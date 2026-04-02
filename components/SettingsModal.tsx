
import React from 'react';
import { X, Globe, Cpu, Check, Zap } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 md:pt-20 md:pr-20 pointer-events-none">
      {/* Backdrop - ultra subtle */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in pointer-events-auto"
        onClick={onClose}
      ></div>

      {/* Compact Popover */}
      <div className="relative w-full max-w-[340px] bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.7)] overflow-hidden animate-scale-in pointer-events-auto">
        <div className="p-8">
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
                        <Globe className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-white uppercase tracking-widest">Regional Node</h2>
                        <p className="text-[8px] font-black text-primary-500 uppercase tracking-[0.2em]">Matrix Sync</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Language Selection */}
                <div className="max-h-[300px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar">
                    <div className="grid grid-cols-1 gap-2.5">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    // Instant close for elite UX
                                    onClose();
                                }}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all duration-300 group
                                ${language === lang.code 
                                    ? 'bg-primary-600/20 border-primary-500/50 text-white shadow-lg shadow-primary-900/20' 
                                    : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:border-white/10 hover:translate-x-1'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">{lang.flag}</span>
                                    <div>
                                        <span className="text-[12px] font-black tracking-widest uppercase">{lang.name}</span>
                                        {language === lang.code && <p className="text-[8px] font-black text-primary-400 uppercase tracking-tighter mt-0.5">Primary Link</p>}
                                    </div>
                                </div>
                                {language === lang.code && (
                                    <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/40">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* System Stats - High Density */}
                <div className="pt-6 border-t border-white/5 px-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Cpu className="w-4 h-4 text-slate-600" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol v6.2.4</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/30">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Sync Active</span>
                        </div>
                    </div>
                    <div className="bg-black/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Alpha Signals</span>
                        </div>
                        <span className="text-[9px] font-black text-amber-500 uppercase">Live</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
