
export enum VerdictType {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  MISLEADING = 'MISLEADING',
  UNVERIFIED = 'UNVERIFIED'
}

export enum ConfidenceLevel {
  AUTHENTIC = 'AUTHENTIC',
  LIKELY_AUTHENTIC = 'LIKELY_AUTHENTIC',
  UNVERIFIED = 'UNVERIFIED',
  LIKELY_FABRICATED = 'LIKELY_FABRICATED',
  FABRICATED = 'FABRICATED'
}

export interface ReasoningStep {
  title: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'FAILED';
  description: string;
}

export interface Source {
  title: string;
  uri: string;
  trustScore?: number; // 0-100
  domainAge?: string;
  reliabilityBadge?: 'LEGACY' | 'VERIFIED' | 'SUSPICIOUS' | 'UNRANKED';
}

export interface PollStats {
  trueVotes: number;
  falseVotes: number;
  misleadingVotes: number;
  total: number;
  weightedConsensus?: number; // 0-100 adjusted for user credibility
}

export interface RiskIntelligence {
  marketImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  garmCategory: string;
  latencyMs: number;
  veracitySignal: number; // 0-100 for HFT
  viralityRisk: number; // 0-100
  viralityReasoning?: string;
}

export interface TickerItem {
  headline: string;
  verdict: 'TRUE' | 'FALSE';
  source: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: number;
}

export interface FactCheckResult {
  id: string;
  claim: string;
  verdict: VerdictType;
  confidenceLevel: ConfidenceLevel;
  explanation: string;
  headline?: string;
  keyPoints?: string[];
  reasoningTimeline: ReasoningStep[];
  sources: Source[];
  timestamp: number;
  imageUrl?: string;
  confidenceScore: number;
  communityPoll: PollStats;
  author: string;
  biasRating?: 'NEUTRAL' | 'LEAN_LEFT' | 'LEAN_RIGHT' | 'POLARIZING';
  analysisTime?: number;
  riskMetrics?: RiskIntelligence;
}

export interface UserStats {
  points: number;
  reportsFiled: number;
  accuracyRate: number;
  sensorUptime: number;
  credibilityWeight: number; // 0.1 to 5.0 base weight for voting
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  level: string;
  votes: Record<string, 'trueVotes' | 'falseVotes' | 'misleadingVotes'>;
  joinedAt: number;
  stats: UserStats;
  isAdmin?: boolean;
}
