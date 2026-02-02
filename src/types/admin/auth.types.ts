// ==========================================
// Types para Autenticação Admin
// ==========================================

// Request de login (deve coincidir com o backend)
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

// Response de login
export interface LoginResponse {
  token: string;
  tokenType: 'Bearer';
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Client';
  expiresAt: string;
}

// Dados do usuário logado
export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Client';
}

// Estado de autenticação
export interface AdminAuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

// Tipo do contexto de autenticação
export interface AdminAuthContextType extends AdminAuthState {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}
