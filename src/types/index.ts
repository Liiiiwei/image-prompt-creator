/** 支援的元素類型 */
export type ElementType =
  | 'title'
  | 'subtitle'
  | 'body_text'
  | 'background'
  | 'icon'
  | 'decoration'
  | 'image'
  | 'shape'
  | 'divider'
  | 'cta_button';

/** 元素位置 */
export interface ElementPosition {
  area: 'top' | 'center' | 'bottom' | 'left' | 'right' | 'full';
  layer: 'foreground' | 'background' | 'overlay';
}

/** AI 辨識出的現有樣式 */
export interface ElementStyle {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontWeight: 'light' | 'regular' | 'bold' | 'extra-bold';
  color: string;
  alignment: 'left' | 'center' | 'right';
}

/** Gemini 分析出的單一元素 */
export interface AnalyzedElement {
  id: string;
  type: ElementType;
  content: string;
  position: ElementPosition;
  style: ElementStyle;
  suggestions: string[];
}

/** 完整分析結果 */
export interface AnalysisResult {
  overallDescription: string;
  aspectRatio: string;
  dominantColors: string[];
  currentMood: string;
  elements: AnalyzedElement[];
  layoutDescription: string;
}

/** 裝飾設定 */
export interface DecorationSetting {
  style: 'none' | 'underline' | 'outline' | 'shadow' | 'gradient' | 'glow' | 'badge';
  intensity: number;
  customNote: string;
}

/** 美化設定 */
export interface EnhancementSetting {
  fontSuggestion: string;
  texture: string;
  effect: string;
  colorOverride: string;
}

/** 使用者對單一元素的調整設定 */
export interface ElementSetting {
  elementId: string;
  decoration: DecorationSetting;
  enhancement: EnhancementSetting;
}

/** 全域設定 */
export interface GlobalSetting {
  mood: 'professional' | 'playful' | 'elegant' | 'bold' | 'minimal' | 'luxury';
  colorScheme: 'keep_original' | 'monochrome' | 'complementary' | 'analogous' | 'pastel' | 'vibrant';
  decorationDensity: number;
  overallRefinement: number;
}

/** 模板預覽資訊 */
export interface TemplatePreview {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

/** 模板預設值 */
export interface TemplateDefaults {
  globalSetting: GlobalSetting;
  elementDefaults: Partial<Record<ElementType, Partial<ElementSetting>>>;
}

/** 風格模板 */
export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  preview: TemplatePreview;
  defaults: TemplateDefaults;
}

/** 應用程式步驟 */
export type AppStep = 'upload' | 'analyzing' | 'editing' | 'generated';
