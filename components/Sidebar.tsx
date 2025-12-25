import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Image, Edit3, Feather } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-6 py-3 transition-all duration-300 group ${
      isActive 
        ? 'text-charcoal border-r-2 border-charcoal bg-paper' 
        : 'text-stone hover:text-charcoal hover:bg-white/50'
    }`;

  return (
    <aside className="w-20 md:w-64 flex-shrink-0 h-screen bg-cream border-r border-stone/20 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 flex items-center justify-center md:justify-start gap-3">
        <Feather className="w-8 h-8 text-charcoal" />
        <span className="text-2xl font-serif font-bold tracking-tight hidden md:block">
          Serene
        </span>
      </div>

      <nav className="flex-1 mt-8 space-y-2">
        <NavLink to="/" className={linkClass}>
          <Home className="w-5 h-5" />
          <span className="font-sans font-light tracking-wide hidden md:block">Home</span>
        </NavLink>
        <NavLink to="/gallery" className={linkClass}>
          <Image className="w-5 h-5" />
          <span className="font-sans font-light tracking-wide hidden md:block">Gallery</span>
        </NavLink>
        <NavLink to="/admin" className={linkClass}>
          <Edit3 className="w-5 h-5" />
          <span className="font-sans font-light tracking-wide hidden md:block">Admin</span>
        </NavLink>
      </nav>

      <div className="p-8 hidden md:block">
        <p className="text-xs text-stone font-serif italic">
          "Simplicity is the ultimate sophistication."
        </p>
      </div>
    </aside>
  );
};