import React from 'react';
import { RouterProvider, Route } from './Router';
import SidebarApp from './SidebarApp';
import ResultsPage from './ResultsPage';

// 主应用内容组件
const AppContent: React.FC = () => {
  return (
    <div className="app-container">
      <Route path="search">
        <SidebarApp />
      </Route>
      <Route path="results">
        <ResultsPage />
      </Route>
    </div>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <RouterProvider initialRoute="search">
      <AppContent />
    </RouterProvider>
  );
};

export default App;