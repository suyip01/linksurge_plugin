import React, { useState, useEffect } from 'react';

const SidebarApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    // 初始化侧边栏
    setIsLoading(false);
  }, []);

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  const handleClose = () => {
    // 通知background script关闭侧边栏
    chrome.runtime.sendMessage({
      action: 'closeSidebar'
    });
  };

  return (
    <div className="sidebar-container" style={{
      width: '400px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 头部 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img 
            src={chrome.runtime.getURL('icons/icon48.png')} 
            alt="Linksurge" 
            style={{ width: '24px', height: '24px' }}
          />
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            Linksurge
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePin}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: isPinned ? '#007bff' : '#666'
            }}
            title={isPinned ? '取消固定' : '固定侧边栏'}
          >
            📌
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: '#666'
            }}
            title="关闭"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {isLoading ? (
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#666', margin: 0 }}>加载中...</p>
          </div>
        ) : (
          <div>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f8f9fa',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              📧
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: '0 0 12px 0'
            }}>
              通用邮箱查找工具
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5',
              margin: '0 0 24px 0',
              maxWidth: '300px'
            }}>
              这是一个通用的邮箱查找Chrome插件，可以帮助您在各种网站上查找和提取邮箱信息。
            </p>
            <div style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{
                color: '#666',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                💡 提示：插件已准备就绪，您可以在任何网页上使用邮箱查找功能。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 底部 */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#999',
          fontSize: '12px',
          margin: 0
        }}>
          Linksurge: Email Finder v1.0.0
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SidebarApp;