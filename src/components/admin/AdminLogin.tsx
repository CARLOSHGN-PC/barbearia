import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

export const AdminLogin = ({ onLogin, error }: AdminLoginProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Acesso Restrito</h1>
          <p className="text-zinc-400 mt-2">Área exclusiva para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Senha de Acesso</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="bg-zinc-950 border-zinc-800 text-white"
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold">
            <LogIn className="w-5 h-5 mr-2" />
            Entrar no Painel
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
