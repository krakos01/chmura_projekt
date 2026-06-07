import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useState, type FormEvent } from 'react';
import {
  Link as RouterLink,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { useColorMode } from '../hooks/useColorMode';
import { colorFromString, initials } from '../utils/format';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/tags', label: 'Tags' },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggle } = useColorMode();

  const initialQuery = new URLSearchParams(location.search).get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [navMenu, setNavMenu] = useState<HTMLElement | null>(null);
  const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    setUserMenu(null);
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={(e) => setNavMenu(e.currentTarget)}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Logo showWordmark={!isMobile} />

          {!isMobile && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ ml: 3, alignItems: 'center' }}
            >
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  end={link.end}
                  color="inherit"
                  sx={{
                    px: 1.5,
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&.active': {
                      color: 'text.primary',
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }} />

          <Box
            component="form"
            onSubmit={onSearch}
            sx={{
              display: { xs: 'none', sm: 'block' },
              flex: { sm: '0 1 320px' },
            }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threads & posts…"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Tooltip
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <IconButton onClick={toggle} aria-label="Toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {isAuthenticated && user ? (
            <>
              <Tooltip title={user.username}>
                <IconButton onClick={(e) => setUserMenu(e.currentTarget)}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: colorFromString(user.username),
                      fontSize: 14,
                    }}
                  >
                    {initials(user.username)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={userMenu}
                open={Boolean(userMenu)}
                onClose={() => setUserMenu(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: { mt: 1, minWidth: 200, borderRadius: 2 },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Box sx={{ fontWeight: 700 }}>{user.username}</Box>
                  {user.email && (
                    <Box sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                      {user.email}
                    </Box>
                  )}
                  {user.role && user.role !== 'USER' && (
                    <Box
                      sx={{
                        mt: 0.5,
                        display: 'inline-block',
                        fontSize: 10.5,
                        fontWeight: 700,
                        px: 1,
                        py: 0.25,
                        borderRadius: 999,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {user.role}
                    </Box>
                  )}
                </Box>
                <Divider />
                <MenuItem
                  component={RouterLink}
                  to="/threads/new"
                  onClick={() => setUserMenu(null)}
                >
                  New thread
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.25 }} />
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              {!isMobile && (
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                >
                  Sign in
                </Button>
              )}
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                startIcon={!isMobile ? <PersonIcon /> : undefined}
              >
                Join
              </Button>
            </Stack>
          )}

          <Menu
            anchorEl={navMenu}
            open={Boolean(navMenu)}
            onClose={() => setNavMenu(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            {NAV_LINKS.map((link) => (
              <MenuItem
                key={link.to}
                component={RouterLink}
                to={link.to}
                onClick={() => setNavMenu(null)}
              >
                {link.label}
              </MenuItem>
            ))}
            {!isAuthenticated && (
              <MenuItem
                component={RouterLink}
                to="/login"
                onClick={() => setNavMenu(null)}
              >
                Sign in
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
