// ==========================================
// Hook para buscar disponibilidade do backend
// ==========================================

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services';
import type { AvailabilityResponse } from '@/types';

export const AVAILABILITY_QUERY_KEY = ['availability'];

interface UseAvailabilityOptions {
  serviceId: string | null;
  month: number;
  year: number;
  enabled?: boolean;
}

export function useAvailability({ serviceId, month, year, enabled = true }: UseAvailabilityOptions) {
  return useQuery<AvailabilityResponse, Error>({
    queryKey: [...AVAILABILITY_QUERY_KEY, serviceId, month, year],
    queryFn: () => bookingService.getAvailability({ 
      serviceId: serviceId!, 
      month, 
      year 
    }),
    enabled: enabled && !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useTimeSlots(serviceId: string | null, date: string | null) {
  return useQuery<string[], Error>({
    queryKey: [...AVAILABILITY_QUERY_KEY, 'timeSlots', serviceId, date],
    queryFn: () => bookingService.getTimeSlotsForDate(serviceId!, date!),
    enabled: !!serviceId && !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}
