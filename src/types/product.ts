/** 產品圖片的 7 種類型 */
export type ProductImageType =
  | 'render_3d'
  | 'hand_held'
  | 'feature_1'
  | 'feature_2'
  | 'comparison'
  | 'lifestyle'
  | 'instruction';

/** 7 種圖片類型的設定 */
export const PRODUCT_IMAGE_TYPES: Array<{
  type: ProductImageType;
  label: string;
  description: string;
  hint: string;
}> = [
  {
    type: 'render_3d',
    label: '3D 渲染',
    description: '產品的高精度 3D 渲染圖，強調材質與光影',
    hint: '常見用途：官網首圖、廣告主視覺',
  },
  {
    type: 'hand_held',
    label: '手持產品',
    description: '真人手持或使用產品，呈現尺寸感與實際使用狀態',
    hint: '常見用途：電商主圖、社群輪播',
  },
  {
    type: 'feature_1',
    label: '產品特點圖 1',
    description: '聚焦第一個核心賣點，搭配說明文字',
    hint: '常見用途：詳情頁賣點說明',
  },
  {
    type: 'feature_2',
    label: '產品特點圖 2',
    description: '聚焦第二個核心賣點，不同構圖與視角',
    hint: '常見用途：詳情頁賣點說明',
  },
  {
    type: 'comparison',
    label: '比較圖',
    description: '與競品或使用前後的對比，凸顯差異與優勢',
    hint: '常見用途：說服型廣告、詳情頁',
  },
  {
    type: 'lifestyle',
    label: '情境 + Model',
    description: '在真實生活場景中使用產品，搭配模特兒',
    hint: '常見用途：品牌形象、社群貼文',
  },
  {
    type: 'instruction',
    label: '使用說明圖',
    description: '步驟圖或操作示意，清楚呈現使用方式',
    hint: '常見用途：詳情頁使用教學',
  },
];

/** 使用者輸入的產品資訊 */
export interface ProductInfo {
  name: string;
  sellingPoints: string[];
  targetAudience: string;
  stylePreference: string;
  additionalNotes: string;
}

/** Gemini 分析產品後得到的特徵 */
export interface ProductAnalysis {
  productDescription: string;
  appearance: string;
  material: string;
  colorPalette: string[];
  inferredUseCase: string;
  visualStyle: string;
}

/** 單一類型的 Prompt 結果 */
export interface ProductPrompt {
  type: ProductImageType;
  label: string;
  prompt: string;
}

/** 7 種 Prompt 的完整結果 */
export type ProductPrompts = ProductPrompt[];

/** 產品 Flow 的步驟 */
export type ProductStep = 'input' | 'analyzing' | 'result';
