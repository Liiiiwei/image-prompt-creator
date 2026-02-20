import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/image-utils';
import { parseGeminiError, validateImageBlob } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: '未收到圖片檔案' }, { status: 400 });
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
    const result = await analyzeImage(base64Data, file.type);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[API /analyze] 錯誤：', err);
    const [status, error, detail] = parseGeminiError(err);
    return NextResponse.json({ error, detail }, { status });
  }
}
