// ==========================================
// MOLECULE: Time Slot Picker
// Seletor de horário com slots disponíveis
// ==========================================

import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface TimeSlotPickerProps {
  value: string;
  onChange: (value: string) => void;
  timeSlots: string[];
  duration?: number; // em minutos
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TimeSlotPicker({
  value,
  onChange,
  timeSlots,
  duration,
  isLoading = false,
  disabled = false,
  placeholder = "Selecione o horário",
  className,
}: TimeSlotPickerProps) {
  const durationLabel = duration 
    ? duration >= 60 
      ? `(${duration / 60}h)` 
      : `(${duration}min)`
    : '';

  if (isLoading) {
    return (
      <div className={cn(
        "h-12 rounded-xl bg-background border border-border flex items-center justify-center gap-2",
        className
      )}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-muted-foreground">Carregando horários...</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("h-12 rounded-xl bg-background border-border", className)}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {timeSlots.length === 0 ? (
          <div className="py-2 px-3 text-sm text-muted-foreground text-center">
            Nenhum horário disponível
          </div>
        ) : (
          timeSlots.map((time) => (
            <SelectItem key={time} value={time}>
              {time} {durationLabel}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
