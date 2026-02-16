import { useState, useEffect } from 'react';
import { Search, AlertTriangle, TrendingUp, Flame, Target, CheckCircle2, XCircle, Radio } from 'lucide-react';
import { actions } from '@/core/windmillClient';

const pains = [
  { pain: 'Slow email deliverability', source: 'Reddit r/emailmarketing', product: 'Warmup Tool Pro', severity: 'high', mentions: 847, growth: '+34%', matched: true, aiValidated: true, marketPotential: '$2.4M' },
  { pain: 'CRM too expensive for startups', source: 'G2 Reviews', product: 'LiteCRM', severity: 'high', mentions: 623, growth: '+28%', matched: true, aiValidated: true, marketPotential: '$5.1M' },
  { pain: 'SEO audits take too long', source: 'Reddit r/SEO', product: 'Instant Audit AI', severity: 'high', mentions: 512, growth: '+41%', matched: true, aiValidated: true, marketPotential: '$1.8M' },
  { pain: 'No good Thai-language chatbot', source: 'Reddit r/Thailand', product: 'ChatBot TH', severity: 'medium', mentions: 389, growth: '+67%', matched: true, aiValidated: false, marketPotential: '$890K' },
  { pain: 'Landing pages convert poorly', source: 'G2 Reviews', product: 'ConvertMax', severity: 'high', mentions: 341, growth: '+22%', matched: true, aiValidated: true, marketPotential: '$3.2M' },
  { pain: 'VPN connection drops frequently', source: 'Reddit r/VPN', product: 'StableVPN Pro', severity: 'medium', mentions: 298, growth: '+15%', matched: true, aiValidated: true, marketPotential: '$4.5M' },
  { pain: 'Invoice creation is manual', source: 'G2 Reviews', product: 'AutoInvoice AI', severity: 'low', mentions: 234, growth: '+9%', matched: false, aiValidated: false, marketPotential: '$620K' },
  { pain: 'Social posting too time consuming', source: 'Reddit r/socialmedia', product: 'ScheduleBot', severity: 'medium', mentions: 201, growth: '+18%', matched: true, aiValidated: true, marketPotential: '$1.1M' },
  { pain: 'Content writing takes hours', source: 'Reddit r/copywriting', product: 'WriteAI Pro', severity: 'high', mentions: 567, growth: '+52%', matched: true, aiValidated: true, marketPotential: '$7.8M' },
  { pain: 'Password management is messy', source: 'G2 Reviews', product: 'PassVault', severity: 'low', mentions: 178, growth: '+11%', matched: false, aiValidated: false, marketPotential: '$340K' },
];

const liveKeywords = [
  'email warmup tool', 'cheap CRM startup', 'SEO audit free', 'Thai chatbot AI',
  'landing page optimization', 'VPN stable connection', 'auto invoice generator',
  'social media scheduler free', 'AI content writer', 'password manager best',
  'affiliate marketing tool', 'cold email outreach', 'conversion rate optimizer',
  'no-code app builder', 'customer support chatbot', 'lead generation SaaS',
];

