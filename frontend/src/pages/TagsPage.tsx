import { Card, CardContent, Chip, Container, Stack } from '@mui/material';
import { LocalOffer as TagIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { searchApi } from '../api/search';
import { useApi } from '../hooks/useApi';
import PageHeader from '../components/PageHeader';
import {
  EmptyState,
  ErrorView,
  SkeletonList,
} from '../components/StateViews';

export default function TagsPage() {
  const { data, loading, error, refresh } = useApi(
    () => searchApi.tags(),
    [],
  );

  return (
    <Container maxWidth="lg">
      <PageHeader
        eyebrow="Discover"
        title="Tags"
        subtitle="Browse topics our community is talking about."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Tags' }]}
      />

      {loading && <SkeletonList count={3} />}
      {error && <ErrorView error={error} onRetry={refresh} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState
          icon={<TagIcon fontSize="inherit" />}
          title="No tags yet"
          description="Tags appear here once members start tagging threads."
        />
      )}

      {!loading && !error && data && data.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              useFlexGap
              sx={{ flexWrap: 'wrap', gap: 1.25 }}
            >
              {data.map((t) => (
                <Chip
                  key={t.name}
                  component={RouterLink}
                  to={`/search?q=${encodeURIComponent(t.name)}`}
                  clickable
                  label={t.count ? `#${t.name} · ${t.count}` : `#${t.name}`}
                  variant="outlined"
                  sx={{
                    py: 2.5,
                    fontSize: 14,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    },
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
