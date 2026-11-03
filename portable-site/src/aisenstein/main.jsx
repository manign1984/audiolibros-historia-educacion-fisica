import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import AisensteinApp from './AisensteinApp.jsx';
import '../reader.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><AisensteinApp /></React.StrictMode>,
);
