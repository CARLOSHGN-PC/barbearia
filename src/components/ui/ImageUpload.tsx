import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, folder, label, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG, etc).');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao enviar a imagem. Tente novamente.');
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
        } catch (error) {
          console.error('Erro ao pegar URL:', error);
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}

      {value ? (
        <div className="relative rounded-md overflow-hidden border border-zinc-800 bg-zinc-900 w-full max-w-sm">
          <img src={value} alt="Preview" className="w-full h-auto object-cover max-h-48" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm"
            title="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="border-dashed border-2 border-zinc-700 hover:border-amber-500 hover:text-amber-500 text-zinc-400 w-full max-w-sm py-8 flex flex-col items-center gap-3"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <span>Enviando... {Math.round(progress)}%</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8" />
                <span>Clique para selecionar uma imagem</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
