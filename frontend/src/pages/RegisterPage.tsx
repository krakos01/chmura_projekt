import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  AlternateEmail,
  LockOutlined,
  PersonOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useState, type FormEvent } from 'react';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

interface LocationState {
  from?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const from = (location.state as LocationState | null)?.from ?? '/';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ username, email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Logo size={40} />
      </Box>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Join the community
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create an account to post and reply on FishNet.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                helperText="At least 8 characters recommended."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>or</Divider>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              state={{ from }}
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
