/** 將 File 轉為 base64 字串 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除 data:image/xxx;base64, 前綴
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** 支援的圖片 MIME 類型 */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

/** 最大檔案大小（10MB） */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** 驗證上傳的圖片 */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return '不支援的圖片格式，請上傳 PNG、JPEG 或 WEBP';
  }
  if (file.size > MAX_FILE_SIZE) {
    return '圖片大小不能超過 10MB';
  }
  return null;
}
