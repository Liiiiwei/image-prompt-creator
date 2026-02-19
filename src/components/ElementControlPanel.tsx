'use client';

import { useCallback, useMemo } from 'react';
import type { AnalysisResult, AnalyzedElement, ElementSetting, GlobalSetting, DecorationSetting, EnhancementSetting } from '@/types';
import { ElementGroup } from './ElementGroup';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import {
  TYPE_LABELS,
  TYPE_ORDER,
  getElementCategory,
  CATEGORY_LABELS,
  CATEGORY_BADGE_VARIANT,
  type ElementCategory,
} from '@/lib/element-categories';

interface ElementControlPanelProps {
  analysis: AnalysisResult;
  elementSettings: ElementSetting[];
  globalSetting: GlobalSetting;
  onElementChange: (settings: ElementSetting[]) => void;
  onGlobalChange: (setting: GlobalSetting) => void;
}

const MOOD_OPTIONS = [
  { value: 'professional', label: '專業' },
  { value: 'playful', label: '活潑' },
  { value: 'elegant', label: '優雅' },
  { value: 'bold', label: '大膽' },
  { value: 'minimal', label: '極簡' },
  { value: 'luxury', label: '奢華' },
];

const COLOR_SCHEME_OPTIONS = [
  { value: 'keep_original', label: '保持原色' },
  { value: 'monochrome', label: '單色系' },
  { value: 'complementary', label: '互補色' },
  { value: 'analogous', label: '類似色' },
  { value: 'pastel', label: '粉彩' },
  { value: 'vibrant', label: '鮮明' },
];

/** 類別顯示順序 */
const CATEGORY_ORDER: ElementCategory[] = ['text', 'visual', 'structural'];

interface TypeGroup {
  type: string;
  elements: AnalyzedElement[];
}

/** 按 type 分組，按 TYPE_ORDER 排序 */
function groupElements(elements: AnalyzedElement[]): TypeGroup[] {
  const groups = new Map<string, AnalyzedElement[]>();
  for (const el of elements) {
    const arr = groups.get(el.type) ?? [];
    arr.push(el);
    groups.set(el.type, arr);
  }
  return TYPE_ORDER
    .filter((type) => groups.has(type))
    .map((type) => ({ type, elements: groups.get(type)! }));
}

export function ElementControlPanel({
  analysis,
  elementSettings,
  globalSetting,
  onElementChange,
  onGlobalChange,
}: ElementControlPanelProps) {
  const handleElementSettingChange = useCallback((updated: ElementSetting) => {
    const newSettings = elementSettings.map((s) =>
      s.elementId === updated.elementId ? updated : s
    );
    onElementChange(newSettings);
  }, [elementSettings, onElementChange]);

  const handleBatchApply = useCallback((
    elementIds: string[],
    decoration: Partial<DecorationSetting>,
    enhancement: Partial<EnhancementSetting>,
  ) => {
    const newSettings = elementSettings.map((s) => {
      if (!elementIds.includes(s.elementId)) return s;
      return {
        ...s,
        decoration: { ...s.decoration, ...decoration },
        enhancement: { ...s.enhancement, ...enhancement },
      };
    });
    onElementChange(newSettings);
  }, [elementSettings, onElementChange]);

  const groups = useMemo(() => groupElements(analysis.elements), [analysis.elements]);

  return (
    <div className="space-y-6">
      {/* 全域設定 */}
      <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800/40 dark:bg-zinc-800/50">
        <h3 className="mb-4 text-sm font-semibold text-blue-800 dark:text-blue-300">
          整體風格控制
        </h3>
        <div className="space-y-3">
          <Select
            label="整體氛圍"
            value={globalSetting.mood}
            options={MOOD_OPTIONS}
            onChange={(v) => onGlobalChange({ ...globalSetting, mood: v as GlobalSetting['mood'] })}
          />
          <Select
            label="配色方案"
            value={globalSetting.colorScheme}
            options={COLOR_SCHEME_OPTIONS}
            onChange={(v) => onGlobalChange({ ...globalSetting, colorScheme: v as GlobalSetting['colorScheme'] })}
          />
          <Slider
            label="裝飾密度"
            value={globalSetting.decorationDensity}
            onChange={(v) => onGlobalChange({ ...globalSetting, decorationDensity: v })}
          />
          <Slider
            label="整體精緻度"
            value={globalSetting.overallRefinement}
            onChange={(v) => onGlobalChange({ ...globalSetting, overallRefinement: v })}
          />
        </div>
      </div>

      {/* 主色調 */}
      <div className="flex flex-wrap gap-2">
        {analysis.dominantColors.map((color, i) => (
          <span
            key={i}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {color}
          </span>
        ))}
      </div>

      {/* 元素細節控制（按類別分組） */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          元素細節控制
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {analysis.elements.length}
          </span>
        </h3>
        {analysis.elements.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              AI 未辨識到任何可調整的元素
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              可嘗試上傳更清晰或包含更多設計元素的圖片
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {CATEGORY_ORDER.map((category) => {
              const categoryGroups = groups.filter(
                (g) => getElementCategory(g.type) === category
              );
              if (categoryGroups.length === 0) return null;

              return (
                <div key={category}>
                  {/* 類別小標題 */}
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <div className="space-y-3">
                    {categoryGroups.map((group) => (
                      <ElementGroup
                        key={group.type}
                        type={group.type}
                        typeLabel={TYPE_LABELS[group.type] ?? group.type}
                        badgeVariant={CATEGORY_BADGE_VARIANT[getElementCategory(group.type)]}
                        elements={group.elements}
                        settings={elementSettings.filter((s) =>
                          group.elements.some((el) => el.id === s.elementId)
                        )}
                        onSettingChange={handleElementSettingChange}
                        onBatchApply={handleBatchApply}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
