'use client';

import { useState, useCallback, useRef } from 'react';
import type { ProductInfo } from '@/types/product';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from '@/components/ui/Button';

const STYLE_OPTIONS = [
  '科技感 / 未來感',
  '自然清新 / 有機',
  '奢華高端 / 精品',
  '活潑可愛 / 年輕',
  '簡約極簡 / 北歐風',
  '專業商務 / 企業',
  '溫暖居家 / 生活感',
];

const SELLING_POINT_PLACEHOLDERS = ['降噪效果業界最強', '續航 40 小時', '重量僅 180g'];

const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500';

interface ProductInfoFormProps {
  onSubmit: (file: File, info: ProductInfo) => void;
  isLoading?: boolean;
}

export function ProductInfoForm({ onSubmit, isLoading = false }: ProductInfoFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [info, setInfo] = useState<ProductInfo>({
    name: '',
    sellingPoints: ['', '', ''],
    targetAudience: '',
    stylePreference: '',
    additionalNotes: '',
  });

  // 用 ref 追蹤前一個 objectURL，避免 handleImageReady 依賴 previewUrl state
  const prevPreviewUrlRef = useRef('');

  const handleImageReady = useCallback((file: File) => {
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    prevPreviewUrlRef.current = url;
    setUploadedFile(file);
    setPreviewUrl(url);
  }, []);  // 無需依賴 previewUrl，避免每次重新建立 callback

  const handleReplaceImage = useCallback(() => {
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
      prevPreviewUrlRef.current = '';
    }
    setPreviewUrl('');
    setUploadedFile(null);
  }, []);

  const handleSellingPointChange = useCallback((index: number, value: string) => {
    setInfo((prev) => {
      const updated = [...prev.sellingPoints];
      updated[index] = value;
      return { ...prev, sellingPoints: updated };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!uploadedFile) return;
    onSubmit(uploadedFile, info);
  }, [uploadedFile, info, onSubmit]);

  const canSubmit = !!uploadedFile && !isLoading;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* 左側：上傳圖片 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          產品圖片
          <span className="ml-1 text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">（必填）</span>
        </h3>

        {previewUrl ? (
          <ImagePreview
            src={previewUrl}
            alt="上傳的產品圖片"
            maxHeight={320}
            onReplace={handleReplaceImage}
            replaceLabel="重新上傳"
          />
        ) : (
          <ImageUploader onImageReady={handleImageReady} />
        )}
      </div>

      {/* 右側：產品資訊 */}
      <div className="space-y-5">
        {/* 產品名稱 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            產品名稱
          </label>
          <input
            type="text"
            value={info.name}
            onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
            placeholder="例：AirMax Pro 無線耳機"
            className={INPUT_CLASS}
          />
        </div>

        {/* 核心賣點 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            核心賣點
            <span className="ml-1 text-xs text-zinc-400 font-normal">（最多 3 點）</span>
          </label>
          <div className="space-y-2">
            {info.sellingPoints.map((point, i) => (
              <input
                key={i}
                type="text"
                value={point}
                onChange={(e) => handleSellingPointChange(i, e.target.value)}
                placeholder={`賣點 ${i + 1}，例：${SELLING_POINT_PLACEHOLDERS[i]}`}
                aria-label={`賣點 ${i + 1}`}
                className={INPUT_CLASS}
              />
            ))}
          </div>
        </div>

        {/* 目標受眾 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            目標受眾
          </label>
          <input
            type="text"
            value={info.targetAudience}
            onChange={(e) => setInfo((p) => ({ ...p, targetAudience: e.target.value }))}
            placeholder="例：25-35 歲通勤上班族、喜愛音樂的年輕人"
            className={INPUT_CLASS}
          />
        </div>

        {/* 風格偏好 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            風格偏好
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="風格偏好選項">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = info.stylePreference === style;
              return (
                <button
                  key={style}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setInfo((p) => ({
                      ...p,
                      stylePreference: p.stylePreference === style ? '' : style,
                    }))
                  }
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* 補充說明 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            補充說明
            <span className="ml-1 text-xs text-zinc-400 font-normal">（選填）</span>
          </label>
          <textarea
            value={info.additionalNotes}
            onChange={(e) => setInfo((p) => ({ ...p, additionalNotes: e.target.value }))}
            placeholder="例：品牌色為深藍色、圖片需搭配白色背景、避免過於鮮豔的顏色..."
            rows={3}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        {/* 送出按鈕 */}
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
          aria-disabled={!canSubmit}
        >
          {isLoading ? '分析中...' : '開始分析，產出 7 種 Prompt'}
        </Button>

        {!uploadedFile && (
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500" role="status">
            請先上傳產品圖片再送出
          </p>
        )}
      </div>
    </div>
  );
}
