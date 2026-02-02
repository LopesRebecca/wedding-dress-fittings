// ==========================================
// Configuração Axios para Admin API
// ==========================================

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5261/api';
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

// Cliente Axios para API admin
export const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Adiciona token automaticamente
adminApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Trata erros de autenticação
adminApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - fazer logout
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      
      // Redireciona para login admin
      if (window.location.pathname.startsWith('/admin') && 
          !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Endpoints da API Admin
export const ADMIN_ENDPOINTS = {
  // Autenticação
  login: '/user/login',
  logout: '/user/logout',
  me: '/user/me',
  
  // Clientes
  customers: '/customers',
  customerSearch: '/customers/search',
  customerById: (id: string) => `/customers/${id}`,
  
  // Agendamentos
  appointments: '/appointment',
  appointmentById: (id: string) => `/appointment/${id}`,
  
  // Configurações
  availableTimeSlots: '/settings/available-time-slots',
  generalSettings: '/generalsettings',
} as const;

export { ADMIN_TOKEN_KEY, ADMIN_USER_KEY };
