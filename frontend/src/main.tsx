import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { ColorModeProvider } from './theme/ColorModeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ColorModeProvider>
  </StrictMode>,
);
