
import React, { useMemo } from 'react';
import { Trophy, Shield, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  
  // Use useMemo to prevent unnecessary re-ranking of the user set
  const rankedUsers = useMemo(() => {
      return db.users.getLeaderboard().filter(u => u.email !== 'admin@factpulse.com');
  }, [user?.stats.points]); // Only re-calculate when the current user's points change

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Global Rankings</h1>
            <p className="text-slate-500 text-sm font-medium">Top truth-validators by proof-points and accuracy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { icon: Trophy, label: "Verification", value: "+50 Pts", color: "text-amber-500" },
                { icon: Shield, label: "Voting", value: "+10 Pts", color: "text-primary-500" },
                { icon: Award, label: "Accuracy", value: "+100 Bonus", color: "text-green-500" }
            ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        <div className="text-white font-black text-lg">{stat.value}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800 overflow-hidden min-h-[500px]">
            {rankedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-32 text-center px-4">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <AlertCircle className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">NETWORK INITIALIZING</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Leaderboard is currently generating data. Be the first to verify content and claim the #1 spot.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-800/50">
                    {rankedUsers.map((u, index) => (
                        <div key={u.id} className={`p-6 flex items-center hover:bg-slate-800/30 transition-all ${user?.id === u.id ? 'bg-primary-900/10 border-l-4 border-l-primary-500' : ''}`}>
                            <div className="w-12 text-center font-black text-xl">
                                {index === 0 ? <Trophy className="w-6 h-6 text-yellow-500 mx-auto" /> : 
                                 index === 1 ? <span className="text-slate-400">2</span> : 
                                 index === 2 ? <span className="text-amber-700">3</span> : 
                                 <span className="text-slate-700 text-sm">{index + 1}</span>}
                            </div>
                            
                            <div className="flex-1 flex items-center gap-5 pl-4 min-w-0">
                                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-white shadow-xl
                                    ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
                                    {u.initials}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white text-base truncate flex items-center gap-2">
                                        {u.name}
                                        {user?.id === u.id && <span className="text-[8px] bg-primary-600 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>}
                                    </h3>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider mt-1">
                                        <span className="text-slate-500 flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-primary-500" /> {u.level}
                                        </span>
                                        <span className="text-green-500 flex items-center gap-1">
                                            <Award className="w-3 h-3" /> {u.stats.accuracyRate}% ACCURACY
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 pl-6">
                                <p className="text-2xl font-black text-primary-400 leading-none">{u.stats.points.toLocaleString()}</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Proof Points</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <div className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Updates in real-time as verification nodes confirm data
        </div>
    </div>
  );
};
