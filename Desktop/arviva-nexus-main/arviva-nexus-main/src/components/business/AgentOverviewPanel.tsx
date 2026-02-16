import { useState, useEffect } from 'react';
import { Bot, Cpu, Search, Mail, Globe, Terminal, TestTube, FlaskConical, Rocket, PenTool, Shield, Eye, Clock, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { actions } from '@/core/windmillClient';

type AgentStatus = 'online' | 'busy' | 'idle' | 'error';

interface Agent {
  id: string; name: string; role: string; domain: 'front' | 'backend'; icon: any;
  status: AgentStatus; cpu: number; tasksCompleted: number; tasksQueue: number;
  uptime: string; lastAction: string; description: string; version: string;
}

const thoughtTemplates = [
  'Evaluating keyword density for "VPN Thailand"...',
  'Cross-referencing G2 reviews with Reddit signals...',
  'Optimizing email subject line variants...',
  'Scanning ClickBank gravity trends...',
  'Running sentiment analysis on 42 threads...',
  'Comparing A/B test results: +18% CTR...',
  'Validating compliance for EU campaign...',
  'Queuing next batch of 1,200 emails...',
];

const agents: Agent[] = [
  { id: 'arb-scout', name: 'Arbitrage Scout', role: 'Product Discovery', domain: 'front', icon: Search, status: 'online', cpu: 34, tasksCompleted: 1247, tasksQueue: 12, uptime: '72h 14m', lastAction: 'Scanned ClickBank top 50', description: 'Skannar affiliate-nätverk för höggravitets-produkter.', version: 'v2.1.3' },
  { id: 'pain-miner', name: 'Pain Miner', role: 'Problem Detection', domain: 'front', icon: Search, status: 'online', cpu: 52, tasksCompleted: 892, tasksQueue: 8, uptime: '72h 14m', lastAction: 'Analyzed Reddit r/entrepreneur', description: 'Djupanalyserar Reddit, Twitter och forum.', version: 'v1.8.0' },
  { id: 'email-ops', name: 'Email Operator', role: 'Campaign Execution', domain: 'front', icon: Mail, status: 'busy', cpu: 78, tasksCompleted: 3421, tasksQueue: 45, uptime: '72h 14m', lastAction: 'Sending batch #847', description: 'Hanterar e-postkampanjer och warmup.', version: 'v3.0.1' },
  { id: 'global-matrix', name: 'Global Matrix', role: 'Geo Intelligence', domain: 'front', icon: Globe, status: 'online', cpu: 21, tasksCompleted: 456, tasksQueue: 3, uptime: '72h 14m', lastAction: 'Updated EU market data', description: 'Spårar marknadsförhållanden globalt.', version: 'v1.4.2' },
  { id: 'content-gen', name: 'Content Generator', role: 'AI Copywriting', domain: 'front', icon: PenTool, status: 'busy', cpu: 89, tasksCompleted: 2156, tasksQueue: 23, uptime: '72h 14m', lastAction: 'Generating landing page copy', description: 'Skapar landningssidor och e-postkopior.', version: 'v2.5.0' },
  { id: 'windmill-logger', name: 'Windmill Logger', role: 'System Telemetry', domain: 'front', icon: Terminal, status: 'online', cpu: 15, tasksCompleted: 12890, tasksQueue: 0, uptime: '72h 14m', lastAction: 'Streaming logs', description: 'Samlar loggar från alla workflows.', version: 'v1.2.0' },
  { id: 'agent-builder', name: 'Agent Builder', role: 'Agent Factory', domain: 'backend', icon: Cpu, status: 'idle', cpu: 5, tasksCompleted: 34, tasksQueue: 0, uptime: '72h 14m', lastAction: 'Built Pain Miner v1.8.0', description: 'Skapar och deployer nya AI-agenter.', version: 'v1.1.0' },
  { id: 'test-runner', name: 'Test Runner', role: 'Quality Assurance', domain: 'backend', icon: TestTube, status: 'online', cpu: 41, tasksCompleted: 567, tasksQueue: 6, uptime: '72h 14m', lastAction: 'Running E2E suite #124', description: 'Kör tester för alla agenter.', version: 'v2.0.0' },
  { id: 'eval-metrics', name: 'Eval Engine', role: 'Performance Analysis', domain: 'backend', icon: FlaskConical, status: 'online', cpu: 28, tasksCompleted: 234, tasksQueue: 2, uptime: '72h 14m', lastAction: 'Comparing staging vs prod', description: 'Mäter agentprestanda.', version: 'v1.6.0' },
  { id: 'deployer', name: 'Deploy Agent', role: 'CI/CD Pipeline', domain: 'backend', icon: Rocket, status: 'idle', cpu: 3, tasksCompleted: 89, tasksQueue: 0, uptime: '72h 14m', lastAction: 'Deployed Email Ops v3.0.1', description: 'Hanterar deploy-pipeline.', version: 'v1.3.0' },
  { id: 'architect', name: 'Master Architect', role: 'System Orchestration', domain: 'backend', icon: Eye, status: 'online', cpu: 62, tasksCompleted: 4521, tasksQueue: 7, uptime: '72h 14m', lastAction: 'Orchestrating 6 sub-agents', description: 'Koordinerar alla andra agenter.', version: 'v4.0.0' },
  { id: 'security', name: 'Security Guard', role: 'Threat Detection', domain: 'backend', icon: Shield, status: 'online', cpu: 18, tasksCompleted: 678, tasksQueue: 1, uptime: '72h 14m', lastAction: 'Blocked suspicious IP', description: 'Övervakar API-anrop och blockerar hot.', version: 'v1.9.5' },
];

const statusStyle: Record<AgentStatus, { color: string; bg: string; border: string; label: string }> = {
  online: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', label: 'ONLINE' },
  busy: { color: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/20', label: 'BUSY' },
  idle: { color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', label: 'IDLE' },
  error: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', label: 'ERROR' },
};

const AgentOverviewPanel = () => {
  const [filter, setFilter] = useState<'all' | 'front' | 'backend'>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<Record<string, string>>({});

  // Simulate thought streams
  useEffect(() => {
    const t = setInterval(() => {
      const activeAgents = agents.filter(a => a.status === 'online' || a.status === 'busy');
      const updates: Record<string, string> = {};
      activeAgents.forEach(a => {
        updates[a.id] = thoughtTemplates[Math.floor(Math.random() * thoughtTemplates.length)];
      });
      setThoughts(updates);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const filtered = agents
    .filter(a => filter === 'all' || a.domain === filter)
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()));

  const online = agents.filter(a => a.status === 'online').length;
  const busy = agents.filter(a => a.status === 'busy').length;
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgCpu = Math.round(agents.reduce((s, a) => s + a.cpu, 0) / agents.length);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Agents</span>
          <p className="text-xl font-bold font-mono mt-0.5">{agents.length}</p>
          <span className="text-[9px] text-muted-foreground font-mono">{agents.filter(a => a.domain === 'front').length}F · {agents.filter(a => a.domain === 'backend').length}B</span>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Online</span>
          <p className="text-xl font-bold font-mono text-success mt-0.5">{online}</p>
          <span className="text-[9px] text-warn font-mono">{busy} busy</span>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Tasks Done</span>
          <p className="text-xl font-bold font-mono mt-0.5">{totalTasks.toLocaleString()}</p>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Avg CPU</span>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xl font-bold font-mono">{avgCpu}%</p>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${avgCpu}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(['all', 'front', 'backend'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}>
              {f === 'all' ? `All (${agents.length})` : f === 'front' ? `Front (${agents.filter(a => a.domain === 'front').length})` : `Backend (${agents.filter(a => a.domain === 'backend').length})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-6 h-6 text-[10px] bg-secondary w-40 rounded-lg border-border font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(agent => {
          const Icon = agent.icon;
          const st = statusStyle[agent.status];
          const isExpanded = expandedId === agent.id;
          const thought = thoughts[agent.id];

          return (
            <div key={agent.id}
              className={`cyber-card p-3 cursor-pointer ${isExpanded ? 'sm:col-span-2 lg:col-span-2 border-primary/30' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : agent.id)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${st.bg} border ${st.border}`}>
                    <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold font-mono">{agent.name}</h4>
                    <p className="text-[8px] text-muted-foreground font-mono">{agent.role} · {agent.version}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase ${st.bg} ${st.color} border ${st.border}`}>
                  <span className={`w-1 h-1 rounded-full ${agent.status === 'online' ? 'bg-success' : agent.status === 'busy' ? 'bg-warn' : agent.status === 'error' ? 'bg-accent' : 'bg-muted-foreground'}`} />
                  {st.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-1.5 text-[9px] font-mono">
                <div>
                  <span className="text-[7px] uppercase text-muted-foreground block">CPU</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{agent.cpu}%</span>
                    <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${agent.cpu}%`, background: agent.cpu > 70 ? 'hsl(345 100% 56%)' : 'hsl(200 100% 50%)' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[7px] uppercase text-muted-foreground block">Done</span>
                  <span className="font-bold">{agent.tasksCompleted.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[7px] uppercase text-muted-foreground block">Queue</span>
                  <span className={`font-bold ${agent.tasksQueue > 10 ? 'text-accent' : ''}`}>{agent.tasksQueue}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[8px] text-muted-foreground font-mono mb-1">
                <Clock className="w-2.5 h-2.5" />
                {agent.lastAction}
              </div>

              {/* Thought Stream */}
              {thought && (agent.status === 'online' || agent.status === 'busy') && (
                <div className="mt-1 pt-1 border-t border-border/30">
                  <div className="flex items-center gap-1 text-[8px] font-mono text-primary/60">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <span className="truncate italic">{thought}</span>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-border space-y-2">
                  <p className="text-[10px] text-foreground/80 leading-relaxed">{agent.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary rounded-lg p-2">
                      <span className="text-[7px] uppercase text-muted-foreground font-mono block">Uptime</span>
                      <span className="text-[10px] font-mono font-bold text-success">{agent.uptime}</span>
                    </div>
                    <div className="bg-secondary rounded-lg p-2">
                      <span className="text-[7px] uppercase text-muted-foreground font-mono block">Domain</span>
                      <span className="text-[10px] font-mono font-bold text-primary">{agent.domain.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); actions.runAgent(agent.id); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono font-bold bg-primary text-primary-foreground">
                      <Play className="w-2.5 h-2.5" /> Run
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); actions.scaleAgent(agent.id, 2); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono font-bold bg-secondary text-foreground border border-border/50">
                      Scale
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentOverviewPanel;
