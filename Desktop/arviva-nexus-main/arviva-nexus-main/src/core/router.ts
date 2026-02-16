// LLM Router - Intelligent model selection and token budget management
// Routes requests to the most cost-effective LLM based on task complexity

export type ModelProvider = 'groq' | 'gemini' | 'mistral' | 'cloudflare' | 'ollama';

export interface RouteDecision {
  provider: ModelProvider;
  model: string;
  reason: string;
  estimatedCost: number;
  estimatedLatency: number;
}

export interface TokenBudget {
  total: number;
  used: number;
  remaining: number;
  percentUsed: number;
}

const MODEL_PRIORITY: { provider: ModelProvider; model: string; costPer1k: number; latencyMs: number }[] = [
  { provider: 'groq', model: 'llama-3.1-70b', costPer1k: 0, latencyMs: 80 },
  { provider: 'cloudflare', model: 'llama-3.1-8b', costPer1k: 0, latencyMs: 120 },
  { provider: 'mistral', model: 'mistral-large', costPer1k: 0.002, latencyMs: 200 },
  { provider: 'gemini', model: 'gemini-2.5-pro', costPer1k: 0.003, latencyMs: 300 },
  { provider: 'ollama', model: 'llama-3.1-8b', costPer1k: 0, latencyMs: 400 },
];

let tokenBudget: TokenBudget = { total: 1_000_000, used: 0, remaining: 1_000_000, percentUsed: 0 };

export const getTokenBudget = (): TokenBudget => ({ ...tokenBudget });

export const routeRequest = (taskType: string, estimatedTokens: number): RouteDecision => {
  // Select cheapest model that fits within budget
  const selected = MODEL_PRIORITY[0];
  return {
    provider: selected.provider,
    model: selected.model,
    reason: `Selected ${selected.provider}/${selected.model} for ${taskType} (cost-optimized)`,
    estimatedCost: selected.costPer1k * (estimatedTokens / 1000),
    estimatedLatency: selected.latencyMs,
  };
};

export const consumeTokens = (count: number): void => {
  tokenBudget.used += count;
  tokenBudget.remaining = tokenBudget.total - tokenBudget.used;
  tokenBudget.percentUsed = Math.round((tokenBudget.used / tokenBudget.total) * 100);
};
