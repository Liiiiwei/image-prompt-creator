'use client';

import { useState, useCallback } from 'react';
import type { ProductInfo } from '@/types/product';
import { ImageUploader } from '@/components/ImageUploader';
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

  const handleImageReady = useCallback((file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

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
          <span className="ml-1 text-red-500">*</span>
        </h3>

        {previewUrl ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="產品圖片"
                className="h-auto w-full object-contain"
                style={{ maxHeight: '320px' }}
              />
            </div>
            <button
              onClick={() => {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
                setUploadedFile(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 underline"
            >
              重新上傳
            </button>
          </div>
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
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
                placeholder={`賣點 ${i + 1}，例：${['降噪效果業界最強', '續航 40 小時', '重量僅 180g'][i]}`}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
          />
        </div>

        {/* 風格偏好 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            風格偏好
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() =>
                  setInfo((p) => ({
                    ...p,
                    stylePreference: p.stylePreference === style ? '' : style,
                  }))
                }
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  info.stylePreference === style
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {style}
              </button>
            ))}
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 resize-none"
          />
        </div>

        {/* 送出按鈕 */}
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
        >
          {isLoading ? '分析中...' : '開始分析，產出 7 種 Prompt'}
        </Button>

        {!uploadedFile && (
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            請先上傳產品圖片
          </p>
        )}
      </div>
    </div>
  );
}
