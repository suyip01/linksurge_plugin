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
    // 通知background script打开侧边栏
    chrome.runtime.sendMessage({ action: 'openSidebar' });
  });

  document.body.appendChild(floatingButton);
};

// 显示悬浮按钮
const showFloatingButton = () => {
  console.log('[Content] showFloatingButton called');
  if (!floatingButton) {
    console.log('[Content] Creating floating button');
    createFloatingButton();
  }
  if (floatingButton) {
    console.log('[Content] Displaying floating button');
    floatingButton.style.display = 'flex';
  }
};

// 隐藏悬浮按钮
const hideFloatingButton = () => {
  console.log('[Content] hideFloatingButton called');
  if (floatingButton) {
    console.log('[Content] Immediately hiding floating button');
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
  } else {
    console.log('[Content] ensureFloatingButtonIfAllowed: locked, keep hidden');
  }
};

// 防抖的状态检查函数（不再调用 runtime 消息，仅做本地确保）
const debouncedStatusCheck = debounce(() => {
  console.log('[Content] Debounced local status check triggered');
  ensureFloatingButtonIfAllowed();
}, 300);

// 监听来自background script的消息
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (response: ExtensionResponse) => void) => {
    console.log('[Content] Received message:', message.action);
    
    switch (message.action) {
      case 'showFloatingButton':
        console.log('[Content] Showing floating button');
        hideLock = false; // 解锁
        showFloatingButton();
        sendResponse({ success: true });
        break;
      case 'hideFloatingButton':
        console.log('[Content] Hiding floating button immediately');
        hideLock = true; // 加锁
        hideFloatingButton();
        sendResponse({ success: true });
        break;
      case 'ping':
        sendResponse({ success: true, data: 'pong' });
        break;
      case 'getSidebarVisibility':
        // 返回当前悬浮按钮是否可见，供 background 推断面板是否关闭
        const floatingButtonVisible = !!floatingButton && floatingButton.style.display !== 'none';
        sendResponse({ success: true, data: { floatingButtonVisible } });
        break;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
        break;
    }
    return true; // 保持消息端口开放
  }
);

// 监听页面可见性变化，尝试在合适时机显示按钮（不触发消息）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('[Content] Page became visible, local check');
    setTimeout(() => { debouncedStatusCheck(); }, 100);
  }
});

// 监听窗口焦点变化
window.addEventListener('focus', () => {
  console.log('[Content] Window focused, local check');
  setTimeout(() => { debouncedStatusCheck(); }, 100);
});

// 初始化
const init = () => {
  console.log('[Content] Linksurge: Email Finder content script loaded at', new Date().toISOString());
  console.log('[Content] Current URL:', window.location.href);
  console.log('[Content] Document ready state:', document.readyState);
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Content] DOM loaded, initializing');
    init();
    // 初始确保显示（若未加锁）
    setTimeout(() => { ensureFloatingButtonIfAllowed(); }, 500);
  });
} else {
  console.log('[Content] Document already loaded, initializing immediately');
  init();
  setTimeout(() => { ensureFloatingButtonIfAllowed(); }, 500);
}

export {};