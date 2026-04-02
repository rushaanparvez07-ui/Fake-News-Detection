
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { FactCheckResult, VerdictType, Source, TickerItem, RiskIntelligence, ConfidenceLevel, ReasoningStep } from "../types";
import { db } from "./db";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const normalizeConfidenceLevel = (score: number, verdict: VerdictType): ConfidenceLevel => {
  if (verdict === VerdictType.TRUE) return score > 85 ? ConfidenceLevel.AUTHENTIC : ConfidenceLevel.LIKELY_AUTHENTIC;
  if (verdict === VerdictType.FALSE) return score > 85 ? ConfidenceLevel.FABRICATED : ConfidenceLevel.LIKELY_FABRICATED;
  return ConfidenceLevel.UNVERIFIED;
};

const normalizeVerdict = (verdict: string): VerdictType => {
  const v = (verdict || "").toUpperCase().trim();
  if (v.includes("TRUE") || v.includes("AUTHENTIC")) return VerdictType.TRUE;
  if (v.includes("FALSE") || v.includes("FAKE")) return VerdictType.FALSE;
  if (v.includes("MISLEADING") || v.includes("CONTEXT")) return VerdictType.MISLEADING;
  return VerdictType.UNVERIFIED;
};

// High-fidelity Futuristic Imagery Engine
const getFuturisticImage = (keyword: string) => {
  const base = "https://images.unsplash.com/photo-";
  const ids: Record<string, string> = {
    tech: "1518770660439-4636190af475",
    politics: "1529107386315-e1a2ed48a620",
    health: "1505751172876-fa1923c5c528",
    global: "1451187580459-43490279c0fa",
    space: "1446776811953-b23d57bd21aa",
    money: "1518186239717-2e9c133c392a",
    science: "1532094349884-543bc11b234d",
    nature: "1470071459604-3b5ec3a7fe05"
  };
  const key = keyword.toLowerCase().trim();
  const id = ids[key] || ids.global;
  return `${base}${id}?auto=format&fit=crop&q=80&w=800`;
};

export const fetchRealTopNews = async (langCode: string, langName: string): Promise<TickerItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: `Headlines in ${langName}. Return 8 items. Format: JSON array with headline, verdict (TRUE/FALSE), and source.` }] }],
            config: { 
              tools: [{ googleSearch: {} }], 
              temperature: 0,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    verdict: { type: Type.STRING },
                    source: { type: Type.STRING }
                  },
                  required: ["headline", "verdict", "source"]
                }
              }
            }
        });
        const data = JSON.parse(response.text || "[]");
        const items = data.map((item: any) => ({
            headline: item.headline,
            verdict: normalizeVerdict(item.verdict) === VerdictType.TRUE ? 'TRUE' : 'FALSE',
            source: item.source
        }));
        if (items.length) db.analytics.saveTicker(items, langCode);
        return items;
    } catch (e) { return []; }
};

export const analyzeClaim = async (text: string, langName: string, imageBase64?: string): Promise<FactCheckResult> => {
  const parts: any[] = imageBase64 ? [{ inlineData: { data: imageBase64, mimeType: "image/jpeg" } }, { text }] : [{ text }];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts }],
      config: {
        systemInstruction: "Strict News Auditor. Output JSON. Verity diversity required.",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            imgCategory: { type: Type.STRING }
          },
          required: ["verdict", "headline", "summary", "confidenceScore", "reasoning", "imgCategory"]
        }
      }
    });
    const json = JSON.parse(response.text || "{}");
    const v = normalizeVerdict(json.verdict);
    return {
      id: `audit-${Date.now()}`,
      claim: text,
      verdict: v,
      confidenceLevel: normalizeConfidenceLevel(json.confidenceScore, v),
      explanation: json.summary,
      headline: json.headline,
      reasoningTimeline: json.reasoning.map((r: string) => ({ title: "FactPulse Node", description: r, status: 'COMPLETE' })),
      sources: [],
      timestamp: Date.now(),
      confidenceScore: json.confidenceScore,
      imageUrl: getFuturisticImage(json.imgCategory),
      communityPoll: { trueVotes: 0, falseVotes: 0, misleadingVotes: 0, total: 0 },
      author: "Forensic Agent"
    };
  } catch (error) { throw error; }
};

export const fetchTrendingDebunks = async (langCode: string, langName: string): Promise<FactCheckResult[]> => {
    try {
       const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `List 5 diverse viral news claims in ${langName}. MUST include 2 TRUE, 2 FALSE, and 1 MISLEADING.` }] }],
        config: { 
          tools: [{ googleSearch: {} }], 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                verdict: { type: Type.STRING },
                category: { type: Type.STRING, description: "tech, science, global, politics, space, money, health, nature" }
              },
              required: ["headline", "summary", "verdict", "category"]
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      const results: FactCheckResult[] = data.map((item: any, i: number) => ({
          id: `trend-${langCode}-${i}-${Date.now()}`,
          claim: item.headline,
          verdict: normalizeVerdict(item.verdict),
          confidenceLevel: normalizeConfidenceLevel(85, normalizeVerdict(item.verdict)),
          explanation: item.summary,
          headline: item.headline,
          reasoningTimeline: [],
          sources: [],
          timestamp: Date.now() - (i * 3600000),
          imageUrl: getFuturisticImage(item.category),
          confidenceScore: 85,
          communityPoll: { trueVotes: Math.floor(Math.random()*30), falseVotes: Math.floor(Math.random()*30), misleadingVotes: Math.floor(Math.random()*30), total: 100 },
          author: "Truth Engine"
      }));
      if (results.length) db.content.saveTrending(results, langCode);
      return results;
    } catch (e) { return []; }
};
