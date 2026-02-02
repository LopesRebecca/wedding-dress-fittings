// ==========================================
// Serviço de Autenticação
// ==========================================

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type { LoginFormData, RegisterFormData, AuthResponse, User } from '@/types/auth';

// Para desenvolvimento - simula respostas da API
const MOCK_DELAY = 800;

const mockUser: User = {
  id: '1',
  name: 'Maria Silva',
  email: 'maria@email.com',
  phone: '(11) 99999-9999',
  createdAt: new Date().toISOString(),
};

// Simula um banco de dados local para desenvolvimento
const getStoredUsers = (): Record<string, { user: User; password: string }> => {
  try {
    const stored = localStorage.getItem('mock_users');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeUser = (email: string, user: User, password: string) => {
  const users = getStoredUsers();
  users[email] = { user, password };
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const authService = {
  // Login
  async login(data: LoginFormData): Promise<AuthResponse> {
    // Tenta usar a API real primeiro
    try {
      return await apiClient.post<AuthResponse>(API_ENDPOINTS.login, data);
    } catch (error) {
      // Fallback para mock em desenvolvimento
      console.log('Usando mock para login');
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = getStoredUsers();
          const storedData = users[data.email];
          
          if (storedData && storedData.password === data.password) {
            resolve({
              user: storedData.user,
              token: `mock_token_${Date.now()}`,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            });
          } else if (data.email === 'demo@email.com' && data.password === '123456') {
            // Usuário demo para testes
            resolve({
              user: mockUser,
              token: `mock_token_${Date.now()}`,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            });
          } else {
            reject(new Error('E-mail ou senha incorretos'));
          }
        }, MOCK_DELAY);
      });
    }
  },

  // Registro
  async register(data: RegisterFormData): Promise<AuthResponse> {
    // Valida senha
    if (data.password !== data.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    if (data.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    // Tenta usar a API real primeiro
    try {
      return await apiClient.post<AuthResponse>(API_ENDPOINTS.register, data);
    } catch (error) {
      // Fallback para mock em desenvolvimento
      console.log('Usando mock para registro');
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = getStoredUsers();
          
          if (users[data.email]) {
            reject(new Error('Este e-mail já está cadastrado'));
            return;
          }

          const newUser: User = {
            id: `user_${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            createdAt: new Date().toISOString(),
          };

          // Salva no mock storage
          storeUser(data.email, newUser, data.password);

          resolve({
            user: newUser,
            token: `mock_token_${Date.now()}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        }, MOCK_DELAY);
      });
    }
  },

  // Obter perfil do usuário
  async getProfile(token: string): Promise<User> {
    try {
      return await apiClient.get<User>(API_ENDPOINTS.profile);
    } catch (error) {
      // Fallback para mock
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUser);
        }, MOCK_DELAY);
      });
    }
  },

  // Atualizar perfil
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await apiClient.put<User>(API_ENDPOINTS.profile, data);
    } catch (error) {
      // Fallback para mock
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...mockUser, ...data });
        }, MOCK_DELAY);
      });
    }
  },
};
