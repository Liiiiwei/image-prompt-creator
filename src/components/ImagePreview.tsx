interface ImagePreviewProps {
  src: string;
  alt?: string;
  maxHeight?: number;
  onReplace?: () => void;
  replaceLabel?: string;
}

export function ImagePreview({
  src,
  alt = '圖片預覽',
  maxHeight = 400,
  onReplace,
  replaceLabel = '重新上傳',
}: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-auto w-full object-contain"
          style={{ maxHeight }}
        />
      </div>
      {onReplace && (
        <button
          onClick={onReplace}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 underline"
        >
          {replaceLabel}
        </button>
      )}
    </div>
  );
}
