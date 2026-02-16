// Windmill Client - Central API client for all Windmill webhook interactions
// All outgoing requests to the Windmill orchestrator flow through this module

const WINDMILL_BASE = import.meta.env.VITE_WINDMILL_URL || '/api/windmill';
const WINDMILL_TOKEN = import.meta.env.VITE_WINDMILL_TOKEN || '';

export interface WindmillRequest {
  script_path: string;
  user_id?: string;
  params: Record<string, unknown>;
}

export interface WindmillResponse {
  ok: boolean;
  job_id?: string;
  data?: unknown;
  error?: string;
}

const buildHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(WINDMILL_TOKEN ? { Authorization: `Bearer ${WINDMILL_TOKEN}` } : {}),
});

export const windmillClient = {
  // Execute a Windmill script/flow
  execute: async (scriptPath: string, params: Record<string, unknown>, userId?: string): Promise<WindmillResponse> => {
    try {
      const res = await fetch(`${WINDMILL_BASE}/api/w/arviva/jobs/run_wait_result/p/${scriptPath}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ ...params, ...(userId ? { user_id: userId } : {}) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return { ok: true, data };
    } catch (e: any) {
      console.warn(`[WINDMILL] ${scriptPath} failed:`, e.message);
      return { ok: false, error: e.message };
    }
  },

  // Trigger a webhook endpoint
  webhook: async (endpoint: string, payload: Record<string, unknown>): Promise<WindmillResponse> => {
    try {
      const res = await fetch(`${WINDMILL_BASE}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { ok: true, data };
    } catch (e: any) {
      console.warn(`[WINDMILL] Webhook ${endpoint} failed:`, e.message);
      return { ok: false, error: e.message };
    }
  },

  // Get job status
  getJobStatus: async (jobId: string): Promise<WindmillResponse> => {
    try {
      const res = await fetch(`${WINDMILL_BASE}/api/w/arviva/jobs/get/${jobId}`, {
        headers: buildHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { ok: true, job_id: jobId, data };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  },
};

// Pre-mapped action handlers (used by UI buttons)
export const actions = {
  runAgent: (agentId: string) => windmillClient.execute('f/agents/run_agent', { agent_id: agentId }),
  scaleAgent: (agentId: string, replicas: number) => windmillClient.execute('f/agents/scale_agent', { agent_id: agentId, replicas }),
  analyzeProduct: (productName: string) => windmillClient.execute('f/analytics/analyze_product', { product: productName }),
  deployAgent: (agentId: string, env: string) => windmillClient.execute('f/infra/deploy_agent', { agent_id: agentId, environment: env }),
  runTests: (suiteId: string) => windmillClient.execute('f/testing/run_tests', { suite_id: suiteId }),
  sendCampaign: (campaignId: string) => windmillClient.execute('f/email_ops/send_campaign', { campaign_id: campaignId }),
  scanPains: (source: string) => windmillClient.execute('f/scouts/scan_pains', { source }),
  exportData: (format: string, dataset: string) => windmillClient.execute('f/data/export', { format, dataset }),
  syncGitHub: (repo: string) => windmillClient.execute('f/infra/sync_github', { repo }),
  runCompliance: (region: string) => windmillClient.execute('f/sentinel/check_compliance', { region }),
};
