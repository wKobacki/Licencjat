import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './i18n/i18n';
import { LanguageProvider } from './i18n/contexts/LanguageContext';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
