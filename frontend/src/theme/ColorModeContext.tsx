import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import buildTheme, { type ThemeMode } from './theme';
import { ColorModeContext } from './colorModeContextValue';

const STORAGE_KEY = 'fishnet.theme';

function readInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const toggle = useCallback(
    () => setModeState((m) => (m === 'dark' ? 'light' : 'dark')),
    [],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

