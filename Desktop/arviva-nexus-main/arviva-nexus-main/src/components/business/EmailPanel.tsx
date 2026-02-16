import { motion } from 'framer-motion';
import { Mail, BarChart3, Thermometer, Send, Users, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const campaigns = [
  { name: 'Thailand SaaS Launch', status: 'active', open: 42.1, click: 8.3, sent: 12400, bounced: 0.3, revenue: '$2,140', list: 'Thai Tech Leads' },
  { name: 'EU VPN Promo Q1', status: 'active', open: 38.7, click: 6.2, sent: 8900, bounced: 0.5, revenue: '$1,680', list: 'EU Privacy Leads' },
  { name: 'US AI Writer Blast', status: 'active', open: 44.2, click: 9.1, sent: 15200, bounced: 0.2, revenue: '$3,420', list: 'US Content Creators' },
  { name: 'LatAm SEO Tools', status: 'paused', open: 29.4, click: 4.1, sent: 5600, bounced: 1.2, revenue: '$480', list: 'LatAm Marketers' },
  { name: 'Nordic CRM Offer', status: 'scheduled', open: 0, click: 0, sent: 0, bounced: 0, revenue: '$0', list: 'Nordic Startups' },
];

const warmupIPs = [
  { ip: '185.x.x.12', progress: 92, status: 'ready', domain: 'send1.arviva.io', reputation: 98, dailyLimit: 5000 },
  { ip: '185.x.x.13', progress: 67, status: 'warming', domain: 'send2.arviva.io', reputation: 72, dailyLimit: 2000 },
  { ip: '185.x.x.14', progress: 34, status: 'warming', domain: 'send3.arviva.io', reputation: 45, dailyLimit: 500 },
  { ip: '185.x.x.15', progress: 12, status: 'new', domain: 'send4.arviva.io', reputation: 20, dailyLimit: 100 },
];

const sendData = [
  { day: 'Mon', sent: 4200, opens: 1680 }, { day: 'Tue', sent: 3800, opens: 1520 },
  { day: 'Wed', sent: 5100, opens: 2244 }, { day: 'Thu', sent: 4600, opens: 1932 },
  { day: 'Fri', sent: 6200, opens: 2790 }, { day: 'Sat', sent: 2100, opens: 840 },
  { day: 'Sun', sent: 1800, opens: 720 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  rate: Math.sin(i / 4) * 20 + 40 + Math.random() * 10,
}));

const statusBadge = (s: string) => {
  if (s === 'active') return 'bg-success/15 text-success border-success/20';
  if (s === 'paused') return 'bg-accent/15 text-accent border-accent/20';
  return 'bg-primary/15 text-primary border-primary/20';
};

const EmailPanel = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
          <Mail className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">Email Operations Center</h2>
          <p className="text-[10px] text-muted-foreground font-mono">Mautic Engine • Hetzner CX53 • 4 IPs active</p>
        </div>
      </div>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { icon: Send, label: 'Total Sent', val: '42.1K', sub: 'This month', color: 'text-primary' },
        { icon: Mail, label: 'Open Rate', val: '38.6%', sub: '+4.2% vs avg', color: 'neon-text-green' },
        { icon: TrendingUp, label: 'Click Rate', val: '6.9%', sub: 'Industry: 2.6%', color: 'neon-text-green' },
        { icon: Users, label: 'Subscribers', val: '28.4K', sub: '+1.2K this week', color: 'text-primary' },
        { icon: BarChart3, label: 'Revenue', val: '$7,720', sub: 'From emails', color: 'neon-text-green' },
      ].map((kpi, i) => (
        <motion.div key={kpi.label} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
          className="cyber-card p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <kpi.icon className="w-3 h-3 text-muted-foreground" />
            <span className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground font-mono">{kpi.label}</span>
          </div>
          <p className={`text-lg font-bold font-mono ${kpi.color}`}>{kpi.val}</p>
          <p className="text-[9px] text-muted-foreground">{kpi.sub}</p>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" /> Send Volume (7d)
        </h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={sendData}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(228 60% 8%)', border: '1px solid hsl(228 30% 14%)', borderRadius: 8, fontSize: 10 }} />
            <Bar dataKey="sent" fill="hsl(217 91% 60%)" radius={[3, 3, 0, 0]} opacity={0.7} />
            <Bar dataKey="opens" fill="hsl(160 84% 39%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="cyber-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Open Rate by Hour
        </h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(330 81% 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(330 81% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(215 20% 50%)' }} axisLine={false} tickLine={false} interval={3} />
            <Tooltip contentStyle={{ background: 'hsl(228 60% 8%)', border: '1px solid hsl(228 30% 14%)', borderRadius: 8, fontSize: 10 }} />
            <Area type="monotone" dataKey="rate" stroke="hsl(330 81% 60%)" fill="url(#openGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Campaigns */}
    <div className="cyber-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Active Campaigns</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border">
              {['Campaign', 'List', 'Status', 'Sent', 'Open %', 'Click %', 'Bounce', 'Revenue'].map(h => (
                <th key={h} className="py-2 px-2 text-left text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <motion.tr key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-b border-border/20 hover:bg-primary/5 transition-colors">
                <td className="py-2.5 px-2 font-medium">{c.name}</td>
                <td className="py-2.5 px-2 text-muted-foreground text-[10px]">{c.list}</td>
                <td className="py-2.5 px-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase border ${statusBadge(c.status)}`}>
                    {c.status === 'active' && <span className="w-1 h-1 rounded-full bg-success animate-pulse" />}
                    {c.status}
                  </span>
                </td>
                <td className="py-2.5 px-2 font-mono">{c.sent.toLocaleString()}</td>
                <td className="py-2.5 px-2 font-mono">{c.open > 0 ? `${c.open}%` : '—'}</td>
                <td className="py-2.5 px-2 font-mono">{c.click > 0 ? `${c.click}%` : '—'}</td>
                <td className="py-2.5 px-2 font-mono">{c.bounced > 0.8 ? <span className="text-accent">{c.bounced}%</span> : `${c.bounced}%`}</td>
                <td className="py-2.5 px-2 font-mono neon-text-green">{c.revenue}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* IP Warmup */}
    <div className="cyber-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Thermometer className="w-3.5 h-3.5" /> IP Warmup & Reputation
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {warmupIPs.map((ip) => (
          <div key={ip.ip} className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-medium">{ip.ip}</span>
                <span className="text-[9px] text-muted-foreground ml-2">{ip.domain}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase ${ip.status === 'ready' ? 'neon-text-green' : ip.status === 'warming' ? 'text-primary' : 'text-muted-foreground'}`}>
                {ip.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                  <span>Warmup</span><span>{ip.progress}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden metric-bar">
                  <motion.div
                    className={`h-full rounded-full ${ip.status === 'ready' ? 'bg-success' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${ip.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground">Rep</p>
                <p className={`text-xs font-mono font-bold ${ip.reputation > 80 ? 'neon-text-green' : ip.reputation > 50 ? 'text-primary' : 'text-accent'}`}>{ip.reputation}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground">Limit</p>
                <p className="text-xs font-mono">{ip.dailyLimit.toLocaleString()}/d</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EmailPanel;
