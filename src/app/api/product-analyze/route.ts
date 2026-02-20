import { NextRequest, NextResponse } from 'next/server';
import { analyzeProduct } from '@/lib/product-gemini';
import { buildProductPrompts } from '@/lib/product-prompt-builder';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/image-utils';
import type { ProductInfo } from '@/types/product';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const infoRaw = formData.get('info');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: '未收到圖片檔案' }, { status: 400 });
    }

    if (!infoRaw || typeof infoRaw !== 'string') {
      return NextResponse.json({ error: '未收到產品資訊' }, { status: 400 });
    }

    let info: ProductInfo;
    try {
      info = JSON.parse(infoRaw);
    } catch {
      return NextResponse.json({ error: '產品資訊格式錯誤' }, { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `不支援的圖片格式：${file.type}，請上傳 PNG、JPEG 或 WEBP` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `圖片大小 ${(file.size / 1024 / 1024).toFixed(1)}MB 超過上限 10MB` },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: '伺服器未設定 GEMINI_API_KEY 環境變數' },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const analysis = await analyzeProduct(base64Data, file.type, info);
    const prompts = buildProductPrompts(info, analysis);

    return NextResponse.json({ analysis, prompts });
  } catch (err: unknown) {
    console.error('[API /product-analyze] 錯誤：', err);

    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    if (message.includes('API key')) {
      return NextResponse.json(
        { error: `Gemini API Key 無效：${message}` },
        { status: 401 }
      );
    }

    if (message.includes('quota') || message.includes('rate')) {
      return NextResponse.json(
        { error: `API 配額超限：${message}` },
        { status: 429 }
      );
    }

    if (message.includes('SAFETY') || message.includes('blocked')) {
      return NextResponse.json(
        { error: `圖片被安全過濾器攔截：${message}` },
        { status: 422 }
      );
    }

    if (message.includes('Expected') || message.includes('invalid')) {
      return NextResponse.json(
        { error: `AI 回傳格式異常：${message}` },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: `分析失敗：${message}`, detail: stack ?? null },
      { status: 500 }
    );
  }
}
