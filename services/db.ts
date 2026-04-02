
import { User, FactCheckResult, TickerItem, Activity, VerdictType, ConfidenceLevel } from '../types';

/**
 * DATABASE SCHEMA VERSION 7.0
 * Zero-Lag Seeding Engine
 */
const STORES = {
  USER_DATA: 'fp_users_v7',
  FEED_DATA: 'fp_content_v7',
  TRENDING_CACHE: 'fp_trending_v7',
  SYSTEM_TICKER: 'fp_ticker_v7',
  ACTIVITY_LOG: 'fp_activity_v7',
  TRAINING_SET: 'fp_training_v7',
  META: 'fp_meta_v7'
};

const CACHE_TTL = 1000 * 60 * 30;

// High-fidelity fallback news data for instant launch
const SEED_TICKER: TickerItem[] = [
  { headline: "Global Deepfake Regulation Treaty Signed", verdict: 'TRUE', source: "Neural Reuters" },
  { headline: "Moon Base Oxygen Leak Rumors Debunked", verdict: 'FALSE', source: "Lunar Press" },
  { headline: "AI-Generated Election Deepfake Detected in Delhi", verdict: 'TRUE', source: "FactPulse India" },
  { headline: "Bitcoin Halving Delayed by Core Devs", verdict: 'FALSE', source: "Satoshi News" },
  { headline: "New Quantum Encryption standard is unhackable", verdict: 'TRUE', source: "Quant-Tech" }
];

const SEED_TRENDING: FactCheckResult[] = [
  {
    id: 'seed-1',
    claim: "Massive Solar Flare will shut down the internet for 3 days.",
    headline: "Solar Flare Internet Blackout Claims",
    verdict: VerdictType.FALSE,
    confidenceLevel: ConfidenceLevel.FABRICATED,
    explanation: "While solar flares can affect satellites, no evidence suggests a total global 3-day blackout is imminent.",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    timestamp: Date.now() - 3600000,
    confidenceScore: 98,
    author: "Neural Node",
    communityPoll: { trueVotes: 5, falseVotes: 85, misleadingVotes: 10, total: 100 },
    reasoningTimeline: [],
    sources: []
  },
  {
    id: 'seed-2',
    claim: "New AI model can predict stock market with 99% accuracy.",
    headline: "AI Market Prediction Claims",
    verdict: VerdictType.MISLEADING,
    confidenceLevel: ConfidenceLevel.UNVERIFIED,
    explanation: "The model is currently in closed testing and has not been peer-reviewed for public claims.",
    imageUrl: "https://images.unsplash.com/photo-1518186239717-2e9c133c392a?auto=format&fit=crop&q=80&w=800",
    timestamp: Date.now() - 7200000,
    confidenceScore: 65,
    author: "Forensic Node",
    communityPoll: { trueVotes: 30, falseVotes: 20, misleadingVotes: 50, total: 100 },
    reasoningTimeline: [],
    sources: []
  }
];

const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        localStorage.clear();
      }
    }
  }
};

export const db = {
  users: {
    all: () => storage.get<User[]>(STORES.USER_DATA, []),
    save: (user: User) => {
      const users = db.users.all();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx > -1) users[idx] = user;
      else users.push(user);
      storage.set(STORES.USER_DATA, users);
    },
    findByEmail: (email: string) => db.users.all().find(u => u.email.toLowerCase() === email.trim().toLowerCase()),
    delete: (id: string) => storage.set(STORES.USER_DATA, db.users.all().filter(u => u.id !== id)),
    getLeaderboard: () => [...db.users.all()].sort((a, b) => b.stats.points - a.stats.points).slice(0, 100)
  },
  content: {
    getFeed: () => storage.get<FactCheckResult[]>(STORES.FEED_DATA, []),
    saveCheck: (check: FactCheckResult) => {
      const feed = db.content.getFeed();
      storage.set(STORES.FEED_DATA, [check, ...feed].slice(0, 25));
    },
    getTrending: (lang: string = 'en') => {
      const cached = storage.get<FactCheckResult[]>(`${STORES.TRENDING_CACHE}_${lang}`, []);
      return cached.length > 0 ? cached : SEED_TRENDING;
    },
    saveTrending: (data: FactCheckResult[], lang: string = 'en') => {
      storage.set(`${STORES.TRENDING_CACHE}_${lang}`, data);
      storage.set(`${STORES.META}_${lang}`, { lastFetch: Date.now() });
    },
    updateVote: (id: string, option: keyof FactCheckResult['communityPoll'], weight: number = 1.0) => {
        const feed = storage.get<FactCheckResult[]>(STORES.FEED_DATA, []);
        const item = feed.find(i => i.id === id);
        if (item) {
          (item.communityPoll[option] as number) += weight;
          item.communityPoll.total += weight;
          storage.set(STORES.FEED_DATA, feed);
        }
    },
    // Fix: Added delete method to db.content to resolve missing property error in AuthContext.tsx
    delete: (id: string) => {
      const feed = db.content.getFeed();
      storage.set(STORES.FEED_DATA, feed.filter(c => c.id !== id));
    },
    isCacheStale: (lang: string = 'en') => {
      const meta = storage.get<{lastFetch?: number}>(`${STORES.META}_${lang}`, {});
      return !meta.lastFetch || (Date.now() - meta.lastFetch > CACHE_TTL);
    }
  },
  training: {
    getSet: () => storage.get<any[]>(STORES.TRAINING_SET, []),
    addExample: (result: FactCheckResult) => {
      const set = db.training.getSet();
      const example = { id: result.id, instruction: `Verify: "${result.claim}"`, response: { verdict: result.verdict, confidence: result.confidenceScore } };
      storage.set(STORES.TRAINING_SET, [...set, example].slice(-100));
    }
  },
  analytics: {
    getTicker: (lang: string = 'en') => {
      const cached = storage.get<TickerItem[]>(`${STORES.SYSTEM_TICKER}_${lang}`, []);
      return cached.length > 0 ? cached : SEED_TICKER;
    },
    saveTicker: (items: TickerItem[], lang: string = 'en') => storage.set(`${STORES.SYSTEM_TICKER}_${lang}`, items),
    getLogs: () => storage.get<Activity[]>(STORES.ACTIVITY_LOG, []),
    log: (userId: string, userName: string, action: string) => {
      const logs = db.analytics.getLogs();
      const entry: Activity = { id: `log-${Date.now()}`, userId, userName, action, timestamp: Date.now() };
      storage.set(STORES.ACTIVITY_LOG, [entry, ...logs].slice(0, 50));
    }
  }
};
