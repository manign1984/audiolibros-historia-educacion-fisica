import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/sora/latin-500.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import LibraryHome, { WorkPage } from './LibraryHome.jsx';
import { catalog } from './catalog.js';
import './library.css';

const slug = window.location.pathname.replace(/\/index\.html$/, '/').split('/').filter(Boolean).at(-1);
const entry = catalog.find((item) => item.id === slug && item.status === 'preparation');
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{entry ? <WorkPage entry={entry} /> : <LibraryHome />}</React.StrictMode>,
);
