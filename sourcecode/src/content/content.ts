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
    console.log('[Content] *** 用户点击悬浮按钮，发送 openSidebar 消息 ***');
    
    // 立即隐藏悬浮按钮，提供更好的用户体验
    console.log('[Content] 立即隐藏悬浮按钮');
    hideLock = true;
    hideFloatingButton();
    
    // 通知background script打开侧边栏
    chrome.runtime.sendMessage({ action: 'openSidebar' }).then(() => {
      console.log('[Content] ✅ openSidebar 消息发送成功');
    }).catch((error) => {
      console.error('[Content] ❌ openSidebar 消息发送失败:', error);
      // 如果打开侧边栏失败，重新显示悬浮按钮
      console.log('[Content] 打开侧边栏失败，重新显示悬浮按钮');
      hideLock = false;
      showFloatingButton();
    });
  });

  document.body.appendChild(floatingButton);
};

// 显示悬浮按钮
const showFloatingButton = () => {
  console.log('[Content] *** 显示悬浮按钮函数被调用 ***');
  console.log('[Content] 当前 hideLock 状态:', hideLock);
  console.trace('[Content] showFloatingButton 调用堆栈');
  
  if (!floatingButton) {
    console.log('[Content] 悬浮按钮不存在，正在创建');
    createFloatingButton();
  }
  if (floatingButton) {
    console.log('[Content] 设置悬浮按钮为可见');
    floatingButton.style.display = 'flex';
    console.log('[Content] ✅ 悬浮按钮已显示');
  } else {
    console.error('[Content] ❌ 无法显示悬浮按钮，元素不存在');
  }
};

// 隐藏悬浮按钮
const hideFloatingButton = () => {
  console.log('[Content] *** 隐藏悬浮按钮函数被调用 ***');
  console.log('[Content] 当前 hideLock 状态:', hideLock);
  
  if (floatingButton) {
    console.log('[Content] 立即隐藏悬浮按钮');
    floatingButton.style.display = 'none';
    console.log('[Content] ✅ 悬浮按钮已隐藏');
    
    // 清除任何可能的防抖定时器，确保不会重新显示
    if (debounceTimer) {
      console.log('[Content] 清除防抖定时器');
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  } else {
    console.warn('[Content] ⚠️ 悬浮按钮不存在，无法隐藏');
  }
};

// 在允许的情况下确保显示按钮（不与面板展开时的隐藏锁冲突）
const ensureFloatingButtonIfAllowed = () => {
  console.log('[Content] ensureFloatingButtonIfAllowed called, hideLock:', hideLock);
  if (!hideLock) {
    console.log('[Content] No hide lock, calling showFloatingButton');
    showFloatingButton();
  } else {
    console.log('[Content] ensureFloatingButtonIfAllowed: locked, keep hidden');
  }
};

// 防抖的状态检查函数（不再调用 runtime 消息，仅做本地确保）
const debouncedStatusCheck = debounce(() => {
  console.log('[Content] *** DEBOUNCED STATUS CHECK TRIGGERED ***');
  console.trace('[Content] Stack trace for debouncedStatusCheck');
  ensureFloatingButtonIfAllowed();
}, 300);

// 监听来自background script的消息
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (response: ExtensionResponse) => void) => {
    console.log('[Content] *** 收到来自background的消息 ***', message.action);
    
    switch (message.action) {
      case 'showFloatingButton':
        console.log('[Content] *** 收到 showFloatingButton 消息 ***');
        console.log('[Content] 解锁 hideLock 并显示悬浮按钮');
        hideLock = false; // 解锁
        showFloatingButton();
        sendResponse({ success: true });
        break;
      case 'hideFloatingButton':
        console.log('[Content] *** 收到 hideFloatingButton 消息 ***');
        console.log('[Content] 锁定 hideLock 并隐藏悬浮按钮');
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
    console.log('[Content] *** PAGE BECAME VISIBLE *** - triggering local check');
    setTimeout(() => { debouncedStatusCheck(); }, 100);
  }
});

// 监听窗口焦点变化
window.addEventListener('focus', () => {
  console.log('[Content] *** WINDOW FOCUSED *** - triggering local check');
  setTimeout(() => { debouncedStatusCheck(); }, 100);
});

// 初始化
const init = async () => {
  console.log('[Content] Linksurge: Email Finder content script loaded at', new Date().toISOString());
  console.log('[Content] Current URL:', window.location.href);
  console.log('[Content] Document ready state:', document.readyState);
  
  // 查询全局侧边栏状态，决定是否显示悬浮按钮
  try {
    console.log('[Content] 查询全局侧边栏状态...');
    const response = await chrome.runtime.sendMessage({ action: 'getSidebarStatus' });
    if (response.success && response.data) {
      const isOpen = response.data.isOpen;
      console.log(`[Content] 全局侧边栏状态: ${isOpen ? '打开' : '关闭'}`);
      
      if (isOpen) {
        console.log('[Content] 侧边栏已打开，设置hideLock并隐藏悬浮按钮');
        hideLock = true;
        // 不创建悬浮按钮
      } else {
        console.log('[Content] 侧边栏已关闭，显示悬浮按钮');
        hideLock = false;
        ensureFloatingButtonIfAllowed();
      }
    } else {
      console.warn('[Content] 无法获取侧边栏状态，默认显示悬浮按钮');
      hideLock = false;
      ensureFloatingButtonIfAllowed();
    }
  } catch (error) {
    console.error('[Content] 查询侧边栏状态时出错:', error);
    console.log('[Content] 默认显示悬浮按钮');
    hideLock = false;
    ensureFloatingButtonIfAllowed();
  }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Content] *** DOM LOADED *** - initializing');
    await init();
  });
} else {
  console.log('[Content] *** DOCUMENT ALREADY LOADED *** - initializing immediately');
  init();
}

export {};