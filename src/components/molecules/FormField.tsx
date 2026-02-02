// ==========================================
// MOLECULE: Form Field
// Campo de formulário com label e ícone
// ==========================================

import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  icon?: ReactNode;
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export function FormField({ icon, label, htmlFor, children, className, hint }: FormFieldProps) {
  return (
    <div className={cn("mb-6", className)}>
      <Label 
        htmlFor={htmlFor} 
        className="text-foreground font-medium flex items-center gap-3"
      >
        {icon && <span className="w-4 h-4 text-primary flex-shrink-0">{icon}</span>}
        {label}
      </Label>
      <div className="mt-3">
        {children}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
