import { createTheme, alpha, type Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surface: Palette['primary'];
  }
  interface PaletteOptions {
    surface?: PaletteOptions['primary'];
  }
}

export type ThemeMode = 'light' | 'dark';

const sharedTypography = {
  fontFamily:
    'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.015em',
  },
  h4: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 600,
  },
  h6: {
    fontFamily: 'Sora, Inter, system-ui, sans-serif',
    fontWeight: 600,
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  body1: { lineHeight: 1.65 },
  body2: { lineHeight: 1.6 },
};

const buildTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === 'dark';

  const primaryMain = isDark ? '#22d3ee' : '#0e7490';
  const secondaryMain = isDark ? '#f59e0b' : '#b45309';
  const bgDefault = isDark ? '#070d18' : '#f4f7fb';
  const bgPaper = isDark ? '#0f172a' : '#ffffff';
  const surfaceMain = isDark ? '#111b2d' : '#eef3f9';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: isDark ? '#67e8f9' : '#22d3ee',
        dark: isDark ? '#0891b2' : '#155e75',
        contrastText: isDark ? '#031018' : '#ffffff',
      },
      secondary: {
        main: secondaryMain,
        light: '#fbbf24',
        dark: '#92400e',
        contrastText: '#1a1003',
      },
      success: { main: isDark ? '#34d399' : '#059669' },
      warning: { main: isDark ? '#fbbf24' : '#d97706' },
      error: { main: isDark ? '#f87171' : '#dc2626' },
      info: { main: isDark ? '#60a5fa' : '#2563eb' },
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      surface: {
        main: surfaceMain,
        light: isDark ? '#1a2640' : '#f8fafc',
        dark: isDark ? '#0a1322' : '#dbe4f0',
        contrastText: isDark ? '#e2e8f0' : '#0f172a',
      },
      text: {
        primary: isDark ? '#e2e8f0' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
      },
      divider: isDark ? alpha('#94a3b8', 0.12) : alpha('#0f172a', 0.08),
    },
    typography: sharedTypography,
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? `radial-gradient(1200px 600px at 80% -10%, ${alpha(
                  '#0891b2',
                  0.18,
                )} 0%, transparent 60%),
                 radial-gradient(900px 500px at -10% 10%, ${alpha(
                   '#7c3aed',
                   0.15,
                 )} 0%, transparent 55%),
                 linear-gradient(180deg, ${bgDefault} 0%, ${bgDefault} 100%)`
              : `radial-gradient(1200px 600px at 80% -10%, ${alpha(
                  '#22d3ee',
                  0.18,
                )} 0%, transparent 60%),
                 radial-gradient(900px 500px at -10% 10%, ${alpha(
                   '#0e7490',
                   0.1,
                 )} 0%, transparent 55%),
                 linear-gradient(180deg, ${bgDefault} 0%, ${bgDefault} 100%)`,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { color: 'transparent', elevation: 0 },
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(180%) blur(14px)',
            WebkitBackdropFilter: 'saturate(180%) blur(14px)',
            backgroundColor: isDark
              ? alpha('#0b1424', 0.7)
              : alpha('#ffffff', 0.75),
            borderBottom: `1px solid ${
              isDark ? alpha('#94a3b8', 0.1) : alpha('#0f172a', 0.08)
            }`,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${
              isDark ? alpha('#94a3b8', 0.1) : alpha('#0f172a', 0.06)
            }`,
            borderRadius: 16,
            backgroundColor: isDark
              ? alpha('#0f172a', 0.7)
              : alpha('#ffffff', 0.92),
            backdropFilter: 'blur(8px)',
            transition:
              'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
            '&:hover': {
              borderColor: isDark
                ? alpha(primaryMain, 0.45)
                : alpha(primaryMain, 0.35),
              boxShadow: isDark
                ? `0 10px 30px -10px ${alpha('#000', 0.6)}, 0 0 0 1px ${alpha(
                    primaryMain,
                    0.25,
                  )}`
                : `0 14px 36px -16px ${alpha(
                    '#0f172a',
                    0.2,
                  )}, 0 0 0 1px ${alpha(primaryMain, 0.18)}`,
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 18,
            paddingBlock: 8,
          },
          contained: ({ ownerState }) =>
            ownerState.color === 'primary'
              ? {
                  background: `linear-gradient(135deg, ${primaryMain} 0%, ${
                    isDark ? '#0e7490' : '#155e75'
                  } 100%)`,
                  color: isDark ? '#04121a' : '#ffffff',
                  '&:hover': {
                    filter: 'brightness(1.05)',
                    boxShadow: `0 8px 24px -10px ${alpha(primaryMain, 0.6)}`,
                  },
                }
              : {},
          outlined: {
            borderColor: isDark
              ? alpha('#94a3b8', 0.25)
              : alpha('#0f172a', 0.15),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 999,
          },
          outlined: {
            borderColor: isDark
              ? alpha('#94a3b8', 0.25)
              : alpha('#0f172a', 0.12),
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark
              ? alpha('#0b1424', 0.7)
              : alpha('#ffffff', 0.9),
          },
        },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
        styleOverrides: {
          root: {
            fontWeight: 500,
            color: 'inherit',
            transition: 'color 150ms ease',
            '&:hover': { color: primaryMain },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            fontFamily: 'Sora, Inter, sans-serif',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark
              ? alpha('#0b1424', 0.95)
              : alpha('#0f172a', 0.9),
            fontSize: 12.5,
            padding: '6px 10px',
            borderRadius: 8,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${
              isDark ? alpha('#94a3b8', 0.1) : alpha('#0f172a', 0.08)
            }`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark
              ? alpha('#94a3b8', 0.1)
              : alpha('#0f172a', 0.08),
          },
        },
      },
    },
  });
};

export default buildTheme;
