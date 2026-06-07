import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 64, sm: 96 }, color: 'primary.main' }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 1 }}>
        That fish got away.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The page you're looking for couldn't be found. Let's get you back to
        familiar waters.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'center' }}
      >
        <Button variant="contained" component={RouterLink} to="/">
          Back home
        </Button>
        <Button variant="outlined" component={RouterLink} to="/categories">
          Browse categories
        </Button>
      </Stack>
    </Container>
  );
}
