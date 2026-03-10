import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const WhatsAppButton = () => {
  const { siteContent } = useAppContext();
  
  // Clean the whatsapp number to only contain digits
  const cleanWhatsapp = siteContent.whatsapp.replace(/\D/g, '');

  return (
    <a
      href={`https://wa.me/${cleanWhatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center group"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-4 bg-zinc-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-800">
        Fale conosco
      </span>
    </a>
  );
};
