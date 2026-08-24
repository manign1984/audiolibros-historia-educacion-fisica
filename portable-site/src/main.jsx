import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/bebas-neue/400.css';
import '@fontsource/poiret-one/400.css';
import '@fontsource/limelight/400.css';
import App from './App.jsx';
import './styles.css';
import './reader.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
