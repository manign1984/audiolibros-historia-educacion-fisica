import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/bebas-neue/400.css';
import '../styles.css';
import '../shared/journey-block-labels.css';
import TorrePastorizaApp from './TorrePastorizaApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><TorrePastorizaApp /></StrictMode>,
);
