/** 元素類別 */
export type ElementCategory = 'text' | 'visual' | 'structural';

/** 10 種元素類型的中文映射 */
export const TYPE_LABELS: Record<string, string> = {
  title: '標題',
  subtitle: '副標題',
  body_text: '內文',
  cta_button: 'CTA 按鈕',
  background: '背景',
  icon: '圖標',
  decoration: '裝飾',
  image: '圖片',
  shape: '形狀',
  divider: '分隔線',
};

/** 判斷元素所屬類別 */
export function getElementCategory(type: string): ElementCategory {
  if (['title', 'subtitle', 'body_text', 'cta_button'].includes(type)) return 'text';
  if (['image', 'icon', 'decoration'].includes(type)) return 'visual';
  return 'structural';
}

/** 類別中文名稱 */
export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  text: '文字元素',
  visual: '視覺元素',
  structural: '結構元素',
};

/** 類別 → Badge variant 映射 */
export const CATEGORY_BADGE_VARIANT: Record<ElementCategory, 'text' | 'visual' | 'structural'> = {
  text: 'text',
  visual: 'visual',
  structural: 'structural',
};

/** 類別 → 卡片邊框色映射 */
export const CATEGORY_BORDER_STYLES: Record<ElementCategory, string> = {
  text: 'border-blue-200 dark:border-blue-800/40',
  visual: 'border-purple-200 dark:border-purple-800/40',
  structural: 'border-zinc-200 dark:border-zinc-700',
};

/** 元素顯示排序（文字 → 視覺 → 結構） */
export const TYPE_ORDER: string[] = [
  'title', 'subtitle', 'body_text', 'cta_button',
  'image', 'icon', 'decoration',
  'background', 'shape', 'divider',
];
