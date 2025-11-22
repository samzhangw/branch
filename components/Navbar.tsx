import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarDays, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenSchedule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSchedule }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const links = [
    { name: '會考倒數', url: 'https://tyctw.github.io/115clock/' },
    { name: '統測倒數', url: 'https://tcte.onrender.com/' },
    { name: '學測倒數', url: 'https://ceecc.vercel.app/' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-6'}`}>
      <nav 
        className={`
          mx-4 w-full max-w-5xl rounded-2xl transition-all duration-300
          ${scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-indigo-100/50 py-3 px-6' 
            : 'bg-white/40 backdrop-blur-md border border-white/50 shadow-sm py-4 px-8'}
        `}
      >
        <div className="flex justify-between items-center">
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
               <span className="font-bold text-base tracking-tighter">115</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">分科測驗</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Countdown</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 group"
              >
                {link.name}
                <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button
              onClick={onOpenSchedule}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <CalendarDays className="w-4 h-4" />
              考程表
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-slate-600 hover:text-indigo-600 p-2 rounded-xl hover:bg-white/60 transition-colors active:scale-95"
              aria-label="開啟選單"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer (Right Side) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-custom-fade"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 bottom-0 h-[100dvh] w-[280px] max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col animate-custom-slide-right border-l border-white/50">
            {/* Drawer Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100/50">
              <span className="font-bold text-lg text-slate-800">選單導航</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                aria-label="關閉選單"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Primary Action */}
              <button
                onClick={() => {
                  onOpenSchedule();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                <CalendarDays className="w-5 h-5" />
                查看考程時間表
              </button>

              {/* Links Section */}
              <div className="space-y-3">
                <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  其他考試倒數
                </h3>
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100/50 text-center bg-slate-50/50">
              <p className="text-xs text-slate-400 font-medium">
                115學年度分科測驗倒數
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};