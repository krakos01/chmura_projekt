import { createContext } from 'react';
import type { ThemeMode } from './theme';

export interface ColorModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(
  null,
);
