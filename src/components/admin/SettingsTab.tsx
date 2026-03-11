import React, { useState } from 'react';
import { Save, AlertTriangle, RotateCcw, CheckCircle, Lock, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmModal } from '../ui/ConfirmModal';

export const SettingsTab = () => {
  const { settings, updateSettings, resetData } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    
    if (password) {
      localStorage.setItem('barbershop_admin_password', password);
      setPassword('');
    }
    
    setMessage('Configurações salvas com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    resetData();
    setMessage('Dados redefinidos com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleBusinessHourChange = (day: number, field: 'open' | 'close' | 'isClosed', value: any) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Configurações do Sistema</h2>
        <p className="text-zinc-400 mt-1">Gerencie horários, taxas e segurança.</p>
      </div>

      {message && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Segurança */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Segurança
          </h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Nova Senha do Painel (deixe em branco para não alterar)</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha"
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
        </div>

        {/* Política de Cancelamento */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Política de Cancelamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Taxa de Cancelamento (R$)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.cancellationFee}
                onChange={(e) => setFormData({ ...formData, cancellationFee: parseFloat(e.target.value) })}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tempo Limite sem Taxa (Horas)</label>
              <Input
                type="number"
                min="0"
                value={formData.cancellationFeeHoursLimit}
                onChange={(e) => setFormData({ ...formData, cancellationFeeHoursLimit: parseInt(e.target.value) })}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Horário de Funcionamento */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Horário de Funcionamento
          </h3>
          <div className="space-y-4">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-zinc-950 rounded-sm border border-zinc-800">
                <div className="w-full sm:w-32">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!formData.businessHours[index].isClosed}
                      onChange={(e) => handleBusinessHourChange(index, 'isClosed', !e.target.checked)}
                      className="rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950"
                    />
                    <span className="text-sm font-medium text-white">{day}</span>
                  </label>
                </div>
                
                <div className="w-full sm:flex-1 flex items-center gap-2">
                  <Input
                    type="time"
                    value={formData.businessHours[index].open}
                    onChange={(e) => handleBusinessHourChange(index, 'open', e.target.value)}
                    disabled={formData.businessHours[index].isClosed}
                    className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-50"
                  />
                  <span className="text-zinc-500">até</span>
                  <Input
                    type="time"
                    value={formData.businessHours[index].close}
                    onChange={(e) => handleBusinessHourChange(index, 'close', e.target.value)}
                    disabled={formData.businessHours[index].isClosed}
                    className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <Button type="button" variant="outline" className="w-full sm:w-auto border-red-500/20 text-red-500 hover:bg-red-500/10" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir Dados Iniciais
          </Button>
          <Button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={confirmReset}
        title="Redefinir Dados"
        message="Tem certeza que deseja redefinir TODOS os dados para o padrão inicial? Isso apagará serviços, barbeiros e configurações atuais."
      />
    </div>
  );
};
