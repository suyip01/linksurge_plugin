import { ExtensionMessage, ExtensionResponse, UserSettings } from '../types';

// 全局侧边栏状态管理 - 简化为单一状态
let globalSidebarOpen: boolean = false;

// 从存储中恢复全局侧边栏状态
const restoreGlobalSidebarState = async (): Promise<void> => {
  try {
    const result = await chrome.storage.local.get(['globalSidebarOpen']);
    if (result.globalSidebarOpen !== undefined) {
      globalSidebarOpen = result.globalSidebarOpen;
      console.log(`[Background] 恢复全局侧边栏状态: ${globalSidebarOpen}`);
    } else {
      console.log('[Background] 未找到存储的侧边栏状态，使用默认值: false');
      globalSidebarOpen = false;
      await chrome.storage.local.set({ globalSidebarOpen: false });
    }
  } catch (error) {
    console.error('[Background] 恢复侧边栏状态失败:', error);
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
    console.log(`[Background] 收到消息:`, message, `来自标签页:`, sender.tab?.id);
    
    switch (message.action) {
      case 'updateSettings':
        console.log('[Background] 处理 updateSettings 消息');
        handleUpdateSettings(message.data, sendResponse);
        return true; // 保持消息端口开放用于异步响应
      case 'getSettings':
        console.log('[Background] 处理 getSettings 消息');
        handleGetSettings(sendResponse);
        return true; // 保持消息端口开放用于异步响应
      case 'openSidebar':
        console.log('[Background] 处理 openSidebar 消息');
        handleOpenSidebar(sender.tab?.id, sendResponse);
        return true;
      case 'getSidebarStatus':
        console.log('[Background] 处理 getSidebarStatus 消息');
        handleGetSidebarStatus(sender.tab?.id, sendResponse);
        return true;
      case 'sidebarOpened':
        console.log(`[Background] *** 收到 sidebarOpened 消息，标签页 ${sender.tab?.id} ***`);
        handleSidebarOpened(sender.tab?.id, sendResponse);
        return true;
      case 'sidebarClosed':
        console.log(`[Background] *** 收到 sidebarClosed 消息，标签页 ${sender.tab?.id} ***`);
        handleSidebarClosed(sender.tab?.id, sendResponse);
        return true;
      case 'closeSidebar':
        console.log(`[Background] *** 收到 closeSidebar 消息，标签页 ${sender.tab?.id} ***`);
        handleSidebarClosed(sender.tab?.id, sendResponse);
        return true;
      case 'refreshCache':
        console.log('[Background] 处理 refreshCache 消息');
        handleRefreshCache(sendResponse);
        return true;
      case 'clearCache':
        console.log('[Background] 处理 clearCache 消息');
        handleClearCache(sendResponse);
        return true;
      default:
        console.log(`[Background] 未知消息类型: ${message.action}`);
        sendResponse({ success: false, error: 'Unknown action' });
        return false;
    }
  }
);





