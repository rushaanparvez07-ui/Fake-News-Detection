
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrendingDebunks, fetchRealTopNews } from '../services/geminiService';
import { db } from '../services/db';
import { FactCheckResult, TickerItem, Activity as ActivityType } from '../types';
import { VerdictBadge } from '../components/VerdictBadge';
import { PollWidget } from '../components/PollWidget';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { RefreshCw, Share2, Clock, Zap, Globe, Radio, Shield } from 'lucide-react';
import { Logo } from '../components/Logo';

// Memoized NewsCard for elite 120fps scrolling
const NewsCard = React.memo(({ item, langFlag, onVote, userVoted }: { 
  item: FactCheckResult, 
  langFlag: string, 
  onVote: any, 
  userVoted?: any 
}) => (
  <div className="bg-slate-900/30 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/10 hover:border-primary-500/40 transition-all duration-500 group animate-fade-in shadow-2xl mb-12">
    <div className="p-8 md:p-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-[40%] shrink-0">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-black relative border border-white/5 shadow-2xl">
            {item.imageUrl ? (
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" alt="News" />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                 <Globe className="w-20 h-20 text-slate-800 animate-pulse" />
              </div>
            )}
            <div className="absolute top-6 left-6 scale-110">
              <VerdictBadge verdict={item.verdict} nodeFlag={langFlag} className="shadow-[0_15px_35px_rgba(0,0,0,0.6)]" />
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
              <span className="text-xl">{langFlag}</span>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">NODE SIGNAL</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-primary-400 uppercase tracking-widest">{item.author}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-primary-400 transition-colors italic">{item.headline || item.claim}</h3>
            <p className="text-slate-400 text-lg leading-relaxed line-clamp-3 mb-8 font-medium">{item.explanation}</p>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div className="flex-1">
              <PollWidget checkId={item.id} stats={item.communityPoll} onVote={onVote} userVotedOption={userVoted} />
            </div>
            <div className="flex items-center gap-6 ml-10">
              <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10 shadow-lg group-hover:rotate-12">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';
  const langFlag = LANGUAGES.find(l => l.code === language)?.flag || '🌐';

  // Atomic Initialization: Always seeded by db.ts fallback
  const [localChecks, setLocalChecks] = useState<FactCheckResult[]>(() => db.content.getFeed());
  const [trendingChecks, setTrendingChecks] = useState<FactCheckResult[]>(() => db.content.getTrending(language));
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(() => db.analytics.getTicker(language));
  
  const [loading, setLoading] = useState(false);
  const [lastTickerUpdate, setLastTickerUpdate] = useState<Date>(new Date());
  const { user, castVote, activeUsersCount } = useAuth();

  const syncData = async (force = false) => {
    if (loading && !force) return;
    setLoading(true);
    try {
      const [news, trending] = await Promise.all([
        fetchRealTopNews(language, langName),
        fetchTrendingDebunks(language, langName)
      ]);
      if (news.length) setTickerItems(news);
      if (trending.length) setTrendingChecks(trending);
      setLastTickerUpdate(new Date());
    } catch (e) {
      console.error("Network sync failed, relying on seed data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(() => syncData(), 300000);
    return () => clearInterval(interval);
  }, [language]);

  const handleVote = (id: string, opt: any) => {
    castVote(id, opt);
    const updateList = (list: FactCheckResult[]) => list.map(item => 
      item.id === id ? { ...item, communityPoll: { ...item.communityPoll, [opt]: item.communityPoll[opt] + 1, total: item.communityPoll.total + 1 } } : item
    );
    setTrendingChecks(updateList); 
    setLocalChecks(updateList);
  };

  const feedItems = useMemo(() => {
    const all = [...localChecks, ...trendingChecks];
    const seen = new Set();
    return all.filter(item => {
        const isDuplicate = seen.has(item.id);
        seen.add(item.id);
        return !isDuplicate;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [localChecks, trendingChecks]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
          <Logo size={800} animated={true} />
      </div>

      {/* GLOBAL LIVE FEED BAR */}
      <div key={language} className="bg-slate-900/80 backdrop-blur-xl border border-white/5 mb-12 rounded-[2rem] overflow-hidden py-4 relative flex items-center shadow-3xl group animate-fade-in border-l-8 border-l-primary-600">
         <div className="bg-red-600 text-white text-[11px] font-black px-6 py-2.5 ml-4 rounded-xl z-10 flex items-center gap-3 shadow-lg shadow-red-900/40">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
             LIVE FEED
         </div>
         <div className="flex-1 overflow-hidden pointer-events-none">
             <div className="animate-ticker">
                 {/* Double content for seamless looping */}
                 {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                     <div key={i} className="flex items-center gap-10 px-12 border-r border-white/5">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">{item.source}</span>
                        <span className="text-base font-bold text-white whitespace-nowrap tracking-tight">{item.headline}</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${item.verdict === 'TRUE' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                            {item.verdict}
                        </span>
                     </div>
                 ))}
             </div>
         </div>
         <div className="hidden lg:flex items-center gap-3 px-8 border-l border-white/5 bg-slate-900/90 z-10 text-slate-500 text-[11px] font-black uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            {lastTickerUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8">
            <div className="flex items-center justify-between px-4 mb-12">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-primary-600/10 rounded-2xl border border-primary-500/20">
                        <Radio className="w-6 h-6 text-primary-500 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">{t('nav_feed')}</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Regional Hub: {langName}</p>
                    </div>
                </div>
                <button onClick={() => syncData(true)} className="p-4 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-slate-800 hover:border-primary-500 transition-all group shadow-xl">
                    <RefreshCw className={`w-6 h-6 text-primary-400 group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {feedItems.map(item => (
              <NewsCard 
                key={item.id} 
                item={item} 
                langFlag={langFlag} 
                onVote={handleVote} 
                userVoted={user?.votes?.[item.id]} 
              />
            ))}
        </div>

        <div className="lg:col-span-4 space-y-12">
             <div className="bg-gradient-to-br from-primary-950 via-slate-950 to-black p-12 rounded-[3.5rem] border border-primary-500/20 shadow-4xl relative overflow-hidden group sticky top-28">
                 <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Logo size={300} animated={true} />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary-600 flex items-center justify-center shadow-3xl shadow-primary-900/50 group-hover:rotate-12 transition-transform duration-500">
                            <Zap className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fast Scan</h3>
                            <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">AI-Powered Verification</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed mb-10 font-medium">Instantly analyze text or images for manipulation and forensic consistency.</p>
                    <Link to="/verify" className="flex items-center justify-center gap-4 w-full py-6 bg-primary-600 hover:bg-primary-500 text-white font-black text-center rounded-2xl transition-all shadow-[0_20px_45px_rgba(37,99,235,0.4)] uppercase tracking-[0.2em] text-sm group/btn">
                        <Shield className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                        {t('btn_scan')}
                    </Link>
                    <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Validators</p>
                            <p className="text-xl font-black text-white italic tracking-tighter">{activeUsersCount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-xl font-black text-green-500 italic tracking-tighter uppercase">SYNCED</p>
                        </div>
                    </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};
