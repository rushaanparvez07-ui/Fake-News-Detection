
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Search, Image as ImageIcon, ExternalLink, ShieldCheck, Cpu, Globe, Link as LinkIcon, AlertCircle, FileCheck, X, Zap, ArrowRight, Shield, FileText, TrendingUp, ChevronDown, ChevronUp, History, Info, AlertTriangle, Activity, CheckCircle2, HelpCircle } from 'lucide-react';
import { analyzeClaim } from '../services/geminiService';
import { FactCheckResult, ConfidenceLevel } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [claim, setClaim] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submitCheck } = useAuth();
  const { t, language } = useLanguage();
  const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';

  // Browser Extension Compatibility: One-click verification via URL param
  useEffect(() => {
    const extClaim = searchParams.get('claim');
    if (extClaim) {
      setClaim(decodeURIComponent(extClaim));
      // Auto-trigger if it looks like a valid request
      if (extClaim.length > 5) {
        setTimeout(() => handleSubmit(), 500);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!claim && !image) return;

    setIsAnalyzing(true);
    setResult(null);
    setShowReasoning(false);
    
    const statuses = ['Initializing Neural Core...', 'Accessing Search Grounding...', 'Auditing Source Trust...', 'Evaluating Virality Risk...'];
    let si = 0;
    setStatus(statuses[0]);
    const timer = setInterval(() => {
      si = (si + 1) % statuses.length;
      setStatus(statuses[si]);
    }, 2000);

    let base64Image = undefined;
    if (image) {
      const reader = new FileReader();
      base64Image = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(image);
      });
    }

    try {
      const analysis = await analyzeClaim(claim, langName, base64Image);
      submitCheck(analysis);
      setResult(analysis);
    } catch (err) {
      setFileError("Neural timeout. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setStatus('');
      clearInterval(timer);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-24">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
            Audit <span className="text-primary-500">Node</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <span className="px-4 py-1.5 bg-slate-900 text-slate-500 text-[10px] font-black rounded-full border border-white/5 uppercase tracking-[0.3em]">
            B2B Risk Logic Active
          </span>
          <div className="h-4 w-px bg-slate-800" />
          <span className="flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" /> Extension Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* INPUT SUITE */}
        <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 p-1 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-900 rounded-[2.8rem] p-8 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="relative group">
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="Paste URL, highlight text, or enter claim..."
                  className="w-full h-48 px-10 py-10 bg-black/40 border border-white/5 text-white rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none text-2xl font-medium placeholder-slate-800 shadow-inner group-hover:border-white/10"
                />
                <div className="absolute bottom-8 right-10 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl border border-white/5 transition-all shadow-xl"
                  >
                    <ImageIcon className="w-7 h-7" />
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setImage(f); setPreviewUrl(URL.createObjectURL(f)); }
                }} />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || (!claim && !image)}
                className="w-full py-9 rounded-[2.5rem] bg-primary-600 text-white font-black text-3xl uppercase italic tracking-tighter hover:bg-primary-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center justify-center gap-5 group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin w-10 h-10" />
                    <span className="text-sm font-black uppercase tracking-widest">{status}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-12 h-12 group-hover:scale-110 transition-transform" />
                    Initiate Deep Audit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RESULTS SUITE */}
        {result && (
          <div className="space-y-16 animate-scale-in">
            <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 md:p-20 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-20">
                <div className="flex-1 space-y-12">
                  <div className="flex flex-wrap items-center gap-6">
                    <VerdictBadge level={result.confidenceLevel} className="scale-125 origin-left" />
                    <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 transition-colors ${result.riskMetrics?.viralityRisk && result.riskMetrics.viralityRisk > 70 ? 'bg-red-950/20 border-red-500/30 text-red-500' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Virality Risk: {result.riskMetrics?.viralityRisk}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-6xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">{result.headline}</h2>
                    <p className="text-slate-400 text-2xl font-medium leading-relaxed mb-10">{result.explanation}</p>
                  </div>

                  {/* AI CONFIDENCE SPECTRUM */}
                  <div className="space-y-6 bg-black/40 p-12 rounded-[3.5rem] border border-white/5">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Veracity Ledger</span>
                        <span className="text-3xl font-black text-white uppercase italic tracking-tighter">{result.confidenceLevel.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black text-primary-500 italic leading-none">{result.confidenceScore}<span className="text-xl">%</span></span>
                        <p className="text-[9px] font-bold text-slate-600 uppercase mt-2">Confidence Certainty</p>
                      </div>
                    </div>
                    <div className="h-5 bg-slate-800/50 rounded-full overflow-hidden flex p-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${result.verdict === 'TRUE' ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${result.confidenceScore}%` }} 
                      />
                    </div>
                  </div>

                  {/* EXPLAINABILITY TIMELINE */}
                  <div className="border-t border-white/5 pt-10">
                    <button 
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="flex items-center gap-4 text-primary-400 font-black uppercase text-xs hover:text-white transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-600 transition-colors">
                        {showReasoning ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                      Explain Verification Flow
                    </button>

                    {showReasoning && (
                      <div className="mt-12 space-y-12 pl-12 relative animate-fade-in">
                        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-800" />
                        {result.reasoningTimeline.map((step, i) => (
                          <div key={i} className="relative group">
                            <div className="absolute -left-12 w-8 h-8 rounded-2xl bg-slate-900 border-2 border-primary-500 flex items-center justify-center z-10 shadow-lg shadow-primary-900/20 group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="w-4 h-4 text-primary-500" />
                            </div>
                            <h4 className="text-white font-black uppercase text-sm mb-2 tracking-wide">{step.title}</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SIDEBAR: SOURCE TRUST & B2B SIGNAL */}
                <div className="w-full lg:w-96 space-y-10">
                  <div className="bg-slate-950 p-10 rounded-[3.5rem] border border-white/5 space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Trust Scores</h3>
                        <Info className="w-4 h-4 text-slate-700" />
                    </div>
                    
                    <div className="space-y-10">
                      {result.sources.length > 0 ? result.sources.map((s, i) => (
                        <div key={i} className="group relative">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-black text-white truncate max-w-[160px] group-hover:text-primary-400 transition-colors">{s.title}</span>
                            <div className="flex flex-col items-end">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border mb-1 ${s.trustScore && s.trustScore > 80 ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                                    {s.trustScore}% TRUST
                                </span>
                                <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">{s.reliabilityBadge}</span>
                            </div>
                          </div>
                          <a href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-600 hover:text-white transition-all flex items-center gap-2 truncate opacity-60 group-hover:opacity-100">
                            <LinkIcon className="w-3 h-3" /> {s.uri}
                          </a>
                        </div>
                      )) : (
                        <div className="text-center py-10 opacity-30">
                            <HelpCircle className="w-10 h-10 mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase">No Primary Grounds</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-10 rounded-[3.5rem] text-white shadow-3xl shadow-primary-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                        <Cpu className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <Shield className="w-8 h-8" />
                          <h4 className="text-xl font-black uppercase italic tracking-tighter">HFT Risk Signal</h4>
                        </div>
                        <p className="text-sm font-bold opacity-80 mb-8 leading-relaxed">
                            Sentiment Volatility: {result.verdict === 'TRUE' ? 'STABLE' : 'UNSTABLE'}. 
                            {result.riskMetrics?.viralityRisk && result.riskMetrics.viralityRisk > 60 ? ' High-frequency nodes flagged for possible trend manipulation.' : ' Organic spread patterns detected.'}
                        </p>
                        <div className="bg-black/20 backdrop-blur-md p-6 rounded-3xl flex justify-between items-center border border-white/10">
                          <span className="text-[9px] font-black uppercase tracking-widest">Market Impact</span>
                          <span className="text-xl font-black italic uppercase tracking-tighter">{result.riskMetrics?.marketImpact}</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
