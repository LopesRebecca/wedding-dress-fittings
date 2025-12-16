// ==========================================
// Hook para configurações do estabelecimento
// ==========================================

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services';
import type { EstablishmentConfig } from '@/types';

export const CONFIG_QUERY_KEY = ['config'];

export function useEstablishmentConfig() {
  return useQuery<EstablishmentConfig, Error>({
    queryKey: CONFIG_QUERY_KEY,
    queryFn: () => bookingService.getConfig(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}
