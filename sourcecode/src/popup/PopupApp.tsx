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
    <div className="w-80 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <i className="fas fa-envelope text-blue-500"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold">Linksurge</h1>
            <p className="text-sm opacity-90">Email Finder</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Status Section */}
        <div className="mb-4 p-3 bg-white rounded-xl border border-blue-200 card-shadow metric-card">
          <div className="flex items-center text-blue-700">
            <i className="fas fa-check-circle text-blue-500 mr-2"></i>
            插件已准备就绪
          </div>
          <p className="text-sm text-blue-600 mt-1">
            可以在任何网页上使用邮箱查找功能
          </p>
        </div>

        {/* Feature Description */}
        <div className="mb-4 p-3 bg-white rounded-xl card-shadow metric-card">
          <h3 className="text-sm font-medium text-gray-900 mb-2">功能介绍</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <i className="fas fa-brain text-blue-500 mr-2 w-3"></i>
              智能邮箱地址检测
            </li>
            <li className="flex items-center">
              <i className="fas fa-globe text-blue-500 mr-2 w-3"></i>
              多种网站兼容
            </li>
            <li className="flex items-center">
              <i className="fas fa-bolt text-blue-500 mr-2 w-3"></i>
              快速信息提取
            </li>
            <li className="flex items-center">
              <i className="fas fa-sidebar text-blue-500 mr-2 w-3"></i>
              便捷的侧边栏界面
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={openSidePanel}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 card-shadow metric-card"
          >
            <i className="fas fa-arrow-right"></i>
            <span>打开侧边栏</span>
          </button>

          <button
            onClick={openSettings}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-gray-200 card-shadow metric-card"
          >
            <i className="fas fa-cog"></i>
            <span>插件设置</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-white rounded-xl border border-yellow-200 card-shadow metric-card">
          <div className="flex items-start space-x-2">
            <i className="fas fa-lightbulb text-yellow-500 mt-0.5 flex-shrink-0"></i>
            <div>
              <p className="text-xs font-medium text-gray-900">使用提示</p>
              <p className="text-xs text-gray-600 mt-1">
                点击"打开侧边栏"开始使用邮箱查找功能
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Linksurge: Email Finder v1.0.0
        </p>
      </div>
    </div>
  );
};

export default PopupApp;