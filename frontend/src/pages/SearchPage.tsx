import {
  Box,
  Container,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { searchApi } from '../api/search';
import { useApi } from '../hooks/useApi';
import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import ThreadListItem from '../components/ThreadListItem';
import {
  CenteredSpinner,
  EmptyState,
  ErrorView,
} from '../components/StateViews';

type Tab = 'all' | 'threads' | 'posts';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const activeQuery = params.get('q') ?? '';

  const [tab, setTab] = useState<Tab>('all');

  const categories = useApi(() => categoriesApi.list(), []);
  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    categories.data?.forEach((c) => map.set(String(c.id), c.name));
    return map;
  }, [categories.data]);

  const fetcher = useCallback(
    () => searchApi.search(activeQuery),
    [activeQuery],
  );
  const enabled = activeQuery.trim().length > 0;
  const { data, loading, error, refresh } = useApi(
    () => (enabled ? fetcher() : Promise.resolve({ threads: [], posts: [] })),
    [activeQuery],
  );

  const threads = data?.threads ?? [];
  const posts = data?.posts ?? [];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const trimmed = String(data.get('q') ?? '').trim();
    if (!trimmed) return;
    setParams({ q: trimmed });
  };

  const showThreads = tab === 'all' || tab === 'threads';
  const showPosts = tab === 'all' || tab === 'posts';

  const totalCount = useMemo(
    () => threads.length + posts.length,
    [threads.length, posts.length],
  );

  return (
    <Container maxWidth="lg">
      <PageHeader
        eyebrow="Search"
        title={
          activeQuery
            ? `Results for “${activeQuery}”`
            : 'Search the forum'
        }
        subtitle={
          activeQuery
            ? `${totalCount} result${totalCount === 1 ? '' : 's'}`
            : 'Find threads, posts, gear talk, and trip reports.'
        }
      />

      <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
        <TextField
          key={activeQuery}
          name="q"
          defaultValue={activeQuery}
          placeholder="Search threads, posts, tags…"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {enabled && (
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v as Tab)}
          sx={{ mb: 2 }}
        >
          <Tab value="all" label={`All (${totalCount})`} />
          <Tab value="threads" label={`Threads (${threads.length})`} />
          <Tab value="posts" label={`Posts (${posts.length})`} />
        </Tabs>
      )}

      {!enabled && (
        <EmptyState
          title="Type something to search"
          description="Try a species, a lake, a lure, or a tag like #catfish or #flyfishing."
        />
      )}

      {enabled && loading && <CenteredSpinner label="Searching…" />}
      {enabled && error && <ErrorView error={error} onRetry={refresh} />}

      {enabled && !loading && !error && totalCount === 0 && (
        <EmptyState
          title="No results"
          description="Try different keywords or check your spelling."
        />
      )}

      {enabled && !loading && !error && totalCount > 0 && (
        <Stack spacing={4}>
          {showThreads && threads.length > 0 && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Threads
              </Typography>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {threads.map((t) => (
                  <ThreadListItem
                    key={t.id}
                    thread={t}
                    showCategory
                    categoryName={categoryNames.get(String(t.categoryId))}
                  />
                ))}
              </Stack>
            </Box>
          )}
          {showPosts && posts.length > 0 && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Posts
              </Typography>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      )}
    </Container>
  );
}
