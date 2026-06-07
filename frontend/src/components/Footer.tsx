import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Logo size={28} />
          </Stack>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/categories">
              Categories
            </Link>
            <Link component={RouterLink} to="/tags">
              Tags
            </Link>
            <Link component={RouterLink} to="/search">
              Search
            </Link>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} FishNet — Built for anglers.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
