
import React from 'react';
import { ConfidenceLevel, VerdictType } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Activity, ShieldCheck, Flag } from 'lucide-react';

interface Props {
  verdict?: VerdictType;
  level?: ConfidenceLevel;
  className?: string;
  isGrounded?: boolean;
  nodeFlag?: string;
}

export const VerdictBadge: React.FC<Props> = ({ verdict, level, className = '', isGrounded = true, nodeFlag = "🌐" }) => {
  const getStyle = () => {
    // Explicit high-visibility state mapping
    if (verdict === VerdictType.MISLEADING) return {
      bg: 'bg-amber-500',
      shadow: 'shadow-amber-900/60',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Misleading',
      badge: '⚠️'
    };

    if (verdict === VerdictType.FALSE || level === ConfidenceLevel.FABRICATED || level === ConfidenceLevel.LIKELY_FABRICATED) return {
      bg: 'bg-red-600',
      shadow: 'shadow-red-900/60',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.7)]',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Fake News',
      badge: '🚫'
    };

    if (verdict === VerdictType.TRUE || level === ConfidenceLevel.AUTHENTIC || level === ConfidenceLevel.LIKELY_AUTHENTIC) return {
      bg: 'bg-green-600',
      shadow: 'shadow-green-900/40',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.6)]',
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: 'Verified',
      badge: '✅'
    };

    return {
      bg: 'bg-slate-800',
      shadow: 'shadow-slate-900/30',
      glow: '',
      icon: <Activity className="w-4 h-4 animate-pulse" />,
      label: 'Auditing...',
      badge: '⏳'
    };
  };

  const style = getStyle();

  return (
    <div className={`inline-flex items-center gap-2.5 ${style.bg} ${style.glow} text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl ${style.shadow} transition-all hover:scale-105 ${className}`}>
      <span className="text-sm mr-1">{nodeFlag}</span>
      <div className="w-1 h-4 bg-white/20 rounded-full mx-1"></div>
      {style.icon}
      {style.label}
      {isGrounded && (
        <div className="ml-1 border-l border-white/20 pl-2">
          <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
        </div>
      )}
    </div>
  );
};
