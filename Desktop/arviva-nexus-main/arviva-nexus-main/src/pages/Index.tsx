import { useState, useEffect } from 'react';
import { useMode } from '@/contexts/ModeContext';

import Navbar from '@/components/Navbar';
import FloatingNexus from '@/components/FloatingNexus';
import RightChat from '@/components/RightChat';

// Business panels
import ArbitragePanel from '@/components/business/ArbitragePanel';
import PainMiningPanel from '@/components/business/PainMiningPanel';
import EmailPanel from '@/components/business/EmailPanel';
import GlobalMatrixPanel from '@/components/business/GlobalMatrixPanel';
import WindmillLogsPanel from '@/components/business/WindmillLogsPanel';
import AgentOverviewPanel from '@/components/business/AgentOverviewPanel';

// Backend panels
import AgentBuilderPanel from '@/components/backend/AgentBuilderPanel';
import TestSuitePanel from '@/components/backend/TestSuitePanel';
import EvalPanel from '@/components/backend/EvalPanel';
import DeployPanel from '@/components/backend/DeployPanel';

// Architect panel
import ArchitectPanel from '@/components/architect/ArchitectPanel';

import {
  Zap, Search, Mail, Globe, Terminal, Bot,
  Cpu, TestTube, FlaskConical, Rocket,
} from 'lucide-react';

const frontPanels = [
  { key: 'arbitrage', label: 'Products', icon: Zap, component: ArbitragePanel },
  { key: 'painmining', label: 'Pain Mining', icon: Search, component: PainMiningPanel },
  { key: 'global', label: 'Global Matrix', icon: Globe, component: GlobalMatrixPanel },
  { key: 'email', label: 'Email Ops', icon: Mail, component: EmailPanel },
  { key: 'logs', label: 'Live Logs', icon: Terminal, component: WindmillLogsPanel },
  { key: 'agents', label: 'Agents', icon: Bot, component: AgentOverviewPanel },
];

const backendPanels = [
  { key: 'agentbuilder', label: 'Agent Builder', icon: Cpu, component: AgentBuilderPanel },
  { key: 'testsuite', label: 'Test Suite', icon: TestTube, component: TestSuitePanel },
  { key: 'eval', label: 'Eval', icon: FlaskConical, component: EvalPanel },
  { key: 'deploy', label: 'Deploy', icon: Rocket, component: DeployPanel },
  { key: 'agents', label: 'Agents', icon: Bot, component: AgentOverviewPanel },
];

const Index = () => {
  const { mode } = useMode();

  if (mode === 'architect') {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <Navbar />
        <ArchitectPanel />
      </div>
    );
  }

  const panels = mode === 'front' ? frontPanels : backendPanels;
  return <PanelView panels={panels} mode={mode} />;
};

const PanelView = ({ panels, mode }: { panels: typeof frontPanels; mode: string }) => {
  const defaultKey = panels[0].key;

  const [activePanel, setActivePanel] = useState(() => {
    const saved = localStorage.getItem(`arviva-panel-${mode}`);
    return panels.find(p => p.key === saved)?.key || defaultKey;
  });

  useEffect(() => {
    const saved = localStorage.getItem(`arviva-panel-${mode}`);
    const found = panels.find(p => p.key === saved);
    setActivePanel(found ? found.key : panels[0].key);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`arviva-panel-${mode}`, activePanel);
  }, [activePanel, mode]);

  const active = panels.find(p => p.key === activePanel) || panels[0];
  const ActiveComponent = active.component;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 overflow-y-auto pt-12 pb-20 px-4 lg:px-6 max-w-[1800px] mx-auto w-full relative z-10">
        <ActiveComponent />
      </main>

      <FloatingNexus
        panels={panels.map(p => ({ key: p.key, label: p.label, icon: p.icon }))}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
      />

      {/* Chat bubble only on business/backend, not architect */}
      <RightChat />
    </div>
  );
};

export default Index;
