'use client';

import type { StyleTemplate } from '@/types';
import { templates } from '@/data/templates';

interface StyleTemplateSelectorProps {
  selectedId: string | null;
  onSelect: (template: StyleTemplate) => void;
  onDeselect?: () => void;
}

export function StyleTemplateSelector({ selectedId, onSelect, onDeselect }: StyleTemplateSelectorProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        風格模板（可選）
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              if (selectedId === template.id) {
                onDeselect?.();
              } else {
                onSelect(template);
              }
            }}
            className={`
              flex shrink-0 flex-col items-start rounded-lg border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2
              ${selectedId === template.id
                ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:ring-zinc-100'
                : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-500'
              }
            `}
            style={{ minWidth: '140px' }}
          >
            {/* 色塊預覽 */}
            <div className="mb-2 flex gap-1">
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: template.preview.primaryColor }}
              />
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: template.preview.secondaryColor }}
              />
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: template.preview.accentColor }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {template.name}
            </span>
            <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
