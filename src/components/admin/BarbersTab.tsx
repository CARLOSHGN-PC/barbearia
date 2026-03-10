import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Barber } from '../../types';

export const BarbersTab = () => {
  const { barbers, addBarber, updateBarber, deleteBarber } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Barber>>({});

  const handleEdit = (barber: Barber) => {
    setEditingId(barber.id);
    setFormData(barber);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', imageUrl: '', specialty: '', availability: true });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.name || !formData.imageUrl) return;

    if (isAdding) {
      addBarber({
        id: `b${Date.now()}`,
        name: formData.name,
        imageUrl: formData.imageUrl,
        specialty: formData.specialty || '',
        availability: formData.availability ?? true
      });
    } else if (editingId) {
      updateBarber(editingId, {
        name: formData.name,
        imageUrl: formData.imageUrl,
        specialty: formData.specialty || '',
        availability: formData.availability ?? true
      });
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este barbeiro?')) {
      deleteBarber(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Barbeiros</h2>
          <p className="text-zinc-400 mt-1">Gerencie a equipe da barbearia.</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Barbeiro
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            {isAdding ? 'Adicionar Novo Barbeiro' : 'Editar Barbeiro'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Especialidade</label>
              <Input
                value={formData.specialty || ''}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="Ex: Especialista em Degradê"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">URL da Foto</label>
              <Input
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={formData.availability ?? true}
                onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                className="rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950"
              />
              <label className="text-sm font-medium text-zinc-300">Disponível para agendamentos</label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <XCircle className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">
              <CheckCircle className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-zinc-900 rounded-sm border border-zinc-800 overflow-hidden shadow-lg group relative">
            <div className="h-48 overflow-hidden relative">
              <img src={barber.imageUrl} alt={barber.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" />
                    {barber.name}
                  </h3>
                  {barber.specialty && <p className="text-sm text-zinc-300 mt-1">{barber.specialty}</p>}
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-zinc-950">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${barber.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  {barber.availability ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(barber)} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(barber.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {barbers.length === 0 && (
          <div className="col-span-full p-12 text-center bg-zinc-900 rounded-sm border border-zinc-800">
            <User className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Nenhum barbeiro cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
