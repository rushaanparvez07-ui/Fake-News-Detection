
import React, { useState } from 'react';
import { Shield, Zap, Globe, Menu, X, User, LogOut, Settings, ChevronDown, Activity, History, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { SettingsModal } from './SettingsModal';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, activeUsersCount } = useAuth();
  const { t, language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path 
    ? 'text-primary-400 font-black' 
    : 'text-slate-400 hover:text-white transition-all';

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <header className="sticky top-0 z-[60] bg-black/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* LEFT: FUTURISTIC BRANDING */}
          <Link to="/" className="flex items-center gap-5 group" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo size={52} className="group-hover:scale-110 transition-transform duration-500" />
            <div className="hidden sm:flex flex-col">
              <span className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none group-hover:text-primary-400 transition-colors">
                FACT<span className="text-primary-500 group-hover:text-white">PULSE</span>
              </span>
              <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-80">
                    Neural Defense Network
                  </span>
              </div>
            </div>
          </Link>

          {/* CENTER: DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-12">
            {[
              { path: '/', label: t('nav_feed') },
              { path: '/verify', label: t('nav_verify') },
              { path: '/leaderboard', label: t('nav_leaderboard') },
              { path: '/evolution', label: 'History' }
            ].map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-[11px] uppercase tracking-[0.3em] relative group py-3 ${isActive(link.path)}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 to-primary-300 transform origin-left transition-transform duration-500 rounded-full ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </nav>

          {/* RIGHT: SYSTEM STATUS & USER */}
          <div className="flex items-center gap-4 sm:gap-8">
            
            {/* QUICK LANGUAGE SELECTOR */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary-500/50 transition-all group"
            >
              <span className="text-xl grayscale-[0.8] group-hover:grayscale-0 transition-all">
                {currentLang?.flag}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </button>

            {/* AUTH SECTION */}
            {user ? (
              <div className="relative group ml-1">
                <Link to="/profile" className="flex items-center gap-4 focus:outline-none group/user p-1 rounded-2xl">
                  <div className="relative">
                    <div className="h-12 w-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center font-black text-sm text-primary-400 shadow-2xl group-hover/user:border-primary-500 transition-all">
                      {user.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-600 rounded-full border-2 border-black flex items-center justify-center">
                        <Zap className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                </Link>

                <div className="absolute right-0 top-full mt-6 w-64 bg-slate-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] py-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-[70] overflow-hidden">
                  <div className="px-8 py-4 border-b border-white/5 mb-4">
                    <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest mb-1">Authenticated Node</p>
                    <p className="text-lg font-black text-white italic tracking-tighter truncate">{user.name}</p>
                  </div>
                  <div className="px-3 space-y-1">
                    <Link to="/profile" className="flex items-center gap-4 px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white rounded-2xl transition-all">
                      <User className="w-4 h-4 text-primary-500" /> Account Node
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-500/10 rounded-2xl transition-all">
                      <LogOut className="w-4 h-4" /> Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-black text-[11px] uppercase tracking-[0.3em] text-white bg-primary-600 rounded-[1.25rem] group transition-all shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95">
                <span className="relative z-10">Connect Node</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-3.5 text-slate-200 bg-white/5 rounded-2xl border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/98 fixed inset-0 top-24 z-[55] animate-fade-in p-8 overflow-y-auto">
          <div className="space-y-6">
            {[
              { path: '/', label: t('nav_feed'), icon: Shield },
              { path: '/verify', label: t('nav_verify'), icon: Zap },
              { path: '/leaderboard', label: t('nav_leaderboard'), icon: BarChart2 },
              { path: '/evolution', label: 'History', icon: History }
            ].map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.25em] flex items-center gap-6 text-white hover:bg-primary-900/20 transition-all"
              >
                <link.icon className="w-8 h-8 text-primary-500" /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};
