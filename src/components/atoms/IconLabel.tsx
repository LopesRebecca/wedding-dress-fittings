// ==========================================
// ATOM: Icon with Label
// Componente atômico para ícone com texto
// ==========================================

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconLabelProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function IconLabel({ icon, children, className }: IconLabelProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-primary">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