const PainMiningPanel = () => {
  const [sortBy, setSortBy] = useState<'mentions' | 'growth'>('mentions');
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulseIdx(i => (i + 1) % liveKeywords.length), 800);
    return () => clearInterval(t);
  }, []);

  const sorted = [...pains].sort((a, b) => {
    if (sortBy === 'mentions') return b.mentions - a.mentions;
    return parseFloat(b.growth) - parseFloat(a.growth);
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <div>
            <h2 className="text-sm font-bold font-mono">Pain Mining Engine</h2>
            <p className="text-[9px] text-muted-foreground font-mono">4,210 sources • Reddit, G2, Twitter</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => actions.scanPains('all')}
            className="px-2 py-1 rounded-lg text-[9px] font-mono font-bold bg-primary text-primary-foreground">
            Run Scan
          </button>
          <span className="flex items-center gap-1 text-[9px] font-mono text-success">
            <Flame className="w-3 h-3" /> LIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3">
        {/* KPIs */}
        <div className="sm:col-span-3 cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Total Pains</span>
          <p className="text-xl font-bold font-mono mt-0.5">4,210</p>
          <span className="text-[9px] text-success font-mono">+342 today</span>
        </div>
        <div className="sm:col-span-3 cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Matched</span>
          <p className="text-xl font-bold font-mono mt-0.5 text-success">1,089</p>
          <span className="text-[9px] text-muted-foreground font-mono">26% match rate</span>
        </div>
        <div className="sm:col-span-3 cyber-card p-3">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">AI Validated</span>
          <p className="text-xl font-bold font-mono mt-0.5 text-primary">847</p>
          <span className="text-[9px] text-muted-foreground font-mono">78% validation</span>
        </div>

        {/* Market Pulse Widget */}
        <div className="sm:col-span-3 cyber-card p-3 overflow-hidden">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono flex items-center gap-1 mb-1.5">
            <Radio className="w-3 h-3 text-primary animate-pulse" /> Market Pulse
          </span>
          <div className="space-y-0.5">
            {liveKeywords.slice(pulseIdx, pulseIdx + 5).map((kw, i) => (
              <div key={`${kw}-${i}`} className={`text-[9px] font-mono truncate transition-opacity duration-300 ${i === 0 ? 'text-primary font-bold' : i < 3 ? 'text-foreground/70' : 'text-muted-foreground/50'}`}>
                {kw}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="cyber-card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
            <Target className="w-3 h-3" /> Pain Points
          </span>
          <div className="flex items-center gap-1">
            {(['mentions', 'growth'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-medium transition-colors ${
                  sortBy === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                }`}>{s === 'mentions' ? 'Mentions' : 'Growth'}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">#</th>
                <th className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">Pain Point</th>
                <th className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">Source</th>
                <th className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">Intensity</th>
                <th className="py-1.5 px-1.5 text-right text-muted-foreground font-medium">Mentions</th>
                <th className="py-1.5 px-1.5 text-right text-muted-foreground font-medium">Growth</th>
                <th className="py-1.5 px-1.5 text-right text-muted-foreground font-medium">Market</th>
                <th className="py-1.5 px-1.5 text-center text-muted-foreground font-medium">AI Valid.</th>
                <th className="py-1.5 px-1.5 text-left text-muted-foreground font-medium">Product Match</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className={`py-1.5 px-1.5 font-bold ${i < 3 ? 'text-accent' : 'text-muted-foreground'}`}>#{i + 1}</td>
                  <td className="py-1.5 px-1.5 font-medium max-w-[200px] truncate">{p.pain}</td>
                  <td className="py-1.5 px-1.5 text-muted-foreground">{p.source}</td>
                  <td className="py-1.5 px-1.5">
                    <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase border ${
                      p.severity === 'high' ? 'text-accent border-accent/20 bg-accent/5' :
                      p.severity === 'medium' ? 'text-warn border-warn/20 bg-warn/5' :
                      'text-muted-foreground border-border bg-secondary/50'
                    }`}>{p.severity}</span>
                  </td>
                  <td className="py-1.5 px-1.5 text-right">{p.mentions.toLocaleString()}</td>
                  <td className={`py-1.5 px-1.5 text-right font-bold ${parseFloat(p.growth) > 30 ? 'text-accent' : 'text-success'}`}>{p.growth}</td>
                  <td className="py-1.5 px-1.5 text-right text-primary">{p.marketPotential}</td>
                  <td className="py-1.5 px-1.5 text-center">
                    {p.aiValidated ? <CheckCircle2 className="w-3 h-3 text-success inline" /> : <XCircle className="w-3 h-3 text-muted-foreground inline" />}
                  </td>
                  <td className="py-1.5 px-1.5">
                    {p.matched ? (
                      <span className="text-success flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />{p.product}</span>
                    ) : <span className="text-muted-foreground">—</span>}
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

export default PainMiningPanel;
