'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { AppStep, AnalysisResult, ElementSetting, GlobalSetting, StyleTemplate } from '@/types';
import { ImageUploader } from '@/components/ImageUploader';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { ElementControlPanel } from '@/components/ElementControlPanel';
import { StyleTemplateSelector } from '@/components/StyleTemplateSelector';
import { PromptOutput } from '@/components/PromptOutput';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { buildPrompt } from '@/lib/prompt-builder';

/** 產生元素的預設設定 */
function createDefaultSettings(analysis: AnalysisResult): ElementSetting[] {
  return analysis.elements.map((el) => ({
    elementId: el.id,
    decoration: { style: 'none' as const, intensity: 50, customNote: '' },
    enhancement: { fontSuggestion: '', texture: '', effect: '', colorOverride: '' },
  }));
}

const DEFAULT_GLOBAL: GlobalSetting = {
  mood: 'professional',
  colorScheme: 'keep_original',
  decorationDensity: 50,
  overallRefinement: 70,
};

const STEPS_CONFIG = [
  { key: 'upload' as AppStep, label: '上傳' },
  { key: 'analyzing' as AppStep, label: '分析' },
  { key: 'editing' as AppStep, label: '調整' },
  { key: 'generated' as AppStep, label: '完成' },
];

export default function BeautifyPage() {
  const [step, setStep] = useState<AppStep>('upload');
  const [previewUrl, setPreviewUrl] = useState('');
  const [elementSettings, setElementSettings] = useState<ElementSetting[]>([]);
  const [globalSetting, setGlobalSetting] = useState<GlobalSetting>(DEFAULT_GLOBAL);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const { result: analysisResult, isLoading, error: analysisError, analyze, retry, reset: resetAnalysis } = useAnalysis();
  const prevResultRef = useRef<AnalysisResult | null>(null);

  useEffect(() => {
    if (analysisResult && analysisResult !== prevResultRef.current) {
      prevResultRef.current = analysisResult;
      setElementSettings(createDefaultSettings(analysisResult));
      setStep('editing');
    }
  }, [analysisResult]);

  const handleImageReady = useCallback(async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setStep('analyzing');
    await analyze(file);
  }, [analyze]);

  const handleTemplateSelect = useCallback((template: StyleTemplate) => {
    setSelectedTemplateId(template.id);
    setGlobalSetting(template.defaults.globalSetting);

    if (analysisResult) {
      setElementSettings((prev) =>
        prev.map((setting) => {
          const element = analysisResult.elements.find((el) => el.id === setting.elementId);
          if (!element) return setting;

          const templateDefault = template.defaults.elementDefaults[element.type];
          if (!templateDefault) return setting;

          return {
            ...setting,
            decoration: templateDefault.decoration ?? setting.decoration,
            enhancement: templateDefault.enhancement ?? setting.enhancement,
          };
        })
      );
    }
  }, [analysisResult]);

  const handleTemplateDeselect = useCallback(() => {
    setSelectedTemplateId(null);
    setGlobalSetting(DEFAULT_GLOBAL);
    if (analysisResult) {
      setElementSettings(createDefaultSettings(analysisResult));
    }
  }, [analysisResult]);

  const handleGeneratePrompt = useCallback(() => {
    if (!analysisResult) return;
    const prompt = buildPrompt(analysisResult, elementSettings, globalSetting);
    setGeneratedPrompt(prompt);
    setStep('generated');
  }, [analysisResult, elementSettings, globalSetting]);

  const handleBackToEdit = useCallback(() => {
    setStep('editing');
  }, []);

  const handleBackToUpload = useCallback(() => {
    setStep('upload');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setElementSettings([]);
    setGlobalSetting(DEFAULT_GLOBAL);
    setSelectedTemplateId(null);
    setGeneratedPrompt('');
    prevResultRef.current = null;
    resetAnalysis();
  }, [previewUrl, resetAnalysis]);

  const handleCancelAnalysis = useCallback(() => {
    handleBackToUpload();
  }, [handleBackToUpload]);

  const handleRetry = useCallback(async () => {
    setStep('analyzing');
    await retry();
  }, [retry]);

  const handleStepClick = useCallback((targetStep: AppStep) => {
    const steps: AppStep[] = ['upload', 'analyzing', 'editing', 'generated'];
    const currentIndex = steps.indexOf(step);
    const targetIndex = steps.indexOf(targetStep);

    if (targetIndex >= currentIndex) return;

    if (targetStep === 'upload') {
      handleBackToUpload();
    } else if (targetStep === 'editing' && step === 'generated') {
      handleBackToEdit();
    }
  }, [step, handleBackToUpload, handleBackToEdit]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* 頂部標題 */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              title="回到首頁"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                社群貼文美化 Prompt 生成器
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                上傳圖片 → AI 分析 → 調整細節 → 生成 Prompt
              </p>
            </div>
          </div>
          {step !== 'upload' && (
            <button
              onClick={handleBackToUpload}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              重新開始
            </button>
          )}
        </div>
      </header>

      {/* 步驟指示 */}
      <div className="border-b border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl gap-6 px-6 py-2.5">
          {STEPS_CONFIG.map((s, i) => {
            const steps: AppStep[] = ['upload', 'analyzing', 'editing', 'generated'];
            const currentIndex = steps.indexOf(step);
            const stepIndex = steps.indexOf(s.key);
            const isCompleted = stepIndex < currentIndex;
            const isCurrent = stepIndex === currentIndex;
            const canClick = isCompleted && s.key !== 'analyzing';

            return (
              <button
                key={s.key}
                onClick={() => canClick && handleStepClick(s.key)}
                disabled={!canClick}
                className={`flex items-center gap-2 transition-colors ${
                  canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                }`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
                }`}>
                  {isCompleted ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs ${
                  isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isCurrent
                      ? 'font-medium text-zinc-700 dark:text-zinc-300'
                      : 'text-zinc-400 dark:text-zinc-500'
                }`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* 步驟 1：上傳 */}
        {step === 'upload' && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                上傳你的社群貼文圖片
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                AI 會分析圖片上的文字、排版和風格，幫你生成美化 prompt
              </p>
            </div>
            <ImageUploader onImageReady={handleImageReady} />
          </div>
        )}

        {/* 步驟 2：分析中 / 分析失敗 */}
        {step === 'analyzing' && (
          <>
            {isLoading && !analysisError && (
              <AnalysisLoading onCancel={handleCancelAnalysis} />
            )}
            {analysisError && !isLoading && (
              <div className="flex w-full max-w-xl mx-auto flex-col items-center gap-6 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    分析失敗
                  </p>
                  <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-red-50 p-3 text-left text-xs text-red-600 whitespace-pre-wrap break-words dark:bg-red-900/20 dark:text-red-400">
                    {analysisError}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={handleBackToUpload}>
                    重新上傳
                  </Button>
                  <Button onClick={handleRetry}>
                    重試分析
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 步驟 3：編輯 */}
        {step === 'editing' && analysisResult && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                原始圖片
              </h3>
              {previewUrl && (
                <div className="sticky top-4 space-y-4">
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="上傳的圖片"
                      className="h-auto w-full object-contain"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                  <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">AI 分析摘要</p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {analysisResult.overallDescription}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      排版：{analysisResult.layoutDescription}
                    </p>
                    <p className="text-xs text-zinc-500">
                      比例：{analysisResult.aspectRatio} | 風格：{analysisResult.currentMood}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 space-y-6">
              <button
                onClick={handleBackToUpload}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                重新上傳圖片
              </button>

              <StyleTemplateSelector
                selectedId={selectedTemplateId}
                onSelect={handleTemplateSelect}
                onDeselect={handleTemplateDeselect}
              />

              <ElementControlPanel
                analysis={analysisResult}
                elementSettings={elementSettings}
                globalSetting={globalSetting}
                onElementChange={setElementSettings}
                onGlobalChange={setGlobalSetting}
              />

              <div className="sticky bottom-0 -mx-6 px-6 pb-4 pt-6 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-zinc-50/0 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-zinc-950/0">
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleGeneratePrompt}>
                    生成 Prompt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 步驟 4：已生成 */}
        {step === 'generated' && analysisResult && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              {previewUrl && (
                <div className="sticky top-4">
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="上傳的圖片"
                      className="h-auto w-full object-contain"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <PromptOutput
                prompt={generatedPrompt}
                onRegenerate={handleBackToEdit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
