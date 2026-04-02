import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FactCheckResult, User, VerdictType } from '../types';
import { Navigate } from 'react-router-dom';
import { Users, FileText, Trash2, Ban, BarChart3, Lock, ShieldAlert, Menu } from 'lucide-react';
import { VerdictBadge } from '../components/VerdictBadge';

export const AdminDashboard: React.FC = () => {
  const { user, getAllUsers, getAllContent, deleteUser, deleteContent } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allContent, setAllContent] = useState<FactCheckResult[]>([]);

  useEffect(() => {
    if (user?.isAdmin) {
        refreshData();
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval);
    }
  }, [user]);

  const refreshData = async () => {
      setAllUsers(getAllUsers());
      const content = await getAllContent();
      setAllContent(content);
  };

  if (!user || !user.isAdmin) {
      return <Navigate to="/" replace />;
  }

  const fakeNewsCount = allContent.filter(c => c.verdict === VerdictType.FALSE).length;
  
  const NavButton = ({ tab, icon: Icon, label }: { tab: 'overview' | 'users' | 'content', icon: any, label: string }) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center gap-3 px-4 py-3 md:py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap
        ${activeTab === tab ? 'bg-primary-900/20 text-primary-400 border border-primary-900/30' : 'text-slate-400 hover:bg-slate-800'}`}
    >
        <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row text-slate-100">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto">
          <div className="flex gap-2">
            <div className="flex-1 min-w-[120px]"><NavButton tab="overview" icon={BarChart3} label="Overview" /></div>
            <div className="flex-1 min-w-[140px]"><NavButton tab="users" icon={Users} label="User Mgmt" /></div>
            <div className="flex-1 min-w-[140px]"><NavButton tab="content" icon={FileText} label="Content" /></div>
          </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
            <h2 className="text-sm font-bold flex items-center gap-2 text-primary-400 uppercase tracking-wide">
                <Lock className="w-4 h-4" /> Admin Console
            </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            <NavButton tab="overview" icon={BarChart3} label="Overview" />
            <NavButton tab="users" icon={Users} label="User Management" />
            <NavButton tab="content" icon={FileText} label="Content Moderation" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        
        {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
                <div className="mb-6 md:mb-8 border-b border-slate-800 pb-4">
                    <h1 className="text-2xl font-bold text-white">System Dashboard</h1>
                    <p className="text-slate-400 text-sm">Real-time platform statistics</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Users</div>
                        <p className="text-3xl font-bold text-white">{allUsers.length}</p>
                        <Users className="absolute right-6 top-6 w-10 h-10 text-slate-800" />
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Verified Content</div>
                        <p className="text-3xl font-bold text-white">{allContent.length}</p>
                        <FileText className="absolute right-6 top-6 w-10 h-10 text-slate-800" />
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-red-900/30 shadow-sm relative overflow-hidden">
                        <div className="text-xs font-bold text-red-500 uppercase mb-2">Fake News Detected</div>
                        <p className="text-3xl font-bold text-red-500">{fakeNewsCount}</p>
                        <ShieldAlert className="absolute right-6 top-6 w-10 h-10 text-red-900/20" />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mt-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white">System Status</h3>
                        <p className="text-xs text-slate-400">All services operational</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 border border-green-800 px-3 py-1 rounded-full font-bold">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Online
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in-up">
                <h1 className="text-xl font-bold text-white mb-6">User Database</h1>
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Name / Email</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Role</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Points</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {allUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isAdmin ? 'bg-amber-900/30 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                                                {u.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                                            {u.stats?.points || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!u.isAdmin && (
                                                <button onClick={() => deleteUser(u.id)} className="text-slate-500 hover:text-red-500 p-2 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete User">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'content' && (
             <div className="space-y-6 animate-fade-in-up">
                 <h1 className="text-xl font-bold text-white mb-6">Content Logs</h1>
                 <div className="space-y-3">
                    {allContent.map(item => (
                        <div key={item.id} className="bg-slate-900 rounded-lg border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-slate-700 transition-all group gap-3">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <VerdictBadge verdict={item.verdict} className="px-2 py-0.5 text-[10px]" />
                                    <span className="text-[10px] text-slate-500 font-mono">ID: {item.id.substring(0,8)}</span>
                                </div>
                                <h3 className="font-bold text-slate-300 text-sm line-clamp-2 md:line-clamp-1">{item.headline || item.claim}</h3>
                            </div>
                            <button onClick={() => deleteContent(item.id)} className="self-end sm:self-auto text-slate-500 hover:text-red-500 p-2 hover:bg-red-900/20 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                 </div>
             </div>
        )}

      </main>
    </div>
  );
};