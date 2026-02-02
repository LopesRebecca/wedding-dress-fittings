// ==========================================
// Types para Agendamentos Admin
// ==========================================

export interface FittingDetails {
  colorDress: string;
  dressCategory: string;
  willBringCompanion: boolean;
  companionCount: number | null;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  scheduledAt: string;
  duration: string;
  type: string;
  status: string;
  fittingDetails: FittingDetails | null;
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  totalCount: number;
  startDate: string;
  endDate: string;
}

export interface CreateAppointmentRequest {
  scheduledAt: string;
  customerName: string;
  customerPhone: string;
  createUserAccount: boolean;
  colorDress: string;
  dressCategory: number; // 1=Noiva, 2=Festa, 3=Madrinha
  willBringCompanion: boolean;
  companionCount: number;
}

export interface CreateAppointmentResponse {
  appointmentId: string;
}

// Enum para categoria de vestido
export enum DressCategory {
  Noiva = 1,
  Festa = 2,
  Madrinha = 3,
}

export const DressCategoryLabels: Record<DressCategory, string> = {
  [DressCategory.Noiva]: 'Noiva',
  [DressCategory.Festa]: 'Festa',
  [DressCategory.Madrinha]: 'Madrinha',
};
