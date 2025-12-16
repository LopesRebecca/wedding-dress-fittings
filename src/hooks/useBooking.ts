// ==========================================
// Hook para criar agendamentos
// ==========================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services';
import type { BookingFormData, BookingResponse } from '@/types';
import { AVAILABILITY_QUERY_KEY } from './useAvailability';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResponse, Error, BookingFormData>({
    mutationFn: (data: BookingFormData) => bookingService.createBooking(data),
    onSuccess: () => {
      // Invalida cache de disponibilidade após criar agendamento
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEY });
    },
  });
}
