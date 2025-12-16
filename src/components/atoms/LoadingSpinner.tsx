// ==========================================
// ATOM: Loading Spinner
// Componente atômico para indicador de loading
// ==========================================

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8 border-3',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
