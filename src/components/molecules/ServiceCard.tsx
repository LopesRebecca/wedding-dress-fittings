// ==========================================
// MOLECULE: Service Card
// Card selecionável para tipo de serviço
// ==========================================

import { cn } from '@/lib/utils';
import type { ServiceType } from '@/types';

interface ServiceCardProps {
  service: ServiceType;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className={cn(
        "p-4 rounded-xl border-2 transition-all duration-300 text-left",
        selected
          ? "border-primary bg-blush shadow-soft"
          : "border-border bg-background hover:border-primary/50 hover:bg-blush/50"
      )}
    >
      <span className="text-2xl mb-1 block">{service.icon}</span>
      <span className={cn(
        "font-medium text-sm",
        selected ? "text-primary" : "text-foreground"
      )}>
        {service.label}
      </span>
      {service.durationMinutes && (
        <span className="text-xs text-muted-foreground block mt-1">
          {service.durationMinutes >= 60 
            ? `${service.durationMinutes / 60}h` 
            : `${service.durationMinutes}min`}
        </span>
      )}
    </button>
  );
}
