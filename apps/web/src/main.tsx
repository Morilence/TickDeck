import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ThemeProvider } from './components/theme-provider';
import './i18n';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('APP_ROOT_MISSING');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
