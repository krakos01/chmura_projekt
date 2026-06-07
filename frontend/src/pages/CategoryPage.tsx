import { Button, Container, Stack } from '@mui/material';
import { Add as AddIcon, Forum as ForumIcon } from '@mui/icons-material';
import { useCallback } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/PageHeader';
import ThreadListItem from '../components/ThreadListItem';
import {
  EmptyState,
  ErrorView,
  SkeletonList,
} from '../components/StateViews';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const categoryFetcher = useCallback(
    () => categoriesApi.get(id!),
    [id],
  );
  const threadsFetcher = useCallback(
    () => categoriesApi.threads(id!),
    [id],
  );

  const category = useApi(categoryFetcher, [id]);
  const threads = useApi(threadsFetcher, [id]);

  const newThreadHref = `/threads/new${id ? `?categoryId=${id}` : ''}`;

  return (
    <Container maxWidth="lg">
      <PageHeader
        eyebrow="Category"
        title={category.data?.name ?? (category.loading ? 'Loading…' : 'Category')}
        subtitle={category.data?.description}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          { label: category.data?.name ?? 'Category' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to={isAuthenticated ? newThreadHref : '/login'}
            state={!isAuthenticated ? { from: newThreadHref } : undefined}
          >
            New thread
          </Button>
        }
      />

      {category.error && (
        <ErrorView error={category.error} onRetry={category.refresh} />
      )}

      {threads.loading && <SkeletonList count={5} />}
      {threads.error && (
        <ErrorView error={threads.error} onRetry={threads.refresh} />
      )}
      {!threads.loading &&
        !threads.error &&
        (threads.data?.length ?? 0) === 0 && (
          <EmptyState
            icon={<ForumIcon fontSize="inherit" />}
            title="No threads here yet"
            description="Be the first to start the conversation in this category."
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={RouterLink}
                to={isAuthenticated ? newThreadHref : '/login'}
                state={!isAuthenticated ? { from: newThreadHref } : undefined}
              >
                Start a thread
              </Button>
            }
          />
        )}

      {!threads.loading && !threads.error && threads.data && threads.data.length > 0 && (
        <Stack spacing={2}>
          {threads.data.map((t) => (
            <ThreadListItem
              key={t.id}
              thread={t}
              categoryName={category.data?.name}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
