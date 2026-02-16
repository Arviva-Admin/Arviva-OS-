import { useState, useEffect, useMemo } from 'react';
import { Zap, TrendingUp, TrendingDown, Search, DollarSign, Activity, ArrowUpDown, X, Bot, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { actions } from '@/core/windmillClient';

interface Product {
  name: string; gravity: number; ltv: string; conv: string; trend: 'up' | 'down'; category: string; network: string; payout: string; epc: string; region: string; status: 'active' | 'testing' | 'paused';
  cost: string; margin: string; assignedAgent: string;
  events: { time: string; event: string; }[];
}

const allProducts: Product[] = [
  { name: 'AI Writing Suite Pro', gravity: 72, ltv: '$847', conv: '4.2%', trend: 'up', category: 'SaaS', network: 'ClickBank', payout: '$127', epc: '$2.84', region: '🇺🇸 US', status: 'active', cost: '$34', margin: '73%', assignedAgent: 'arb-scout', events: [{ time: '10:04:32', event: 'Scout matched pain point' }, { time: '10:06:11', event: 'Email sequence generated' }, { time: '10:12:44', event: 'A/B test started' }] },
  { name: 'VPN Pro Max', gravity: 65, ltv: '$234', conv: '6.1%', trend: 'up', category: 'Security', network: 'Impact', payout: '$45', epc: '$1.92', region: '🌍 Global', status: 'active', cost: '$12', margin: '73%', assignedAgent: 'content-gen', events: [{ time: '09:58:21', event: 'Landing page deployed' }, { time: '10:01:33', event: 'Warmup IP assigned' }] },
  { name: 'Cloud Backup Enterprise', gravity: 58, ltv: '$567', conv: '3.8%', trend: 'up', category: 'SaaS', network: 'PartnerStack', payout: '$89', epc: '$2.14', region: '🇪🇺 EU', status: 'active', cost: '$28', margin: '69%', assignedAgent: 'email-ops', events: [{ time: '10:10:05', event: 'Campaign batch sent' }] },
  { name: 'SEO Toolkit Ultimate', gravity: 54, ltv: '$189', conv: '5.4%', trend: 'up', category: 'Marketing', network: 'ClickBank', payout: '$67', epc: '$1.56', region: '🇺🇸 US', status: 'active', cost: '$18', margin: '73%', assignedAgent: 'arb-scout', events: [{ time: '10:08:19', event: 'Gravity check passed' }] },
  { name: 'Email Validator Pro', gravity: 48, ltv: '$92', conv: '8.7%', trend: 'up', category: 'Marketing', network: 'ShareASale', payout: '$32', epc: '$3.21', region: '🌍 Global', status: 'active', cost: '$8', margin: '75%', assignedAgent: 'pain-miner', events: [{ time: '10:03:41', event: 'Reddit thread analyzed' }] },
  { name: 'Thai Language Chatbot', gravity: 44, ltv: '$156', conv: '3.1%', trend: 'up', category: 'AI', network: 'Direct', payout: '$48', epc: '$0.98', region: '🇹🇭 TH', status: 'testing', cost: '$15', margin: '69%', assignedAgent: 'content-gen', events: [{ time: '10:11:55', event: 'Localization in progress' }] },
  { name: 'CRM Lite Startups', gravity: 41, ltv: '$234', conv: '4.8%', trend: 'down', category: 'SaaS', network: 'PartnerStack', payout: '$72', epc: '$1.44', region: '🌍 Global', status: 'active', cost: '$22', margin: '69%', assignedAgent: 'email-ops', events: [{ time: '10:07:30', event: 'Conversion rate declined' }] },
  { name: 'Landing Page Builder', gravity: 38, ltv: '$312', conv: '3.6%', trend: 'up', category: 'Marketing', network: 'ClickBank', payout: '$94', epc: '$1.88', region: '🇺🇸 US', status: 'active', cost: '$25', margin: '73%', assignedAgent: 'arb-scout', events: [] },
  { name: 'Invoice Generator AI', gravity: 35, ltv: '$78', conv: '9.2%', trend: 'up', category: 'Finance', network: 'ShareASale', payout: '$24', epc: '$2.76', region: '🇪🇺 EU', status: 'testing', cost: '$6', margin: '75%', assignedAgent: 'pain-miner', events: [] },
  { name: 'Social Media Scheduler', gravity: 33, ltv: '$145', conv: '5.1%', trend: 'down', category: 'Marketing', network: 'Impact', payout: '$43', epc: '$1.33', region: '🌍 Global', status: 'paused', cost: '$14', margin: '67%', assignedAgent: 'none', events: [] },
  { name: 'Privacy Shield VPN', gravity: 31, ltv: '$198', conv: '4.4%', trend: 'up', category: 'Security', network: 'CJ', payout: '$58', epc: '$1.67', region: '🇪🇺 EU', status: 'active', cost: '$16', margin: '72%', assignedAgent: 'content-gen', events: [] },
  { name: 'AI Content Spinner', gravity: 28, ltv: '$67', conv: '7.3%', trend: 'up', category: 'AI', network: 'ClickBank', payout: '$21', epc: '$2.12', region: '🇺🇸 US', status: 'testing', cost: '$5', margin: '76%', assignedAgent: 'arb-scout', events: [] },
  { name: 'Crypto Tax Calculator', gravity: 26, ltv: '$289', conv: '2.9%', trend: 'up', category: 'Finance', network: 'Direct', payout: '$86', epc: '$1.11', region: '🌍 Global', status: 'active', cost: '$30', margin: '65%', assignedAgent: 'email-ops', events: [] },
  { name: 'Password Manager', gravity: 22, ltv: '$112', conv: '6.8%', trend: 'up', category: 'Security', network: 'Impact', payout: '$34', epc: '$2.45', region: '🌍 Global', status: 'active', cost: '$9', margin: '74%', assignedAgent: 'pain-miner', events: [] },
];

const revenueData = [
  { day: 'Mon', rev: 1240, clicks: 820 }, { day: 'Tue', rev: 1890, clicks: 1100 },
  { day: 'Wed', rev: 2100, clicks: 1340 }, { day: 'Thu', rev: 1760, clicks: 980 },
  { day: 'Fri', rev: 2400, clicks: 1560 }, { day: 'Sat', rev: 3100, clicks: 2100 },
  { day: 'Sun', rev: 2800, clicks: 1890 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, val: Math.floor(Math.random() * 180 + 40) }));
