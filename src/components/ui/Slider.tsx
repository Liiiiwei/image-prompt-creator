'use client';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </label>
        <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200
          accent-zinc-900
          dark:bg-zinc-700 dark:accent-zinc-100
        "
      />
    </div>
  );
}
