// ==========================================
// Hook para buscar serviços do backend
// ==========================================

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services';
import type { ServiceType } from '@/types';

export const SERVICES_QUERY_KEY = ['services'];

export function useServices() {
  return useQuery<ServiceType[], Error>({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: () => bookingService.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useServiceById(id: string | null) {
  return useQuery<ServiceType | null, Error>({
    queryKey: [...SERVICES_QUERY_KEY, id],
    queryFn: () => (id ? bookingService.getServiceById(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
