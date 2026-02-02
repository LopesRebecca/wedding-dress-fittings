// ==========================================
// Contexto de Autenticação Admin - Provider
// ==========================================

import { useState, useEffect, useCallback, type ReactNode, createContext } from 'react';
import { adminAuthService } from '../services/admin';
import type { AuthUser, LoginRequest, AdminAuthContextType } from '../types/admin';
import { toast } from '../hooks/use-toast';

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedUser = adminAuthService.getCurrentUser();
    const storedToken = adminAuthService.getToken();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await adminAuthService.login(data);
      
      setUser({
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      });
      setToken(response.token);
      
      toast({
        title: 'Bem-vindo! 🎉',
        description: `Olá, ${response.name}!`,
      });
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Credenciais inválidas';
      toast({
        title: 'Erro no login',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await adminAuthService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isAdmin: user?.role === 'Admin',
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
