import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Mode = 'front' | 'backend' | 'architect';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(() => {
    const saved = localStorage.getItem('arviva-mode');
    return (saved === 'front' || saved === 'backend' || saved === 'architect') ? saved : 'front';
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('arviva-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('arviva-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    localStorage.setItem('arviva-mode', m);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, isDark, toggleTheme }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
};
