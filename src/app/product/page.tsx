'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { ProductInfo, ProductPrompts, ProductAnalysis, ProductStep } from '@/types/product';
import { ProductInfoForm } from '@/components/product/ProductInfoForm';
import { ProductPromptCards } from '@/components/product/ProductPromptCards';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/Button';

const STEPS_CONFIG = [
  { key: 'input' as ProductStep, label: '填寫資訊' },
  { key: 'analyzing' as ProductStep, label: '分析中' },
  { key: 'result' as ProductStep, label: '查看 Prompt' },
];

export default function ProductPage() {
  const [step, setStep] = useState<ProductStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<ProductPrompts | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [lastInfo, setLastInfo] = useState<ProductInfo | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async (file: File, info: ProductInfo) => {
    // 取消前一個尚未完成的請求
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLastFile(file);
    setLastInfo(info);
    setStep('analyzing');
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('info', JSON.stringify(info));

      const res = await fetch('/api/product-analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const serverError = body?.error ?? '未知伺服器錯誤';
        throw new Error(`[${res.status}] ${serverError}`);
      }

      const data: { analysis: ProductAnalysis; prompts: ProductPrompts } = await res.json();
      setAnalysis(data.analysis);
      setPrompts(data.prompts);
      setStep('result');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('[ProductPage] 分析失敗：', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('網路連線失敗，請檢查網路後重試。');
      } else {
        setError(err instanceof Error ? err.message : '發生未知錯誤');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    if (!lastFile || !lastInfo) return;
    await handleSubmit(lastFile, lastInfo);
  }, [lastFile, lastInfo, handleSubmit]);

  const handleReset = useCallback(() => {
    abortControllerRef.current?.abort();
    setStep('input');
    setError(null);
    setPrompts(null);
    setAnalysis(null);
    setLastFile(null);
    setLastInfo(null);
  }, []);

  const handleBackToInput = useCallback(() => {
    setStep('input');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              aria-label="回到首頁"
              title="回到首頁"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                產品圖 Prompt 生成器
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                上傳產品圖 + 填寫資訊 → AI 一次產出 7 種 Prompt
              </p>
            </div>
          </div>
          {step !== 'input' && (
            <button
              onClick={handleReset}
              aria-label="重新開始整個流程"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              重新開始
            </button>
          )}
        </div>
      </header>

      {/* Step Indicator */}
      <div className="border-b border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <StepIndicator steps={STEPS_CONFIG} current={step} />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                上傳產品圖 & 填寫資訊
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                資訊填越詳細，產出的 Prompt 越精準
              </p>
            </div>
            <ProductInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Step 2: Analyzing */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center gap-6 py-24">
            {isLoading ? (
              <>
                <div className="relative flex h-16 w-16 items-center justify-center" role="status" aria-label="AI 分析中">
                  <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-500" />
                  <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">AI 正在分析產品...</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    同時產出 7 種圖片 Prompt，約需 15-30 秒
                  </p>
                </div>
              </>
            ) : error ? (
              <div className="flex w-full max-w-md flex-col items-center gap-6" role="alert">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">分析失敗</p>
                  <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-red-50 p-3 text-left text-xs text-red-600 whitespace-pre-wrap break-words dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={handleReset}>重新填寫</Button>
                  <Button onClick={handleRetry}>重試分析</Button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && prompts && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  7 種產品圖 Prompt
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  點擊各卡片右上角的複製按鈕，貼至 AI 圖片生成工具
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleReset}>
                重新生成
              </Button>
            </div>

            <ProductPromptCards
              prompts={prompts}
              analysis={analysis}
              onRegenerate={handleBackToInput}
            />
          </div>
        )}
      </main>
    </div>
  );
}
