interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'text' | 'visual' | 'structural';
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  default: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  text: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  visual: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  structural: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md px-2 py-0.5
        text-xs font-medium
        ${VARIANT_STYLES[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
