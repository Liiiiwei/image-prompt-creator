'use client';

import type { AnalysisResult, ElementSetting, GlobalSetting } from '@/types';
import { ElementCard } from './ElementCard';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';

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

export function ElementControlPanel({
  analysis,
  elementSettings,
  globalSetting,
  onElementChange,
  onGlobalChange,
}: ElementControlPanelProps) {
  const handleElementSettingChange = (updated: ElementSetting) => {
    const newSettings = elementSettings.map((s) =>
      s.elementId === updated.elementId ? updated : s
    );
    onElementChange(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* 全域設定 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="mb-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
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

      {/* 逐元素控制 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          元素細節控制 ({analysis.elements.length})
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
          <div className="space-y-3">
            {analysis.elements.map((element) => {
              const setting = elementSettings.find((s) => s.elementId === element.id);
              if (!setting) return null;
              return (
                <ElementCard
                  key={element.id}
                  element={element}
                  setting={setting}
                  onChange={handleElementSettingChange}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
