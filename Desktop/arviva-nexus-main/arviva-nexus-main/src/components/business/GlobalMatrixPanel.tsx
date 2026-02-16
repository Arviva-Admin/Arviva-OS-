import { useState, useMemo } from 'react';
import { Globe, AlertTriangle, X, Search, BarChart3 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis, CartesianGrid, Cell } from 'recharts';
import { Input } from '@/components/ui/input';

interface CountryData {
  id: string; name: string; flag: string; cx: number; cy: number;
  compliance: 'ok' | 'warn' | 'critical'; status: 'live' | 'warming' | 'pending';
  revenue: string; agents: number; activity: number; leads: number; campaigns: number; flags: string[];
  latency: string; activeTasks: number;
}

const countries: CountryData[] = [
  { id: 'us', name: 'United States', flag: '🇺🇸', cx: 22, cy: 38, compliance: 'ok', status: 'live', revenue: '$4,280', agents: 24, activity: 95, leads: 1240, campaigns: 8, flags: [], latency: '12ms', activeTasks: 34 },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', cx: 20, cy: 28, compliance: 'ok', status: 'live', revenue: '$1,120', agents: 8, activity: 72, leads: 340, campaigns: 3, flags: [], latency: '18ms', activeTasks: 12 },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', cx: 47, cy: 30, compliance: 'warn', status: 'live', revenue: '$1,840', agents: 12, activity: 69, leads: 560, campaigns: 5, flags: ['Cookie consent'], latency: '24ms', activeTasks: 18 },
  { id: 'de', name: 'Germany', flag: '🇩🇪', cx: 50, cy: 31, compliance: 'warn', status: 'live', revenue: '$1,560', agents: 11, activity: 72, leads: 480, campaigns: 4, flags: ['GDPR strict'], latency: '26ms', activeTasks: 15 },
  { id: 'fr', name: 'France', flag: '🇫🇷', cx: 48, cy: 34, compliance: 'warn', status: 'live', revenue: '$1,290', agents: 9, activity: 66, leads: 390, campaigns: 3, flags: ['CNIL rules'], latency: '28ms', activeTasks: 11 },
  { id: 'ae', name: 'UAE', flag: '🇦🇪', cx: 62, cy: 42, compliance: 'ok', status: 'live', revenue: '$1,100', agents: 8, activity: 76, leads: 320, campaigns: 3, flags: [], latency: '45ms', activeTasks: 9 },
  { id: 'in', name: 'India', flag: '🇮🇳', cx: 68, cy: 44, compliance: 'ok', status: 'live', revenue: '$1,420', agents: 14, activity: 81, leads: 680, campaigns: 5, flags: [], latency: '52ms', activeTasks: 22 },
  { id: 'th', name: 'Thailand', flag: '🇹🇭', cx: 74, cy: 48, compliance: 'ok', status: 'live', revenue: '$960', agents: 12, activity: 87, leads: 520, campaigns: 4, flags: [], latency: '68ms', activeTasks: 16 },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', cx: 83, cy: 36, compliance: 'ok', status: 'live', revenue: '$1,680', agents: 10, activity: 58, leads: 390, campaigns: 3, flags: [], latency: '38ms', activeTasks: 8 },
  { id: 'kr', name: 'South Korea', flag: '🇰🇷', cx: 81, cy: 36, compliance: 'ok', status: 'live', revenue: '$1,240', agents: 9, activity: 74, leads: 350, campaigns: 3, flags: [], latency: '42ms', activeTasks: 10 },
  { id: 'au', name: 'Australia', flag: '🇦🇺', cx: 84, cy: 68, compliance: 'ok', status: 'live', revenue: '$980', agents: 7, activity: 61, leads: 290, campaigns: 3, flags: [], latency: '88ms', activeTasks: 7 },
  { id: 'br', name: 'Brazil', flag: '🇧🇷', cx: 32, cy: 62, compliance: 'ok', status: 'live', revenue: '$920', agents: 10, activity: 64, leads: 410, campaigns: 4, flags: [], latency: '120ms', activeTasks: 14 },
  { id: 'ng', name: 'Nigeria', flag: '🇳🇬', cx: 50, cy: 52, compliance: 'ok', status: 'warming', revenue: '$180', agents: 3, activity: 43, leads: 95, campaigns: 1, flags: [], latency: '145ms', activeTasks: 2 },
  { id: 'za', name: 'South Africa', flag: '🇿🇦', cx: 55, cy: 72, compliance: 'ok', status: 'pending', revenue: '$90', agents: 2, activity: 28, leads: 40, campaigns: 0, flags: [], latency: '160ms', activeTasks: 0 },
];

