import { motion } from 'framer-motion';
import { TestTube, Play, CheckCircle2, XCircle, Loader2, Clock, BarChart3, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TestResult {
  name: string; category: string; status: 'pass' | 'fail' | 'running'; time: string; lastRun: string;
}

const allTests: TestResult[] = [
  { name: 'Playwright: ClickBank scraper', category: 'Scraping', status: 'pass', time: '2.3s', lastRun: '2m ago' },
  { name: 'Playwright: G2 review scraper', category: 'Scraping', status: 'pass', time: '3.1s', lastRun: '2m ago' },
  { name: 'Playwright: Reddit pain detector', category: 'Scraping', status: 'pass', time: '1.8s', lastRun: '2m ago' },
  { name: 'LLM: Pain classification', category: 'AI', status: 'pass', time: '1.1s', lastRun: '5m ago' },
  { name: 'LLM: Content generation', category: 'AI', status: 'pass', time: '2.4s', lastRun: '5m ago' },
  { name: 'LLM: Product matching', category: 'AI', status: 'pass', time: '0.9s', lastRun: '5m ago' },
  { name: 'Mautic: Email send API', category: 'Email', status: 'pass', time: '0.8s', lastRun: '3m ago' },
  { name: 'Mautic: List management', category: 'Email', status: 'pass', time: '0.5s', lastRun: '3m ago' },
  { name: 'Mautic: Template render', category: 'Email', status: 'fail', time: '4.2s', lastRun: '3m ago' },
  { name: 'Scout: Reddit r/SaaS scraper', category: 'Scraping', status: 'fail', time: '8.1s', lastRun: '10m ago' },
  { name: 'Router: Model fallback chain', category: 'Infra', status: 'pass', time: '0.3s', lastRun: '1m ago' },
  { name: 'Router: Token budget calc', category: 'Infra', status: 'pass', time: '0.1s', lastRun: '1m ago' },
  { name: 'Sentinel: GDPR compliance', category: 'Compliance', status: 'pass', time: '1.5s', lastRun: '8m ago' },
  { name: 'Sentinel: Cookie consent', category: 'Compliance', status: 'pass', time: '0.7s', lastRun: '8m ago' },
  { name: 'Optimizer: A/B split logic', category: 'Core', status: 'pass', time: '0.2s', lastRun: '15m ago' },
];

const categories = ['All', 'Scraping', 'AI', 'Email', 'Infra', 'Compliance', 'Core'];

const TestSuitePanel = () => {
  const [running, setRunning] = useState(false);
  const [catFilter, setCatFilter] = useState('All');
  const [tests, setTests] = useState(allTests);

  const runAll = () => {
    setRunning(true);
    setTests(prev => prev.map(t => ({ ...t, status: 'running' as const })));
    setTimeout(() => {
      setTests(allTests);
      setRunning(false);
    }, 2500);
  };

  const passed = tests.filter(t => t.status === 'pass').length;
  const failed = tests.filter(t => t.status === 'fail').length;
  const total = tests.length;
  const coverage = 82;

  const pieData = [
    { name: 'Passed', value: passed, color: 'hsl(160 84% 39%)' },
    { name: 'Failed', value: failed, color: 'hsl(330 81% 60%)' },
  ];

  const filtered = tests.filter(t => catFilter === 'All' || t.category === catFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <TestTube className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Test Suite</h2>
            <p className="text-[10px] text-muted-foreground font-mono">{total} tests • {passed} passed • {failed} failed</p>
          </div>
        </div>
        <button onClick={runAll} disabled={running}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 neon-glow-blue">
          {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {running ? 'Running...' : 'Run All Tests'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="cyber-card p-4 flex items-center gap-3">
          <ResponsiveContainer width={50} height={50}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={15} outerRadius={22} strokeWidth={0}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div>
            <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground font-mono">Pass Rate</p>
            <p className="text-lg font-bold font-mono neon-text-green">{Math.round((passed / total) * 100)}%</p>
          </div>
        </div>
        {[
          { label: 'Passed', val: `${passed}/${total}`, color: 'neon-text-green', icon: CheckCircle2 },
          { label: 'Failed', val: `${failed}/${total}`, color: 'neon-text-pink', icon: XCircle },
          { label: 'Coverage', val: `${coverage}%`, color: 'text-primary', icon: BarChart3 },
        ].map((s) => (
          <div key={s.label} className="cyber-card p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground font-mono">{s.label}</span>
            </div>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Test list */}
      <div className="cyber-card p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          {filtered.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className={`flex items-center gap-3 py-2 px-2.5 rounded-lg transition-colors border-l-2
                ${t.status === 'fail' ? 'bg-accent/5 border-accent/50 hover:bg-accent/10' :
                  t.status === 'running' ? 'bg-primary/5 border-primary/50' :
                  'border-transparent hover:bg-secondary/30'}`}>
              {t.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" /> :
               t.status === 'fail' ? <XCircle className="w-4 h-4 text-accent flex-shrink-0" /> :
               <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />}
              <span className="text-[11px] font-medium flex-1">{t.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-secondary text-[8px] text-muted-foreground">{t.category}</span>
              <span className="text-[10px] text-muted-foreground font-mono w-12 text-right">{t.time}</span>
              <span className="text-[9px] text-muted-foreground w-16 text-right">{t.lastRun}</span>
              <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary transition-colors">
                <RefreshCw className="w-3 h-3 text-muted-foreground" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSuitePanel;
