
import React from 'react';
import { Shield, Zap, Cpu, Search, History, CheckCircle2, TrendingUp, Globe, BarChart, Layers, Database } from 'lucide-react';

const VERSIONS = [
  {
    tag: 'V1',
    title: 'The Basic Validator',
    era: 'Initial Concept',
    date: 'Hackathon Start',
    description: 'The foundation of the project focused on binary fact-checking. A simple "is it true?" interface with a minimal local database.',
    features: ['Binary True/False detection', 'Static news feed', 'Basic user voting'],
    tech: 'React, Tailwind, LocalStorage',
    color: 'slate',
    icon: Shield
  },
  {
    tag: 'V2',
    title: 'Neural Defense Network',
    era: 'The Real-Time Pivot',
    date: 'First Overhaul',
    description: 'Introduction of the "Pulse" brand. Shifted to a high-performance dark-mode interface with a real-time global news ticker powered by Gemini Flash.',
    features: ['Real-time Global Ticker', 'Glassmorphism UI', 'Language Localization (8+)', 'Gemini Flash Grounding'],
    tech: 'Gemini 3 Flash, Google Search Tool',
    color: 'primary',
    icon: Zap
  },
  {
    tag: 'V3',
    title: 'Forensic Risk Intelligence',
    era: 'Professional Auditor',
    date: 'Current State',
    description: 'The current enterprise-grade version. Moves beyond simple facts into "Risk Intelligence," assessing virality, source trust, and AI explainability.',
    features: ['5-Tier Confidence Spectrum', 'Explainability Reasoning Path', 'Source Trust Scoring', 'Virality Risk Predictor', 'B2B Risk Signals'],
    tech: 'Gemini 3 Pro (Thinking Model), GARM Standards',
    color: 'emerald',
    icon: Cpu
  }
];

export const VersionGallery: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-24">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic">
          Project <span className="text-primary-500">Evolution</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] bg-slate-900/50 inline-block px-4 py-2 rounded-full border border-white/5">
          From Concept to Forensic Auditor
        </p>
      </div>

      <div className="relative">
        {/* Timeline Path */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800" />

        <div className="space-y-24">
          {VERSIONS.map((v, i) => (
            <div key={v.tag} className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center`}>
              
              {/* Timeline Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-950 border-4 border-slate-800 rounded-2xl z-10 flex items-center justify-center shadow-2xl">
                <v.icon className={`w-5 h-5 ${i === 2 ? 'text-primary-500' : 'text-slate-500'}`} />
              </div>

              {/* Version Content */}
              <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest`}>
                    {v.era}
                  </span>
                  <span className="text-primary-500 text-[10px] font-black uppercase tracking-widest">{v.tag}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">{v.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  {v.description}
                </p>
                
                <div className={`flex flex-wrap gap-2 mb-8 ${i % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                  {v.features.map(f => (
                    <span key={f} className="px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                      {f}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-white/5 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <Database className="w-4 h-4 text-primary-500" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{v.tech}</span>
                </div>
              </div>

              {/* Spacer for other side */}
              <div className="hidden md:block md:w-[45%]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-32 p-12 bg-primary-600 rounded-[3rem] text-white text-center shadow-2xl shadow-primary-900/40 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Globe className="w-96 h-96 absolute -bottom-20 -right-20 animate-pulse" />
        </div>
        <div className="relative z-10">
          <History className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Architecture Summary</h2>
          <p className="max-w-xl mx-auto text-sm font-bold opacity-80 leading-relaxed mb-8">
            FactPulse has evolved from a simple UI into a multi-agent system where Gemini Flash handles high-speed indexing (Ticker) and Gemini Pro handles high-accuracy forensics (Audit).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-2 bg-black/20 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">3,400+ Lines Modfied</div>
            <div className="px-6 py-2 bg-black/20 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Gemini 3 Core</div>
            <div className="px-6 py-2 bg-black/20 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">8 Regions Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};
