import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfToday, isBefore, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { generateTimeSlots, calculateEndTime } from '../utils/dateUtils';
import { Appointment } from '../types';

export const Booking = () => {
  const navigate = useNavigate();
  const { services, barbers, settings, siteContent, appointments, addAppointment } = useAppContext();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceId: '',
    barberId: '',
    date: startOfToday(),
    time: '',
  });
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate dates for the next 14 days
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    if (formData.serviceId && formData.barberId && formData.date) {
      const service = services.find(s => s.id === formData.serviceId);
      if (service) {
        const slots = generateTimeSlots(formData.date, formData.barberId, service.durationMinutes, appointments, settings);
        setAvailableSlots(slots);
        // Reset time if it's no longer available
        if (formData.time && !slots.includes(formData.time)) {
          setFormData(prev => ({ ...prev, time: '' }));
        }
      }
    }
  }, [formData.serviceId, formData.barberId, formData.date, appointments, services, settings]);

  const handleNext = () => {
    if (step === 1 && (!formData.serviceId || !formData.barberId)) return;
    if (step === 2 && (!formData.date || !formData.time)) return;
    if (step === 3 && (!formData.name || !formData.phone)) return;
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = services.find(s => s.id === formData.serviceId);
    if (!service) return;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.name,
      clientPhone: formData.phone,
      serviceId: formData.serviceId,
      barberId: formData.barberId,
      date: format(formData.date, 'yyyy-MM-dd'),
      startTime: formData.time,
      endTime: calculateEndTime(formData.time, service.durationMinutes),
      status: 'agendado',
    };

    addAppointment(newAppointment);
    setIsSuccess(true);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="bg-zinc-900 p-10 rounded-sm border border-zinc-800 max-w-md w-full text-center shadow-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3 uppercase tracking-tight">Agendamento Confirmado!</h2>
          <p className="text-zinc-400 mb-10 text-lg font-light">
            Seu horário foi reservado com sucesso. Te esperamos na barbearia!
          </p>
          <div className="space-y-4">
            <Button className="w-full h-12 text-lg uppercase tracking-wider" onClick={() => navigate('/meus-agendamentos')}>
              Ver Meus Agendamentos
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg uppercase tracking-wider" onClick={() => navigate('/')}>
              Voltar para o Início
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedBarber = barbers.find(b => b.id === formData.barberId);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Agendar Horário</h1>
          <p className="text-zinc-400 mt-3 text-lg font-light">Siga os passos abaixo para reservar seu horário.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative max-w-md mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10 rounded-full"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 -z-10 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= s ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 p-6 sm:p-10 rounded-sm border border-zinc-800 shadow-2xl relative min-h-[400px]">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            
            <div className="flex-grow relative">
              <AnimatePresence custom={direction} mode="wait">
                
                {/* Step 1: Service & Barber */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Scissors className="w-6 h-6 text-amber-500" />
                      O que vamos fazer hoje?
                    </h2>
                    
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold tracking-wide uppercase text-zinc-400">Serviço</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {services.map(service => (
                          <div 
                            key={service.id}
                            onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id }))}
                            className={`p-5 rounded-sm border cursor-pointer transition-all ${
                              formData.serviceId === service.id 
                                ? 'border-amber-500 bg-amber-500/10 shadow-[inset_0_0_0_1px_rgba(245,158,11,1)]' 
                                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                            }`}
                          >
                            <div className="font-bold text-white text-lg">{service.name}</div>
                            <div className="text-sm text-zinc-400 flex justify-between mt-2 font-mono">
                              <span>{service.durationMinutes} min</span>
                              <span className="text-amber-500 font-bold">R$ {service.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                      <label className="block text-sm font-semibold tracking-wide uppercase text-zinc-400">Profissional</label>
                      <div className="grid grid-cols-2 gap-4">
                        {barbers.map(barber => (
                          <div 
                            key={barber.id}
                            onClick={() => setFormData(prev => ({ ...prev, barberId: barber.id }))}
                            className={`p-4 rounded-sm border cursor-pointer transition-all flex flex-col items-center gap-3 text-center ${
                              formData.barberId === barber.id 
                                ? 'border-amber-500 bg-amber-500/10 shadow-[inset_0_0_0_1px_rgba(245,158,11,1)]' 
                                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                            }`}
                          >
                            <img src={barber.imageUrl} alt={barber.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800" referrerPolicy="no-referrer" />
                            <span className="font-bold text-white uppercase tracking-wide">{barber.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <CalendarIcon className="w-6 h-6 text-amber-500" />
                      Escolha a data e horário
                    </h2>
                    
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold tracking-wide uppercase text-zinc-400">Data</label>
                      <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
                        {availableDates.map((date, i) => {
                          const isSelected = format(formData.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                          const dayName = format(date, 'EEE', { locale: ptBR });
                          const dayNumber = format(date, 'dd');
                          const isClosed = settings.businessHours[date.getDay()].isClosed;
                          
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={isClosed}
                              onClick={() => setFormData(prev => ({ ...prev, date, time: '' }))}
                              className={`snap-start shrink-0 w-20 h-24 rounded-sm flex flex-col items-center justify-center border transition-all ${
                                isClosed ? 'opacity-20 cursor-not-allowed border-zinc-800 bg-zinc-950' :
                                isSelected 
                                  ? 'border-amber-500 bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900'
                              }`}
                            >
                              <span className={`text-xs uppercase font-bold tracking-wider mb-1 ${isSelected ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                {dayName}
                              </span>
                              <span className={`text-2xl font-bold ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                                {dayNumber}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                      <label className="block text-sm font-semibold tracking-wide uppercase text-zinc-400 flex items-center justify-between">
                        <span>Horários Disponíveis</span>
                        {availableSlots.length === 0 && <span className="text-red-400 text-xs normal-case">(Nenhum horário livre)</span>}
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {availableSlots.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, time }))}
                            className={`py-3 rounded-sm border text-base font-mono transition-all ${
                              formData.time === time 
                                ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Personal Info */}
                {step === 3 && (
                  <motion.div 
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-amber-500" />
                      Seus Dados
                    </h2>
                    
                    <div className="space-y-6">
                      <Input 
                        label="Nome Completo" 
                        placeholder="Ex: João da Silva" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="h-12 text-lg"
                      />
                      <Input 
                        label="Telefone (WhatsApp)" 
                        placeholder="(11) 99999-9999" 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="h-12 text-lg"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <motion.div 
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Resumo do Agendamento</h2>
                    
                    <div className="bg-zinc-950 rounded-sm border border-zinc-800 p-6 space-y-6 shadow-inner">
                      <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                        <div>
                          <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Serviço</p>
                          <p className="font-bold text-white text-lg">{selectedService?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Valor</p>
                          <p className="font-bold text-amber-500 text-lg">R$ {selectedService?.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                        <div>
                          <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Data e Hora</p>
                          <p className="font-bold text-white text-lg capitalize">
                            {format(formData.date, "dd 'de' MMMM", { locale: ptBR })} às {formData.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Profissional</p>
                          <p className="font-bold text-white text-lg">{selectedBarber?.name}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Cliente</p>
                        <p className="font-bold text-white text-lg">{formData.name}</p>
                        <p className="text-zinc-400 font-mono mt-1">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-5 flex gap-4">
                      <Info className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-zinc-300">
                        <p className="font-bold text-amber-500 mb-1 uppercase tracking-wide text-xs">Política de Cancelamento</p>
                        <p className="leading-relaxed">
                          {siteContent.cancellationPolicyText
                            .replace('{hours}', settings.cancellationFeeHoursLimit.toString())
                            .replace('{fee}', `R$ ${settings.cancellationFee.toFixed(2).replace('.', ',')}`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="w-full sm:w-auto uppercase tracking-wider font-bold">
                  <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
                </Button>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              
              {step < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 uppercase tracking-wider font-bold"
                  disabled={
                    (step === 1 && (!formData.serviceId || !formData.barberId)) ||
                    (step === 2 && (!formData.date || !formData.time)) ||
                    (step === 3 && (!formData.name || !formData.phone))
                  }
                >
                  Continuar <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : (
                <Button type="submit" className="w-full sm:w-auto bg-amber-500 text-zinc-950 hover:bg-amber-400 px-8 uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Confirmar Agendamento
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
