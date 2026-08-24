import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import LibraryHome from './LibraryHome.jsx';
import './library.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LibraryHome />
  </React.StrictMode>,
);
