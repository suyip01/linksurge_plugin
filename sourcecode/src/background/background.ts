import { ExtensionMessage, ExtensionResponse, UserSettings } from '../types';

// 全局侧边栏状态管理 - 简化为单一状态
let globalSidebarOpen: boolean = false;

// 从存储中恢复全局侧边栏状态
const restoreGlobalSidebarState = async (): Promise<void> => {
  try {
    const result = await chrome.storage.local.get(['globalSidebarOpen']);
    if (result.globalSidebarOpen !== undefined) {
      globalSidebarOpen = result.globalSidebarOpen;
    } else {
      globalSidebarOpen = false;
      await chrome.storage.local.set({ globalSidebarOpen: false });
    }
  } catch (error) {
    globalSidebarOpen = false;
  }
};

// 初始化用户设置
const initializeSettings = async (): Promise<void> => {
  const defaultSettings: UserSettings = {
    apiKey: '',
    cacheExpiration: 30,
    autoRefresh: true,
    notifications: true,
    theme: 'auto',
    autoDetect: true,
    showSubscriberCount: true,
    displayMode: 'detailed',
    shortcuts: {
      toggleSidebar: 'Ctrl+Shift+L',
      refreshInfo: 'Ctrl+Shift+R'
    }
  };

  const result = await chrome.storage.sync.get(['userSettings']);
  if (!result.userSettings) {
    await chrome.storage.sync.set({ userSettings: defaultSettings });
  }
};

// 处理来自content script和popup的消息
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse: (response: ExtensionResponse) => void) => {
    switch (message.action) {
      case 'updateSettings':
        handleUpdateSettings(message.data, sendResponse);
        return true;
      case 'getSettings':
        handleGetSettings(sendResponse);
        return true;
      case 'openSidebar':
        handleOpenSidebar(sender.tab?.id, sendResponse);
        return true;
      case 'getSidebarStatus':
        handleGetSidebarStatus(sender.tab?.id, sendResponse);
        return true;
      case 'sidebarOpened':
        handleSidebarOpened(sender.tab?.id, sendResponse);
        return true;
      case 'sidebarClosed':
        handleSidebarClosed(sender.tab?.id, sendResponse);
        return true;
      case 'closeSidebar':
        handleSidebarClosed(sender.tab?.id, sendResponse);
        return true;
      case 'sidePanelClosing':
        handleSidePanelClosing(sendResponse);
        return true;
      case 'refreshCache':
        handleRefreshCache(sendResponse);
        return true;
      case 'clearCache':
        handleClearCache(sendResponse);
        return true;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
        return false;
    }
  }
);

// 更新设置
const handleUpdateSettings = async (settings: UserSettings, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    await chrome.storage.sync.set({ userSettings: settings });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 获取设置
const handleGetSettings = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    const result = await chrome.storage.sync.get(['userSettings']);
    sendResponse({ 
      success: true, 
      data: result.userSettings 
    });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 刷新缓存
const handleRefreshCache = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    const result = await chrome.storage.local.get(null);
    const keysToRemove = Object.keys(result).filter(key => 
      key.startsWith('cache_') || key.startsWith('channel_')
    );
    
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
    }
    
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 清除所有缓存
const handleClearCache = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    await chrome.storage.local.clear();
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 获取侧边栏状态
const handleGetSidebarStatus = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    sendResponse({ 
      success: true, 
      data: { 
        isOpen: globalSidebarOpen
      } 
    });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 处理侧边栏打开消息
const handleSidebarOpened = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    globalSidebarOpen = true;
    await chrome.storage.local.set({ globalSidebarOpen: true });
    
    // 向所有标签页发送隐藏悬浮按钮的消息
    const tabs = await chrome.tabs.query({});
    const promises = tabs.map(tab => {
      if (tab.id) {
        return chrome.tabs.sendMessage(tab.id, {
          action: 'hideFloatingButton'
        }).catch(() => {});
      }
    });
    
    await Promise.allSettled(promises);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 处理侧边栏关闭消息
const handleSidebarClosed = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    globalSidebarOpen = false;
    await chrome.storage.local.set({ globalSidebarOpen: false });
    await broadcastSidebarClosed();
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 广播侧边栏关闭消息给所有标签页
const broadcastSidebarClosed = async () => {
  try {
    const tabs = await chrome.tabs.query({});
    const promises = tabs.map(tab => {
      if (tab.id) {
        return chrome.tabs.sendMessage(tab.id, {
          action: 'showFloatingButton'
        }).catch(() => {});
      }
    });
    
    await Promise.allSettled(promises);
  } catch (error) {
    // 静默处理错误
  }
};

// 处理侧边栏即将关闭消息
const handleSidePanelClosing = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    globalSidebarOpen = false;
    await chrome.storage.local.set({ globalSidebarOpen: false });
    await broadcastSidebarClosed();
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

const handleOpenSidebar = async (tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    if (tabId) {
      await chrome.sidePanel.open({ tabId });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No active tab' });
    }
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 处理插件图标点击事件
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab.id) {
      return;
    }

    await chrome.sidePanel.open({ 
      tabId: tab.id,
      windowId: tab.windowId 
    });
  } catch (error) {
    // 静默处理错误
  }
});

// 插件安装时初始化
chrome.runtime.onInstalled.addListener(async () => {
  globalSidebarOpen = false;
  await chrome.storage.local.set({ globalSidebarOpen: false });
  await initializeSettings();
});

// 监听标签页关闭事件
chrome.tabs.onRemoved.addListener((_tabId) => {
  // 不再需要清理基于标签页的状态，因为现在使用全局状态
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    // 如果全局侧边栏状态为打开，向新加载的标签页发送隐藏悬浮按钮消息
    if (globalSidebarOpen) {
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {
          action: 'hideFloatingButton'
        }).catch(() => {});
      }, 500);
    }
  }
});

// 插件启动时初始化设置
chrome.runtime.onStartup.addListener(async () => {
  await restoreGlobalSidebarState();
  await initializeSettings();
});

export {};