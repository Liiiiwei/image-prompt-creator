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

/** 建構單一元素的指令 */
function buildElementInstruction(
  element: AnalyzedElement,
  setting: ElementSetting
): string {
  const parts: string[] = [];

  // 元素基本描述
  const typeLabel = getTypeLabel(element.type);
  parts.push(`【${typeLabel}】「${element.content}」（位於${element.position.area}）`);

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
  };
  return labels[type] ?? type;
}

/** 建構全域約束段落 */
function buildGlobalConstraints(global: GlobalSetting): string {
  const lines = [
    '重要約束：',
    '- 不要大幅改變原始排版結構，僅微調元素位置以達成視覺平衡',
    '- 保留所有原始文字內容不變',
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
