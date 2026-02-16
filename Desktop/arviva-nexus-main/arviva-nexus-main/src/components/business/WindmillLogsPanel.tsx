import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, Filter, Pause, Play, Trash2, Download } from 'lucide-react';

const logTemplates = [
  { level: 'info', msgs: [
    'Scout-TH: 12 new trending products detected in Thai market',
    'Arbitrageur: Matched "AI Writer Pro" → ClickBank offer #4821',
    'Creator: Generated 3 email sequences for VPN campaign',
    'Mautic: IP 185.x.x.12 warmup complete — ready for production',
    'Router: Switched model Groq → Mistral for cost optimization',
    'Scout: New pain point detected on Reddit r/SaaS',
    'Arbitrageur: LTV analysis complete — 3 products above threshold',
    'Creator: Content batch #47 queued for review',
    'Mautic: Campaign "EU_VPN_Q1" open rate at 41.2%',
    'Router: Token budget at 78% — switching to free models',
    'Optimizer: A/B test concluded — variant B +12% CTR',
    'Sentinel-US: Compliance check passed for landing page v3',
  ]},
  { level: 'warn', msgs: [
    'Sentinel-DE: GDPR compliance flag on landing page variant B',
    'Router: Groq rate limit approaching — 80% capacity',
    'Mautic: IP 185.x.x.14 bounce rate elevated — 1.8%',
    'Scout-EU: CNIL cookie consent rule change detected',
  ]},
  { level: 'error', msgs: [
    'Playwright: Scraping timeout on competitor pricing page',
    'Mautic: SMTP connection failed to relay-3 — retrying',
  ]},
];

interface LogEntry {
  id: number; ts: string; level: string; msg: string;
}

const WindmillLogsPanel = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const addLog = () => {
    const r = Math.random();
    const template = r > 0.9 ? logTemplates[2] : r > 0.75 ? logTemplates[1] : logTemplates[0];
    const msg = template.msgs[Math.floor(Math.random() * template.msgs.length)];
    const entry: LogEntry = {
      id: idRef.current++,
      ts: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as any),
      level: template.level,
      msg,
    };
    setLogs(prev => [entry, ...prev].slice(0, 100));
  };

  useEffect(() => {
    // Initial burst
    for (let i = 0; i < 15; i++) addLog();
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(addLog, 1500 + Math.random() * 2000);
    return () => clearInterval(t);
  }, [paused]);

  const filtered = logs.filter(l => levelFilter === 'all' || l.level === levelFilter);
  const counts = { info: logs.filter(l => l.level === 'info').length, warn: logs.filter(l => l.level === 'warn').length, error: logs.filter(l => l.level === 'error').length };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Windmill Orchestration Logs</h2>
            <p className="text-[10px] text-muted-foreground font-mono">{logs.length} entries • Streaming</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${paused ? 'text-muted-foreground' : 'text-success animate-pulse'}`} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-muted-foreground" />
          {(['all', 'info', 'warn', 'error'] as const).map(l => (
            <button key={l} onClick={() => setLevelFilter(l)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors flex items-center gap-1
                ${levelFilter === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
              {l.toUpperCase()}
              {l !== 'all' && <span className="text-[8px] opacity-70">{counts[l as keyof typeof counts]}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPaused(!paused)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={() => setLogs([])}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Trash2 className="w-3 h-3" /> Clear
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="cyber-card p-2 font-mono text-[11px] max-h-[600px] overflow-y-auto space-y-0">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs">No logs matching filter</div>
        )}
        {filtered.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex gap-2 py-1 px-2 rounded hover:bg-secondary/30 border-l-2 transition-colors
              ${log.level === 'error' ? 'border-destructive/50 bg-destructive/5' :
                log.level === 'warn' ? 'border-accent/50 bg-accent/5' :
                'border-transparent'}`}
          >
            <span className="text-muted-foreground/60 flex-shrink-0 w-[85px]">{log.ts}</span>
            <span className={`w-[42px] text-right flex-shrink-0 font-bold uppercase
              ${log.level === 'error' ? 'text-destructive' : log.level === 'warn' ? 'text-accent' : 'text-success'}`}>
              {log.level}
            </span>
            <span className="text-foreground/80 break-all">{log.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WindmillLogsPanel;
