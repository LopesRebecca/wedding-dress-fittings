// ==========================================
// Types & Interfaces para a aplicação
// ==========================================

// Re-exportar tipos de autenticação
export * from './auth';

// Tipo de serviço/vestido
export interface ServiceType {
  id: string;
  label: string;
  icon: string;
  durationMinutes: number;
  isActive: boolean;
}

// Horário disponível
export interface TimeSlot {
  id: string;
  time: string; // formato "HH:mm"
  available: boolean;
}

// Data disponível com horários
export interface AvailableDate {
  date: string; // formato "YYYY-MM-DD"
  dayOfWeek: string;
  timeSlots: TimeSlot[];
}

// Dados do formulário de agendamento
export interface BookingFormData {
  name: string;
  phone: string;
  dressType: string;
  otherDressType?: string;
  serviceId: string;
  otherService?: string;
  color: string;
  date: string;
  time: string;
  hasCompanions: boolean;
  companionsCount?: number;
  createAccount: boolean;
  userId?: string; // ID do usuário logado
}

// Resposta de agendamento do backend
export interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  message: string;
  createdAt: string;
}

// Configurações do estabelecimento (vindas do backend)
export interface EstablishmentConfig {
  name: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  instagram: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[]; // 0 = domingo, 6 = sábado
}

// Estado de loading/error para queries
export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Request para buscar disponibilidade
export interface AvailabilityRequest {
  serviceId: string;
  month: number;
  year: number;
}

// Resposta de disponibilidade
export interface AvailabilityResponse {
  availableDates: AvailableDate[];
  serviceInfo: ServiceType;
}
