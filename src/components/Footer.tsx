import React from 'react';
import { Instagram, MapPin, Phone, Scissors } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Footer = () => {
  const { siteContent, settings } = useAppContext();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-amber-500 mb-4">
            <Scissors className="w-6 h-6" />
            <span className="font-serif text-xl font-bold tracking-wide uppercase">{siteContent.name}</span>
          </div>
          <p className="text-sm">{siteContent.description}</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contato</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {siteContent.address}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {siteContent.phone}</li>
            <li className="flex items-center gap-2"><Instagram className="w-4 h-4" /> @{siteContent.name.toLowerCase().replace(/\s/g, '')}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Horários</h3>
          <ul className="space-y-2 text-sm">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
              const hours = settings.businessHours[index];
              return (
                <li key={day} className="flex justify-between">
                  <span>{day}:</span>
                  <span>{hours.isClosed ? 'Fechado' : `${hours.open} - ${hours.close}`}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
        &copy; {new Date().getFullYear()} {siteContent.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
};
