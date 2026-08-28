import * as React from 'react';

export type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = Exclude<Theme, 'system'>;

type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}>;

type ThemeProviderState = Readonly<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>;

const colorSchemeQuery = '(prefers-color-scheme: dark)';
const themeValues: readonly Theme[] = ['dark', 'light', 'system'];
const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value !== null && themeValues.includes(value as Theme);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(colorSchemeQuery).matches ? 'dark' : 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'tickdeck.theme-preference.v1',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    let storedTheme: string | null = null;
    try {
      storedTheme = localStorage.getItem(storageKey);
    } catch {
      // Storage can be denied or unavailable; the in-memory preference remains authoritative.
    }
    return isTheme(storedTheme) ? storedTheme : defaultTheme;
  });

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // The shell must continue to theme in memory when persistence is unavailable.
      }
    },
    [storageKey],
  );

  React.useEffect(() => {
    const applyTheme = () => {
      const resolved = theme === 'system' ? getSystemTheme() : theme;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
      document.documentElement.style.colorScheme = resolved;
    };
    applyTheme();
    if (theme !== 'system') return undefined;
    const media = window.matchMedia(colorSchemeQuery);
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  const value = React.useMemo(() => ({ theme, setTheme }), [setTheme, theme]);
  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeProviderContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
