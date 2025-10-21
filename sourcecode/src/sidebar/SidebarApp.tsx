import React, { useState, useEffect } from 'react';
import { ChevronDown, User, DollarSign, BookOpen, Clock, Pin, X } from 'lucide-react';

const SidebarApp: React.FC = () => {
  const [isPinned, setIsPinned] = useState(false);
  const [selectedProject, setSelectedProject] = useState('选择项目');
  const [selectedRegion, setSelectedRegion] = useState('全球');
  const [selectedVideoType, setSelectedVideoType] = useState('不限');
  const [selectedFollowers, setSelectedFollowers] = useState('不限');
  const [selectedViews, setSelectedViews] = useState('不限');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showVideoTypeDropdown, setShowVideoTypeDropdown] = useState(false);
  const [showFollowersDropdown, setShowFollowersDropdown] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);

  // 侧边栏生命周期管理
  useEffect(() => {
    // 侧边栏加载时发送消息
    console.log('[Sidebar] 侧边栏正在加载，发送 sidebarOpened 消息');
    chrome.runtime.sendMessage({ action: 'sidebarOpened' })
      .then(() => {
        console.log('[Sidebar] sidebarOpened 消息发送成功');
      })
      .catch((error) => {
        console.error('[Sidebar] sidebarOpened 消息发送失败:', error);
      });

    // 监听页面卸载事件
    const handleBeforeUnload = () => {
      console.log('[Sidebar] 页面即将卸载，发送 sidebarClosed 消息');
      chrome.runtime.sendMessage({ action: 'sidebarClosed' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 清理函数
    return () => {
      console.log('[Sidebar] 组件卸载，移除事件监听器并发送 sidebarClosed 消息');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 组件卸载时也发送关闭消息
      chrome.runtime.sendMessage({ action: 'sidebarClosed' })
        .then(() => {
          console.log('[Sidebar] 组件卸载时 sidebarClosed 消息发送成功');
        })
        .catch((error) => {
          console.error('[Sidebar] 组件卸载时 sidebarClosed 消息发送失败:', error);
        });
    };
  }, []);

  const projects = ['项目A', '项目B', '项目C', '+ 新建项目'];
  const videoTypes = ['不限', 'Vlog', '测评', '开箱', 'OOTD'];
  const followersRanges = ['不限', '1K-10K (Nano)', '10K-100K (Micro)', '100K-500K (Mid-Tier)', '500K-1M (Macro)', '自定义'];
  const viewsRanges = ['不限', '1K-5K', '5K-10K', '10K-50K', '50K-100K', '100K+', '自定义'];

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  const handleClose = () => {
    console.log('[Sidebar] *** 用户点击关闭按钮，发送 closeSidebar 消息 ***');
    chrome.runtime.sendMessage({
      action: 'closeSidebar'
    }).then(() => {
      console.log('[Sidebar] ✅ closeSidebar 消息发送成功');
    }).catch((error) => {
      console.error('[Sidebar] ❌ closeSidebar 消息发送失败:', error);
    });
  };

  const handleSearch = () => {
    // 处理搜索逻辑
    console.log('搜索参数:', {
      project: selectedProject,
      region: selectedRegion,
      videoType: selectedVideoType,
      followers: selectedFollowers,
      views: selectedViews
    });
  };

  const DropdownButton = ({ 
    value, 
    onClick, 
    isOpen, 
    className = "" 
  }: { 
    value: string; 
    onClick: () => void; 
    isOpen: boolean; 
    className?: string; 
  }) => (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-left hover:border-gray-300 transition-colors ${className}`}
    >
      <span className="text-gray-700">{value}</span>
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  const DropdownMenu = ({ 
    options, 
    onSelect, 
    isOpen, 
    className = "" 
  }: { 
    options: string[]; 
    onSelect: (option: string) => void; 
    isOpen: boolean; 
    className?: string; 
  }) => (
    isOpen && (
      <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto ${className}`}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 first:rounded-t-lg last:rounded-b-lg"
          >
            {option}
          </button>
        ))}
      </div>
    )
  );

  return (
    <div className="w-full h-screen bg-[#F7EDE2] flex">
      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col pr-16">
        {/* 头部导航 */}
        <div className="flex items-center justify-between p-4 bg-[#F7EDE2] border-b border-orange-200">
          <div className="flex items-center gap-2">
            <img 
              src={chrome.runtime.getURL('icons/icon48.png')} 
              alt="LinkSurge" 
              className="w-6 h-6"
            />
            <h1 className="text-lg font-semibold text-gray-800">LinkSurge</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePin}
              className="p-2 hover:bg-orange-200 rounded-lg transition-colors"
              title={isPinned ? '取消固定' : '固定侧边栏'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'text-orange-600' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-orange-200 rounded-lg transition-colors"
              title="关闭"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 搜索表单 */}
        <div className="flex-1 p-6 space-y-6">
          {/* 项目选择 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">项目</label>
            <DropdownButton
              value={selectedProject}
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              isOpen={showProjectDropdown}
            />
            <DropdownMenu
              options={projects}
              onSelect={(option) => {
                setSelectedProject(option);
                setShowProjectDropdown(false);
              }}
              isOpen={showProjectDropdown}
            />
          </div>

          {/* 地区 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">地区</label>
            <DropdownButton
              value={selectedRegion}
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              isOpen={showRegionDropdown}
            />
            <DropdownMenu
              options={['全球', '中国 🇨🇳', '美国 🇺🇸', '日本 🇯🇵', '韩国 🇰🇷', '英国 🇬🇧']}
              onSelect={(option) => {
                setSelectedRegion(option);
                setShowRegionDropdown(false);
              }}
              isOpen={showRegionDropdown}
            />
          </div>

          {/* 视频类型 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">视频类型</label>
            <DropdownButton
              value={selectedVideoType}
              onClick={() => setShowVideoTypeDropdown(!showVideoTypeDropdown)}
              isOpen={showVideoTypeDropdown}
            />
            <DropdownMenu
              options={videoTypes}
              onSelect={(option) => {
                setSelectedVideoType(option);
                setShowVideoTypeDropdown(false);
              }}
              isOpen={showVideoTypeDropdown}
            />
          </div>

          {/* 粉丝数 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">粉丝数</label>
            <DropdownButton
              value={selectedFollowers}
              onClick={() => setShowFollowersDropdown(!showFollowersDropdown)}
              isOpen={showFollowersDropdown}
            />
            <DropdownMenu
              options={followersRanges}
              onSelect={(option) => {
                setSelectedFollowers(option);
                setShowFollowersDropdown(false);
              }}
              isOpen={showFollowersDropdown}
            />
          </div>

          {/* 平均观看数 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">平均观看数</label>
            <DropdownButton
              value={selectedViews}
              onClick={() => setShowViewsDropdown(!showViewsDropdown)}
              isOpen={showViewsDropdown}
            />
            <DropdownMenu
              options={viewsRanges}
              onSelect={(option) => {
                setSelectedViews(option);
                setShowViewsDropdown(false);
              }}
              isOpen={showViewsDropdown}
            />
          </div>

          {/* 搜索按钮 */}
          <button
            onClick={handleSearch}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            🔍 找相似博主
          </button>

          {/* 联系工作人员 */}
          <div className="text-center">
            <button className="text-amber-800 hover:text-amber-900 text-sm underline">
              联系工作人员
            </button>
          </div>
        </div>
      </div>

      {/* 右侧导航栏 */}
      <div className="fixed right-0 top-0 bottom-0 w-16 bg-[#F7EDE2] border-l border-orange-200 flex flex-col items-center justify-end py-2">
        <div className="flex flex-col items-center space-y-5">
          {/* 历史任务 */}
          <button 
            className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
            title="历史任务"
          >
            <Clock className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">历史任务</span>
          </button>

          {/* 教程 */}
          <button 
            className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
            title="教程"
          >
            <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">教程</span>
          </button>

          {/* 余额 */}
          <button 
            className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
            title="余额"
          >
            <DollarSign className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">余额</span>
          </button>

          {/* 用户头像 */}
          <button 
            className="w-10 h-10 bg-white rounded-full border-2 border-orange-300 flex items-center justify-center hover:border-orange-400 transition-colors"
            title="用户中心"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarApp;