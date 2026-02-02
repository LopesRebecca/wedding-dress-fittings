// ==========================================
// Serviço de Agendamentos Admin
// ==========================================

import { adminApi, ADMIN_ENDPOINTS } from '@/config/adminApi';
import type { 
  Appointment,
  AppointmentsResponse, 
  CreateAppointmentRequest, 
  CreateAppointmentResponse 
} from '@/types/admin';

export const appointmentService = {
  /**
   * Lista agendamentos por intervalo de datas
   */
  async getByDateRange(startDate: string, endDate: string): Promise<AppointmentsResponse> {
    const response = await adminApi.get<AppointmentsResponse>(ADMIN_ENDPOINTS.appointments, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Busca agendamento por ID
   */
  async getById(id: string): Promise<Appointment> {
    const response = await adminApi.get<Appointment>(ADMIN_ENDPOINTS.appointmentById(id));
    return response.data;
  },

  /**
   * Cria novo agendamento
   */
  async create(data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const response = await adminApi.post<CreateAppointmentResponse>(
      ADMIN_ENDPOINTS.appointments,
      data
    );
    return response.data;
  },

  /**
   * Cancela agendamento
   */
  async cancel(id: string): Promise<void> {
    await adminApi.delete(ADMIN_ENDPOINTS.appointmentById(id));
  },

  /**
   * Busca horários disponíveis para uma data
   */
  async getAvailableTimeSlots(date: string): Promise<{
    date: string;
    timeSlots: string[];
    isAvailable: boolean;
    reason?: string;
  }> {
    const response = await adminApi.get(ADMIN_ENDPOINTS.availableTimeSlots, {
      params: { date },
    });
    return response.data;
  },
};

export default appointmentService;
