'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ProductPrompts, ProductAnalysis } from '@/types/product';
import { getAllPromptsText } from '@/lib/product-prompt-builder';

interface ProductPromptCardsProps {
  prompts: ProductPrompts;
  analysis: ProductAnalysis;
  onRegenerate: () => void;
}

function CopyButton({ text, size = 'sm' }: { text: string; size?: 'sm' | 'xs' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API 不可用時（如非 HTTPS 環境）跳過
      return;
    }
    setCopied(true);
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? '已複製' : '複製 Prompt'}
      className={`flex items-center gap-1 rounded-md transition-colors ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-xs'
      } ${
        copied
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {copied ? (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          已複製
        </>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          複製
        </>
      )}
    </button>
  );
}

const TYPE_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  render_3d:   { bg: 'bg-violet-50 dark:bg-violet-900/10',  text: 'text-violet-700 dark:text-violet-300',  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  hand_held:   { bg: 'bg-sky-50 dark:bg-sky-900/10',        text: 'text-sky-700 dark:text-sky-300',        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  feature_1:   { bg: 'bg-amber-50 dark:bg-amber-900/10',    text: 'text-amber-700 dark:text-amber-300',    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  feature_2:   { bg: 'bg-orange-50 dark:bg-orange-900/10',  text: 'text-orange-700 dark:text-orange-300',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  comparison:  { bg: 'bg-rose-50 dark:bg-rose-900/10',      text: 'text-rose-700 dark:text-rose-300',      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  lifestyle:   { bg: 'bg-pink-50 dark:bg-pink-900/10',      text: 'text-pink-700 dark:text-pink-300',      badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  instruction: { bg: 'bg-teal-50 dark:bg-teal-900/10',      text: 'text-teal-700 dark:text-teal-300',      badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
};

export function ProductPromptCards({ prompts, analysis, onRegenerate }: ProductPromptCardsProps) {
  const allText = useMemo(() => getAllPromptsText(prompts), [prompts]);

  return (
    <div className="space-y-6">
      {/* 分析摘要 */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">AI 分析摘要</p>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">外觀：</span>
            {analysis.appearance}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">材質：</span>
            {analysis.material}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">主色調：</span>
            {analysis.colorPalette.join('、')}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">建議風格：</span>
            {analysis.visualStyle}
          </p>
        </div>
      </div>

      {/* 7 張 Prompt 卡片 */}
      <div className="space-y-4">
        {prompts.map((item, index) => {
          const colors = TYPE_COLORS[item.type] ?? TYPE_COLORS['render_3d'];
          return (
            <article
              key={item.type}
              className={`rounded-xl border border-zinc-200 ${colors.bg} dark:border-zinc-700`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className={`text-sm font-medium ${colors.text}`}>
                    {item.label}
                  </h3>
                </div>
                <CopyButton text={item.prompt} size="xs" />
              </div>

              <div className="px-4 py-3">
                <p className="font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                  {item.prompt}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* 底部操作列 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          回到上一步重新產出
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">全部複製：</span>
          <CopyButton text={allText} size="sm" />
        </div>
      </div>
    </div>
  );
}
