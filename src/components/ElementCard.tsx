'use client';

import type { AnalyzedElement, ElementSetting } from '@/types';
import { TYPE_LABELS, getElementCategory, CATEGORY_BADGE_VARIANT, CATEGORY_BORDER_STYLES } from '@/lib/element-categories';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Badge } from './ui/Badge';

interface ElementCardProps {
  element: AnalyzedElement;
  setting: ElementSetting;
  onChange: (setting: ElementSetting) => void;
}

/** 裝飾風格選項 */
export const DECORATION_OPTIONS = [
  { value: 'none', label: '無裝飾' },
  { value: 'underline', label: '底線' },
  { value: 'outline', label: '外框' },
  { value: 'shadow', label: '陰影' },
  { value: 'gradient', label: '漸層' },
  { value: 'glow', label: '發光' },
  { value: 'badge', label: '標章' },
];

/** 字體建議選項 */
const FONT_OPTIONS = [
  { value: '', label: '保持原樣' },
  { value: '現代無襯線體', label: '現代無襯線體' },
  { value: '優雅襯線體', label: '優雅襯線體' },
  { value: '手寫風', label: '手寫風' },
  { value: '粗體標題體', label: '粗體標題體' },
  { value: '圓體', label: '圓體' },
  { value: '復古字體', label: '復古字體' },
];

/** 材質選項 */
const TEXTURE_OPTIONS = [
  { value: '', label: '無材質' },
  { value: '磨砂質感', label: '磨砂質感' },
  { value: '玻璃', label: '玻璃' },
  { value: '紙質', label: '紙質' },
  { value: '金屬', label: '金屬' },
  { value: '木紋', label: '木紋' },
  { value: '大理石', label: '大理石' },
];

/** 特效選項 */
const EFFECT_OPTIONS = [
  { value: '', label: '無特效' },
  { value: '微陰影', label: '微陰影' },
  { value: '浮雕', label: '浮雕' },
  { value: '霓虹', label: '霓虹' },
  { value: '金屬光澤', label: '金屬光澤' },
  { value: '水彩', label: '水彩' },
  { value: '立體感', label: '立體感' },
];

/** 是否為文字類元素 */
function isTextElement(type: string): boolean {
  return ['title', 'subtitle', 'body_text', 'cta_button'].includes(type);
}

export function ElementCard({ element, setting, onChange }: ElementCardProps) {
  const category = getElementCategory(element.type);

  const updateDecoration = (key: string, value: string | number) => {
    onChange({
      ...setting,
      decoration: { ...setting.decoration, [key]: value },
    });
  };

  const updateEnhancement = (key: string, value: string) => {
    onChange({
      ...setting,
      enhancement: { ...setting.enhancement, [key]: value },
    });
  };

  return (
    <div className={`rounded-lg border bg-white p-4 dark:bg-zinc-800/50 ${CATEGORY_BORDER_STYLES[category]}`}>
      {/* 標頭 */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={CATEGORY_BADGE_VARIANT[category]}>
            {TYPE_LABELS[element.type] ?? element.type}
          </Badge>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
            {element.content}
          </span>
        </div>
        <span className="shrink-0 text-xs text-zinc-400">
          {element.position.area}
        </span>
      </div>

      {/* AI 建議 */}
      {element.suggestions.length > 0 && (
        <div className={`mb-3 rounded-md px-3 py-2 ${
          category === 'text'
            ? 'bg-blue-50/50 dark:bg-blue-900/10'
            : 'bg-zinc-50 dark:bg-zinc-900/50'
        }`}>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">AI 建議：</p>
          <ul className="mt-1 space-y-0.5">
            {element.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-zinc-600 dark:text-zinc-300">
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 控制項 */}
      <div className="space-y-3">
        {/* 裝飾風格 */}
        <Select
          label="裝飾風格"
          value={setting.decoration.style}
          options={DECORATION_OPTIONS}
          onChange={(v) => updateDecoration('style', v)}
        />

        {/* 裝飾強度 */}
        <Slider
          label="裝飾強度"
          value={setting.decoration.intensity}
          onChange={(v) => updateDecoration('intensity', v)}
        />

        {/* 文字類才顯示字體建議 */}
        {isTextElement(element.type) && (
          <Select
            label="字體風格"
            value={setting.enhancement.fontSuggestion}
            options={FONT_OPTIONS}
            onChange={(v) => updateEnhancement('fontSuggestion', v)}
          />
        )}

        {/* 材質 */}
        <Select
          label="材質/紋理"
          value={setting.enhancement.texture}
          options={TEXTURE_OPTIONS}
          onChange={(v) => updateEnhancement('texture', v)}
        />

        {/* 特效 */}
        <Select
          label="特效"
          value={setting.enhancement.effect}
          options={EFFECT_OPTIONS}
          onChange={(v) => updateEnhancement('effect', v)}
        />

        {/* 自訂備註 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            自訂備註
          </label>
          <input
            type="text"
            value={setting.decoration.customNote}
            onChange={(e) => updateDecoration('customNote', e.target.value)}
            placeholder="自由輸入額外指令..."
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}
