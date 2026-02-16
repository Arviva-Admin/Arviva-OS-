import { motion } from 'framer-motion';
import { FlaskConical, TrendingUp, TrendingDown, BarChart3, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const evals = [
  { agent: 'Scout-TH', production: 94, staging: 97, diff: '+3%', better: true, latency: '120ms', tokens: '2.1K', cost: '$0.004' },
  { agent: 'Scout-US', production: 91, staging: 93, diff: '+2%', better: true, latency: '95ms', tokens: '1.8K', cost: '$0.003' },
  { agent: 'Arbitrageur-US', production: 88, staging: 91, diff: '+3%', better: true, latency: '210ms', tokens: '3.4K', cost: '$0.007' },
  { agent: 'Creator-Email', production: 82, staging: 79, diff: '-3%', better: false, latency: '340ms', tokens: '5.2K', cost: '$0.012' },
  { agent: 'Sentinel-EU', production: 96, staging: 96, diff: '0%', better: true, latency: '85ms', tokens: '1.2K', cost: '$0.002' },
  { agent: 'Optimizer-Global', production: 85, staging: 89, diff: '+4%', better: true, latency: '280ms', tokens: '4.1K', cost: '$0.009' },
  { agent: 'Creator-Landing', production: 79, staging: 84, diff: '+5%', better: true, latency: '450ms', tokens: '6.8K', cost: '$0.015' },
  { agent: 'Scout-JP', production: 87, staging: 90, diff: '+3%', better: true, latency: '130ms', tokens: '2.3K', cost: '$0.005' },
];

const historyData = [
  { day: 'W1', score: 82 }, { day: 'W2', score: 85 }, { day: 'W3', score: 84 },
  { day: 'W4', score: 88 }, { day: 'W5', score: 87 }, { day: 'W6', score: 90 },
  { day: 'W7', score: 89 }, { day: 'W8', score: 91 },
];

const radarData = [
  { metric: 'Accuracy', value: 92 }, { metric: 'Speed', value: 85 },
  { metric: 'Cost Eff.', value: 88 }, { metric: 'Reliability', value: 95 },
  { metric: 'Coverage', value: 78 }, { metric: 'Compliance', value: 96 },
];

const avgScore = (evals.reduce((s, e) => s + e.staging, 0) / evals.length).toFixed(1);
const regressions = evals.filter(e => !e.better).length;

const EvalPanel = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">Eval Metrics Dashboard</h2>
          <p className="text-[10px] text-muted-foreground font-mono">{evals.length} agents evaluated • Staging vs Production</p>
        </div>
      </div>
      {regressions > 0 && (
        <span className="flex items-center gap-1 text-[10px] font-mono text-accent">
          <AlertTriangle className="w-3 h-3" /> {regressions} regression{regressions > 1 ? 's' : ''}
        </span>
      )}
    </div>

    {/* KPIs + Charts */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Score Trend (8 weeks)
        </h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={historyData}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[75, 100]} tick={{ fontSize: 9, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(228 60% 8%)', border: '1px solid hsl(228 30% 14%)', borderRadius: 8, fontSize: 10 }} />
            <Area type="monotone" dataKey="score" stroke="hsl(160 84% 39%)" fill="url(#scoreGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">System Health Radar</h3>
        <ResponsiveContainer width="100%" height={140}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(228 30% 14%)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 8, fill: 'hsl(215 20% 50%)' }} />
            <Radar dataKey="value" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60%)" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Avg Score', val: `${avgScore}%`, color: 'neon-text-green' },
          { label: 'Regressions', val: regressions.toString(), color: regressions > 0 ? 'neon-text-pink' : 'neon-text-green' },
          { label: 'Total Tokens', val: '27.9K', color: 'text-primary' },
          { label: 'Total Cost', val: '$0.057', color: 'text-foreground' },
        ].map(s => (
          <div key={s.label} className="cyber-card p-3">
            <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground font-mono">{s.label}</p>
            <p className={`text-lg font-bold font-mono mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Eval table */}
    <div className="cyber-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Staging vs Production Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border">
              {['Agent', 'Production', 'Staging', 'Δ', 'Latency', 'Tokens', 'Cost'].map(h => (
                <th key={h} className="py-2 px-2 text-left text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evals.map((e, i) => (
              <motion.tr key={e.agent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`border-b border-border/20 transition-colors ${!e.better ? 'bg-accent/5' : 'hover:bg-primary/5'}`}>
                <td className="py-2.5 px-2 font-medium font-mono">{e.agent}</td>
                <td className="py-2.5 px-2 font-mono">{e.production}%</td>
                <td className="py-2.5 px-2 font-mono font-bold">{e.staging}%</td>
                <td className="py-2.5 px-2">
                  <span className={`flex items-center gap-1 font-mono font-bold ${e.better ? 'neon-text-green' : 'neon-text-pink'}`}>
                    {e.better ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {e.diff}
                  </span>
                </td>
                <td className="py-2.5 px-2 font-mono text-muted-foreground">{e.latency}</td>
                <td className="py-2.5 px-2 font-mono text-muted-foreground">{e.tokens}</td>
                <td className="py-2.5 px-2 font-mono text-muted-foreground">{e.cost}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default EvalPanel;
