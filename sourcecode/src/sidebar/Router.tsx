import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义路由类型
export type Route = 'search' | 'results';

// 路由上下文类型
interface RouterContextType {
  currentRoute: Route;
  navigateTo: (route: Route) => void;
  searchParams?: any;
  setSearchParams: (params: any) => void;
}

// 创建路由上下文
const RouterContext = createContext<RouterContextType | undefined>(undefined);

// 路由提供者组件
interface RouterProviderProps {
  children: ReactNode;
  initialRoute?: Route;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ 
  children, 
  initialRoute = 'search' 
}) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);
  const [searchParams, setSearchParams] = useState<any>(null);

  const navigateTo = (route: Route) => {
    setCurrentRoute(route);
  };

  return (
    <RouterContext.Provider value={{
      currentRoute,
      navigateTo,
      searchParams,
      setSearchParams
    }}>
      {children}
    </RouterContext.Provider>
  );
};

// 使用路由的Hook
export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

// 路由组件
interface RouteProps {
  path: Route;
  children: ReactNode;
}

export const Route: React.FC<RouteProps> = ({ path, children }) => {
  const { currentRoute } = useRouter();
  
  if (currentRoute !== path) {
    return null;
  }
  
  return <>{children}</>;
};