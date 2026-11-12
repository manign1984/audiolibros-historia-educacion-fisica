import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/bebas-neue/latin-400.css';
import '../styles.css';
import '../reader.css';
import ThwaitesReyApp from './ThwaitesReyApp.jsx';
import { migrateTextReaderState } from './migrateTextReaderState.js';

migrateTextReaderState();

createRoot(document.getElementById('root')).render(
  <StrictMode><ThwaitesReyApp /></StrictMode>,
);
