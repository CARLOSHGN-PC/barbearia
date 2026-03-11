import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';
import { Button } from './Button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK'
}: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-sm w-full shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          <p className="text-zinc-400 text-sm mb-6">
            {message}
          </p>

          <div className="flex">
            <Button
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium"
            >
              {buttonText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
