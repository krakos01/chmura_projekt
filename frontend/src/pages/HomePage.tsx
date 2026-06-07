import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Forum as ForumIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { searchApi } from '../api/search';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import CategoryCard from '../components/CategoryCard';
import { CenteredSpinner, ErrorView } from '../components/StateViews';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const categories = useApi(() => categoriesApi.list(), []);
  const tags = useApi(() => searchApi.tags(), []);

  const featuredCategories = (categories.data ?? []).slice(0, 6);
  const featuredTags = (tags.data ?? []).slice(0, 12);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(14,116,144,0.35) 0%, rgba(34,211,238,0.12) 50%, rgba(124,58,237,0.18) 100%)'
              : 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(255,255,255,0.6) 50%, rgba(124,58,237,0.12) 100%)',
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #22d3ee 0%, transparent 35%), radial-gradient(circle at 80% 70%, #7c3aed 0%, transparent 35%)',
            pointerEvents: 'none',
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ alignItems: 'center', position: 'relative' }}
        >
          <Box sx={{ flex: 1 }}>
            <Chip
              label="A community of anglers"
              variant="outlined"
              sx={{
                mb: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 38, sm: 50, md: 60 },
                lineHeight: 1.05,
                mb: 2,
              }}
            >
              Cast a line.
              <br />
              <Box component="span" sx={{ color: 'primary.main' }}>
                Share the catch.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 560, mb: 3, fontSize: { md: 18 } }}
            >
              FishNet is a modern forum for anglers — swap stories, talk
              tackle, decode weather windows, and find your next honey hole.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to="/categories"
                endIcon={<ArrowForwardIcon />}
              >
                Browse the forum
              </Button>
              {!isAuthenticated && (
                <Button
                  size="large"
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                >
                  Create an account
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  size="large"
                  variant="outlined"
                  component={RouterLink}
                  to="/threads/new"
                >
                  Start a thread
                </Button>
              )}
            </Stack>
          </Box>
          <HeroIllustration />
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: 'center' }}
        >
          <ForumIcon color="primary" />
          <Typography variant="h5">Browse categories</Typography>
        </Stack>
        <Button
          component={RouterLink}
          to="/categories"
          endIcon={<ArrowForwardIcon />}
        >
          See all
        </Button>
      </Stack>

      {categories.loading && <CenteredSpinner />}
      {categories.error && (
        <ErrorView error={categories.error} onRetry={categories.refresh} />
      )}
      {!categories.loading && !categories.error && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2.5,
            mb: 6,
          }}
        >
          {featuredCategories.length === 0 ? (
            <Card
              sx={{
                p: 4,
                gridColumn: '1 / -1',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              No categories yet — check back soon.
            </Card>
          ) : (
            featuredCategories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))
          )}
        </Box>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1, p: 3 }}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', mb: 1.5 }}
          >
            <TrendingUpIcon color="primary" />
            <Typography variant="h6">Get involved</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Anyone can read along — sign in to post a reply, start a thread,
            or upload photos of your latest catch.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                >
                  Create account
                </Button>
                <Button variant="outlined" component={RouterLink} to="/login">
                  Sign in
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                component={RouterLink}
                to="/threads/new"
              >
                New thread
              </Button>
            )}
          </Stack>
        </Card>
        <Card sx={{ flex: 1, p: 3 }}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', mb: 1.5 }}
          >
            <TagIcon color="primary" />
            <Typography variant="h6">Popular tags</Typography>
          </Stack>
          {tags.loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading tags…
            </Typography>
          ) : tags.error ? (
            <Typography variant="body2" color="text.secondary">
              Tags unavailable.
            </Typography>
          ) : featuredTags.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No tags yet.
            </Typography>
          ) : (
            <Box>
              <Stack
                direction="row"
                useFlexGap
                sx={{ flexWrap: 'wrap', gap: 1 }}
              >
                {featuredTags.map((t) => (
                  <Chip
                    key={t.name}
                    component={RouterLink}
                    clickable
                    to={`/search?q=${encodeURIComponent(t.name)}`}
                    label={
                      t.count ? `#${t.name} · ${t.count}` : `#${t.name}`
                    }
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Card>
      </Stack>
    </Container>
  );
}

function HeroIllustration() {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 360 },
        aspectRatio: '1 / 1',
        position: 'relative',
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 360 360"
        sx={{ width: '100%', height: '100%' }}
        aria-hidden
      >
        <defs>
          <radialGradient id="waterBg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#0e7490" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fishBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <circle cx="180" cy="180" r="160" fill="url(#waterBg)" />
        {[0.35, 0.6, 0.85].map((r, i) => (
          <circle
            key={i}
            cx="180"
            cy="180"
            r={160 * r}
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        <g transform="translate(80,140) scale(1.6)">
          <path
            d="M44 32c-6 8-14 10-22 7l-6 5 2-8c-2-2-2-6 0-8l-2-8 6 5c8-3 16-1 22 7z"
            fill="url(#fishBody)"
          />
          <circle cx="40" cy="29" r="2" fill="#031018" />
          <path d="M44 32l8-4-2 4 2 4z" fill="url(#fishBody)" />
        </g>
        <g transform="translate(220,80)">
          <path
            d="M30 0 L30 80 Q30 100 50 100 L80 100"
            stroke="#94a3b8"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="2 4"
          />
          <circle cx="30" cy="0" r="3" fill="#f59e0b" />
        </g>
      </Box>
    </Box>
  );
}
