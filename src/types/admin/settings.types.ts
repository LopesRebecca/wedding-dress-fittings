// ==========================================
// Types para Configurações Gerais
// ==========================================

export interface StudioInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsApp: string;
  address: string;
  description: string;
}

export interface NotificationSettings {
  id: string;
  emailNotificationsEnabled: boolean;
  whatsAppNotificationsEnabled: boolean;
  dailyReportEnabled: boolean;
  newAppointmentAlertEnabled: boolean;
}

export interface GeneralSettings {
  studioInfo: StudioInfo;
  notifications: NotificationSettings;
}

export interface SaveGeneralSettingsRequest {
  studioInfo: Omit<StudioInfo, 'id'>;
  notifications: Omit<NotificationSettings, 'id'>;
}
