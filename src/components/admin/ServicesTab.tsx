import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Service } from '../../types';
import { ConfirmModal } from '../ui/ConfirmModal';

export const ServicesTab = () => {
  const { services, addService, updateService, deleteService } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', price: 0, durationMinutes: 30, description: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.durationMinutes) return;

    try {
      if (isAdding) {
        await addService({
          id: `s${Date.now()}`,
          name: formData.name,
          price: Number(formData.price),
          durationMinutes: Number(formData.durationMinutes),
          description: formData.description || ''
        });
      } else if (editingId) {
        await updateService(editingId, {
          name: formData.name,
          price: Number(formData.price),
          durationMinutes: Number(formData.durationMinutes),
          description: formData.description || ''
        });
      }
      handleCancel();
    } catch (e) {
      alert("Erro ao salvar o serviço no banco de dados. Verifique se o Firestore está criado e as permissões estão corretas.");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Serviços</h2>
          <p className="text-zinc-400 mt-1">Gerencie os serviços oferecidos na barbearia.</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            {isAdding ? 'Adicionar Novo Serviço' : 'Editar Serviço'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome do Serviço</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="Ex: Corte Degradê"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Preço (R$)</label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Duração (minutos)</label>
              <Input
                type="number"
                step="5"
                value={formData.durationMinutes || ''}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                rows={2}
                placeholder="Breve descrição do serviço"
              />
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

      <div className="bg-zinc-900 rounded-sm border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Serviço</th>
                <th className="p-4 font-semibold">Duração</th>
                <th className="p-4 font-semibold">Preço</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{service.name}</p>
                    {service.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{service.description}</p>}
                  </td>
                  <td className="p-4 text-zinc-300">{service.durationMinutes} min</td>
                  <td className="p-4 text-amber-500 font-bold font-mono whitespace-nowrap">R$ {service.price.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(service)} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    Nenhum serviço cadastrado.
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
          if (deleteConfirmId) deleteService(deleteConfirmId);
        }}
        title="Remover Serviço"
        message="Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
