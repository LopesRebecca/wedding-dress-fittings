// ==========================================
// ATOM: Section Title
// Componente atômico para títulos de seção
// ==========================================

import { cn } from '@/lib/utils';

interface SectionTitleProps {
  label?: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}

export function SectionTitle({ label, title, highlight, description, className }: SectionTitleProps) {
  return (
    <div className={cn("text-center", className)}>
      {label && (
        <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm">
          {label}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
        {title} {highlight && <span className="italic text-primary">{highlight}</span>}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
