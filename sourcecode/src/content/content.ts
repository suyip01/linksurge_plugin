import { ExtensionMessage, ExtensionResponse } from '../types';

// 防抖函数
let debounceTimer: number | null = null;
const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => func.apply(null, args), delay);
  };
};

// 悬浮按钮相关功能
let floatingButton: HTMLElement | null = null;
// 在面板展开期间的隐藏锁，防止任何检查把按钮重新显示
let hideLock = false;

// 创建悬浮按钮
const createFloatingButton = () => {
  if (floatingButton) {
    return; // 已存在，不重复创建
  }

  floatingButton = document.createElement('div');
  floatingButton.id = 'linksurge-floating-button';
  floatingButton.innerHTML = `
    <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="Linksurge" />
  `;
  
  // 设置样式
  Object.assign(floatingButton.style, {
    position: 'fixed',
    top: '50%',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    border: '2px solid #e0e0e0',
    transform: 'translateY(-50%)'
  });

  // 设置图标样式
  const img = floatingButton.querySelector('img') as HTMLImageElement;
  if (img) {
    Object.assign(img.style, {
      width: '32px',
      height: '32px',
      borderRadius: '50%'
    });
  }

  // 添加悬停效果
  floatingButton.addEventListener('mouseenter', () => {
    if (floatingButton) {
      floatingButton.style.transform = 'translateY(-50%) scale(1.1)';
      floatingButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
    }
  });

  floatingButton.addEventListener('mouseleave', () => {
    if (floatingButton) {
      floatingButton.style.transform = 'translateY(-50%) scale(1)';
      floatingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
  });

  // 点击事件
  floatingButton.addEventListener('click', () => {
    // 立即隐藏悬浮按钮，提供更好的用户体验
    hideLock = true;
    hideFloatingButton();
    
    // 通知background script打开侧边栏
    chrome.runtime.sendMessage({ action: 'openSidebar' }).then(() => {
      // 成功处理
    }).catch(() => {
      // 如果打开侧边栏失败，重新显示悬浮按钮
      hideLock = false;
      showFloatingButton();
    });
  });

  document.body.appendChild(floatingButton);
};

// 显示悬浮按钮
const showFloatingButton = () => {
  if (!floatingButton) {
    createFloatingButton();
  }
  if (floatingButton) {
    floatingButton.style.display = 'flex';
  }
};

// 隐藏悬浮按钮
const hideFloatingButton = () => {
  if (floatingButton) {
    floatingButton.style.display = 'none';
    
    // 清除任何可能的防抖定时器，确保不会重新显示
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }
};

// 在允许的情况下确保显示按钮（不与面板展开时的隐藏锁冲突）
const ensureFloatingButtonIfAllowed = () => {
  if (!hideLock) {
    showFloatingButton();
  }
};

// 防抖的状态检查函数
const debouncedStatusCheck = debounce(() => {
  ensureFloatingButtonIfAllowed();
}, 300);

// 监听来自background script的消息
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (response: ExtensionResponse) => void) => {
    switch (message.action) {
      case 'showFloatingButton':
        hideLock = false; // 解锁
        showFloatingButton();
        sendResponse({ success: true });
        break;
      case 'hideFloatingButton':
        hideLock = true; // 加锁
        hideFloatingButton();
        sendResponse({ success: true });
        break;
      case 'ping':
        sendResponse({ success: true, data: 'pong' });
        break;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
        break;
    }
    return true; // 保持消息端口开放
  }
);

// 监听页面可见性变化，尝试在合适时机显示按钮
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    setTimeout(() => { debouncedStatusCheck(); }, 100);
  }
});

// 监听窗口焦点变化
window.addEventListener('focus', () => {
  setTimeout(() => { debouncedStatusCheck(); }, 100);
});

// 初始化
const init = async () => {
  // 查询全局侧边栏状态，决定是否显示悬浮按钮
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSidebarStatus' });
    if (response.success && response.data) {
      const isOpen = response.data.isOpen;
      
      if (isOpen) {
        hideLock = true;
        // 不创建悬浮按钮
      } else {
        hideLock = false;
        ensureFloatingButtonIfAllowed();
      }
    } else {
      hideLock = false;
      ensureFloatingButtonIfAllowed();
    }
  } catch (error) {
    hideLock = false;
    ensureFloatingButtonIfAllowed();
  }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await init();
  });
} else {
  init();
}

export {};