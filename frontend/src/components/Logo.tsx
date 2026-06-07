import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export default function Logo({ size = 32, showWordmark = true }: LogoProps) {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 64 64"
        sx={{
          width: size,
          height: size,
          filter: 'drop-shadow(0 4px 12px rgba(34,211,238,0.35))',
        }}
        aria-hidden
      >
        <defs>
          <linearGradient id="fnLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <path
          d="M44 32c-6 8-14 10-22 7l-6 5 2-8c-2-2-2-6 0-8l-2-8 6 5c8-3 16-1 22 7z"
          fill="url(#fnLogoGrad)"
        />
        <circle cx="40" cy="29" r="2" fill="#03121a" />
        <path d="M44 32l8-4-2 4 2 4z" fill="url(#fnLogoGrad)" />
      </Box>
      {showWordmark && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Sora, Inter, sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Fish
            <Box component="span" sx={{ color: 'primary.main' }}>
              Net
            </Box>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: 9.5,
              fontWeight: 600,
              mt: 0.25,
            }}
          >
            Angler's Forum
          </Typography>
        </Box>
      )}
    </Box>
  );
}
