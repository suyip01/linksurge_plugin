import { ExtensionMessage, ExtensionResponse, UserSettings } from '../types';

// 侧边栏状态管理
let sidebarStatus: { [tabId: number]: boolean } = {};

// 定时检查侧边栏状态的间隔ID
let statusCheckInterval: number | null = null;

// 状态锁定机制，防止面板展开期间悬浮按钮重新出现
let sidebarLocked: { [tabId: number]: boolean } = {};

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
    console.log('Background received message:', message);

    switch (message.action) {
      case 'updateSettings':
        handleUpdateSettings(message.data, sendResponse);
        return true; // 保持消息端口开放用于异步响应
      case 'getSettings':
        handleGetSettings(sendResponse);
        return true; // 保持消息端口开放用于异步响应
      case 'openSidebar':
        handleOpenSidebar(sender.tab?.id, sendResponse);
        return true;
      case 'getSidebarStatus':
        handleGetSidebarStatus(sender.tab?.id, sendResponse);
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
const handleGetSidebarStatus = async (tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    if (tabId) {
      const isOpen = sidebarStatus[tabId] || false;
      sendResponse({ 
        success: true, 
        data: { isOpen } 
      });
    } else {
      sendResponse({ success: false, error: 'No active tab' });
    }
  } catch (error) {
    console.error('Error getting sidebar status:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// 打开侧边栏
const handleOpenSidebar = async (tabId: number | undefined, sendResponse: (response: ExtensionResponse) => void) => {
  try {
    if (tabId) {
      console.log(`[Background] Opening sidebar for tab ${tabId}`);
      await chrome.sidePanel.open({ tabId });
      
      // 立即锁定状态，防止定时检查干扰
      sidebarLocked[tabId] = true;
      
      // 更新侧边栏状态
      sidebarStatus[tabId] = true;
      console.log(`[Background] Sidebar status set to true and locked for tab ${tabId}`);
      
      // 立即通知content script隐藏悬浮按钮
      chrome.tabs.sendMessage(tabId, {
        action: 'hideFloatingButton'
      }).catch(() => {
        console.log(`[Background] Failed to send hideFloatingButton to tab ${tabId}`);
      });
      
      // 启动监控（如果还没有启动）
      if (!statusCheckInterval) {
        startSidebarStatusMonitoring();
      }
      
      // 延迟解锁，给侧边栏足够时间完全打开
      setTimeout(() => {
        sidebarLocked[tabId] = false;
        console.log(`[Background] Sidebar unlocked for tab ${tabId}`);
      }, 3000); // 3秒后解锁
      
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
    
    // 立即锁定状态，防止定时检查干扰
    sidebarLocked[tab.id] = true;
    
    // 尝试打开侧边栏
    await chrome.sidePanel.open({ 
      tabId: tab.id,
      windowId: tab.windowId 
    });
    
    // 更新侧边栏状态
    sidebarStatus[tab.id] = true;
    console.log(`[Background] Sidebar status set to true and locked for tab ${tab.id} (action click)`);
    
    // 立即通知content script隐藏悬浮按钮
    chrome.tabs.sendMessage(tab.id, {
      action: 'hideFloatingButton'
    }).catch(() => {
      console.log(`[Background] Failed to send hideFloatingButton to tab ${tab.id} (action click)`);
    });
    
    // 启动监控（如果还没有启动）
    if (!statusCheckInterval) {
      startSidebarStatusMonitoring();
    }
    
    // 延迟解锁，给侧边栏足够时间完全打开
    setTimeout(() => {
      if (tab.id) {
        sidebarLocked[tab.id] = false;
        console.log(`[Background] Sidebar unlocked for tab ${tab.id} (action click)`);
      }
    }, 3000); // 3秒后解锁
  } catch (error) {
    console.error('[Background] Error handling action click:', error);
  }
});

// 插件安装时初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Linksurge: Email Finder installed');
  initializeSettings();
  
  // 启动侧边栏状态监控
  startSidebarStatusMonitoring();
});

// 监听标签页关闭事件，清理侧边栏状态
chrome.tabs.onRemoved.addListener((tabId) => {
  delete sidebarStatus[tabId];
  delete sidebarLocked[tabId];
});

// 检查单个标签页的侧边栏状态
const checkSidebarStatusForTab = async (tabId: number) => {
  try {
    // 如果侧边栏被锁定，跳过检查
    if (sidebarLocked[tabId]) {
      console.log(`[Background] Sidebar locked for tab ${tabId}, skipping status check`);
      return;
    }
    
    console.log(`[Background] Checking sidebar status for tab ${tabId}`);
    
    // 尝试获取当前活动标签页
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs.find(tab => tab.id === tabId);
    
    if (!activeTab) {
      console.log(`[Background] Tab ${tabId} is not active or not found`);
      return;
    }

    // 通过与 content script 通讯，判断悬浮按钮是否可见
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });

      if (sidebarStatus[tabId]) {
        setTimeout(async () => {
          if (sidebarLocked[tabId]) {
            console.log(`[Background] Sidebar still locked for tab ${tabId}, skipping delayed check`);
            return;
          }

          try {
            const response = await chrome.tabs.sendMessage(tabId, { action: 'getSidebarVisibility' });
            const visible = !!response?.data?.floatingButtonVisible;

            if (!visible) {
              console.log(`[Background] Sidebar likely closed for tab ${tabId}, ensuring floating button shows`);
              sidebarStatus[tabId] = false;
              chrome.tabs.sendMessage(tabId, { action: 'showFloatingButton' }).catch(() => {
                console.log(`[Background] Failed to send showFloatingButton to tab ${tabId}`);
              });
            } else {
              console.log(`[Background] Floating button is visible for tab ${tabId}, panel considered closed`);
              sidebarStatus[tabId] = false;
            }
          } catch (error) {
            console.log(`[Background] Content script not responding for tab ${tabId}, assuming sidebar closed`);
            sidebarStatus[tabId] = false;
            chrome.tabs.sendMessage(tabId, { action: 'showFloatingButton' }).catch(() => {
              console.log(`[Background] Failed to send showFloatingButton to tab ${tabId}`);
            });
          }
        }, 800);
      }
    } catch (error) {
      console.log(`[Background] Content script not available for tab ${tabId}`);
    }
  } catch (error) {
    console.error(`[Background] Error checking sidebar status for tab ${tabId}:`, error);
  }
};

// 定期检查所有标签页的侧边栏状态
const startSidebarStatusMonitoring = () => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
  
  statusCheckInterval = setInterval(async () => {
    try {
      // 获取所有标签页
      const tabs = await chrome.tabs.query({});
      
      for (const tab of tabs) {
        if (tab.id && sidebarStatus[tab.id]) {
          await checkSidebarStatusForTab(tab.id);
        }
      }
    } catch (error) {
      console.error('[Background] Error in sidebar status monitoring:', error);
    }
  }, 2000); // 每2秒检查一次
};

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    console.log(`[Background] Tab ${tabId} completed loading`);
    
    // 如果侧边栏状态显示为打开，检查是否真的打开
    if (sidebarStatus[tabId]) {
      setTimeout(() => {
        checkSidebarStatusForTab(tabId);
      }, 500);
    }
  }
});

// 插件启动时初始化设置
chrome.runtime.onStartup.addListener(() => {
  console.log('[Background] Extension startup');
  initializeSettings();
  
  // 启动侧边栏状态监控
  startSidebarStatusMonitoring();
});

export {};