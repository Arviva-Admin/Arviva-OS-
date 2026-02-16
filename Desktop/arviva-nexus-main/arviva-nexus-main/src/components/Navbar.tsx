import { useMode } from '@/contexts/ModeContext';
import { User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { mode, setMode, isDark, toggleTheme } = useMode();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-navbar" role="banner">
      <nav className="flex items-center justify-between px-2 sm:px-4 lg:px-6 h-10" aria-label="Main navigation">
        {/* Left: Brand */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <img src="/logo-192.png" alt="ARVIVA OS" className="w-5 h-5 rounded-md" />
          <h1 className="text-[11px] font-bold tracking-tight text-primary font-mono hidden sm:block">
            ARVIVA<span className="text-muted-foreground font-normal ml-1">OS</span>
          </h1>
        </div>

        {/* Center: Mode Switch */}
        <div className="flex items-center mx-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <div className="flex items-center rounded-xl border border-border bg-secondary/50 overflow-hidden">
            {([
              { key: 'front' as const, label: 'BIZ', full: 'FRONTEND' },
              { key: 'backend' as const, label: 'DEV', full: 'BACKEND' },
              { key: 'architect' as const, label: 'ARCH', full: 'ARCHITECT' },
            ]).map((m, i, arr) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-2 sm:px-4 py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider transition-all ${
                  i === 0 ? 'rounded-l-xl' : i === arr.length - 1 ? 'rounded-r-xl' : ''
                } ${
                  mode === m.key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="sm:hidden">{m.label}</span>
                <span className="hidden sm:inline">{m.full}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Theme toggle + User */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/30 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3 h-3 text-muted-foreground" /> : <Moon className="w-3 h-3 text-muted-foreground" />}
          </button>
          <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center">
            <User className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
