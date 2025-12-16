// ==========================================
// ORGANISM: DateTime Picker
// Seletor de data e horário integrado
// ==========================================

import { Calendar } from 'lucide-react';
import { FormField, DatePicker, TimeSlotPicker } from '@/components/molecules';

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
  timeSlots: string[];
  serviceDuration?: number;
  isLoadingTimeSlots?: boolean;
  disabledDates?: (date: Date) => boolean;
  hint?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  timeSlots,
  serviceDuration,
  isLoadingTimeSlots = false,
  disabledDates,
  hint,
}: DateTimePickerProps) {
  return (
    <FormField 
      icon={<Calendar />} 
      label="Data e Horário Preferidos"
      hint={hint}
      className="mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DatePicker
          value={date}
          onChange={onDateChange}
          disabledDates={disabledDates}
        />
        
        <TimeSlotPicker
          value={time}
          onChange={onTimeChange}
          timeSlots={timeSlots}
          duration={serviceDuration}
          isLoading={isLoadingTimeSlots}
          disabled={!date}
          placeholder={!date ? "Selecione a data primeiro" : "Selecione o horário"}
        />
      </div>
    </FormField>
  );
}
