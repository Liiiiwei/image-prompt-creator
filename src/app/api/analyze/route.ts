import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/image-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: '未收到圖片檔案' },
        { status: 400 }
      );
    }

    // 驗證檔案類型
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `不支援的圖片格式：${file.type}，請上傳 PNG、JPEG 或 WEBP` },
        { status: 400 }
      );
    }

    // 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `圖片大小 ${(file.size / 1024 / 1024).toFixed(1)}MB 超過上限 10MB` },
        { status: 400 }
      );
    }

    // 檢查 API Key 是否存在
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: '伺服器未設定 GEMINI_API_KEY 環境變數' },
        { status: 500 }
      );
    }

    // 轉換為 base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // 呼叫 Gemini 分析
    const result = await analyzeImage(base64Data, file.type);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[API /analyze] 錯誤：', err);

    // 區分不同的錯誤類型，回傳詳細訊息
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;

    // Gemini API 錯誤通常包含特定關鍵字
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

    // Zod 驗證失敗
    if (message.includes('Expected') || message.includes('invalid')) {
      return NextResponse.json(
        { error: `AI 回傳格式異常：${message}` },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: `分析失敗：${message}`,
        detail: stack ?? null,
      },
      { status: 500 }
    );
  }
}
