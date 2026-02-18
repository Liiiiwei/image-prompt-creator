'use client';

import { useImageUpload } from '@/hooks/useImageUpload';
import { ACCEPTED_IMAGE_TYPES } from '@/lib/image-utils';
import { Button } from './ui/Button';

interface ImageUploaderProps {
  onImageReady: (file: File) => void;
}

export function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const {
    file,
    previewUrl,
    error,
    isDragging,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    openFilePicker,
    reset,
  } = useImageUpload({ onSuccess: onImageReady });

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* 隱藏的 file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {!file ? (
        // 上傳區域
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`
            flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all
            ${isDragging
              ? 'border-zinc-500 bg-zinc-50 dark:border-zinc-400 dark:bg-zinc-800/50'
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30'
            }
          `}
        >
          <svg
            className="mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            拖拽圖片到這裡，或點擊上傳
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            支援 PNG、JPEG、WEBP，最大 10MB
          </p>
        </div>
      ) : (
        // 預覽區域
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="上傳的圖片預覽"
              className="h-auto w-full object-contain"
              style={{ maxHeight: '400px' }}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={reset}>
              重新上傳
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
