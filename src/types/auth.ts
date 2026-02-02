// ==========================================
// Types & Interfaces para Autenticação
// ==========================================

// Usuário autenticado
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

// Dados do formulário de login
export interface LoginFormData {
  email: string;
  password: string;
}

// Dados do formulário de registro
export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Estado de autenticação
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Contexto de autenticação
export interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
