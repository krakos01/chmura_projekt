import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

export function CenteredSpinner({ label }: { label?: string }) {
  return (
    <Stack
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}
    >
      <CircularProgress />
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
    </Stack>
  );
}

interface ErrorViewProps {
  error: Error | null;
  onRetry?: () => void;
}
export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={
        onRetry ? (
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        ) : undefined
      }
    >
      {error?.message ?? 'Something went wrong.'}
    </Alert>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}
export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: 'center',
        border: (t) => `1px dashed ${t.palette.divider}`,
        borderRadius: 3,
        bgcolor: (t) =>
          t.palette.mode === 'dark'
            ? 'rgba(15,23,42,0.45)'
            : 'rgba(255,255,255,0.6)',
      }}
    >
      {icon && (
        <Box sx={{ color: 'text.secondary', mb: 1.5, fontSize: 40 }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 460, mx: 'auto' }}
        >
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={88}
          sx={{ borderRadius: 3 }}
        />
      ))}
    </Stack>
  );
}
