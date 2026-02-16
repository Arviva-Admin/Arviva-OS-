import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Play, Users, Zap, Search, Settings, Power, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const squads = [
  { name: 'Scouts', count: 48, active: 45, cpu: 12, tasks: 234, color: 'hsl(217 91% 60%)' },
  { name: 'Arbitrageurs', count: 35, active: 34, cpu: 18, tasks: 189, color: 'hsl(160 84% 39%)' },
  { name: 'Creators', count: 52, active: 48, cpu: 31, tasks: 412, color: 'hsl(330 81% 60%)' },
  { name: 'Sentinels', count: 30, active: 28, cpu: 8, tasks: 156, color: 'hsl(45 93% 47%)' },
  { name: 'Optimizers', count: 35, active: 35, cpu: 22, tasks: 298, color: 'hsl(280 70% 60%)' },
];

const agents = [
  { name: 'Scout-TH-Alpha', squad: 'Scouts', status: 'active', uptime: '99.8%', tasks: 847, model: 'Groq', region: '🇹🇭 TH', lastAction: '12s ago' },
  { name: 'Scout-US-Beta', squad: 'Scouts', status: 'active', uptime: '99.2%', tasks: 1203, model: 'Gemini', region: '🇺🇸 US', lastAction: '3s ago' },
  { name: 'Arb-Global-01', squad: 'Arbitrageurs', status: 'active', uptime: '98.9%', tasks: 567, model: 'Mistral', region: '🌍 Global', lastAction: '8s ago' },
  { name: 'Creator-Email-Main', squad: 'Creators', status: 'active', uptime: '99.5%', tasks: 2341, model: 'Groq', region: '🌍 Global', lastAction: '1s ago' },
  { name: 'Sentinel-EU-GDPR', squad: 'Sentinels', status: 'warning', uptime: '97.1%', tasks: 445, model: 'Cloudflare', region: '🇪🇺 EU', lastAction: '45s ago' },
  { name: 'Optimizer-AB-Test', squad: 'Optimizers', status: 'active', uptime: '99.9%', tasks: 1892, model: 'Groq', region: '🌍 Global', lastAction: '5s ago' },
  { name: 'Scout-JP-Niche', squad: 'Scouts', status: 'idle', uptime: '95.4%', tasks: 234, model: 'Ollama', region: '🇯🇵 JP', lastAction: '5m ago' },
  { name: 'Creator-Landing', squad: 'Creators', status: 'active', uptime: '99.3%', tasks: 1567, model: 'Gemini', region: '🌍 Global', lastAction: '2s ago' },
];

const performanceData = squads.map(s => ({ name: s.name, tasks: s.tasks, agents: s.active }));

const radarData = [
  { metric: 'Speed', Scouts: 90, Arbitrageurs: 75, Creators: 60, Sentinels: 50, Optimizers: 85 },
  { metric: 'Accuracy', Scouts: 70, Arbitrageurs: 85, Creators: 80, Sentinels: 95, Optimizers: 88 },
  { metric: 'Volume', Scouts: 85, Arbitrageurs: 65, Creators: 95, Sentinels: 40, Optimizers: 70 },
  { metric: 'Efficiency', Scouts: 75, Arbitrageurs: 90, Creators: 55, Sentinels: 80, Optimizers: 92 },
  { metric: 'Uptime', Scouts: 95, Arbitrageurs: 88, Creators: 92, Sentinels: 97, Optimizers: 99 },
  { metric: 'Autonomy', Scouts: 80, Arbitrageurs: 70, Creators: 85, Sentinels: 60, Optimizers: 78 },
];

const statusBadge = (s: string) => s === 'active' ? 'bg-success/15 text-success border-success/20' : s === 'warning' ? 'bg-accent/15 text-accent border-accent/20' : 'bg-secondary text-muted-foreground border-border';

