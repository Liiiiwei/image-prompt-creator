interface Step<T extends string> {
  key: T;
  label: string;
}

interface StepIndicatorProps<T extends string> {
  steps: Step<T>[];
  current: T;
  /** 點擊已完成步驟時觸發，傳入目標步驟 key */
  onStepClick?: (key: T) => void;
  /** 哪些步驟允許被點擊回跳（預設：所有已完成步驟） */
  clickableKeys?: T[];
}

export function StepIndicator<T extends string>({
  steps,
  current,
  onStepClick,
  clickableKeys,
}: StepIndicatorProps<T>) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-6 py-2.5">
      {steps.map((step, i) => {
        const stepIndex = i;
        const isCompleted = stepIndex < currentIndex;
        const isCurrent = stepIndex === currentIndex;
        const canClick =
          isCompleted &&
          !!onStepClick &&
          (clickableKeys ? clickableKeys.includes(step.key) : true);

        return (
          <button
            key={step.key}
            onClick={() => canClick && onStepClick?.(step.key)}
            disabled={!canClick}
            aria-current={isCurrent ? 'step' : undefined}
            aria-disabled={!canClick}
            className={`flex items-center gap-2 transition-colors ${
              canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
              }`}
            >
              {isCompleted ? (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs ${
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isCurrent
                    ? 'font-medium text-zinc-700 dark:text-zinc-300'
                    : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
