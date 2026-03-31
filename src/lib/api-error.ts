/** 統一處理 API 路由的 Gemini 錯誤，回傳 [statusCode, message] */
export function parseGeminiError(err: unknown): [number, string, string | null] {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? (err.stack ?? null) : null;

  if (message.includes('API key')) return [401, `Gemini API Key 無效：${message}`, null];
  if (message.includes('quota') || message.includes('rate')) return [429, `API 配額超限：${message}`, null];
  if (message.includes('SAFETY') || message.includes('blocked')) return [422, `圖片被安全過濾器攔截：${message}`, null];
  if (message.includes('Expected') || message.includes('invalid')) return [502, `AI 回傳格式異常：${message}`, null];

  return [500, `分析失敗：${message}`, stack];
}

/** 驗證圖片 Blob，回傳錯誤訊息或 null */
export function validateImageBlob(
  file: Blob,
  acceptedTypes: string[],
  maxSize: number
): string | null {
  if (!acceptedTypes.includes(file.type)) {
    return `不支援的圖片格式：${file.type}，請上傳 PNG、JPEG 或 WEBP`;
  }
  if (file.size > maxSize) {
    return `圖片大小 ${(file.size / 1024 / 1024).toFixed(1)}MB 超過上限 10MB`;
  }
  return null;
}
