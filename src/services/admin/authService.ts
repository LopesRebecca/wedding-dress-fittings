// ==========================================
// Serviço de Autenticação Admin
// ==========================================

import { adminApi, ADMIN_ENDPOINTS, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '@/config/adminApi';
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/admin';

export const adminAuthService = {
  /**
   * Faz login com email/telefone e senha
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await adminApi.post<LoginResponse>(ADMIN_ENDPOINTS.login, data);
    
    // Salva token e dados do usuário
    localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({
      userId: response.data.userId,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
    }));
    
    return response.data;
  },

  /**
   * Faz logout
   */
  async logout(): Promise<void> {
    try {
      await adminApi.post(ADMIN_ENDPOINTS.logout);
    } catch (error) {
      // Ignora erro se token já expirou
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    }
  },

  /**
   * Retorna dados do usuário do localStorage
   */
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem(ADMIN_USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Retorna o token atual
   */
  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  },

  /**
   * Verifica se usuário é admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  },

  /**
   * Busca dados atualizados do usuário na API
   */
  async getMe(): Promise<AuthUser> {
    const response = await adminApi.get<AuthUser>(ADMIN_ENDPOINTS.me);
    return response.data;
  },
};

export default adminAuthService;
