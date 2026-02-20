import type { ProductInfo, ProductAnalysis, ProductPrompt, ProductPrompts, ProductImageType } from '@/types/product';
import { PRODUCT_IMAGE_TYPES } from '@/types/product';

/** 共用的基礎產品描述，用於所有 Prompt */
function buildBaseContext(info: ProductInfo, analysis: ProductAnalysis): string {
  const points = info.sellingPoints.filter(Boolean);
  return [
    `產品：${info.name || analysis.productDescription}`,
    `外觀：${analysis.appearance}`,
    `材質：${analysis.material}`,
    `主色調：${analysis.colorPalette.join('、')}`,
    points.length > 0 ? `核心賣點：${points.join('、')}` : '',
    `目標受眾：${info.targetAudience || analysis.inferredUseCase}`,
  ].filter(Boolean).join('；');
}

/** 3D 渲染 Prompt */
function build3DRender(info: ProductInfo, analysis: ProductAnalysis): string {
  const style = info.stylePreference || analysis.visualStyle;
  return `High-quality 3D product render of ${info.name || 'the product'}, ${analysis.appearance}, made of ${analysis.material}, color palette: ${analysis.colorPalette.join(', ')}. Studio lighting setup with soft shadows, 45-degree camera angle, clean white or gradient background, ultra-detailed surface texture, photorealistic rendering, ${style} aesthetic, commercial product photography style, 8K resolution, no text overlay.`;
}

/** 手持產品 Prompt */
function buildHandHeld(info: ProductInfo, analysis: ProductAnalysis): string {
  const audience = info.targetAudience || '一般消費者';
  return `A ${audience} holding ${info.name || 'the product'} (${analysis.appearance}, ${analysis.colorPalette[0] || 'neutral'} color) in their hand, natural lifestyle setting, soft natural lighting, shallow depth of field, product clearly visible and in focus, authentic and relatable mood, the hand gestures show the product's scale and ease of use, ${analysis.visualStyle} style, no text, cinematic composition.`;
}

/** 特點圖 1 Prompt */
function buildFeature1(info: ProductInfo, analysis: ProductAnalysis): string {
  const point = info.sellingPoints.filter(Boolean)[0] || '核心功能';
  return `Product feature highlight image for "${point}" of ${info.name || 'the product'}. Close-up shot focusing on the key feature detail of ${analysis.appearance}. Clean minimal background in ${analysis.colorPalette[0] || 'neutral'} tones, dramatic lighting to emphasize the feature, infographic-friendly composition with space for text labels on the left or right side, ${analysis.visualStyle} visual style, high contrast, professional commercial photography.`;
}

/** 特點圖 2 Prompt */
function buildFeature2(info: ProductInfo, analysis: ProductAnalysis): string {
  const points = info.sellingPoints.filter(Boolean);
  const point = points[1] || points[0] || '產品優勢';
  return `Product feature highlight image for "${point}" of ${info.name || 'the product'}. Different angle from the first feature shot, showing ${analysis.material} material texture up close. Complementary background color from the palette: ${analysis.colorPalette.join(', ')}, split composition — product on one side with annotation space on the other, ${analysis.visualStyle} aesthetic, product photography with creative lighting, ultra sharp focus on the highlighted feature area.`;
}

/** 比較圖 Prompt */
function buildComparison(info: ProductInfo, analysis: ProductAnalysis): string {
  const advantage = info.sellingPoints.filter(Boolean)[0] || '更好的效果';
  return `Side-by-side comparison image for ${info.name || 'the product'}. Left side labeled "Before" or "Others" showing a problem or inferior alternative (dimmer, less refined, generic), right side labeled "After" or "${info.name || 'Our Product'}" showing the ${advantage} with ${analysis.appearance} in ${analysis.colorPalette[0] || 'brand'} color. Clean split layout with clear visual contrast, centered dividing line, ${analysis.visualStyle} design style, persuasive advertising composition, no clutter.`;
}

/** 情境 + Model Prompt */
function buildLifestyle(info: ProductInfo, analysis: ProductAnalysis): string {
  const scene = analysis.inferredUseCase || '日常生活場景';
  const audience = info.targetAudience || '現代消費者';
  return `Lifestyle photography of ${audience} using ${info.name || 'the product'} in ${scene}. The model is naturally interacting with the product (${analysis.appearance}), genuine and relatable expression, golden hour or studio soft lighting, environment matches the ${analysis.visualStyle} brand aesthetic with ${analysis.colorPalette.join(', ')} color tones, editorial fashion photography style, full or three-quarter body shot, product prominently featured but not forced, aspirational yet authentic mood.`;
}

/** 使用說明 Prompt */
function buildInstruction(info: ProductInfo, analysis: ProductAnalysis): string {
  return `Step-by-step instruction graphic for ${info.name || 'the product'}. 3 to 4 numbered steps shown in a clean grid or horizontal layout, each step featuring the product (${analysis.appearance}) in a different usage position, flat lay or slight isometric angle, minimal ${analysis.colorPalette[0] || 'white'} and ${analysis.colorPalette[1] || 'light grey'} background, numbered icons clearly visible (1, 2, 3, 4), ample white space for text labels, ${analysis.visualStyle} design style, infographic layout, no actual text rendered — space reserved for overlaying copy.`;
}

const BUILDERS: Record<ProductImageType, (info: ProductInfo, analysis: ProductAnalysis) => string> = {
  render_3d: build3DRender,
  hand_held: buildHandHeld,
  feature_1: buildFeature1,
  feature_2: buildFeature2,
  comparison: buildComparison,
  lifestyle: buildLifestyle,
  instruction: buildInstruction,
};

/** 產生 7 種產品圖 Prompt */
export function buildProductPrompts(
  info: ProductInfo,
  analysis: ProductAnalysis
): ProductPrompts {
  return PRODUCT_IMAGE_TYPES.map(({ type, label }) => {
    const builder = BUILDERS[type];
    const prompt = builder(info, analysis);
    return { type, label, prompt } satisfies ProductPrompt;
  });
}

/** 取得所有 Prompt 的純文字（換行分隔，方便全部複製） */
export function getAllPromptsText(prompts: ProductPrompts): string {
  return prompts
    .map((p, i) => `[${i + 1}] ${p.label}\n${p.prompt}`)
    .join('\n\n---\n\n');
}

export { buildBaseContext };
