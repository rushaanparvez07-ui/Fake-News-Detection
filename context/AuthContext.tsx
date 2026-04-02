
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, FactCheckResult, Activity } from '../types';
import { fetchTrendingDebunks } from '../services/geminiService';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  checkEmailExists: (email: string) => boolean;
  login: (email: string, name?: string, rememberMe?: boolean) => void;
  loginAdmin: (password: string) => boolean; 
  logout: () => void;
  castVote: (checkId: string, option: 'trueVotes' | 'falseVotes' | 'misleadingVotes') => void;
  submitCheck: (check: FactCheckResult) => void;
  activeUsersCount: number;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => void;
  getAllContent: () => Promise<FactCheckResult[]>;
  deleteContent: (contentId: string) => void;
  getRecentActivities: () => Activity[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_KEY = 'fp_active_session_v5';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState(() => 1250 + Math.floor(Math.random() * 300));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUsersCount(prev => {
        const drift = Math.floor(Math.random() * 31) - 15;
        return Math.max(1000, Math.min(3000, prev + drift));
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        const fresh = db.users.findByEmail(session.email);
        if (fresh) setUser({ ...fresh, isAdmin: session.isAdmin });
      } catch (e) { console.error("Session restoration failed", e); }
    }
  }, []);

  const login = (email: string, name?: string, rememberMe = false) => {
    const existing = db.users.findByEmail(email);
    let active: User;
    const isAdmin = email.toLowerCase() === 'admin@factpulse.com';

    if (existing) {
      active = { ...existing, isAdmin };
    } else {
      if (!name) throw new Error("Full name required for new node registration");
      active = {
        id: `node-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        level: 'Truth Seeker',
        votes: {},
        joinedAt: Date.now(),
        stats: { points: 100, reportsFiled: 0, accuracyRate: 100, sensorUptime: 100, credibilityWeight: 1.0 },
        isAdmin
      };
      db.users.save(active);
    }

    setUser(active);
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(active));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const castVote = (checkId: string, option: 'trueVotes' | 'falseVotes' | 'misleadingVotes') => {
    if (!user) return;
    
    // Community Integrity: Weight vote by user credibility
    const weight = user.stats.credibilityWeight || 1.0;
    
    // Detection of suspicious voting patterns (Simulated)
    const recentVotesCount = Object.keys(user.votes).length;
    if (recentVotesCount > 500) {
        // Fix: Changed user.userName to user.name as userName property does not exist on type User.
        db.analytics.log(user.id, user.name, "NODE FLAGGED: Suspicious high-frequency voting activity detected.");
    }
    
    db.content.updateVote(checkId, option, weight);
    
    const updated: User = {
      ...user,
      votes: { ...user.votes, [checkId]: option },
      stats: { ...user.stats, points: user.stats.points + Math.round(10 * weight) }
    };
    db.users.save(updated);
    setUser(updated);
    db.analytics.log(user.id, user.name, `authenticated veracity signal for audit #${checkId.substring(0, 5)}`);
  };

  const submitCheck = (check: FactCheckResult) => {
    db.content.saveCheck(check);
    if (user) {
      const updated: User = {
        ...user,
        stats: { ...user.stats, points: user.stats.points + 50, reportsFiled: user.stats.reportsFiled + 1 }
      };
      db.users.save(updated);
      setUser(updated);
      db.analytics.log(user.id, user.name, `pushed high-veracity evidence: "${check.headline?.substring(0, 25)}..."`);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, checkEmailExists: (e) => !!db.users.findByEmail(e), castVote, submitCheck, activeUsersCount,
      getAllUsers: () => db.users.all(),
      deleteUser: (id) => db.users.delete(id),
      getAllContent: async () => [...db.content.getFeed(), ...(await fetchTrendingDebunks('en', 'English'))],
      deleteContent: (id) => db.content.delete(id),
      getRecentActivities: () => db.analytics.getLogs(),
      loginAdmin: (pass: string) => {
        if (pass === 'admin123') {
          login('admin@factpulse.com', 'System Administrator', true);
          return true;
        }
        return false;
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
