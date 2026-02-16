import { useState, useEffect, useRef, useCallback } from 'react';
import { Monitor, Send, Bot, Eye, EyeOff, Power, Terminal, Wifi, WifiOff, Zap, X, Maximize2, Minimize2, Command } from 'lucide-react';
import { actions } from '@/core/windmillClient';
import FloatingNexus from '@/components/FloatingNexus';

const logTemplates = [
  '[SCOUT-TH] Scanning reddit.com/r/Thailand — 3 new threads detected',
  '[ARBITRAGEUR] Matched product "VPN Pro" with pain "connection drops" (score: 0.94)',
  '[CREATOR] Email sequence #412 generated — 3 variants queued for A/B test',
  '[SENTINEL-EU] GDPR compliance check PASSED for campaign EU_VPN_Q1',
  '[ROUTER] Token budget: 67% remaining — staying on Groq (free tier)',
  '[OPTIMIZER] A/B test concluded: Variant B +18% CTR — promoting to production',
  '[MAUTIC] IP 185.x.x.12 warmup: 92% complete — reputation score: 98',
  '[SCOUT-US] New trending product detected: "AI Meeting Notes" (gravity: 64)',
  '[WINDMILL] Flow exec #8847 completed in 2.3s — all steps passed',
  '[ARCHITECT] Meta-task processed: "optimize Thailand pipeline" — dispatched to 3 agents',
];

const actionFeed = [
  { text: 'Deployed Agent Scout-TH v2.1.4', ts: '10:04:32' },
  { text: 'Synced GitHub repo arviva/core', ts: '10:05:01' },
  { text: 'Executed Python analytics script', ts: '10:06:14' },
  { text: 'Updated Supabase record #8847', ts: '10:07:22' },
  { text: 'Scaled Email Ops to 3 workers', ts: '10:08:45' },
  { text: 'Ran compliance check EU region', ts: '10:09:11' },
  { text: 'Optimized prompt for Scout-JP', ts: '10:10:33' },
  { text: 'Processed 12 meta_tasks', ts: '10:11:56' },
  { text: 'Rotated API keys in Vault', ts: '10:12:44' },
  { text: 'Triggered A/B test batch #412', ts: '10:13:22' },
];

interface ChatMsg { id: number; from: 'user' | 'architect'; text: string; ts: string; }

const getLogTag = (log: string) => {
  if (log.includes('ERROR') || log.includes('FAIL') || log.includes('failed')) return { tag: 'ERR', cls: 'text-accent' };
  if (log.includes('PASSED') || log.includes('completed') || log.includes('promoting')) return { tag: 'OK', cls: 'text-success' };
  if (log.includes('WARNING') || log.includes('flag') || log.includes('warmup')) return { tag: 'WARN', cls: 'text-primary' };
  return { tag: 'INFO', cls: 'text-info' };
};