const categories = ['All', 'SaaS', 'Marketing', 'Security', 'AI', 'Finance'];

const agentAvatars: Record<string, { name: string; color: string }> = {
  'arb-scout': { name: 'AS', color: 'bg-primary' },
  'pain-miner': { name: 'PM', color: 'bg-amber' },
  'email-ops': { name: 'EO', color: 'bg-success' },
  'content-gen': { name: 'CG', color: 'bg-accent' },
  'none': { name: '—', color: 'bg-muted' },
};

// ROI Gauge SVG component
const ROIGauge = ({ margin }: { margin: number }) => {
  const angle = (margin / 100) * 180;
  const rad = (angle - 90) * Math.PI / 180;
  const x = 50 + 35 * Math.cos(rad);
  const y = 50 + 35 * Math.sin(rad);
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="hsl(0 0% 14%)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="hsl(200 100% 50%)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${(angle / 180) * 110} 110`} />
      <circle cx={x} cy={y} r="3" fill="hsl(200 100% 50%)" />
      <text x="50" y="48" textAnchor="middle" className="fill-foreground" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">{margin}%</text>
      <text x="50" y="56" textAnchor="middle" className="fill-muted-foreground" fontSize="6" fontFamily="JetBrains Mono">ROI</text>
    </svg>
  );
};

const ArbitragePanel = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortField, setSortField] = useState<keyof Product>('gravity');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toggleSort = (field: keyof Product) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = useMemo(() => allProducts
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = typeof a[sortField] === 'string' ? parseFloat((a[sortField] as string).replace(/[$%,]/g, '')) || 0 : a[sortField] as number;
      const bv = typeof b[sortField] === 'string' ? parseFloat((b[sortField] as string).replace(/[$%,]/g, '')) || 0 : b[sortField] as number;
      return sortDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number);
    }), [search, category, sortField, sortDir]);

  const totalActive = allProducts.filter(p => p.status === 'active').length;
  const avgEpc = (allProducts.reduce((s, p) => s + parseFloat(p.epc.replace('$', '')), 0) / allProducts.length).toFixed(2);

  return (
    <div className="space-y-3">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Revenue 7d', val: '$15,290', delta: '+18.4%', up: true },
          { label: 'Active Products', val: totalActive.toString(), delta: `${allProducts.filter(p => p.trend === 'up').length} trending`, up: true },
          { label: 'Avg EPC', val: `$${avgEpc}`, delta: '+$0.32', up: true },
          { label: 'Networks', val: '5', delta: 'All connected', up: true },
        ].map(kpi => (
          <div key={kpi.label} className="cyber-card p-3">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">{kpi.label}</span>
            <p className="text-lg font-bold font-mono text-foreground mt-0.5">{kpi.val}</p>
            <span className={`text-[9px] font-mono ${kpi.up ? 'text-success' : 'text-accent'}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-7 cyber-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Revenue & Clicks (7d)</span>
            <span className="text-sm font-bold font-mono text-primary">$15,290</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200 100% 50%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(200 100% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(220 8% 42%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(220 8% 42%)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="rev" stroke="hsl(200 100% 50%)" fill="url(#revG)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(345 100% 56%)" fill="none" strokeWidth={1} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="sm:col-span-5 cyber-card p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">24h Clicks</span>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={hourlyData} barSize={4}>
              <XAxis dataKey="h" tick={{ fontSize: 7, fill: 'hsl(220 8% 42%)' }} axisLine={false} tickLine={false} interval={5} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                {hourlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.val > 150 ? 'hsl(200 100% 50%)' : entry.val > 80 ? 'hsl(200 100% 30%)' : 'hsl(0 0% 16%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter Plot: EPC vs Gravity */}
      <div className="cyber-card p-3">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2 block">Product Landscape — EPC vs Gravity (bubble = margin)</span>
        <ResponsiveContainer width="100%" height={180}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="gravity" name="Gravity" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="epcNum" name="EPC" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={30} />
            <ZAxis type="number" dataKey="marginNum" range={[40, 400]} name="Margin" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <Scatter name="Products" data={allProducts.map(p => ({ name: p.name, gravity: p.gravity, epcNum: parseFloat(p.epc.replace('$', '')), marginNum: parseInt(p.margin) }))} fill="hsl(var(--primary))">
              {allProducts.map((p, i) => (
                <Cell key={i} fill={p.status === 'active' ? 'hsl(var(--primary))' : p.status === 'testing' ? 'hsl(var(--warn))' : 'hsl(var(--muted-foreground))'} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Product Table + Side Panel */}
      <div className="flex gap-3">
        <div className={`cyber-card p-3 transition-all ${selectedProduct ? 'flex-1' : 'w-full'}`}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-1">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-medium transition-colors ${
                    category === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                  }`}>{c}</button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-6 h-6 text-[10px] bg-secondary w-36 rounded-lg border-border font-mono" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { key: 'name', label: 'Product' }, { key: 'network', label: 'Net' },
                    { key: 'gravity', label: 'Grav' }, { key: 'payout', label: 'Pay' },
                    { key: 'margin', label: 'Margin' }, { key: 'epc', label: 'EPC' },
                    { key: 'conv', label: 'Conv' }, { key: 'status', label: 'Status' },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key as keyof Product)}
                      className="py-1.5 px-1.5 text-left text-muted-foreground cursor-pointer hover:text-foreground select-none font-medium">
                      <span className="inline-flex items-center gap-0.5">{col.label}{sortField === col.key && <ArrowUpDown className="w-2 h-2" />}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.name}
                    onClick={() => setSelectedProduct(selectedProduct?.name === p.name ? null : p)}
                    className={`border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer ${selectedProduct?.name === p.name ? 'bg-primary/5 border-primary/20' : ''}`}>
                    <td className="py-1.5 px-1.5">
                      <div className="flex items-center gap-1">
                        {p.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 text-success flex-shrink-0" /> : <TrendingDown className="w-2.5 h-2.5 text-accent flex-shrink-0" />}
                        <span className="font-medium truncate max-w-[120px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-1.5 text-muted-foreground">{p.network}</td>
                    <td className="py-1.5 px-1.5 font-bold">{p.gravity}</td>
                    <td className="py-1.5 px-1.5 text-primary">{p.payout}</td>
                    <td className="py-1.5 px-1.5 text-success">{p.margin}</td>
                    <td className="py-1.5 px-1.5">{p.epc}</td>
                    <td className="py-1.5 px-1.5">{p.conv}</td>
                    <td className="py-1.5 px-1.5">
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase border ${
                        p.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                        p.status === 'testing' ? 'bg-warn/10 text-warn border-warn/20' :
                        'bg-secondary text-muted-foreground border-border'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${p.status === 'active' ? 'bg-success' : p.status === 'testing' ? 'bg-warn' : 'bg-muted-foreground'}`} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
            <p className="text-[9px] text-muted-foreground font-mono">{filtered.length}/{allProducts.length} products</p>
            <div className="flex items-center gap-1">
              <button onClick={() => actions.exportData('csv', 'products')} className="px-2 py-0.5 rounded-lg text-[9px] bg-secondary text-muted-foreground hover:text-foreground font-mono border border-border/50">CSV</button>
              <button onClick={() => actions.exportData('pdf', 'products')} className="px-2 py-0.5 rounded-lg text-[9px] bg-secondary text-muted-foreground hover:text-foreground font-mono border border-border/50">PDF</button>
            </div>
          </div>
        </div>

        {/* Product Warp Side Panel */}
        {selectedProduct && (
          <div className="w-[320px] flex-shrink-0 cyber-card p-4 space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono truncate">{selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
            </div>

            {/* ROI Gauge */}
            <div className="h-[80px]">
              <ROIGauge margin={parseInt(selectedProduct.margin)} />
            </div>

            {/* Unit Economics */}
            <div className="space-y-1 text-[10px] font-mono">
              <span className="text-[7px] uppercase tracking-widest text-muted-foreground block mb-1">Unit Economics</span>
              {[
                { l: 'Cost', v: selectedProduct.cost, c: '' },
                { l: 'Payout', v: selectedProduct.payout, c: 'text-primary' },
                { l: 'Margin', v: selectedProduct.margin, c: 'text-success' },
                { l: 'LTV', v: selectedProduct.ltv, c: 'text-primary' },
                { l: 'EPC', v: selectedProduct.epc, c: '' },
              ].map(r => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Product Radar */}
            <div>
              <span className="text-[7px] uppercase tracking-widest text-muted-foreground block mb-1">Performance Profile</span>
              <ResponsiveContainer width="100%" height={150}>
                <RadarChart data={[
                  { m: 'Gravity', v: selectedProduct.gravity },
                  { m: 'Conv', v: parseFloat(selectedProduct.conv) * 10 },
                  { m: 'EPC', v: parseFloat(selectedProduct.epc.replace('$', '')) * 20 },
                  { m: 'Margin', v: parseInt(selectedProduct.margin) },
                  { m: 'LTV', v: Math.min(parseFloat(selectedProduct.ltv.replace('$', '')) / 10, 100) },
                ]}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="m" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar dataKey="v" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Squad */}
            <div>
              <span className="text-[7px] uppercase tracking-widest text-muted-foreground font-mono block mb-1.5">Agent Squad</span>
              <div className="flex items-center gap-1.5">
                {(() => {
                  const av = agentAvatars[selectedProduct.assignedAgent] || agentAvatars['none'];
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${av.color} flex items-center justify-center text-[8px] font-bold font-mono text-primary-foreground`}>{av.name}</div>
                      <div>
                        <p className="text-[10px] font-mono font-bold">{selectedProduct.assignedAgent}</p>
                        <p className="text-[8px] text-success font-mono">ACTIVE</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <button onClick={() => actions.analyzeProduct(selectedProduct.name)}
                className="mt-2 w-full px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold bg-primary text-primary-foreground">
                Analyze Product
              </button>
            </div>

            {/* Live Events */}
            <div>
              <span className="text-[7px] uppercase tracking-widest text-muted-foreground font-mono block mb-1">Live Events</span>
              <div className="space-y-1">
                {selectedProduct.events.length > 0 ? selectedProduct.events.map((e, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono">
                    <Clock className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{e.time}</span>
                    <span className="text-foreground/70">{e.event}</span>
                  </div>
                )) : <p className="text-[9px] text-muted-foreground font-mono">No recent events</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArbitragePanel;
