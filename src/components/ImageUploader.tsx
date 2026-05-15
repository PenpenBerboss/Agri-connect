import React, { useState } from 'react';
import { Plus, X, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../shared/utils';

interface ImageUploaderProps {
  bucket: 'products' | 'profiles';
  onUpload: (url: string) => void;
  className?: string;
  defaultImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ bucket, onUpload, className, defaultImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      console.log('Generated Public URL:', data.publicUrl);
      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Erreur: ${error.message || 'Problème lors du téléchargement'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {preview ? (
        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => { setPreview(null); onUpload(''); }}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-primary-light transition-all group-hover:bg-primary-light/5">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary-dark animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-primary-dark mb-2" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ajouter image</span>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
};
