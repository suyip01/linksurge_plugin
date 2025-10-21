import React, { useEffect } from 'react';

const PopupApp: React.FC = () => {
  useEffect(() => {
    // 初始化弹窗
  }, []);

  const openSidePanel = () => {
    chrome.runtime.sendMessage({ action: 'openSidebar' });
    window.close();
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-80 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={chrome.runtime.getURL('icons/icon48.png')} 
            alt="Linksurge" 
            className="w-8 h-8"
          />
          <div>
            <h1 className="text-lg font-bold">Linksurge</h1>
            <p className="text-sm opacity-90">Email Finder</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Status Section */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            插件已准备就绪
          </div>
          <p className="text-sm text-blue-600 mt-1">
            可以在任何网页上使用邮箱查找功能
          </p>
        </div>

        {/* Feature Description */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">功能介绍</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 智能邮箱地址检测</li>
            <li>• 多种网站兼容</li>
            <li>• 快速信息提取</li>
            <li>• 便捷的侧边栏界面</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={openSidePanel}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>打开侧边栏</span>
          </button>

          <button
            onClick={openSettings}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>插件设置</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs font-medium text-yellow-800">使用提示</p>
              <p className="text-xs text-yellow-700 mt-1">
                点击"打开侧边栏"开始使用邮箱查找功能
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Linksurge: Email Finder v1.0.0
        </p>
      </div>
    </div>
  );
};

export default PopupApp;