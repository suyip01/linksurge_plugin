// 用户设置接口
export interface UserSettings {
  apiKey: string;
  cacheExpiration: number;
  autoRefresh: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoDetect?: boolean; // 自动检测开关
  showSubscriberCount?: boolean; // 显示订阅数开关
  displayMode?: 'compact' | 'detailed'; // 显示模式
  shortcuts?: {
    toggleSidebar: string;
    refreshInfo: string;
  };
}

// 缓存数据接口
export interface CacheData {
  [key: string]: {
    data: any;
    expireTime: number;
    dataType: string;
  };
}

// Chrome Extension消息接口
export interface ExtensionMessage {
  action: 'openSidebar' | 'updateSettings' | 'getSettings' | 'refreshCache' | 'clearCache' | 'showFloatingButton' | 'hideFloatingButton' | 'getSidebarStatus' | 'ping' | 'getSidebarVisibility' | 'sidebarOpened' | 'sidebarClosed' | 'closeSidebar';
  data?: any;
}

// Chrome Extension响应接口
export interface ExtensionResponse {
  success: boolean;
  data?: any;
  error?: string;
  cached?: boolean;
}