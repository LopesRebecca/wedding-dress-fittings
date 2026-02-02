// ==========================================
// Types para Clientes
// ==========================================

export interface Customer {
  customerId: string;
  name: string;
  phone: string;
  email: string | null;
  taxNumber: string | null;
  hasCompleteRegistration: boolean;
  hasUserAccount: boolean;
  userId: string | null;
  userEmail: string | null;
  isUserActive: boolean | null;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  taxNumber?: string;
  createUserAccount: boolean;
  password?: string;
}

export interface CreateCustomerResponse {
  customerId: string;
  userId: string | null;
  userAccountCreated: boolean;
  message: string;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  taxNumber?: string;
}
