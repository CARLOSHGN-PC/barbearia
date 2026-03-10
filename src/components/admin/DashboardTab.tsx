import React, { useState, useMemo } from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle, User, Scissors, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const DashboardTab = () => {
  const { appointments, services, barbers, updateAppointmentStatus } = useAppContext();
  
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterBarber, setFilterBarber] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchDate = app.date === filterDate;
      const matchBarber = filterBarber ? app.barberId === filterBarber : true;
      return matchDate && matchBarber;
    }).sort((a, b) => {
      const timeA = parse(a.startTime, 'HH:mm', new Date()).getTime();
      const timeB = parse(b.startTime, 'HH:mm', new Date()).getTime();
      return timeA - timeB;
    });
  }, [appointments, filterDate, filterBarber]);

  const stats = useMemo(() => {
    const total = filteredAppointments.length;
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmado' || a.status === 'agendado').length;
    const completed = filteredAppointments.filter(a => a.status === 'concluido').length;
    const cancelled = filteredAppointments.filter(a => a.status === 'cancelado').length;
    const noShow = filteredAppointments.filter(a => a.status === 'nao_compareceu').length;

    return { total, confirmed, completed, cancelled, noShow };
  }, [filteredAppointments]);

  const handleStatusChange = (id: string, status: any) => {
    updateAppointmentStatus(id, status);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 w-full bg-zinc-900 p-4 rounded-sm border border-zinc-800 shadow-xl">
        <div className="w-full sm:w-48">
          <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Data</label>
          <Input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-zinc-950 border-zinc-800 text-white h-10"
          />
        </div>
        <div className="w-full sm:w-56">
          <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Profissional</label>
          <Select 
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            options={[
              { value: '', label: 'Todos os Barbeiros' },
              ...barbers.map(b => ({ value: b.id, label: b.name }))
            ]}
            className="bg-zinc-950 border-zinc-800 text-white h-10"
          />
        </div>
      </div>

      {/* Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-700"></div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-2">Total</p>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-2">Agendados</p>
          <p className="text-4xl font-bold text-amber-500">{stats.confirmed}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-2">Concluídos</p>
          <p className="text-4xl font-bold text-green-500">{stats.completed}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-2">Cancelados</p>
          <p className="text-4xl font-bold text-red-500">{stats.cancelled}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-500"></div>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-2">Faltas</p>
          <p className="text-4xl font-bold text-zinc-500">{stats.noShow}</p>
        </motion.div>
      </motion.div>

      {/* Appointments List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-zinc-900 rounded-sm border border-zinc-800 overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
            <Calendar className="w-6 h-6 text-amber-500" />
            Agenda do Dia: <span className="text-amber-500">{format(parse(filterDate, 'yyyy-MM-dd', new Date()), "dd 'de' MMMM", { locale: ptBR })}</span>
          </h2>
        </div>
        
        <div className="divide-y divide-zinc-800/50">
          {filteredAppointments.length === 0 ? (
            <div className="p-16 text-center">
              <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Nenhum agendamento para esta data</h3>
              <p className="text-zinc-500 text-lg font-light">Aproveite o tempo livre ou verifique outra data.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredAppointments.map((app, index) => {
                const service = services.find(s => s.id === app.serviceId);
                const barber = barbers.find(b => b.id === app.barberId);
                
                return (
                  <motion.div 
                    key={app.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center hover:bg-zinc-800/30 transition-colors group relative"
                  >
                    {/* Hover Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start gap-6 pl-2">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 text-center min-w-[90px] shadow-inner">
                        <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-1">Início</p>
                        <p className="text-2xl font-bold text-amber-500 font-mono">{app.startTime}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-zinc-500" />
                          {app.clientName}
                        </h3>
                        <p className="text-zinc-400 font-mono">{app.clientPhone}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="text-sm text-zinc-300 flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-sm border border-zinc-800 shadow-sm">
                            <Scissors className="w-4 h-4 text-amber-500" /> <span className="font-medium">{service?.name}</span>
                          </span>
                          <span className="text-sm text-zinc-300 flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-sm border border-zinc-800 shadow-sm">
                            <User className="w-4 h-4 text-amber-500" /> <span className="font-medium">{barber?.name}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto pl-2 lg:pl-0">
                      {/* Status Indicator */}
                      <div className="sm:mr-2">
                        {app.status === 'agendado' && <span className="px-4 py-1.5 rounded-sm text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Agendado</span>}
                        {app.status === 'confirmado' && <span className="px-4 py-1.5 rounded-sm text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">Confirmado</span>}
                        {app.status === 'concluido' && <span className="px-4 py-1.5 rounded-sm text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wider">Concluído</span>}
                        {app.status === 'cancelado' && <span className="px-4 py-1.5 rounded-sm text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">Cancelado</span>}
                        {app.status === 'nao_compareceu' && <span className="px-4 py-1.5 rounded-sm text-xs font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase tracking-wider">Faltou</span>}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {app.status !== 'concluido' && app.status !== 'cancelado' && app.status !== 'nao_compareceu' && (
                          <>
                            <Button size="sm" variant="outline" className="border-green-500/20 text-green-500 hover:bg-green-500/10 uppercase tracking-wider font-bold text-xs" onClick={() => handleStatusChange(app.id, 'concluido')}>
                              <CheckCircle className="w-4 h-4 mr-1.5" /> Concluir
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 uppercase tracking-wider font-bold text-xs" onClick={() => handleStatusChange(app.id, 'cancelado')}>
                              <XCircle className="w-4 h-4 mr-1.5" /> Cancelar
                            </Button>
                            <Button size="sm" variant="outline" className="border-zinc-500/20 text-zinc-500 hover:bg-zinc-500/10 uppercase tracking-wider font-bold text-xs" onClick={() => handleStatusChange(app.id, 'nao_compareceu')}>
                              <AlertTriangle className="w-4 h-4 mr-1.5" /> Faltou
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};
