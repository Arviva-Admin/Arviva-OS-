interface Props {
  panels?: { key: string; label: string; icon: any }[];
  activePanel?: string;
  onPanelChange?: (key: string) => void;
}

const FloatingNexus = ({ panels, activePanel, onPanelChange }: Props) => {
  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 max-w-[95vw]" style={{ zIndex: 9999 }}>
      <div className="glass-float rounded-2xl px-1.5 sm:px-2 py-1.5 flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        {panels && onPanelChange && panels.map(p => {
          const Icon = p.icon;
          const active = activePanel === p.key;
          return (
            <button key={p.key} onClick={() => onPanelChange(p.key)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-[12px] font-mono font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}>
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingNexus;
