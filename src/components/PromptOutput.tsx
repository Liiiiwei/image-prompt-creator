'use client';

import { CopyButton } from './ui/CopyButton';

interface PromptOutputProps {
  prompt: string;
  onRegenerate: () => void;
}

export function PromptOutput({ prompt, onRegenerate }: PromptOutputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          生成的 Prompt
        </h3>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          返回調整設定
        </button>
      </div>

      {/* Prompt 顯示區域 */}
      <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {prompt}
        </pre>
      </div>

      {/* 複製按鈕 */}
      <div className="flex justify-center">
        <CopyButton text={prompt} />
      </div>

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        複製後貼到任何 AI 圖像生成工具即可使用
      </p>
    </div>
  );
}