const ArchitectPanel = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { id: 1, from: 'architect', text: 'Arkitekten online. Alla squads operativa. Väntar på instruktioner.', ts: new Date().toLocaleTimeString('sv-SE') },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isVisionLive, setIsVisionLive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showLogs, setShowLogs] = useState(true);
  const [commandInput, setCommandInput] = useState('');
  const [showCommand, setShowCommand] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const cmdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial = Array.from({ length: 10 }, () =>
      `[${new Date().toLocaleTimeString('sv-SE')}] ${logTemplates[Math.floor(Math.random() * logTemplates.length)]}`
    );
    setLogs(initial);
    const interval = setInterval(() => {
      const msg = `[${new Date().toLocaleTimeString('sv-SE')}] ${logTemplates[Math.floor(Math.random() * logTemplates.length)]}`;
      setLogs(prev => [...prev.slice(-100), msg]);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isFullscreen) {
          setShowChat(p => !p);
          setShowLogs(p => !p);
        } else {
          setShowCommand(p => !p);
          setTimeout(() => cmdRef.current?.focus(), 50);
        }
      }
      if (e.key === 'Escape') { setShowCommand(false); if (isFullscreen) setIsFullscreen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  const sendChat = (text?: string) => {
    const msg = text || chatInput;
    if (!msg.trim()) return;
    setChatMsgs(prev => [...prev, { id: Date.now(), from: 'user', text: msg, ts: new Date().toLocaleTimeString('sv-SE') }]);
    setChatInput('');
    setCommandInput('');
    setShowCommand(false);
    setTimeout(() => {
      const responses = [
        'Mottaget. Dispatchar meta_task med HIGHEST priority. 3 agenter tilldelade.',
        'Analyserar visuell kontext... Windmill-dashboard med 12 aktiva flows. Optimerar.',
        'Roger. Shadow Mode aktiverad på Agent Scout-JP. Resultat om 30s.',
        'Compliance-varning noterad. Sentinel-EU uppdaterar templates automatiskt.',
      ];
      setChatMsgs(prev => [...prev, { id: Date.now() + 1, from: 'architect', text: responses[Math.floor(Math.random() * responses.length)], ts: new Date().toLocaleTimeString('sv-SE') }]);
    }, 1500);
  };

  const VisionContent = () => (
    <div className="absolute inset-0 p-4 font-mono text-[10px] leading-relaxed text-muted-foreground overflow-hidden">
      <div className="mb-2 text-xs font-bold text-primary">arviva@hetzner-cx53:~$ htop</div>
      <div className="grid grid-cols-2 gap-x-6 text-[9px]">
        <div>
          <div className="text-foreground/40 mb-1">┌─ PROCESSES ──────────────────────────┐</div>
          <div>│ windmill-worker    CPU: 12% MEM: 340M │</div>
          <div>│ mautic-php         CPU:  8% MEM: 280M │</div>
          <div>│ playwright-runner   CPU: 15% MEM: 520M │</div>
          <div>│ supabase-realtime  CPU:  3% MEM: 180M │</div>
          <div>│ docker-proxy       CPU:  1% MEM:  90M │</div>
          <div>│ nginx              CPU:  0% MEM:  45M │</div>
          <div>│ kasmvnc-server     CPU:  5% MEM: 210M │</div>
          <div className="text-foreground/40">└──────────────────────────────────────┘</div>
        </div>
        <div>
          <div className="text-foreground/40 mb-1">┌─ DOCKER CONTAINERS ───────────────────┐</div>
          <div className="text-success">│ ✓ windmill         UP 14d 3h         │</div>
          <div className="text-success">│ ✓ mautic           UP 14d 3h         │</div>
          <div className="text-success">│ ✓ supabase         UP 14d 3h         │</div>
          <div className="text-success">│ ✓ playwright       UP 14d 3h         │</div>
          <div className="text-success">│ ✓ kasmvnc          UP  2d 8h         │</div>
          <div className="text-primary">│ ◉ ollama           UP  5h (idle)     │</div>
          <div className="text-foreground/40">└──────────────────────────────────────┘</div>
        </div>
      </div>
      <div className="mt-3 text-xs font-bold text-primary">arviva@hetzner-cx53:~$ windmill status</div>
      <div className="mt-1"><span className="text-success">●</span> Orchestrator: RUNNING | Flows: 847 completed | Queue: 3 | Workers: 4/4</div>
      <div className="mt-3 text-xs font-bold text-primary">arviva@hetzner-cx53:~$ <span className="animate-pulse">_</span></div>
    </div>
  );

  const ChatPanel = ({ overlay = false }: { overlay?: boolean }) => (
    <div className={`flex flex-col ${overlay ? 'rounded-xl overflow-hidden glass-float' : 'bg-card/90 backdrop-blur-xl'}`}
      style={overlay ? { opacity: 0.92 } : {}}>
      <div className="px-3 py-2 border-b border-primary/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-primary" />
          <div>
            <p className="text-[10px] font-bold text-primary font-mono">Neural Command</p>
            <p className="text-[7px] font-mono text-muted-foreground">MASTER ROUTER</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {overlay && <button onClick={() => setShowChat(false)}><X className="w-3 h-3 text-muted-foreground" /></button>}
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      <div className="px-3 py-1 flex items-center gap-3 border-b border-primary/5 flex-shrink-0">
        {[
          { name: 'Scouts', count: 48, ok: true },
          { name: 'Arbs', count: 35, ok: true },
          { name: 'Creators', count: 52, ok: true },
          { name: 'Sentinels', count: 30, ok: false },
        ].map(sq => (
          <span key={sq.name} className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground">
            <span className={`w-1 h-1 rounded-full ${sq.ok ? 'bg-success' : 'bg-accent animate-pulse'}`} />
            {sq.name} <span className="text-foreground/30">{sq.count}</span>
          </span>
        ))}
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {chatMsgs.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-[10px] leading-relaxed ${
              msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'glass-panel text-foreground'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[7px] mt-1 ${msg.from === 'user' ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>{msg.ts}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-primary/10 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            placeholder="Kommando..."
            className="flex-1 bg-secondary border border-primary/10 rounded-lg px-3 py-1.5 text-[10px] font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30" />
          <button onClick={() => sendChat()} className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary text-primary-foreground" style={{ borderRadius: 8 }}>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  // FULLSCREEN MODE
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-20" style={{ background: '#050505' }}>
        {isVisionLive ? <VisionContent /> : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <EyeOff className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-xs text-muted-foreground font-mono">Vision feed disconnected</p>
            <button onClick={() => setIsVisionLive(true)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-mono font-bold" style={{ borderRadius: 8 }}>Reconnect</button>
          </div>
        )}

        <button onClick={() => setIsFullscreen(false)}
          className="absolute top-3 right-3 z-50 p-2 rounded-lg glass-float text-muted-foreground hover:text-foreground transition-colors" style={{ borderRadius: 8 }}>
          <Minimize2 className="w-4 h-4" />
        </button>

        {showChat && (
          <div className="absolute top-2 right-14 bottom-14 w-[320px] z-40 flex flex-col">
            <ChatPanel overlay />
          </div>
        )}

        {showLogs && (
          <div className="absolute bottom-2 left-2 right-[340px] z-40 rounded-xl overflow-hidden glass-float" style={{ opacity: 0.85, maxHeight: '140px', borderRadius: 8 }}>
            <div className="px-3 py-1 border-b border-primary/10 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-muted-foreground flex items-center gap-1.5">
                <Terminal className="w-3 h-3" /> ACTIVITY LOG
              </span>
              <button onClick={() => setShowLogs(false)}><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
            </div>
            <div className="p-2 overflow-y-auto font-mono text-[9px] space-y-px" style={{ maxHeight: '100px' }}>
              {logs.slice(-8).map((log, i) => {
                const { tag, cls } = getLogTag(log);
                return (
                  <div key={i} className="flex items-center gap-2 px-1.5 py-0.5">
                    <span className={`text-[7px] font-bold w-7 text-center ${cls}`}>{tag}</span>
                    <span className="text-foreground/60">{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 text-[8px] font-mono text-muted-foreground/40">
          ⌘K toggle overlays · ESC exit
        </div>

        <FloatingNexus />
      </div>
    );
  }

  // DEFAULT SPLIT VIEW
  return (
    <div className="fixed inset-0 top-10 bottom-0 z-20 grid" style={{ background: '#050505', gridTemplateColumns: '1fr 25%', minWidth: 0 }}>
      {/* LEFT: Vision Feed (75%) */}
      <div className="flex flex-col border-r border-primary/10 overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/10 bg-card/80 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold font-mono text-primary">LIVE VISION</span>
            <span className="text-[9px] font-mono text-muted-foreground">|</span>
            {isVisionLive ? (
              <span className="flex items-center gap-1 text-[9px] font-mono text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> CONNECTED
              </span>
            ) : (
              <span className="text-[9px] font-mono text-accent">OFFLINE</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsVisionLive(!isVisionLive)} className="p-1 rounded-lg hover:bg-secondary transition-colors" style={{ borderRadius: 8 }}>
              {isVisionLive ? <Wifi className="w-3 h-3 text-success" /> : <WifiOff className="w-3 h-3 text-accent" />}
            </button>
            <button onClick={() => actions.runAgent('architect')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold text-primary hover:bg-secondary transition-colors border border-primary/10" style={{ borderRadius: 8 }}>
              <Zap className="w-2.5 h-2.5" /> OVERRIDE
            </button>
            <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold text-accent hover:bg-secondary transition-colors border border-primary/10" style={{ borderRadius: 8 }}>
              <Power className="w-2.5 h-2.5" /> KILL
            </button>
            <button onClick={() => setIsFullscreen(true)} className="p-1 rounded-lg hover:bg-secondary transition-colors" title="Fullscreen" style={{ borderRadius: 8 }}>
              <Maximize2 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {isVisionLive ? <VisionContent /> : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <EyeOff className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-xs text-muted-foreground font-mono">Vision feed disconnected</p>
              <button onClick={() => setIsVisionLive(true)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-mono font-bold" style={{ borderRadius: 8 }}>Reconnect</button>
            </div>
          )}
        </div>

        {/* Event Ticker — last 10 actions scrolling */}
        <div className="border-t border-primary/10 bg-card/80 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 overflow-hidden">
            <Terminal className="w-3 h-3 text-primary flex-shrink-0" />
            <div className="flex-1 overflow-x-auto flex items-center gap-4 scrollbar-hide">
              {actionFeed.map((a, i) => (
                <span key={i} className="flex-shrink-0 text-[9px] font-mono text-muted-foreground whitespace-nowrap">
                  <span className="text-primary/60">{a.ts}</span> {a.text}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-primary/5">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[9px] font-mono font-bold text-muted-foreground">ACTIVITY LOG ({logs.length})</span>
            </div>
            <div className="h-[100px] overflow-y-auto px-2 pb-2 font-mono text-[9px] space-y-px">
              {logs.map((log, i) => {
                const { tag, cls } = getLogTag(log);
                return (
                  <div key={i} className="flex items-center gap-2 px-1.5 py-0.5 rounded hover:bg-secondary/30" style={{ borderRadius: 4 }}>
                    <span className={`text-[7px] font-bold w-7 text-center ${cls}`}>{tag}</span>
                    <span className="text-foreground/60">{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Neural Command Chat — fixed 25%, never collapses */}
      <div className="flex flex-col min-w-[300px]">
        <ChatPanel />
      </div>

      {/* Spotlight Command */}
      {showCommand && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[999] w-[500px] max-w-[90%]">
          <div className="glass-float rounded-2xl overflow-hidden" style={{ borderRadius: 12 }}>
            <div className="flex items-center gap-3 px-4 py-3">
              <Command className="w-4 h-4 text-primary flex-shrink-0" />
              <input ref={cmdRef} value={commandInput} onChange={e => setCommandInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendChat(commandInput); if (e.key === 'Escape') setShowCommand(false); }}
                placeholder="Quick command..."
                className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none" autoFocus />
              <kbd className="px-1.5 py-0.5 rounded text-[8px] font-mono text-muted-foreground/40 border border-primary/10">ESC</kbd>
            </div>
          </div>
        </div>
      )}

      <FloatingNexus />
    </div>
  );
};

export default ArchitectPanel;
