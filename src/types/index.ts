export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
};

export type Barber = {
  id: string;
  name: string;
  imageUrl: string;
  specialty?: string;
  availability?: boolean;
};

export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'nao_compareceu';

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  cancellationFeeApplied?: boolean;
};

export type Settings = {
  cancellationFee: number;
  cancellationFeeHoursLimit: number;
  businessHours: {
    [key: number]: { open: string; close: string; isClosed: boolean };
  };
};

export type SiteContent = {
  name: string;
  slogan: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  cancellationPolicyText: string;
};
