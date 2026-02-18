'use client';

import { Button } from './ui/Button';

interface AnalysisLoadingProps {
  onCancel?: () => void;
}

export function AnalysisLoading({ onCancel }: AnalysisLoadingProps) {
  return (
    <div className="flex w-full max-w-xl mx-auto flex-col items-center gap-6 py-12">
      {/* 旋轉動畫 */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          AI 正在分析圖片...
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          辨識文字、排版結構、配色與裝飾元素
        </p>
      </div>

      {/* 骨架區域 */}
      <div className="w-full space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-2 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>

      {/* 取消按鈕 */}
      {onCancel && (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          取消分析
        </Button>
      )}
    </div>
  );
}
