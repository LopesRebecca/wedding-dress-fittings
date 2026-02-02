// ==========================================
// Serviço de Configurações de Disponibilidade
// ==========================================

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';

// Response do endpoint available-time-slots
export interface AvailableTimeSlotsResponse {
  date: string;
  timeSlots: string[];
  isAvailable: boolean;
  reason?: string;
}

// Response do endpoint availability (configurações completas)
export interface BusinessTimeRangeDto {
  id: string;
  startTime: string;
  endTime: string;
  slotDurationInMinutes: number;
  isEnabled: boolean;
}

export interface WeeklyBusinessHoursDto {
  id: string;
  dayOfWeek: number;
  isEnabled: boolean;
  timeRanges: BusinessTimeRangeDto[];
}

export interface BlockedDateDto {
  id: string;
  date: string;
  reason: string;
}

export interface AvailabilitySettingsResponse {
  weeklyBusinessHours: WeeklyBusinessHoursDto[];
  blockedDates: BlockedDateDto[];
}

export const configService = {
  /**
   * Busca horários disponíveis para uma data específica
   * GET /api/Settings/available-time-slots?date=YYYY-MM-DD
   */
  async getAvailableTimeSlots(date: string): Promise<AvailableTimeSlotsResponse> {
    return apiClient.get<AvailableTimeSlotsResponse>(
      `${API_ENDPOINTS.settings.availableTimeSlots}?date=${date}`
    );
  },

  /**
   * Busca configurações de disponibilidade (horários semanais e datas bloqueadas)
   * GET /api/Settings/availability
   */
  async getAvailabilitySettings(
    startDate?: string,
    endDate?: string
  ): Promise<AvailabilitySettingsResponse> {
    let url = API_ENDPOINTS.settings.availability;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return apiClient.get<AvailabilitySettingsResponse>(url);
  },
};

export default configService;
