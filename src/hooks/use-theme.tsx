/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'dark';
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f0f23' : '#eef0fc');
  }
};

/**
 * Uses the View Transitions API (where supported) to crossfade the entire
 * page as a single composited snapshot — eliminates per-element transition
 * artifacts. Falls back to the normal class-based swap on older browsers.
 */
const applyThemeWithTransition = (theme: Theme) => {
  if (!document.startViewTransition) {
    applyTheme(theme);
    return;
  }

  // Disable per-element transitions during the view transition to avoid
  // double-animating and reduce compositor work.
  const root = document.documentElement;
  root.classList.add('theme-switching');

  const transition = document.startViewTransition(() => {
    applyTheme(theme);
  });

  transition.finished.then(() => {
    root.classList.remove('theme-switching');
  });
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => getPreferredTheme());
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    // On initial mount, apply instantly (no animation needed)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      applyTheme(theme);
      return;
    }
    applyThemeWithTransition(theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
