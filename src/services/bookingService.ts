// ==========================================
// Serviço de Agendamentos
// ==========================================

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type {
  ServiceType,
  AvailableDate,
  BookingFormData,
  BookingResponse,
  EstablishmentConfig,
  AvailabilityRequest,
  AvailabilityResponse,
} from '@/types';


const MOCK_SERVICES: ServiceType[] = [
  { id: "noiva", label: "Noiva", icon: "💍", durationMinutes: 120, isActive: true },
  { id: "debutante", label: "Debutante", icon: "👑", durationMinutes: 60, isActive: true },
  { id: "madrinha", label: "Madrinha", icon: "✨", durationMinutes: 60, isActive: true },
  { id: "daminha", label: "Daminha", icon: "🌸", durationMinutes: 60, isActive: true },
  { id: "outro", label: "Outro", icon: "🎀", durationMinutes: 60, isActive: true },
];

const MOCK_CONFIG: EstablishmentConfig = {
  name: "Atelier Carvalho",
  phone: "(21) 98249-5227",
  whatsappNumber: "5521982495227",
  address: "R. Cel. Costa Pereira, 100, Vila Ibirapitanga, Itaguaí - RJ, 23815-040",
  instagram: "https://www.instagram.com/ateliecarvalho.oficial",
  workingHours: { start: "09:00", end: "18:00" },
  workingDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
};

// Gerar horários disponíveis baseado no serviço
function generateMockTimeSlots(serviceId: string): string[] {
  const service = MOCK_SERVICES.find(s => s.id === serviceId);
  const intervalMinutes = service?.durationMinutes || 60;
  const slots: string[] = [];
  
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour + (minute + intervalMinutes) / 60 <= endHour) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeStr);
      }
    }
  }
  
  return slots;
}

// Gerar datas disponíveis mock
function generateMockAvailability(serviceId: string, month: number, year: number): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const timeSlots = generateMockTimeSlots(serviceId);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Pular se é passado ou se não é dia de trabalho
    if (date < today || !MOCK_CONFIG.workingDays.includes(dayOfWeek)) {
      continue;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    dates.push({
      date: dateStr,
      dayOfWeek: dayNames[dayOfWeek],
      timeSlots: timeSlots.map((time, index) => ({
        id: `${dateStr}-${time}`,
        time,
        available: Math.random() > 0.3, // 70% chance de estar disponível
      })),
    });
  }
  
  return dates;
}

// ==========================================
// Funções do Serviço
// ==========================================

// Flag para usar mock ou API real
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const bookingService = {
  /**
   * Busca todos os tipos de serviço disponíveis
   */
  async getServices(): Promise<ServiceType[]> {
    if (USE_MOCK) {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_SERVICES.filter(s => s.isActive);
    }
    return apiClient.get<ServiceType[]>(API_ENDPOINTS.services);
  },

  /**
   * Busca um serviço pelo ID
   */
  async getServiceById(id: string): Promise<ServiceType | null> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_SERVICES.find(s => s.id === id) || null;
    }
    return apiClient.get<ServiceType>(API_ENDPOINTS.serviceById(id));
  },

  /**
   * Busca disponibilidade de datas e horários
   */
  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const service = MOCK_SERVICES.find(s => s.id === request.serviceId);
      return {
        availableDates: generateMockAvailability(request.serviceId, request.month, request.year),
        serviceInfo: service || MOCK_SERVICES[0],
      };
    }
    return apiClient.post<AvailabilityResponse, AvailabilityRequest>(
      API_ENDPOINTS.availability,
      request
    );
  },

  /**
   * Busca horários disponíveis para uma data específica
   */
  async getTimeSlotsForDate(serviceId: string, date: string): Promise<string[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const slots = generateMockTimeSlots(serviceId);
      // Simula alguns horários indisponíveis
      return slots.filter(() => Math.random() > 0.3);
    }
    const response = await apiClient.get<{ timeSlots: string[] }>(
      `${API_ENDPOINTS.availabilityByDate(date)}?serviceId=${serviceId}`
    );
    return response.timeSlots;
  },

  /**
   * Envia um novo agendamento
   */
  async createBooking(data: BookingFormData): Promise<BookingResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: `booking-${Date.now()}`,
        status: 'pending',
        message: 'Agendamento recebido! Aguarde confirmação pelo WhatsApp.',
        createdAt: new Date().toISOString(),
      };
    }
    
    // Mapear dados do frontend para o formato do backend .NET
    const backendRequest = {
      scheduledAt: `${data.date}T${data.time}:00.000Z`,
      customerName: data.name,
      customerPhone: data.phone,
      createUserAccount: data.createAccount,
      colorDress: data.color,
      dressCategory: data.dressType === 'outros' ? data.otherDressType : data.dressType,
      willBringCompanion: data.hasCompanions,
      companionCount: data.companionsCount || 0,
    };
    
    const response = await apiClient.post<{ appointmentId: string }, typeof backendRequest>(
      API_ENDPOINTS.bookings,
      backendRequest
    );
    
    // Mapear resposta do backend para o formato esperado pelo frontend
    return {
      id: response.appointmentId,
      status: 'pending',
      message: 'Agendamento criado com sucesso! Aguarde confirmação pelo WhatsApp.',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Busca configurações do estabelecimento
   */
  async getConfig(): Promise<EstablishmentConfig> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_CONFIG;
    }
    return apiClient.get<EstablishmentConfig>(API_ENDPOINTS.config);
  },
};

export default bookingService;
