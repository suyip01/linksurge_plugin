import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PopupApp from './PopupApp';

ReactDOM.createRoot(document.getElementById('popup-root')!).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);