const AgentBuilderPanel = () => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [squad, setSquad] = useState('Scouts');
  const [searchQ, setSearchQ] = useState('');
  const [squadFilter, setSquadFilter] = useState('All');

  const filteredAgents = agents
    .filter(a => squadFilter === 'All' || a.squad === squadFilter)
    .filter(a => a.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Agent Command Center</h2>
            <p className="text-[10px] text-muted-foreground font-mono">200 agents • 5 squads • 190 active</p>
          </div>
        </div>
      </div>

      {/* Squad overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {squads.map((s, i) => (
          <motion.div key={s.name} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="cyber-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-mono">{s.name}</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.active}<span className="text-muted-foreground text-xs">/{s.count}</span></p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">CPU {s.cpu}%</span>
              <span className="text-[9px] text-muted-foreground">{s.tasks} tasks</span>
            </div>
            <div className="h-1 bg-secondary rounded-full mt-1.5 overflow-hidden metric-bar">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: s.color }} initial={{ width: 0 }} animate={{ width: `${(s.active / s.count) * 100}%` }} transition={{ duration: 1 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Builder + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="cyber-card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" /> Build New Agent
          </h3>
          <Input placeholder="Agent name..." value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50 text-[11px] h-8" />
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Agent prompt / instructions..."
            className="w-full h-24 bg-secondary/50 border border-input rounded-lg px-3 py-2 text-[11px] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          <div className="flex items-center gap-2">
            <select value={squad} onChange={e => setSquad(e.target.value)}
              className="bg-secondary/50 border border-input rounded-lg px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary">
              {squads.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <select className="bg-secondary/50 border border-input rounded-lg px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Groq (fast)</option><option>Gemini 2.5</option><option>Mistral</option><option>Cloudflare</option><option>Ollama (local)</option>
            </select>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/80 transition-colors neon-glow-blue">
              <Play className="w-3 h-3" /> Shadow Test
            </button>
          </div>
        </div>

        <div className="cyber-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" /> Squad Performance
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(228 60% 8%)', border: '1px solid hsl(228 30% 14%)', borderRadius: 8, fontSize: 10 }} />
              <Bar dataKey="tasks" fill="hsl(217 91% 60%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Squad Radar Chart */}
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Squad Capabilities Radar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
            <Radar name="Scouts" dataKey="Scouts" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60%)" fillOpacity={0.15} strokeWidth={1.5} />
            <Radar name="Creators" dataKey="Creators" stroke="hsl(330 81% 60%)" fill="hsl(330 81% 60%)" fillOpacity={0.1} strokeWidth={1.5} />
            <Radar name="Optimizers" dataKey="Optimizers" stroke="hsl(280 70% 60%)" fill="hsl(280 70% 60%)" fillOpacity={0.1} strokeWidth={1.5} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent list */}
      <div className="cyber-card p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Registry</span>
          </div>
          <div className="flex items-center gap-2">
            {['All', ...squads.map(s => s.name)].map(f => (
              <button key={f} onClick={() => setSquadFilter(f)}
                className={`px-2 py-1 rounded-lg text-[9px] font-medium transition-colors ${squadFilter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
                {f}
              </button>
            ))}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search..." className="pl-7 h-7 text-[11px] bg-secondary/50 w-32 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                {['Agent', 'Squad', 'Status', 'Model', 'Region', 'Uptime', 'Tasks', 'Last Action'].map(h => (
                  <th key={h} className="py-2 px-2 text-left text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((a, i) => (
                <motion.tr key={a.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/20 hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="py-2 px-2 font-medium font-mono">{a.name}</td>
                  <td className="py-2 px-2"><span className="px-1.5 py-0.5 rounded bg-secondary text-[9px]">{a.squad}</span></td>
                  <td className="py-2 px-2">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase border ${statusBadge(a.status)}`}>
                      <span className={`w-1 h-1 rounded-full ${a.status === 'active' ? 'bg-success animate-pulse' : a.status === 'warning' ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono text-muted-foreground">{a.model}</td>
                  <td className="py-2 px-2">{a.region}</td>
                  <td className="py-2 px-2 font-mono neon-text-green">{a.uptime}</td>
                  <td className="py-2 px-2 font-mono">{a.tasks.toLocaleString()}</td>
                  <td className="py-2 px-2 text-muted-foreground">{a.lastAction}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilderPanel;
