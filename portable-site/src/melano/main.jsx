import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/900.css';
import '@fontsource/bebas-neue/400.css';
import MelanoApp from './MelanoApp.jsx';
import '../styles.css';
import '../reader.css';
import '../shared/journey-block-labels.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><MelanoApp /></React.StrictMode>,
);
