import { Box, Container } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';
import { categoriesApi } from '../api/categories';
import { useApi } from '../hooks/useApi';
import CategoryCard from '../components/CategoryCard';
import PageHeader from '../components/PageHeader';
import {
  EmptyState,
  ErrorView,
  SkeletonList,
} from '../components/StateViews';

export default function CategoriesPage() {
  const { data, loading, error, refresh } = useApi(
    () => categoriesApi.list(),
    [],
  );

  return (
    <Container maxWidth="lg">
      <PageHeader
        eyebrow="Forum"
        title="All categories"
        subtitle="Pick a topic and dive in. Anyone can read — sign in to post."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]}
      />

      {loading && <SkeletonList count={6} />}
      {error && <ErrorView error={error} onRetry={refresh} />}
      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState
          icon={<ForumIcon fontSize="inherit" />}
          title="No categories yet"
          description="An administrator hasn't created any categories. Check back soon."
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {data.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </Box>
      )}
    </Container>
  );
}
