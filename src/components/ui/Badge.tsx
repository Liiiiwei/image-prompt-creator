interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5
        text-xs font-medium text-zinc-600
        dark:bg-zinc-700 dark:text-zinc-300
        ${className}
      `}
    >
      {children}
    </span>
  );
}
