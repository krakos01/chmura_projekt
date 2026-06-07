import { Box } from '@mui/material';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Box>
      <Footer />
      <ScrollRestoration />
    </Box>
  );
}
