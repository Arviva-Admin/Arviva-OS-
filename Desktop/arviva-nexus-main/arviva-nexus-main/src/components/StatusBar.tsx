import { useMode } from '@/contexts/ModeContext';
import { Activity, Cpu, HardDrive, Wifi, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const StatusBar = () => {
  const { mode } = useMode();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-6 glass-navbar flex items-center justify-between px-4 text-[9px] font-mono text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Activity className="w-2.5 h-2.5 text-success" />
          <span className="text-success">NOMINAL</span>
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="w-2.5 h-2.5" /> CPU 23%
        </span>
        <span className="flex items-center gap-1">
          <HardDrive className="w-2.5 h-2.5" /> RAM 4.2GB
        </span>
        <span className="flex items-center gap-1">
          <Wifi className="w-2.5 h-2.5 text-primary" /> 200 Agents
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="uppercase tracking-wider text-primary font-bold">{mode}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {time.toLocaleTimeString('sv-SE')}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
