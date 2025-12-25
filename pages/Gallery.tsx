import React, { useEffect, useState } from 'react';
import { Photo } from '../types';
import { getPhotos, savePhoto } from '../services/storageService';
import { Upload, Plus } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newPhoto: Photo = {
            id: Date.now().toString(),
            url: reader.result,
            caption: 'Captured Moment'
          };
          savePhoto(newPhoto);
          setPhotos(prev => [newPhoto, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
       <header className="text-center space-y-4 mb-16 relative">
        <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
          Visual Diary
        </h1>
        <p className="text-stone font-handwriting text-2xl">
          Capturing the fleeting moments.
        </p>

        <div className="absolute right-0 top-0 hidden md:block">
           <label className="cursor-pointer group flex items-center gap-2 text-xs uppercase tracking-widest text-stone hover:text-gold transition-colors border border-stone/20 px-4 py-2 rounded-full hover:border-gold">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
           </label>
        </div>
        
        {/* Mobile Upload Button */}
        <div className="md:hidden mt-6 flex justify-center">
           <label className="cursor-pointer group flex items-center gap-2 text-xs uppercase tracking-widest text-stone hover:text-gold transition-colors border border-stone/20 px-4 py-2 rounded-full hover:border-gold">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
           </label>
        </div>
      </header>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid group relative overflow-hidden rounded-sm bg-stone/10">
            <img 
              src={photo.url} 
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-end p-6">
              <p className="text-cream font-serif italic text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out drop-shadow-md">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};