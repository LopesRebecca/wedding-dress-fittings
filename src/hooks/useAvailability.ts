// ==========================================
// Hook para buscar disponibilidade do backend
// ==========================================

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services';
import { configService, type AvailableTimeSlotsResponse } from '@/services/configService';
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

/**
 * Hook para buscar horários disponíveis para uma data específica
 * Usa o endpoint /api/Settings/available-time-slots
 */
export function useTimeSlots(serviceId: string | null, date: string | null) {
  return useQuery<string[], Error>({
    queryKey: [...AVAILABILITY_QUERY_KEY, 'timeSlots', date],
    queryFn: async () => {
      const response = await configService.getAvailableTimeSlots(date!);
      
      // Se não está disponível, retorna array vazio
      if (!response.isAvailable) {
        return [];
      }
      
      return response.timeSlots;
    },
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para buscar resposta completa de disponibilidade (incluindo razão de indisponibilidade)
 */
export function useAvailableTimeSlots(date: string | null) {
  return useQuery<AvailableTimeSlotsResponse, Error>({
    queryKey: [...AVAILABILITY_QUERY_KEY, 'availableTimeSlots', date],
    queryFn: () => configService.getAvailableTimeSlots(date!),
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}
