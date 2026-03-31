import { NextRequest, NextResponse } from 'next/server';
import { analyzeProduct } from '@/lib/product-gemini';
import { buildProductPrompts } from '@/lib/product-prompt-builder';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/image-utils';
import { parseGeminiError, validateImageBlob } from '@/lib/api-error';
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

    const validationError = validateImageBlob(file, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: '伺服器未設定 GEMINI_API_KEY 環境變數' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const analysis = await analyzeProduct(base64Data, file.type, info);
    const prompts = buildProductPrompts(info, analysis);

    return NextResponse.json({ analysis, prompts });
  } catch (err: unknown) {
    console.error('[API /product-analyze] 錯誤：', err);
    const [status, error, detail] = parseGeminiError(err);
    return NextResponse.json({ error, detail }, { status });
  }
}
