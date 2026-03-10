import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, Scissors, Users, Settings, FileText, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLogin } from '../components/admin/AdminLogin';
import { DashboardTab } from '../components/admin/DashboardTab';
import { AppointmentsTab } from '../components/admin/AppointmentsTab';
import { ServicesTab } from '../components/admin/ServicesTab';
import { BarbersTab } from '../components/admin/BarbersTab';
import { SiteContentTab } from '../components/admin/SiteContentTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { Button } from '../components/ui/Button';

type Tab = 'dashboard' | 'appointments' | 'services' | 'barbers' | 'content' | 'settings';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  useEffect(() => {
    const auth = localStorage.getItem('barbershop_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    const adminPassword = localStorage.getItem('barbershop_admin_password') || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('barbershop_admin_auth', 'true');
    } else {
      setAuthError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('barbershop_admin_auth');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={authError} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Agendamentos', icon: CalendarDays },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'barbers', label: 'Barbeiros', icon: Users },
    { id: 'content', label: 'Conteúdo do Site', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Painel Admin</h2>
          <p className="text-zinc-500 text-sm mt-1">Gerenciamento da Barbearia</p>
        </div>

        <nav className="flex-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-zinc-800">
          <Button 
            variant="outline" 
            className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'appointments' && <AppointmentsTab />}
            {activeTab === 'services' && <ServicesTab />}
            {activeTab === 'barbers' && <BarbersTab />}
            {activeTab === 'content' && <SiteContentTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
