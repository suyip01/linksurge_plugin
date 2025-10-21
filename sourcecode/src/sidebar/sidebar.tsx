import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import SidebarApp from './SidebarApp';

ReactDOM.createRoot(document.getElementById('sidebar-root')!).render(
  <React.StrictMode>
    <SidebarApp />
  </React.StrictMode>,
);