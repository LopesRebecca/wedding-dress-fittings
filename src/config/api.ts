// ==========================================
// Configurações da API
// ==========================================

// URL base da API - pode ser configurada via variável de ambiente
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  login: '/user/login',
  register: '/user/register',
  profile: '/user/me',
  
  // Serviços
  services: '/services',
  serviceById: (id: string) => `/services/${id}`,
  
  // Disponibilidade
  availability: '/availability',
  availabilityByDate: (date: string) => `/availability/${date}`,
  
  // Settings - Configurações de disponibilidade (Backend .NET)
  settings: {
    availableTimeSlots: '/Settings/available-time-slots',
    availability: '/Settings/availability',
  },
  
  // Agendamentos - Backend .NET
  bookings: '/Appointment',
  bookingById: (id: string) => `/Appointment/${id}`,
  userBookings: '/Appointment/user',
  
  // Configurações
  config: '/config',
} as const;

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Timeout padrão para requisições (em ms)
export const REQUEST_TIMEOUT = 10000;
