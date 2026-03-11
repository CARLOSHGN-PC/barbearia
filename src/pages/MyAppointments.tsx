import React, { useState } from 'react';
import { format, parse, differenceInHours, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Calendar, Clock, Search, Scissors, User, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Appointment } from '../types';

export const MyAppointments = () => {
  const { appointments, services, barbers, settings, updateAppointmentStatus } = useAppContext();
  const [phoneSearch, setPhoneSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;
    
    const found = appointments.filter(app => app.clientPhone.includes(phoneSearch.trim()));
    // Sort by date and time descending
    found.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });
    
    setMyAppointments(found);
    setHasSearched(true);
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedAppointment) return;

    const appointmentDateTime = parse(`${selectedAppointment.date} ${selectedAppointment.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const hoursDifference = differenceInHours(appointmentDateTime, new Date());
    
    const feeApplied = hoursDifference < settings.cancellationFeeHoursLimit;
    
    updateAppointmentStatus(selectedAppointment.id, 'cancelado', feeApplied);
    
    // Update local state to reflect change immediately
    setMyAppointments(prev => 
      prev.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: 'cancelado', cancellationFeeApplied: feeApplied } 
          : app
      )
    );
    
    setCancelModalOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
      case 'confirmado':
        return <span className="px-3 py-1 rounded-sm text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Agendado</span>;
      case 'concluido':
        return <span className="px-3 py-1 rounded-sm text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wider">Concluído</span>;
      case 'cancelado':
        return <span className="px-3 py-1 rounded-sm text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">Cancelado</span>;
      case 'nao_compareceu':
        return <span className="px-3 py-1 rounded-sm text-xs font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase tracking-wider">Faltou</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Meus Agendamentos</h1>
          <p className="text-zinc-400 mt-3 text-lg font-light">Consulte ou cancele seus horários marcados.</p>
        </div>

        {/* Search Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-2xl mb-10"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input 
                label="Digite seu telefone" 
                placeholder="(11) 99999-9999" 
                type="tel"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-amber-500 text-zinc-950 hover:bg-amber-400 uppercase tracking-wider font-bold w-full sm:w-auto shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Search className="w-5 h-5 mr-2" /> Buscar
            </Button>
          </form>
        </motion.div>

        {/* Results Section */}
        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900 rounded-sm border border-zinc-800 shadow-inner">
                <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-zinc-500 text-lg font-light">Verifique se o número digitado está correto.</p>
              </div>
            ) : (
              <AnimatePresence>
                {myAppointments.map((app, index) => {
                  const service = services.find(s => s.id === app.serviceId);
                  const barber = barbers.find(b => b.id === app.barberId);
                  let appointmentDateTime = new Date();
                  try {
                    appointmentDateTime = parse(`${app.date} ${app.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
                  } catch (e) {
                    console.error("Invalid date or time format in appointment:", app);
                  }

                  const isPastAppointment = isPast(appointmentDateTime);
                  const canCancel = (app.status === 'agendado' || app.status === 'confirmado') && !isPastAppointment;

                  let formattedDate = app.date;
                  try {
                    formattedDate = format(parse(app.date, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy");
                  } catch (e) {
                    // keep original format if parsing fails
                  }

                  return (
                    <motion.div 
                      key={app.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-zinc-900 rounded-sm border border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center transition-all hover:border-zinc-700 hover:shadow-xl relative overflow-hidden group"
                    >
                      {/* Decorative accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-amber-500 transition-colors duration-300"></div>

                      <div className="space-y-4 pl-4">
                        <div className="flex items-center gap-4">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">ID: {app.id}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Scissors className="w-6 h-6 text-amber-500" />
                            {service?.name}
                          </h3>
                          <p className="text-zinc-400 flex items-center gap-2 mt-2 text-lg font-light">
                            <User className="w-5 h-5 text-zinc-500" /> {barber?.name}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950 px-4 py-2 rounded-sm border border-zinc-800/50">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            <span className="font-medium tracking-wide">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950 px-4 py-2 rounded-sm border border-zinc-800/50">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="font-medium tracking-wide">{app.startTime}</span>
                          </div>
                        </div>
                        
                        {app.status === 'cancelado' && app.cancellationFeeApplied && (
                          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500" /> 
                            <span className="text-sm text-red-400 font-medium tracking-wide">Taxa aplicada: R$ {settings.cancellationFee.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                      </div>

                      {canCancel && (
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider font-bold h-12 px-6"
                          onClick={() => handleCancelClick(app)}
                        >
                          <X className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* Cancel Modal */}
        <AnimatePresence>
          {cancelModalOpen && selectedAppointment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-zinc-900 rounded-sm border border-zinc-800 p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

                <div className="flex items-center gap-4 mb-6 text-amber-500">
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Confirmar Cancelamento</h3>
                </div>
                
                <p className="text-zinc-300 mb-8 text-lg font-light leading-relaxed">
                  Tem certeza que deseja cancelar seu agendamento para <strong className="text-white font-medium">
                    {(() => {
                      try {
                        return format(parse(selectedAppointment.date, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy");
                      } catch (e) {
                        return selectedAppointment.date;
                      }
                    })()} às {selectedAppointment.startTime}</strong>?
                </p>

                {(() => {
                  let hoursDifference = 0;
                  try {
                    const appointmentDateTime = parse(`${selectedAppointment.date} ${selectedAppointment.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
                    hoursDifference = differenceInHours(appointmentDateTime, new Date());
                  } catch (e) {
                    console.error("Invalid appointment date format", selectedAppointment);
                  }
                  
                  if (hoursDifference < settings.cancellationFeeHoursLimit) {
                    return (
                      <div className="bg-red-500/5 border border-red-500/20 rounded-sm p-5 mb-8">
                        <p className="text-sm text-red-400 flex items-start gap-3 leading-relaxed">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-red-500 block mb-1 uppercase tracking-wider text-xs">Atenção</strong>
                            Como o cancelamento está sendo feito com menos de {settings.cancellationFeeHoursLimit} horas de antecedência, será aplicada a taxa de cancelamento de <strong className="text-red-300">R$ {settings.cancellationFee.toFixed(2).replace('.', ',')}</strong>.
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-sm p-5 mb-8">
                      <p className="text-sm text-green-400 flex items-start gap-3 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-green-500 block mb-1 uppercase tracking-wider text-xs">Tudo Certo</strong>
                          Cancelamento gratuito. Obrigado por avisar com antecedência.
                        </span>
                      </p>
                    </div>
                  );
                })()}

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <Button variant="ghost" onClick={() => setCancelModalOpen(false)} className="uppercase tracking-wider font-bold h-12">
                    Voltar
                  </Button>
                  <Button variant="danger" onClick={confirmCancel} className="uppercase tracking-wider font-bold h-12">
                    Sim, Cancelar
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
