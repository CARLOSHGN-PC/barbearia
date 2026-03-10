import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { siteContent } = useAppContext();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors overflow-hidden" onClick={closeMenu}>
          <Scissors className="w-7 h-7 shrink-0" />
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest uppercase truncate">{siteContent.name}</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#servicos" className="text-sm font-semibold tracking-wide uppercase text-zinc-400 hover:text-amber-500 transition-colors">Serviços</a>
          <a href="/#barbeiros" className="text-sm font-semibold tracking-wide uppercase text-zinc-400 hover:text-amber-500 transition-colors">Barbeiros</a>
          <Link to="/meus-agendamentos" className={`text-sm font-semibold tracking-wide uppercase transition-colors ${location.pathname === '/meus-agendamentos' ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'}`}>Meus Agendamentos</Link>
          <Link to="/admin" className={`text-sm font-semibold tracking-wide uppercase transition-colors ${location.pathname === '/admin' ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-300'}`}>Admin</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/agendar" className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-sm font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            Agendar
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-300 hover:text-amber-500 transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <a href="/#servicos" className="text-lg font-medium text-zinc-300 hover:text-amber-500 py-2 border-b border-zinc-800/50" onClick={closeMenu}>Serviços</a>
              <a href="/#barbeiros" className="text-lg font-medium text-zinc-300 hover:text-amber-500 py-2 border-b border-zinc-800/50" onClick={closeMenu}>Barbeiros</a>
              <Link to="/meus-agendamentos" className="text-lg font-medium text-zinc-300 hover:text-amber-500 py-2 border-b border-zinc-800/50" onClick={closeMenu}>Meus Agendamentos</Link>
              <Link to="/admin" className="text-lg font-medium text-zinc-500 hover:text-zinc-300 py-2 border-b border-zinc-800/50" onClick={closeMenu}>Painel Admin</Link>
              <Link to="/agendar" className="mt-4 bg-amber-500 text-zinc-950 px-4 py-3 rounded-sm font-bold text-center uppercase tracking-wider" onClick={closeMenu}>
                Agendar Horário
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
