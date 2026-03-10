import { Service, Barber, Settings, SiteContent } from '../types';

export const initialServices: Service[] = [
  { id: 's1', name: 'Corte de cabelo', durationMinutes: 30, price: 50, description: 'Corte clássico ou moderno, com lavagem e finalização.' },
  { id: 's2', name: 'Barba', durationMinutes: 20, price: 35, description: 'Modelagem de barba com toalha quente e navalha.' },
  { id: 's3', name: 'Corte + Barba', durationMinutes: 50, price: 80, description: 'O pacote completo para o seu visual.' },
  { id: 's4', name: 'Acabamento / Pezinho', durationMinutes: 15, price: 20, description: 'Apenas o contorno para manter o corte alinhado.' },
];

export const initialBarbers: Barber[] = [
  { id: 'b1', name: 'João', imageUrl: 'https://picsum.photos/seed/joao/200/200', specialty: 'Especialista em cortes clássicos', availability: true },
  { id: 'b2', name: 'Marcos', imageUrl: 'https://picsum.photos/seed/marcos/200/200', specialty: 'Mestre das barbas e degradês', availability: true },
];

export const initialSettings: Settings = {
  cancellationFee: 15.00,
  cancellationFeeHoursLimit: 2,
  businessHours: {
    0: { open: '00:00', close: '00:00', isClosed: true }, // Domingo
    1: { open: '09:00', close: '19:00', isClosed: false }, // Segunda
    2: { open: '09:00', close: '19:00', isClosed: false }, // Terça
    3: { open: '09:00', close: '19:00', isClosed: false }, // Quarta
    4: { open: '09:00', close: '19:00', isClosed: false }, // Quinta
    5: { open: '09:00', close: '19:00', isClosed: false }, // Sexta
    6: { open: '09:00', close: '16:00', isClosed: false }, // Sábado
  }
};

export const initialSiteContent: SiteContent = {
  name: 'The Classic Barber',
  slogan: 'Tradição e Estilo em Cada Corte',
  description: 'Uma barbearia clássica para homens modernos.',
  phone: '(11) 99999-9999',
  whatsapp: '5511999999999',
  address: 'Rua da Tradição, 123 - Centro, São Paulo - SP',
  heroTitle: 'O Seu Estilo, Nossa Tradição.',
  heroSubtitle: 'Agende seu horário e tenha uma experiência premium de cuidado pessoal.',
  heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80',
  aboutText: 'Na The Classic Barber, nós acreditamos que um bom corte de cabelo e uma barba bem feita são essenciais para a confiança de um homem. Nossos profissionais são treinados nas melhores técnicas para oferecer um serviço de excelência.',
  cancellationPolicyText: 'Cancelamentos com menos de {hours} horas de antecedência estão sujeitos a uma taxa de R$ {fee} no próximo agendamento.'
};
