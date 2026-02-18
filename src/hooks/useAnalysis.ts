'use client';

import { useState, useCallback, useRef } from 'react';
import type { AnalysisResult } from '@/types';

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyze: (file: File) => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFileRef = useRef<File | null>(null);

  const analyze = useCallback(async (file: File) => {
    lastFileRef.current = file;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const status = res.status;
        const serverError = body?.error ?? '未知伺服器錯誤';
        const detail = body?.detail ? `\n${body.detail}` : '';
        throw new Error(`[${status}] ${serverError}${detail}`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error('[useAnalysis] 分析錯誤：', err);

      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('網路連線失敗，請檢查網路後重試。可能原因：伺服器未啟動、CORS 問題或網路中斷。');
      } else {
        const message = err instanceof Error ? err.message : '分析時發生未知錯誤';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 使用上次的檔案重新分析 */
  const retry = useCallback(async () => {
    if (lastFileRef.current) {
      await analyze(lastFileRef.current);
    }
  }, [analyze]);

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
    lastFileRef.current = null;
  }, []);

  return { result, isLoading, error, analyze, retry, reset };
}
