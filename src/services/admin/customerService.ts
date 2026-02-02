// ==========================================
// Serviço de Clientes Admin
// ==========================================

import { adminApi, ADMIN_ENDPOINTS } from '@/config/adminApi';
import type { 
  Customer, 
  CreateCustomerRequest, 
  CreateCustomerResponse,
  UpdateCustomerRequest 
} from '@/types/admin';

export const customerService = {
  /**
   * Lista todos os clientes
   */
  async getAll(): Promise<Customer[]> {
    const response = await adminApi.get<Customer[]>(ADMIN_ENDPOINTS.customers);
    return response.data;
  },

  /**
   * Busca inteligente de clientes (email, telefone ou nome)
   */
  async search(filter: string): Promise<Customer[]> {
    const response = await adminApi.get<Customer[]>(ADMIN_ENDPOINTS.customerSearch, {
      params: { filter },
    });
    return response.data;
  },

  /**
   * Busca cliente por ID
   */
  async getById(id: string): Promise<Customer> {
    const response = await adminApi.get<Customer>(ADMIN_ENDPOINTS.customerById(id));
    return response.data;
  },

  /**
   * Cria novo cliente
   */
  async create(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const response = await adminApi.post<CreateCustomerResponse>(
      ADMIN_ENDPOINTS.customers,
      data
    );
    return response.data;
  },

  /**
   * Atualiza cliente existente
   */
  async update(id: string, data: UpdateCustomerRequest): Promise<void> {
    await adminApi.put(ADMIN_ENDPOINTS.customerById(id), data);
  },

  /**
   * Remove cliente
   */
  async delete(id: string): Promise<void> {
    await adminApi.delete(ADMIN_ENDPOINTS.customerById(id));
  },
};

export default customerService;
