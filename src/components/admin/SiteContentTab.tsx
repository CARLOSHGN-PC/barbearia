import React, { useState } from 'react';
import { Save, CheckCircle, Image, Type, AlignLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SiteContentTab = () => {
  const { siteContent, updateSiteContent } = useAppContext();
  const [formData, setFormData] = useState(siteContent);
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    setMessage('Conteúdo do site salvo com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Conteúdo do Site</h2>
        <p className="text-zinc-400 mt-1">Edite os textos e imagens que aparecem para os clientes.</p>
      </div>

      {message && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-500" />
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Nome da Barbearia</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Slogan</label>
              <Input
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Descrição Curta</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        {/* Contato e Endereço */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-amber-500" />
            Contato e Endereço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Telefone (Ex: (11) 99999-9999)</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">WhatsApp (Apenas números com DDI)</label>
              <Input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Endereço Completo</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Seção Hero (Início) */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-500" />
            Seção Principal (Home)
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Título Principal</label>
              <Input
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Subtítulo</label>
              <Input
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">URL da Imagem de Fundo</label>
              <Input
                name="heroImage"
                value={formData.heroImage}
                onChange={handleChange}
                className="bg-zinc-950 border-zinc-800 text-white"
                required
              />
              {formData.heroImage && (
                <div className="mt-4 h-32 w-full rounded-md overflow-hidden relative">
                  <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Textos Institucionais */}
        <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-amber-500" />
            Textos Institucionais
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Texto "Sobre Nós"</label>
              <textarea
                name="aboutText"
                value={formData.aboutText}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Texto da Política de Cancelamento (Use {'{hours}'} e {'{fee}'} para variáveis)
              </label>
              <textarea
                name="cancellationPolicyText"
                value={formData.cancellationPolicyText}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end pt-4">
          <Button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Conteúdo
          </Button>
        </div>
      </form>
    </div>
  );
};
