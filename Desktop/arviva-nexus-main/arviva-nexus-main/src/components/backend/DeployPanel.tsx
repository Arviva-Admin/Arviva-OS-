import { motion } from 'framer-motion';
import { Rocket, Plus, Shield, CheckCircle2, AlertTriangle, Clock, Server, GitBranch, Package, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const guardrails = [
  { name: 'Shadow mode test completed', status: 'pass', required: true },
  { name: 'Eval score ≥ 85% threshold', status: 'pass', required: true },
  { name: 'Sentinel compliance check', status: 'pass', required: true },
  { name: 'Budget impact analysis', status: 'pass', required: true },
  { name: 'Rollback plan verified', status: 'pass', required: true },
  { name: 'Load test (1000 req/s)', status: 'pass', required: false },
];

const deployHistory = [
  { version: 'v2.1.0', time: '2h ago', status: 'success', changes: 'Scout-TH model upgrade', by: 'Arkitekten' },
  { version: 'v2.0.9', time: '6h ago', status: 'success', changes: 'Email template v3 rollout', by: 'Arkitekten' },
  { version: 'v2.0.8', time: '1d ago', status: 'rollback', changes: 'Creator prompt update (regression)', by: 'Arkitekten' },
  { version: 'v2.0.7', time: '2d ago', status: 'success', changes: 'Sentinel GDPR rule update', by: 'Manual' },
  { version: 'v2.0.6', time: '3d ago', status: 'success', changes: 'Router cost optimization', by: 'Arkitekten' },
];

const mcpResources = [
  { name: 'ClickBank API', type: 'Scraping', status: 'active', calls: '12.4K/d' },
  { name: 'Mautic SMTP', type: 'Email', status: 'active', calls: '5.2K/d' },
  { name: 'Reddit API', type: 'Scraping', status: 'active', calls: '8.1K/d' },
  { name: 'Groq LLM', type: 'AI', status: 'active', calls: '3.4K/d' },
  { name: 'Gemini 2.5', type: 'AI', status: 'active', calls: '1.2K/d' },
  { name: 'Bitwarden CLI', type: 'Security', status: 'active', calls: '0.1K/d' },
];

const DeployPanel = () => {
  const [resource, setResource] = useState('');
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Deploy & Infrastructure</h2>
            <p className="text-[10px] text-muted-foreground font-mono">Hetzner CX53 • Docker • Windmill Orchestrator</p>
          </div>
        </div>
      </div>

      {/* Deploy + Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="cyber-card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add MCP Resource / Deploy Agent
          </h3>
          <Input placeholder="Resource name..." value={resource} onChange={e => setResource(e.target.value)} className="bg-secondary/50 text-[11px] h-8" />
          <textarea placeholder="Configuration (JSON)..."
            className="w-full h-28 bg-secondary/50 border border-input rounded-lg px-3 py-2 text-[11px] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          <button onClick={() => setConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/80 transition-colors neon-glow-blue">
            <Rocket className="w-3.5 h-3.5" /> Deploy with Guardrails
          </button>
        </div>

        <div className="cyber-card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Deploy Guardrails
          </h3>
          <div className="space-y-1.5">
            {guardrails.map(g => (
              <div key={g.name} className={`flex items-center gap-2.5 py-2 px-3 rounded-lg border
                ${g.status === 'pass' ? 'bg-success/5 border-success/15' : 'bg-accent/5 border-accent/15'}`}>
                {g.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0" />}
                <span className="text-[11px] flex-1">{g.name}</span>
                {g.required && <span className="text-[8px] text-muted-foreground uppercase">Required</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="cyber-card p-4 border-primary/30 neon-glow-blue text-center space-y-3">
          <p className="text-sm font-bold">Confirm Deployment?</p>
          <p className="text-[11px] text-muted-foreground">All 6 guardrails passed. Resource will be deployed to production.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setConfirm(false)} className="px-5 py-2 rounded-lg bg-secondary text-[11px] hover:bg-secondary/80 transition-colors">Cancel</button>
            <button onClick={() => setConfirm(false)} className="px-5 py-2 rounded-lg bg-success text-success-foreground text-[11px] font-medium hover:bg-success/80 transition-colors neon-glow-green">
              Deploy Now
            </button>
          </div>
        </motion.div>
      )}

      {/* MCP Resources */}
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Package className="w-3.5 h-3.5" /> Connected Resources (MCP)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mcpResources.map(r => (
            <div key={r.name} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/30 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium truncate">{r.name}</p>
                <p className="text-[9px] text-muted-foreground">{r.type} • {r.calls}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy history */}
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5" /> Deployment History
        </h3>
        <div className="space-y-1.5">
          {deployHistory.map((d, i) => (
            <motion.div key={d.version} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg border-l-2 transition-colors
                ${d.status === 'rollback' ? 'border-accent/50 bg-accent/5' : 'border-success/50 hover:bg-secondary/30'}`}>
              {d.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" /> :
               <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0" />}
              <span className="text-[11px] font-mono font-bold text-primary w-14">{d.version}</span>
              <span className="text-[11px] flex-1">{d.changes}</span>
              <span className="text-[9px] text-muted-foreground">{d.by}</span>
              <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{d.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeployPanel;
