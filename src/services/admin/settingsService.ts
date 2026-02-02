// ==========================================
// Serviço de Configurações Admin
// ==========================================

import { adminApi, ADMIN_ENDPOINTS } from '@/config/adminApi';
import type { GeneralSettings, SaveGeneralSettingsRequest } from '@/types/admin';

export const settingsService = {
  /**
   * Busca configurações gerais
   */
  async getGeneralSettings(): Promise<GeneralSettings> {
    const response = await adminApi.get<GeneralSettings>(ADMIN_ENDPOINTS.generalSettings);
    return response.data;
  },

  /**
   * Salva configurações gerais
   */
  async saveGeneralSettings(data: SaveGeneralSettingsRequest): Promise<void> {
    await adminApi.post(ADMIN_ENDPOINTS.generalSettings, data);
  },
};

export default settingsService;
