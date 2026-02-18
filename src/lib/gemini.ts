import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type { AnalysisResult } from '@/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const ANALYSIS_PROMPT = `你是一個專業的社群媒體設計分析師。
你的任務是分析使用者上傳的社群貼文圖片，精確辨識所有視覺元素。

分析要求：
1. 辨識所有文字元素（標題、副標題、內文、標籤等），記錄其內容與樣式
2. 辨識背景設計（純色、漸層、圖片、材質）
3. 辨識裝飾元素（圖標、形狀、分隔線、花紋等）
4. 辨識圖片/插圖元素
5. 描述整體排版結構與配色
6. 對每個元素提供 1-2 個美化建議

注意事項：
- 位置描述使用相對區域（top/center/bottom/left/right/full）
- 顏色用中文描述（如「深藍色」、「暖橘色」）
- 字體描述用風格（如「無襯線體」、「手寫風」）而非具體字體名
- 每個元素都需要唯一 id，格式為 type_序號（如 title_1, decoration_2）
- suggestions 陣列中每個建議應該是具體可操作的美化方向`;

/** Zod schema 用於驗證 Gemini 回傳 */
const analysisResultSchema = z.object({
  overallDescription: z.string(),
  aspectRatio: z.string(),
  dominantColors: z.array(z.string()),
  currentMood: z.string(),
  elements: z.array(
    z.object({
      id: z.string(),
      type: z.enum([
        'title', 'subtitle', 'body_text', 'background',
        'icon', 'decoration', 'image', 'shape', 'divider',
      ]),
      content: z.string(),
      position: z.object({
        area: z.enum(['top', 'center', 'bottom', 'left', 'right', 'full']),
        layer: z.enum(['foreground', 'background', 'overlay']),
      }),
      style: z.object({
        fontSize: z.enum(['small', 'medium', 'large', 'xlarge']),
        fontWeight: z.enum(['light', 'regular', 'bold', 'extra-bold']),
        color: z.string(),
        alignment: z.enum(['left', 'center', 'right']),
      }),
      suggestions: z.array(z.string()),
    })
  ),
  layoutDescription: z.string(),
});

/** JSON Schema（給 Gemini responseSchema 用） */
const JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    overallDescription: { type: 'string' as const, description: '圖片整體描述，50 字以內' },
    aspectRatio: { type: 'string' as const, description: '例如 1:1、4:5、16:9' },
    dominantColors: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description: '3-5 個主色調描述',
    },
    currentMood: { type: 'string' as const, description: '整體風格評估' },
    elements: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          id: { type: 'string' as const },
          type: {
            type: 'string' as const,
            enum: ['title', 'subtitle', 'body_text', 'background', 'icon', 'decoration', 'image', 'shape', 'divider'],
          },
          content: { type: 'string' as const },
          position: {
            type: 'object' as const,
            properties: {
              area: { type: 'string' as const, enum: ['top', 'center', 'bottom', 'left', 'right', 'full'] },
              layer: { type: 'string' as const, enum: ['foreground', 'background', 'overlay'] },
            },
            required: ['area', 'layer'],
          },
          style: {
            type: 'object' as const,
            properties: {
              fontSize: { type: 'string' as const, enum: ['small', 'medium', 'large', 'xlarge'] },
              fontWeight: { type: 'string' as const, enum: ['light', 'regular', 'bold', 'extra-bold'] },
              color: { type: 'string' as const },
              alignment: { type: 'string' as const, enum: ['left', 'center', 'right'] },
            },
            required: ['fontSize', 'fontWeight', 'color', 'alignment'],
          },
          suggestions: { type: 'array' as const, items: { type: 'string' as const } },
        },
        required: ['id', 'type', 'content', 'position', 'style', 'suggestions'],
      },
    },
    layoutDescription: { type: 'string' as const },
  },
  required: ['overallDescription', 'aspectRatio', 'dominantColors', 'currentMood', 'elements', 'layoutDescription'],
};

/** 呼叫 Gemini 分析圖片 */
export async function analyzeImage(
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> {
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
          { text: ANALYSIS_PROMPT },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: JSON_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini 未回傳任何內容');
  }

  const parsed = JSON.parse(text);
  return analysisResultSchema.parse(parsed);
}
