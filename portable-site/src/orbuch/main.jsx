import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import OrbuchApp from './OrbuchApp.jsx';
import './orbuch.css';
import '../reader.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OrbuchApp />
  </React.StrictMode>,
);
