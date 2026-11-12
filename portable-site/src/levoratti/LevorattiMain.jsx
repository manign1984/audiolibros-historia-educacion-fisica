import React from 'react';
import { createRoot } from 'react-dom/client';
import LevorattiApp from './LevorattiApp.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><LevorattiApp /></React.StrictMode>
);
