import React, { useState, useEffect } from 'react';
import RegionSelector from './RegionSelector';
import Navbar from './Navbar';
import { useRouter } from './Router';

const SidebarApp: React.FC = () => {
  const { navigateTo, setSearchParams } = useRouter();
  const [selectedProject, setSelectedProject] = useState('选择项目');
  const [selectedRegion, setSelectedRegion] = useState('全球');
  const [selectedVideoType, setSelectedVideoType] = useState('不限');
  const [selectedFollowers, setSelectedFollowers] = useState('不限');
  const [selectedViews, setSelectedViews] = useState('不限');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showVideoTypeDropdown, setShowVideoTypeDropdown] = useState(false);
  const [showFollowersDropdown, setShowFollowersDropdown] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);
  
  // 关闭所有下拉菜单的函数
  const closeAllDropdowns = () => {
    setShowProjectDropdown(false);
    setShowVideoTypeDropdown(false);
    setShowFollowersDropdown(false);
    setShowViewsDropdown(false);
  };

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 检查是否点击在下拉菜单容器内
      if (!target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

    // 监听页面即将卸载事件
    const handleBeforeUnload = () => {
      console.log('[Sidebar] 页面即将卸载，发送 sidePanelClosing 消息');
      chrome.runtime.sendMessage({ action: 'sidePanelClosing' });
    };

    // 监听页面可见性变化事件
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('[Sidebar] 页面变为隐藏状态，发送 sidePanelClosing 消息');
        chrome.runtime.sendMessage({ action: 'sidePanelClosing' });
      }
    };

    // 添加事件监听器
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const projects = ['项目A', '项目B', '项目C', '+ 新建项目'];
  const videoTypes = ['不限', 'Vlog', '测评', '开箱', 'OOTD'];
  const followersRanges = ['不限', '1K-10K (Nano)', '10K-100K (Micro)', '100K-500K (Mid-Tier)', '500K-1M (Macro)', '自定义'];
  const viewsRanges = ['不限', '1K-5K', '5K-10K', '10K-50K', '50K-100K', '100K+', '自定义'];

  // 处理地区选择
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleSearch = () => {
    // 收集搜索参数
    const searchParams = {
      project: selectedProject,
      region: selectedRegion,
      videoType: selectedVideoType,
      followers: selectedFollowers,
      views: selectedViews
    };
    
    // 保存搜索参数
    setSearchParams(searchParams);
    
    // 跳转到结果页面
    navigateTo('results');
    
    console.log('搜索参数:', searchParams);
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
      className={`w-full px-5 py-2 bg-stone-200/90 rounded-3xl border border-gray-200 flex items-center justify-between text-left hover:border-blue-300 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <span className="text-gray-800 font-medium">{value}</span>
      <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  const DropdownMenu = React.memo(({ 
    options, 
    onSelect, 
    isOpen, 
    className = "", 
    maxHeight = "max-h-40"
  }: { 
    options: string[]; 
    onSelect: (option: string) => void; 
    isOpen: boolean; 
    className?: string; 
    maxHeight?: string;
  }) => {
    // 使用内部状态来管理动画，避免闪烁
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        setIsAnimatingOut(false);
      } else if (shouldRender) {
        setIsAnimatingOut(true);
        // 等待动画完成后再停止渲染
        const timer = setTimeout(() => {
          setShouldRender(false);
          setIsAnimatingOut(false);
        }, 300); // 匹配动画持续时间
        return () => clearTimeout(timer);
      }
    }, [isOpen, shouldRender]);

    if (!shouldRender) {
      return null;
    }

    return (
      <div className={`absolute top-full left-0 right-0 mt-2 z-10 ${className} ${!isOpen ? 'pointer-events-none' : ''}`}>
        <div className={`
          bg-stone-200/90 backdrop-blur-sm border border-gray-100 rounded-3xl card-shadow overflow-hidden
          transform origin-top
          ${isOpen && !isAnimatingOut
            ? 'animate-dropdown-in' 
            : isAnimatingOut
            ? 'animate-dropdown-out'
            : 'opacity-0'
          }
        `}>
          <div className={`overflow-y-auto ${maxHeight} scrollbar-hide`}>
            {options.map((option) => (
              <div key={option} className="mx-2 my-0.5">
                <button
                  onClick={() => onSelect(option)}
                  className={`
                    w-full text-left text-gray-700 font-medium 
                    hover:bg-stone-400
                    px-5 py-1 rounded-xl
                    transition-all duration-200 ease-out
                    hover:scale-[1.02] hover:shadow-sm
                  `}
                >
                  {option}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="fixed top-0 h-screen mx-auto left-0 right-0 bg-gray-50 flex">
      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col pr-12">
        {/* 头部导航 */}
        <div className="h-4"></div>

        {/* 搜索表单 */}
        <div className="flex-1 px-8 py-8">
          <div className="w-[220px] mx-auto space-y-6">
            {/* 项目选择 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-900 mb-3">项目</label>
              <DropdownButton
                value={selectedProject}
                onClick={() => {
                  // 只有在当前下拉框关闭时才关闭其他下拉框
                  if (!showProjectDropdown) {
                    closeAllDropdowns();
                  }
                  setShowProjectDropdown(!showProjectDropdown);
                }}
                isOpen={showProjectDropdown}
              />
              <DropdownMenu
                options={projects}
                onSelect={(option) => {
                  setSelectedProject(option);
                  setShowProjectDropdown(false);
                }}
                isOpen={showProjectDropdown}
                maxHeight="max-h-40"
              />
            </div>

            {/* 地区 */}
            <div className="relative">
              <label className="block text-base font-semibold text-gray-900 mb-3">地区</label>
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionSelect={handleRegionSelect}
              />
            </div>

            {/* 视频类型 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-900 mb-3">视频类型</label>
              <DropdownButton
                value={selectedVideoType}
                onClick={() => {
                  // 只有在当前下拉框关闭时才关闭其他下拉框
                  if (!showVideoTypeDropdown) {
                    closeAllDropdowns();
                  }
                  setShowVideoTypeDropdown(!showVideoTypeDropdown);
                }}
                isOpen={showVideoTypeDropdown}
              />
              <DropdownMenu
                options={videoTypes}
                onSelect={(option) => {
                  setSelectedVideoType(option);
                  setShowVideoTypeDropdown(false);
                }}
                isOpen={showVideoTypeDropdown}
                maxHeight="max-h-40"
              />
            </div>

            {/* 粉丝数 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-900 mb-3">粉丝数</label>
              <DropdownButton
                value={selectedFollowers}
                onClick={() => {
                  // 只有在当前下拉框关闭时才关闭其他下拉框
                  if (!showFollowersDropdown) {
                    closeAllDropdowns();
                  }
                  setShowFollowersDropdown(!showFollowersDropdown);
                }}
                isOpen={showFollowersDropdown}
              />
              <DropdownMenu
                options={followersRanges}
                onSelect={(option) => {
                  setSelectedFollowers(option);
                  setShowFollowersDropdown(false);
                }}
                isOpen={showFollowersDropdown}
                maxHeight="max-h-40"
              />
            </div>

            {/* 平均观看数 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-900 mb-3">平均观看数</label>
              <DropdownButton
                value={selectedViews}
                onClick={() => {
                  // 只有在当前下拉框关闭时才关闭其他下拉框
                  if (!showViewsDropdown) {
                    closeAllDropdowns();
                  }
                  setShowViewsDropdown(!showViewsDropdown);
                }}
                isOpen={showViewsDropdown}
              />
              <DropdownMenu
                options={viewsRanges}
                onSelect={(option) => {
                  setSelectedViews(option);
                  setShowViewsDropdown(false);
                }}
                isOpen={showViewsDropdown}
                maxHeight="max-h-40"
              />
            </div>

            {/* 搜索按钮 */}
            <div className="pt-4">
              <button
                onClick={handleSearch}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 px-8 rounded-3xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] card-shadow metric-card"
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-search"></i>
                  <span>找相似博主</span>
                </span>
              </button>
            </div>

            {/* 联系工作人员 */}
            <div className="text-center pt-2">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2 transition-colors duration-200">
                联系工作人员
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧导航栏 */}
      <Navbar />
    </div>
  );
};

export default SidebarApp;