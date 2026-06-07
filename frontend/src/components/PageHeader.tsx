import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  action?: ReactNode;
  eyebrow?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  eyebrow,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1.5, color: 'text.secondary', fontSize: 14 }}
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            if (isLast || !crumb.to) {
              return (
                <Typography
                  key={`${crumb.label}-${idx}`}
                  color="text.primary"
                  sx={{ fontSize: 14, fontWeight: 500 }}
                >
                  {crumb.label}
                </Typography>
              );
            }
            return (
              <Link
                key={`${crumb.label}-${idx}`}
                component={RouterLink}
                to={crumb.to}
                sx={{ fontSize: 14 }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <Box>
          {eyebrow && (
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                letterSpacing: '0.16em',
                fontWeight: 700,
              }}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: 28, sm: 34 }, mt: eyebrow ? 0.5 : 0 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 720 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Stack>
    </Box>
  );
}
