import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // ローカルストレージから初期値を取得、なければシステム設定
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    console.log('Initial theme from localStorage:', savedTheme);
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    console.log('Theme changed to:', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('Added dark class to html element');
    } else {
      root.classList.remove('dark');
      console.log('Removed dark class from html element');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('toggleTheme called! Current theme:', theme);
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      console.log('Switching from', prev, 'to', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
