
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Navigate, Link } from 'react-router-dom';
import { Shield, Award, Calendar, Mail, CheckCircle2, Cpu, Database, Download, Zap, Radio, Server } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [trainingData] = useState(() => db.training.getSet());

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleExportData = () => {
    const jsonl = trainingData.map(ex => JSON.stringify(ex)).join('\n');
    const blob = new Blob([jsonl], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factpulse_training_set_${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-slate-900 rounded-3xl shadow-card border border-slate-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-800 to-primary-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
            </div>
        </div>
        
        <div className="px-4 md:px-8 pb-8">
            <div className="relative -mt-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 w-full">
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 p-1 shadow-2xl">
                        <div className="w-full h-full bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-400 font-black text-3xl border border-primary-800">
                            {user.initials}
                        </div>
                    </div>
                    <div className="mb-1">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                           <Shield className="w-4 h-4 text-primary-500" />
                           <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{user.level}</p>
                        </div>
                    </div>
                </div>
                {user.isAdmin && (
                    <div className="bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 shadow-lg shadow-amber-500/20">
                        System Admin
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Points</div>
                    <div className="text-2xl font-black text-primary-400">{user.stats.points.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Audits</div>
                    <div className="text-2xl font-black text-white">{user.stats.reportsFiled}</div>
                </div>
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
                    <div className="text-2xl font-black text-green-500">{user.stats.accuracyRate}%</div>
                </div>
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sensor Pulse</div>
                    <div className="text-2xl font-black text-amber-500">99.2%</div>
                </div>
            </div>

            {/* SENSOR NETWORK SECTION */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-primary-900/30 p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Radio className="w-32 h-32 text-primary-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/40">
                            <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Distributed Sensor Node</h3>
                            <p className="text-slate-500 text-xs font-medium">Your node provides real-time signals for B2B Risk Intelligence</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Node Sync Progress</span>
                                    <span className="text-primary-400">{Math.min(100, (trainingData.length / 50) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (trainingData.length / 50) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                You have successfully processed <span className="text-white font-bold">{trainingData.length} risk vectors</span>. These signals are anonymized via **Edge AI** before being integrated into the global "Digital Iron Dome" API.
                            </p>
                        </div>

                        <div className="bg-black/50 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                <Zap className="w-4 h-4 text-amber-500" />
                                On-Device Privacy Enabled
                            </div>
                            <button 
                                onClick={handleExportData}
                                disabled={trainingData.length === 0}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Risk Dataset (JSONL)
                            </button>
                            <p className="text-[9px] text-slate-600 text-center uppercase font-bold tracking-tighter">
                                Metadata mapped to GARM and FIX Protocol standards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Infrastructure Status</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-xs text-slate-500 font-medium">B2B API Sync</span>
                            <span className="text-xs text-green-500 font-black uppercase">Synchronized</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-xs text-slate-500 font-medium">Uptime Status</span>
                            <span className="text-xs text-green-500 font-black uppercase">Active Sensor</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                            <span className="text-xs text-slate-500 font-medium">Network Latency</span>
                            <span className="text-xs text-white font-mono">18ms</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-6 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Alpha Signal Sync</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">Ensure your local node is broadcasting the most accurate veracity signals to the HFT global ledger.</p>
                    </div>
                    <button className="mt-4 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-800 transition-all">
                        Force Global Node Sync
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
