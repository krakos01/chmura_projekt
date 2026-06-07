import { useContext } from 'react';
import {
  ColorModeContext,
  type ColorModeContextValue,
} from '../theme/colorModeContextValue';

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return ctx;
}
