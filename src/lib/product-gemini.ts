import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type { ProductInfo, ProductAnalysis } from '@/types/product';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/** Zod schema 驗證 Gemini 回傳的產品分析 */
const productAnalysisSchema = z.object({
  productDescription: z.string(),
  appearance: z.string(),
  material: z.string(),
  colorPalette: z.array(z.string()),
  inferredUseCase: z.string(),
  visualStyle: z.string(),
});

const PRODUCT_ANALYSIS_JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    productDescription: { type: 'string' as const, description: '產品整體描述，50 字以內' },
    appearance: { type: 'string' as const, description: '外觀形態描述，包含形狀、結構、尺寸感' },
    material: { type: 'string' as const, description: '材質或質感描述，如金屬光澤、磨砂塑料、布料等' },
    colorPalette: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description: '產品的 2-4 個主要顏色，用中文描述',
    },
    inferredUseCase: { type: 'string' as const, description: '推測的使用場景與目標族群' },
    visualStyle: { type: 'string' as const, description: '適合的視覺風格建議，如科技感、自然清新、奢華高端等' },
  },
  required: ['productDescription', 'appearance', 'material', 'colorPalette', 'inferredUseCase', 'visualStyle'],
};

/** 呼叫 Gemini 分析產品圖片 */
export async function analyzeProduct(
  base64Data: string,
  mimeType: string,
  info: ProductInfo
): Promise<ProductAnalysis> {
  const sellingPointsText = info.sellingPoints.filter(Boolean).join('、') || '未提供';

  const prompt = `你是一個專業的產品攝影師與電商視覺設計師。
請分析這張產品圖片，並結合使用者提供的產品資訊，提供詳細的視覺特徵分析。

使用者提供的產品資訊：
- 產品名稱：${info.name || '未提供'}
- 核心賣點：${sellingPointsText}
- 目標受眾：${info.targetAudience || '未提供'}
- 風格偏好：${info.stylePreference || '未指定'}
- 補充說明：${info.additionalNotes || '無'}

分析要求：
1. 從圖片中辨識產品外觀（形狀、結構、比例）
2. 判斷材質與質感
3. 提取主要顏色
4. 結合使用者資訊推測最佳使用場景
5. 建議最適合的視覺風格方向

請回傳 JSON 格式的分析結果。`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: PRODUCT_ANALYSIS_JSON_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini 未回傳任何內容');
  }

  const parsed = JSON.parse(text);
  return productAnalysisSchema.parse(parsed);
}
