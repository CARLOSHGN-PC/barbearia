import React, { useState, useMemo } from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle, XCircle, AlertTriangle, Edit2, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Appointment } from '../../types';
import { ConfirmModal } from '../ui/ConfirmModal';

export const AppointmentsTab = () => {
  const { appointments, services, barbers, updateAppointmentStatus, updateAppointment, deleteAppointment } = useAppContext();
  
  const [filterDate, setFilterDate] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchDate = filterDate ? app.date === filterDate : true;
      const matchBarber = filterBarber ? app.barberId === filterBarber : true;
      const matchStatus = filterStatus ? app.status === filterStatus : true;
      const matchPhone = searchPhone ? app.clientPhone.includes(searchPhone) : true;
      return matchDate && matchBarber && matchStatus && matchPhone;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
      return dateB - dateA; // Sort descending (newest first)
    });
  }, [appointments, filterDate, filterBarber, filterStatus, searchPhone]);

  const handleStatusChange = (id: string, status: any) => {
    updateAppointmentStatus(id, status);
  };

  const handleEdit = (app: Appointment) => {
    setEditingId(app.id);
    setFormData(app);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSaveEdit = () => {
    if (editingId && formData) {
      // Basic conflict validation could go here, but for simplicity we just save
      updateAppointment(editingId, formData);
      handleCancelEdit();
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Gestão de Agendamentos</h2>
        <p className="text-zinc-400 mt-1">Visualize e edite todos os agendamentos do sistema.</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Data</label>
            <Input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-white h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Profissional</label>
            <Select 
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value)}
              options={[
                { value: '', label: 'Todos' },
                ...barbers.map(b => ({ value: b.id, label: b.name }))
              ]}
              className="bg-zinc-950 border-zinc-800 text-white h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Status</label>
            <Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: '', label: 'Todos' },
                { value: 'agendado', label: 'Agendado' },
                { value: 'confirmado', label: 'Confirmado' },
                { value: 'concluido', label: 'Concluído' },
                { value: 'cancelado', label: 'Cancelado' },
                { value: 'nao_compareceu', label: 'Faltou' },
              ]}
              className="bg-zinc-950 border-zinc-800 text-white h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-500 mb-2">Telefone</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                type="text" 
                placeholder="Buscar telefone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-white h-10 pl-9"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-end">
          <Button variant="outline" onClick={() => { setFilterDate(''); setFilterBarber(''); setFilterStatus(''); setSearchPhone(''); }} className="w-full sm:w-auto border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs uppercase tracking-wider font-bold">
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-sm border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Data/Hora</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Serviço/Barbeiro</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredAppointments.map((app) => {
                const service = services.find(s => s.id === app.serviceId);
                const barber = barbers.find(b => b.id === app.barberId);
                const isEditing = editingId === app.id;

                if (isEditing) {
                  return (
                    <tr key={app.id} className="bg-zinc-800/50">
                      <td colSpan={5} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Data</label>
                            <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-zinc-950 border-zinc-700 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Hora Início</label>
                            <Input type="time" value={formData.startTime || ''} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="bg-zinc-950 border-zinc-700 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Barbeiro</label>
                            <Select value={formData.barberId || ''} onChange={(e) => setFormData({...formData, barberId: e.target.value})} options={barbers.map(b => ({value: b.id, label: b.name}))} className="bg-zinc-950 border-zinc-700 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Serviço</label>
                            <Select value={formData.serviceId || ''} onChange={(e) => setFormData({...formData, serviceId: e.target.value})} options={services.map(s => ({value: s.id, label: s.name}))} className="bg-zinc-950 border-zinc-700 text-white" />
                          </div>
                          <div className="md:col-span-4 flex flex-col sm:flex-row justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto border-zinc-600 text-zinc-300 hover:bg-zinc-700">Cancelar</Button>
                            <Button onClick={handleSaveEdit} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">Salvar Alterações</Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{format(parse(app.date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}</div>
                      <div className="text-amber-500 font-mono text-sm">{app.startTime} - {app.endTime}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{app.clientName}</div>
                      <div className="text-zinc-400 font-mono text-sm">{app.clientPhone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-zinc-300 text-sm">{service?.name}</div>
                      <div className="text-zinc-500 text-xs">{barber?.name}</div>
                    </td>
                    <td className="p-4">
                      {app.status === 'agendado' && <span className="px-2 py-1 rounded-sm text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Agendado</span>}
                      {app.status === 'confirmado' && <span className="px-2 py-1 rounded-sm text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">Confirmado</span>}
                      {app.status === 'concluido' && <span className="px-2 py-1 rounded-sm text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wider">Concluído</span>}
                      {app.status === 'cancelado' && <span className="px-2 py-1 rounded-sm text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">Cancelado</span>}
                      {app.status === 'nao_compareceu' && <span className="px-2 py-1 rounded-sm text-[10px] font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase tracking-wider">Faltou</span>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        {app.status !== 'concluido' && app.status !== 'cancelado' && (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'concluido')} title="Concluir" className="p-1.5 text-zinc-400 hover:text-green-500 hover:bg-green-500/10 rounded transition-colors"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleStatusChange(app.id, 'cancelado')} title="Cancelar" className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleEdit(app)} title="Editar" className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(app.id)} title="Excluir" className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    Nenhum agendamento encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteAppointment(deleteConfirmId);
        }}
        title="Excluir Agendamento"
        message="Tem certeza que deseja excluir permanentemente este agendamento? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
