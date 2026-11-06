import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/archivo/latin-900.css';
import '@fontsource/bebas-neue/latin-400.css';
import SoaresApp from './SoaresApp.jsx';
import { soaresPrivateAsset } from './readerConfig.js';
import '../reader.css';
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<p role="status">Cargando la lectura…</p>);
fetch(soaresPrivateAsset('reader-document.json')).then(response=>{
  if(!response.ok) throw new Error('Material local ausente');
  return response.json();
}).then(document=>root.render(<React.StrictMode><SoaresApp readingDocument={document}/></React.StrictMode>))
.catch(()=>root.render(<main><h1>Lectura en preparación</h1><p>El capítulo todavía no está disponible.</p><a href={import.meta.env.BASE_URL}>Volver a la biblioteca</a></main>));