// 更新设置
const handleUpdateSettings = async (settings: UserSettings, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    await chrome.storage.sync.set({ userSettings: settings });
    console.log('Settings updated successfully');
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
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
    console.error('Error getting settings:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};



// 刷新缓存
const handleRefreshCache = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    // 清除所有缓存数据
    const result = await chrome.storage.local.get(null);
    const keysToRemove = Object.keys(result).filter(key => 
      key.startsWith('cache_') || key.startsWith('channel_')
    );
    
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
    }
    
    console.log('Cache refreshed successfully');
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 清除所有缓存
const handleClearCache = async (sendResponse: (response: ExtensionResponse) => void) => {
  try {
    // 清除所有本地存储数据
    await chrome.storage.local.clear();
    console.log('Cache cleared successfully');
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error clearing cache:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 获取侧边栏状态
const handleGetSidebarStatus = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    console.log(`[Background] *** 获取全局侧边栏状态 ***`);
    console.log(`[Background] 全局侧边栏状态: ${globalSidebarOpen}`);
    
    sendResponse({ 
      success: true, 
      data: { 
        isOpen: globalSidebarOpen
      } 
    });
  } catch (error) {
    console.error('[Background] ❌ 获取侧边栏状态时出错:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 处理侧边栏打开消息
const handleSidebarOpened = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    console.log(`[Background] *** 侧边栏已打开，更新全局状态 ***`);
    
    // 更新全局侧边栏状态
    globalSidebarOpen = true;
    console.log(`[Background] 全局侧边栏状态更新为: ${globalSidebarOpen}`);
    
    // 持久化状态到存储
    await chrome.storage.local.set({ globalSidebarOpen: true });
    console.log(`[Background] 侧边栏状态已保存到存储`);
    
    // 向所有标签页发送隐藏悬浮按钮的消息
    console.log(`[Background] 向所有标签页发送 hideFloatingButton 消息`);
    const tabs = await chrome.tabs.query({});
    const validTabs = tabs.filter(tab => tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'));
    console.log(`[Background] 找到 ${validTabs.length} 个有效标签页`);
    
    const promises = validTabs.map(tab => {
      if (tab.id) {
        return chrome.tabs.sendMessage(tab.id, {
          action: 'hideFloatingButton'
        }).catch((error) => {
          console.log(`[Background] 标签页 ${tab.id} (${tab.url}) 发送消息失败:`, error.message);
        });
      }
    });
    
    await Promise.allSettled(promises);
    console.log(`[Background] ✅ 侧边栏打开处理完成`);
    sendResponse({ success: true });
  } catch (error) {
    console.error('[Background] ❌ 处理 sidebarOpened 时出错:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 处理侧边栏关闭消息
const handleSidebarClosed = async (_tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    console.log(`[Background] *** 侧边栏已关闭，更新全局状态 ***`);
    
    // 更新全局侧边栏状态
    globalSidebarOpen = false;
    console.log(`[Background] 全局侧边栏状态更新为: ${globalSidebarOpen}`);
    
    // 持久化状态到存储
    await chrome.storage.local.set({ globalSidebarOpen: false });
    console.log(`[Background] 侧边栏状态已保存到存储`);
    
    // 向所有标签页发送显示悬浮按钮的消息
    console.log(`[Background] 向所有标签页发送 showFloatingButton 消息`);
    const tabs = await chrome.tabs.query({});
    const validTabs = tabs.filter(tab => tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'));
    console.log(`[Background] 找到 ${validTabs.length} 个有效标签页`);
    
    const promises = validTabs.map(tab => {
      if (tab.id) {
        return chrome.tabs.sendMessage(tab.id, {
          action: 'showFloatingButton'
        }).catch((error) => {
          console.log(`[Background] 标签页 ${tab.id} (${tab.url}) 发送消息失败:`, error.message);
        });
      }
    });
    
    await Promise.allSettled(promises);
    console.log(`[Background] ✅ 侧边栏关闭处理完成`);
    sendResponse({ success: true });
  } catch (error) {
    console.error('[Background] ❌ 处理 sidebarClosed 时出错:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

const handleOpenSidebar = async (tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    if (tabId) {
      console.log(`[Background] Opening sidebar for tab ${tabId}`);
      await chrome.sidePanel.open({ tabId });
      
      // 注意：不再在这里设置状态，等待侧边栏页面发送sidebarOpened消息
      console.log(`[Background] Sidebar open request sent for tab ${tabId}`);
      
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No active tab' });
    }
  } catch (error) {
    console.error('[Background] Error opening sidebar:', error);
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
      console.error('[Background] No tab ID available');
      return;
    }

    console.log(`[Background] Action clicked for tab ${tab.id}`);
    
    // 尝试打开侧边栏
    await chrome.sidePanel.open({ 
      tabId: tab.id,
      windowId: tab.windowId 
    });
    
    // 注意：不再在这里设置状态，等待侧边栏页面发送sidebarOpened消息
    console.log(`[Background] Sidebar open request sent for tab ${tab.id} (action click)`);
  } catch (error) {
    console.error('[Background] Error handling action click:', error);
  }
});

// 插件安装时初始化
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Background] Linksurge: Email Finder installed');
  
  // 插件安装时强制设置侧边栏状态为false
  globalSidebarOpen = false;
  await chrome.storage.local.set({ globalSidebarOpen: false });
  console.log('[Background] 插件安装时设置侧边栏状态为: false');
  
  // 初始化设置
  await initializeSettings();
  
  // 启动侧边栏状态监控
  startSidebarStatusMonitoring();
});

// 监听标签页关闭事件（现在不需要清理状态，因为使用全局状态）
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log(`[Background] 标签页 ${tabId} 已关闭`);
  // 不再需要清理基于标签页的状态，因为现在使用全局状态
});

// 检查单个标签页的侧边栏状态（已废弃，现在使用直接通信）
// 这个函数已经不再需要，因为我们现在使用侧边栏页面的直接通信
// 保留函数定义以避免破坏现有的调用，但不执行任何操作
// const checkSidebarStatusForTab = async (tabId: number) => {
//   console.log(`[Background] checkSidebarStatusForTab called for tab ${tabId} - using direct communication instead`);
// };

// 启动侧边栏状态监控（已简化，现在主要依赖直接通信）
const startSidebarStatusMonitoring = () => {
  // 现在主要依赖侧边栏页面的直接通信，不再需要复杂的定时检查
  // 保留函数以避免破坏现有调用
  console.log('[Background] Sidebar status monitoring initialized - using direct communication');
};

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    console.log(`[Background] Tab ${tabId} completed loading: ${tab.url}`);
    
    // 如果全局侧边栏状态为打开，向新加载的标签页发送隐藏悬浮按钮消息
    if (globalSidebarOpen) {
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {
          action: 'hideFloatingButton'
        }).catch((error) => {
          console.log(`[Background] 标签页 ${tabId} (${tab.url}) 发送隐藏悬浮按钮消息失败:`, error.message);
        });
      }, 500);
    }
  }
});

// 插件启动时初始化设置
chrome.runtime.onStartup.addListener(async () => {
  console.log('[Background] Extension startup');
  
  // 恢复全局侧边栏状态
  await restoreGlobalSidebarState();
  
  // 初始化设置
  await initializeSettings();
  
  // 启动侧边栏状态监控
  startSidebarStatusMonitoring();
});

export {};