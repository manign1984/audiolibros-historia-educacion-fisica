import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/archivo/latin-900.css';
import '@fontsource/bebas-neue/latin-400.css';
import MarcaidaApp from './MarcaidaApp.jsx';
import '../reader.css';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><MarcaidaApp /></React.StrictMode>);