const regionData = [
  { region: 'NA', rev: 5400 }, { region: 'EU', rev: 4690 },
  { region: 'APAC', rev: 6280 }, { region: 'LATAM', rev: 920 },
  { region: 'MEA', rev: 1370 },
];

const GlobalMatrixPanel = () => {
  const [selected, setSelected] = useState<CountryData | null>(null);
  const [hovered, setHovered] = useState<CountryData | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'warming' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => countries
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.activity - a.activity), [filter, search]);

  const totalRevenue = countries.reduce((s, c) => s + parseFloat(c.revenue.replace(/[$,]/g, '')), 0);
  const liveCount = countries.filter(c => c.status === 'live').length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Revenue</span>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Countries</span>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{countries.length}</p>
          <span className="text-[9px] text-success font-mono">{liveCount} live</span>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Agents</span>
          <p className="text-lg font-bold font-mono text-foreground mt-0.5">{countries.reduce((s, c) => s + c.agents, 0)}</p>
        </div>
        <div className="cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Warnings</span>
          <p className="text-lg font-bold font-mono text-accent mt-0.5">{countries.filter(c => c.compliance !== 'ok').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="col-span-2 cyber-card p-3 relative">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2 block">Operations Map</span>
          <div className="relative w-full" style={{ paddingBottom: '42%' }}>
            <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full">
              <path d="M10,20 Q15,18 22,22 Q28,25 25,35 Q22,42 18,45 Q14,42 12,35 Q10,28 10,20Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />
              <path d="M24,48 Q30,46 33,52 Q35,58 33,65 Q30,72 27,74 Q24,72 25,65 Q24,58 24,48Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />
              <path d="M44,22 Q48,20 54,22 Q56,26 55,32 Q52,36 48,38 Q44,36 44,30 Q43,26 44,22Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />
              <path d="M46,40 Q52,38 56,42 Q58,48 58,56 Q56,65 54,70 Q50,74 48,70 Q46,62 46,54 Q45,48 46,40Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />
              <path d="M58,22 Q65,18 75,22 Q82,26 85,32 Q84,40 80,46 Q75,50 70,48 Q65,45 62,40 Q58,34 58,28 Q57,24 58,22Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />
              <path d="M78,58 Q84,56 88,60 Q90,65 88,70 Q84,72 80,68 Q78,64 78,58Z" fill="none" stroke="hsl(0 0% 18%)" strokeWidth="0.2" />

              {countries.map(c => (
                <g key={c.id}
                  onClick={() => setSelected(c)}
                  onMouseEnter={() => setHovered(c)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer">
                  <circle cx={c.cx} cy={c.cy}
                    r={selected?.id === c.id ? 2.2 : hovered?.id === c.id ? 1.8 : c.status === 'live' ? 1.2 : 0.7}
                    fill={c.status === 'live' ? 'hsl(200 100% 50%)' : c.status === 'warming' ? 'hsl(40 100% 50%)' : 'hsl(0 0% 25%)'}
                    style={{ transition: 'r 0.15s ease' }}
                  />
                  {c.compliance !== 'ok' && (
                    <circle cx={c.cx} cy={c.cy} r="2.5" fill="none" stroke="hsl(345 100% 56%)" strokeWidth="0.15" strokeDasharray="0.5,0.5" />
                  )}
                </g>
              ))}

              {/* Hover tooltip */}
              {hovered && (
                <foreignObject x={Math.min(hovered.cx + 2, 72)} y={Math.max(hovered.cy - 16, 2)} width="26" height="16">
                  <div className="bg-card border border-border rounded px-1 py-0.5 text-[3.5px] font-mono leading-tight" style={{ backdropFilter: 'blur(8px)' }}>
                    <div className="font-bold text-foreground">{hovered.flag} {hovered.name}</div>
                    <div className="text-success">{hovered.revenue}</div>
                    <div className="text-muted-foreground">{hovered.activeTasks} tasks · {hovered.latency}</div>
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>
          <div className="flex items-center gap-4 mt-1">
            {[{ l: 'Live', cls: 'bg-info' }, { l: 'Warming', cls: 'bg-warn' }, { l: 'Pending', cls: 'bg-muted-foreground' }, { l: 'Warning', cls: 'bg-accent' }].map(x => (
              <span key={x.l} className="flex items-center gap-1 text-[8px] text-muted-foreground font-mono"><span className={`w-1.5 h-1.5 rounded-full ${x.cls}`} />{x.l}</span>
            ))}
          </div>
        </div>

        <div className="cyber-card p-3 flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2">Revenue by Region</span>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: 'hsl(220 8% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 10, fill: 'hsl(220 8% 42%)' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)', borderRadius: 8, fontSize: 10 }} />
                <Bar dataKey="rev" fill="hsl(200 100% 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {selected && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono">{selected.flag} {selected.name}</span>
                <button onClick={() => setSelected(null)}><X className="w-3 h-3 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">Latency</span><span className="text-primary">{selected.latency}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tasks</span><span>{selected.activeTasks}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-success">{selected.revenue}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Agents</span><span>{selected.agents}</span></div>
              </div>
              {selected.flags.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-2.5 h-2.5 text-accent" />
                  <span className="text-[8px] text-accent font-mono">{selected.flags.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bubble Chart: Revenue vs Activity (bubble = agents) */}
      <div className="cyber-card p-3">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2 block">Market Bubble — Revenue vs Activity (bubble = agents)</span>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="activity" name="Activity %" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="revNum" name="Revenue" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
            <ZAxis type="number" dataKey="agents" range={[60, 600]} name="Agents" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} formatter={(value: number, name: string) => [name === 'Revenue' ? `$${value.toLocaleString()}` : value, name]} />
            <Scatter name="Markets" data={countries.map(c => ({ name: `${c.flag} ${c.name}`, activity: c.activity, revNum: parseFloat(c.revenue.replace(/[$,]/g, '')), agents: c.agents }))} fill="hsl(var(--primary))">
              {countries.map((c, i) => (
                <Cell key={i} fill={c.status === 'live' ? 'hsl(var(--primary))' : c.status === 'warming' ? 'hsl(var(--warn))' : 'hsl(var(--muted-foreground))'} fillOpacity={0.7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Markets table */}
      <div className="cyber-card p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            {(['all', 'live', 'warming', 'pending'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                }`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-6 h-6 text-[10px] bg-secondary w-36 rounded-lg border-border font-mono" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border">
                {['Country', 'Status', 'Revenue', 'Latency', 'Tasks', 'Agents', 'Activity', 'Compliance'].map(h => (
                  <th key={h} className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="py-1.5 px-1.5 font-medium">{c.flag} {c.name}</td>
                  <td className="py-1.5 px-1.5">
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase border ${
                      c.status === 'live' ? 'bg-success/10 text-success border-success/20' :
                      c.status === 'warming' ? 'bg-warn/10 text-warn border-warn/20' :
                      'bg-secondary text-muted-foreground border-border'
                    }`}>{c.status === 'live' && <span className="w-1 h-1 rounded-full bg-success" />}{c.status}</span>
                  </td>
                  <td className="py-1.5 px-1.5 text-success">{c.revenue}</td>
                  <td className="py-1.5 px-1.5 text-primary">{c.latency}</td>
                  <td className="py-1.5 px-1.5">{c.activeTasks}</td>
                  <td className="py-1.5 px-1.5">{c.agents}</td>
                  <td className="py-1.5 px-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.activity > 70 ? 'bg-success' : c.activity > 40 ? 'bg-primary' : 'bg-muted-foreground'}`} style={{ width: `${c.activity}%` }} />
                      </div>
                      <span className="text-[9px]">{c.activity}%</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1.5">
                    {c.compliance === 'ok' ? <span className="text-success">✓</span> : <span className="text-accent flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" />{c.flags[0]}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GlobalMatrixPanel;
