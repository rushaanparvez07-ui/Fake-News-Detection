import React from 'react';
import { PollStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Check, X, AlertTriangle } from 'lucide-react';

interface Props {
  checkId: string;
  stats: PollStats;
  onVote: (id: string, option: 'trueVotes' | 'falseVotes' | 'misleadingVotes') => void;
  userVotedOption?: 'trueVotes' | 'falseVotes' | 'misleadingVotes';
}

export const PollWidget: React.FC<Props> = ({ checkId, stats, onVote, userVotedOption }) => {
  const { user } = useAuth();
  
  const total = stats.total || 1;
  const truePct = Math.round((stats.trueVotes / total) * 100);
  const falsePct = Math.round((stats.falseVotes / total) * 100);
  const misleadingPct = Math.round((stats.misleadingVotes / total) * 100);

  const handleVote = (option: 'trueVotes' | 'falseVotes' | 'misleadingVotes') => {
    if (!user) return;
    onVote(checkId, option);
  };

  if (!user) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
        <p className="text-xs font-medium text-slate-500 mb-2">Sign in to vote on this claim</p>
        <Link 
            to="/login"
            className="inline-block px-4 py-1.5 bg-slate-900 text-primary-400 border border-slate-700 hover:border-primary-500 hover:bg-slate-800 rounded-md text-xs font-bold transition-all"
        >
            Sign In
        </Link>
      </div>
    );
  }

  if (userVotedOption) {
    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Community Consensus</h4>
        
        <div className="space-y-3">
          {/* True */}
          <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-xs font-bold text-green-500">Verified True</span>
              <span className="text-xs font-bold text-green-500">{truePct}%</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-800">
              <div style={{ width: `${truePct}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"></div>
            </div>
          </div>

          {/* False */}
          <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-xs font-bold text-red-500">Fake News</span>
              <span className="text-xs font-bold text-red-500">{falsePct}%</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-800">
              <div style={{ width: `${falsePct}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500"></div>
            </div>
          </div>

           {/* Misleading */}
           <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-xs font-bold text-amber-500">Misleading</span>
              <span className="text-xs font-bold text-amber-500">{misleadingPct}%</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-800">
              <div style={{ width: `${misleadingPct}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-600 transition-all duration-500"></div>
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-500 mt-3 text-center">Based on {total} votes</p>
      </div>
    );
  }

  return (
    <div>
       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">What do you think?</h4>
       <div className="flex gap-2">
          <button 
             onClick={() => handleVote('trueVotes')}
             className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-green-600 hover:bg-green-900/20 hover:text-green-400 text-slate-400 rounded-md transition-all flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
          >
             <Check className="w-3 h-3" /> True
          </button>
          <button 
             onClick={() => handleVote('falseVotes')}
             className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-red-600 hover:bg-red-900/20 hover:text-red-400 text-slate-400 rounded-md transition-all flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
          >
             <X className="w-3 h-3" /> Fake
          </button>
          <button 
             onClick={() => handleVote('misleadingVotes')}
             className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-amber-600 hover:bg-amber-900/20 hover:text-amber-400 text-slate-400 rounded-md transition-all flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
          >
             <AlertTriangle className="w-3 h-3" /> Unsure
          </button>
       </div>
    </div>
  );
};