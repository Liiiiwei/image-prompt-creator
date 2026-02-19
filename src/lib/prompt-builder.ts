import type { AnalysisResult, AnalyzedElement, ElementSetting, GlobalSetting } from '@/types';

const MOOD_LABELS: Record<string, string> = {
  professional: '專業商務',
  playful: '活潑有趣',
  elegant: '優雅精緻',
  bold: '大膽強烈',
  minimal: '極簡乾淨',
  luxury: '奢華質感',
};

const COLOR_SCHEME_LABELS: Record<string, string> = {
  keep_original: '保持原始配色',
  monochrome: '單色系',
  complementary: '互補色搭配',
  analogous: '類似色和諧',
  pastel: '柔和粉彩色調',
  vibrant: '鮮明活力色調',
};

const DECORATION_LABELS: Record<string, string> = {
  none: '',
  underline: '加上裝飾性底線',
  outline: '加上精緻外框',
  shadow: '加上立體陰影效果',
  gradient: '使用漸層效果',
  glow: '加上柔和發光效果',
  badge: '用標章/徽章風格呈現',
};

/** 建構整體指令段落 */
function buildOverallInstruction(
  analysis: AnalysisResult,
  global: GlobalSetting
): string {
  const lines = [
    `重新設計這張社群貼文圖片。整體風格調整為「${MOOD_LABELS[global.mood]}」。`,
    `配色方案：${COLOR_SCHEME_LABELS[global.colorScheme]}。`,
    `原始排版為：${analysis.layoutDescription}。`,
    `圖片比例為 ${analysis.aspectRatio}。`,
    `原始主色調為：${analysis.dominantColors.join('、')}。`,
  ];

  return lines.join('\n');
}

/** 文字類元素類型 */
const TEXT_TYPES = ['title', 'subtitle', 'body_text', 'cta_button'];

/** 建構單一元素的指令 */
function buildElementInstruction(
  element: AnalyzedElement,
  setting: ElementSetting
): string {
  const parts: string[] = [];

  // 元素基本描述
  const typeLabel = getTypeLabel(element.type);
  parts.push(`【${typeLabel}】「${element.content}」（位於${element.position.area}）`);

  // 圖片元素：自動附加保護指令
  if (element.type === 'image') {
    parts.push(`  - ⚠️ 保留此圖片原始內容不變，僅可調整外圍裝飾（邊框、陰影、圓角等）`);
  }

  // 裝飾
  const decoLabel = DECORATION_LABELS[setting.decoration.style];
  if (decoLabel) {
    parts.push(`  - ${decoLabel}（強度 ${setting.decoration.intensity}%）`);
  }

  // 字體
  if (setting.enhancement.fontSuggestion) {
    parts.push(`  - 字體風格：${setting.enhancement.fontSuggestion}`);
  }

  // 材質
  if (setting.enhancement.texture) {
    parts.push(`  - 材質/紋理：${setting.enhancement.texture}`);
  }

  // 特效
  if (setting.enhancement.effect) {
    parts.push(`  - 視覺特效：${setting.enhancement.effect}`);
  }

  // 顏色覆蓋
  if (setting.enhancement.colorOverride) {
    parts.push(`  - 顏色調整為：${setting.enhancement.colorOverride}`);
  }

  // 自訂備註
  if (setting.decoration.customNote) {
    parts.push(`  - 額外要求：${setting.decoration.customNote}`);
  }

  // 文字類元素且有裝飾效果：自動附加可讀性指令
  if (TEXT_TYPES.includes(element.type) && (setting.decoration.style !== 'none' || setting.enhancement.effect)) {
    parts.push(`  - ⚠️ 確保文字清晰可讀：裝飾效果不可遮擋或模糊文字，需維持足夠的文字與背景對比度`);
  }

  return parts.join('\n');
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    title: '標題',
    subtitle: '副標題',
    body_text: '內文',
    background: '背景',
    icon: '圖標',
    decoration: '裝飾元素',
    image: '圖片',
    shape: '形狀',
    divider: '分隔線',
    cta_button: 'CTA 按鈕',
  };
  return labels[type] ?? type;
}

/** 建構全域約束段落 */
function buildGlobalConstraints(global: GlobalSetting): string {
  const lines = [
    '重要約束：',
    '- 不要大幅改變原始排版結構，僅微調元素位置以達成視覺平衡',
    '- 保留所有原始文字內容不變',
    '- ⚠️ 嚴格保留原始照片和產品圖片：不得修改、重繪或替換圖片中的實拍照片、產品照片、人物照片，僅能調整其邊框、陰影等外圍裝飾',
    '- ⚠️ 文字可讀性最高優先：所有文字元素必須保持清晰易讀，裝飾效果（如金屬光澤、發光、浮雕）不得降低文字對比度或模糊字體邊緣；若裝飾與可讀性衝突，優先保證可讀性',
    '- 在原有基礎上增加視覺精緻度，讓圖片更吸睛',
    `- 裝飾元素密度控制在 ${global.decorationDensity}%（0=極少裝飾, 100=大量裝飾）`,
    `- 整體精緻度 ${global.overallRefinement}%（0=簡單樸素, 100=極致精緻）`,
    '- 輸出為適合社群媒體的高解析度圖片',
  ];

  return lines.join('\n');
}

/** 組裝完整 prompt */
export function buildPrompt(
  analysis: AnalysisResult,
  elementSettings: ElementSetting[],
  globalSetting: GlobalSetting
): string {
  const sections: string[] = [];

  // 整體指令
  sections.push(buildOverallInstruction(analysis, globalSetting));

  // 分隔
  sections.push('---\n各元素細節：');

  // 逐元素
  for (const element of analysis.elements) {
    const setting = elementSettings.find((s) => s.elementId === element.id);
    if (setting) {
      sections.push(buildElementInstruction(element, setting));
    }
  }

  // 全域約束
  sections.push('---');
  sections.push(buildGlobalConstraints(globalSetting));

  return sections.join('\n\n');
}
