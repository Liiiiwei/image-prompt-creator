'use client';

import { useState } from 'react';
import type { AnalyzedElement, ElementSetting, DecorationSetting, EnhancementSetting } from '@/types';
import { ElementCard, DECORATION_OPTIONS } from './ElementCard';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import { getElementCategory } from '@/lib/element-categories';

interface ElementGroupProps {
  type: string;
  typeLabel: string;
  badgeVariant: 'text' | 'visual' | 'structural';
  elements: AnalyzedElement[];
  settings: ElementSetting[];
  onSettingChange: (updated: ElementSetting) => void;
  onBatchApply: (
    elementIds: string[],
    decoration: Partial<DecorationSetting>,
    enhancement: Partial<EnhancementSetting>
  ) => void;
}

export function ElementGroup({
  type,
  typeLabel,
  badgeVariant,
  elements,
  settings,
  onSettingChange,
  onBatchApply,
}: ElementGroupProps) {
  const category = getElementCategory(type);
  // 文字類預設展開，其他收合
  const [isExpanded, setIsExpanded] = useState(category === 'text');
  const [batchStyle, setBatchStyle] = useState('none');
  const [batchIntensity, setBatchIntensity] = useState(50);

  const hasMultiple = elements.length > 1;

  const handleBatchApply = () => {
    const ids = elements.map((el) => el.id);
    onBatchApply(
      ids,
      { style: batchStyle as DecorationSetting['style'], intensity: batchIntensity },
      {}
    );
  };

  // 單元素群組：直接顯示卡片
  if (!hasMultiple) {
    const element = elements[0];
    const setting = settings.find((s) => s.elementId === element.id);
    if (!setting) return null;
    return (
      <ElementCard
        element={element}
        setting={setting}
        onChange={onSettingChange}
      />
    );
  }

  // 多元素群組：展開/收合 + 批次設定
  return (
    <div className="space-y-2">
      {/* 群組標頭 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg bg-zinc-50 px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{typeLabel}</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {elements.length} 個元素
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-2 pl-2">
          {/* 批次設定區塊 */}
          <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/30 p-3 dark:border-blue-800/40 dark:bg-blue-900/10">
            <p className="mb-2 text-xs font-medium text-blue-700 dark:text-blue-300">
              批次套用到此群組所有元素
            </p>
            <div className="space-y-2">
              <Select
                label="裝飾風格"
                value={batchStyle}
                options={DECORATION_OPTIONS}
                onChange={setBatchStyle}
              />
              <Slider
                label="裝飾強度"
                value={batchIntensity}
                onChange={setBatchIntensity}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  套用後仍可個別調整
                </span>
                <Button size="sm" onClick={handleBatchApply}>
                  套用到全組
                </Button>
              </div>
            </div>
          </div>

          {/* 個別元素卡片 */}
          {elements.map((element) => {
            const setting = settings.find((s) => s.elementId === element.id);
            if (!setting) return null;
            return (
              <ElementCard
                key={element.id}
                element={element}
                setting={setting}
                onChange={onSettingChange}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
