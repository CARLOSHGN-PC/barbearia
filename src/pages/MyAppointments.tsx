import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { Calendar, Clock, Search, Scissors, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Appointment } from '../types';

const PHONE_REGEX = /^\d{10,11}$/;

export const MyAppointments = () => {
  const { services, barbers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState('');
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchTerm.trim();
    if (!value) return;

    const localAppointments = JSON.parse(localStorage.getItem('barbershop_my_appointments') || '[]') as Appointment[];
    const normalizedPhone = value.replace(/\D/g, '');

    let found: Appointment[] = [];

    if (value.includes('_')) {
      found = localAppointments.filter((app) => app.id === value);
      setMessage('Busca por código do agendamento.');
    } else if (PHONE_REGEX.test(normalizedPhone)) {
      found = localAppointments.filter((app) => app.clientPhone === normalizedPhone);
      setMessage('Busca por telefone completo (DDD + número).');
    } else {
      setMyAppointments([]);
      setHasSearched(true);
      setMessage('Digite o telefone completo (10 ou 11 dígitos) ou o código completo do agendamento.');
      return;
    }

    found.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    setMyAppointments(found);
    setHasSearched(true);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Meus Agendamentos</h1>
          <p className="text-zinc-400 mt-3 text-lg font-light">Consulte usando telefone completo ou código do agendamento.</p>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-2xl mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Telefone completo ou código"
                placeholder="11999998888 ou b1_2026-05-01_09-00"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-amber-500 text-zinc-950 hover:bg-amber-400 uppercase tracking-wider font-bold w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" /> Buscar
            </Button>
          </form>
          {message && <p className="text-sm text-zinc-400 mt-3">{message}</p>}
        </motion.div>

        {hasSearched && (
          <div className="space-y-6">
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900 rounded-sm border border-zinc-800 shadow-inner">
                <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum agendamento encontrado</h3>
              </div>
            ) : (
              myAppointments.map((app) => {
                const service = services.find((s) => s.id === app.serviceId);
                const barber = barbers.find((b) => b.id === app.barberId);
                const formattedDate = format(parse(app.date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');

                return (
                  <div key={app.id} className="bg-zinc-900 rounded-sm border border-zinc-800 p-6 sm:p-8 flex flex-col gap-4">
                    <div className="text-xs text-zinc-500 font-mono">Código: {app.id}</div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Scissors className="w-6 h-6 text-amber-500" />
                      {service?.name || 'Serviço'}
                    </h3>
                    <p className="text-zinc-400 flex items-center gap-2"><User className="w-4 h-4" />{barber?.name || 'Barbeiro'}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950 px-4 py-2 rounded-sm border border-zinc-800/50">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950 px-4 py-2 rounded-sm border border-zinc-800/50">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{app.startTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
