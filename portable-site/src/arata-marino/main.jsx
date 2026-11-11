import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/900.css';
import '@fontsource/bebas-neue/400.css';
import ArataMarinoApp from './ArataMarinoApp.jsx';
import '../styles.css';
import '../shared/journey-block-labels.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><ArataMarinoApp /></React.StrictMode>,
);
