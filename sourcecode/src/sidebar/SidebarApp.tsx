import React, { useState, useEffect } from 'react';
import { ChevronDown, User, BookOpen, Clock, Wallet, X } from 'lucide-react';

const SidebarApp: React.FC = () => {
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
  
  // 地区搜索相关状态
  const [isRegionSearchMode, setIsRegionSearchMode] = useState(false);
  const [regionSearchInput, setRegionSearchInput] = useState('');
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);

  // 关闭所有下拉菜单的函数
  const closeAllDropdowns = () => {
    setShowProjectDropdown(false);
    setShowRegionDropdown(false);
    setShowVideoTypeDropdown(false);
    setShowFollowersDropdown(false);
    setShowViewsDropdown(false);
  };

  // 点击外部区域关闭下拉菜单 - 修改版本，排除输入框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // 排除输入框和其容器，避免干扰输入
      if (!target.closest('.dropdown-container') && !target.closest('.region-search-input')) {
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

  // 地区选项列表
  const regionOptions = [
    '全球',
    '阿尔巴尼亚 🇦🇱', '阿尔及利亚 🇩🇿', '阿富汗 🇦🇫', '阿根廷 🇦🇷', '阿联酋 🇦🇪', '阿曼 🇴🇲', '阿塞拜疆 🇦🇿',
    '埃及 🇪🇬', '埃塞俄比亚 🇪🇹', '爱尔兰 🇮🇪', '爱沙尼亚 🇪🇪', '安道尔 🇦🇩', '安哥拉 🇦🇴', '安提瓜和巴布达 🇦🇬',
    '奥地利 🇦🇹', '澳大利亚 🇦🇺', '澳门 🇲🇴',
    '巴巴多斯 🇧🇧', '巴布亚新几内亚 🇵🇬', '巴哈马 🇧🇸', '巴基斯坦 🇵🇰', '巴拉圭 🇵🇾', '巴林 🇧🇭', '巴拿马 🇵🇦',
    '巴西 🇧🇷', '白俄罗斯 🇧🇾', '保加利亚 🇧🇬', '贝宁 🇧🇯', '比利时 🇧🇪', '冰岛 🇮🇸', '波兰 🇵🇱', '波黑 🇧🇦',
    '玻利维亚 🇧🇴', '博茨瓦纳 🇧🇼', '伯利兹 🇧🇿', '不丹 🇧🇹', '布基纳法索 🇧🇫', '布隆迪 🇧🇮',
    '朝鲜 🇰🇵', '赤道几内亚 🇬🇶',
    '丹麦 🇩🇰', '德国 🇩🇪', '东帝汶 🇹🇱', '多哥 🇹🇬', '多米尼加 🇩🇴', '多米尼克 🇩🇲',
    '俄罗斯 🇷🇺', '厄瓜多尔 🇪🇨', '厄立特里亚 🇪🇷',
    '法国 🇫🇷', '梵蒂冈 🇻🇦', '菲律宾 🇵🇭', '斐济 🇫🇯', '芬兰 🇫🇮', '佛得角 🇨🇻',
    '冈比亚 🇬🇲', '刚果布 🇨🇬', '刚果金 🇨🇩', '哥伦比亚 🇨🇴', '哥斯达黎加 🇨🇷', '格林纳达 🇬🇩', '格鲁吉亚 🇬🇪',
    '古巴 🇨🇺', '圭亚那 🇬🇾',
    '哈萨克斯坦 🇰🇿', '海地 🇭🇹', '韩国 🇰🇷', '荷兰 🇳🇱', '黑山 🇲🇪', '洪都拉斯 🇭🇳',
    '基里巴斯 🇰🇮', '吉布提 🇩🇯', '吉尔吉斯斯坦 🇰🇬', '几内亚 🇬🇳', '几内亚比绍 🇬🇼', '加纳 🇬🇭', '加拿大 🇨🇦',
    '加蓬 🇬🇦', '柬埔寨 🇰🇭', '捷克 🇨🇿', '津巴布韦 🇿🇼',
    '喀麦隆 🇨🇲', '卡塔尔 🇶🇦', '科摩罗 🇰🇲', '科特迪瓦 🇨🇮', '科威特 🇰🇼', '克罗地亚 🇭🇷', '肯尼亚 🇰🇪', '库克群岛 🇨🇰',
    '拉脱维亚 🇱🇻', '莱索托 🇱🇸', '老挝 🇱🇦', '黎巴嫩 🇱🇧', '立陶宛 🇱🇹', '利比里亚 🇱🇷', '利比亚 🇱🇾',
    '列支敦士登 🇱🇮', '卢森堡 🇱🇺', '卢旺达 🇷🇼', '罗马尼亚 🇷🇴',
    '马达加斯加 🇲🇬', '马尔代夫 🇲🇻', '马耳他 🇲🇹', '马拉维 🇲🇼', '马来西亚 🇲🇾', '马里 🇲🇱', '马绍尔群岛 🇲🇭',
    '毛里求斯 🇲🇺', '毛里塔尼亚 🇲🇷', '美国 🇺🇸', '蒙古 🇲🇳', '孟加拉国 🇧🇩', '秘鲁 🇵🇪', '密克罗尼西亚 🇫🇲',
    '缅甸 🇲🇲', '摩尔多瓦 🇲🇩', '摩洛哥 🇲🇦', '摩纳哥 🇲🇨', '莫桑比克 🇲🇿', '墨西哥 🇲🇽',
    '纳米比亚 🇳🇦', '南非 🇿🇦', '南苏丹 🇸🇸', '瑙鲁 🇳🇷', '尼泊尔 🇳🇵', '尼加拉瓜 🇳🇮', '尼日尔 🇳🇪', '尼日利亚 🇳🇬', '挪威 🇳🇴',
    '帕劳 🇵🇼', '葡萄牙 🇵🇹',
    '日本 🇯🇵', '瑞典 🇸🇪', '瑞士 🇨🇭',
    '萨尔瓦多 🇸🇻', '萨摩亚 🇼🇸', '塞尔维亚 🇷🇸', '塞拉利昂 🇸🇱', '塞内加尔 🇸🇳', '塞浦路斯 🇨🇾', '塞舌尔 🇸🇨',
    '沙特阿拉伯 🇸🇦', '圣多美和普林西比 🇸🇹', '圣基茨和尼维斯 🇰🇳', '圣卢西亚 🇱🇨', '圣马力诺 🇸🇲', '圣文森特和格林纳丁斯 🇻🇨',
    '斯里兰卡 🇱🇰', '斯洛伐克 🇸🇰', '斯洛文尼亚 🇸🇮', '斯威士兰 🇸🇿', '苏丹 🇸🇩', '苏里南 🇸🇷', '所罗门群岛 🇸🇧', '索马里 🇸🇴',
    '塔吉克斯坦 🇹🇯', '台湾 🇹🇼', '泰国 🇹🇭', '坦桑尼亚 🇹🇿', '汤加 🇹🇴', '特立尼达和多巴哥 🇹🇹', '突尼斯 🇹🇳',
    '图瓦卢 🇹🇻', '土耳其 🇹🇷', '土库曼斯坦 🇹🇲',
    '瓦努阿图 🇻🇺', '危地马拉 🇬🇹', '委内瑞拉 🇻🇪', '文莱 🇧🇳', '乌干达 🇺🇬', '乌克兰 🇺🇦', '乌拉圭 🇺🇾', '乌兹别克斯坦 🇺🇿',
    '西班牙 🇪🇸', '希腊 🇬🇷', '新加坡 🇸🇬', '新西兰 🇳🇿', '匈牙利 🇭🇺', '叙利亚 🇸🇾', '香港 🇭🇰',
    '牙买加 🇯🇲', '亚美尼亚 🇦🇲', '也门 🇾🇪', '伊拉克 🇮🇶', '伊朗 🇮🇷', '以色列 🇮🇱', '意大利 🇮🇹',
    '印度 🇮🇳', '印度尼西亚 🇮🇩', '英国 🇬🇧', '约旦 🇯🇴', '越南 🇻🇳',
    '赞比亚 🇿🇲', '乍得 🇹🇩', '智利 🇨🇱', '中非 🇨🇫', '中国 🇨🇳'
  ];

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

  // 地区搜索过滤功能 - 添加防抖
  const handleRegionSearch = React.useCallback((input: string) => {
    setRegionSearchInput(input);
    // 使用 setTimeout 实现简单的防抖
    setTimeout(() => {
      if (input.trim() === '') {
        setFilteredRegions(regionOptions);
      } else {
        const filtered = regionOptions.filter(region => 
          region.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredRegions(filtered);
      }
    }, 100); // 100ms 延迟
  }, [regionOptions]);

  // 处理地区选择
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setIsRegionSearchMode(false);
    setRegionSearchInput('');
    setShowRegionDropdown(false);
  };

  // 处理地区按钮点击
  const handleRegionButtonClick = () => {
    closeAllDropdowns();
    // 总是进入搜索模式并显示下拉菜单
    setIsRegionSearchMode(true);
    setShowRegionDropdown(true);
    setRegionSearchInput(''); // 清空搜索输入
    setFilteredRegions(regionOptions); // 重置过滤结果
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
      className={`w-full px-5 py-2 bg-stone-50/95 rounded-3xl border border-gray-200 flex items-center justify-between text-left hover:border-orange-300 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <span className="text-gray-800 font-medium">{value}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  // 地区搜索输入框组件 - 简化版本
  const RegionSearchInput = ({ 
    value, 
    onChange, 
    onBlur,
    onClear,
    placeholder = "搜索地区..."
  }: { 
    value: string; 
    onChange: (value: string) => void;
    onBlur?: () => void;
    onClear?: () => void;
    placeholder?: string;
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 自动聚焦
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const handleClearClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) {
        onClear();
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="relative region-search-input">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full px-5 py-2 bg-stone-50/95 rounded-3xl border border-gray-200 text-gray-800 font-medium focus:outline-none focus:border-orange-300 focus:shadow-md transition-all duration-200 pr-10"
        />
        {value && (
          <button
            onClick={handleClearClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const DropdownMenu = ({ 
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
    if (!isOpen) return null;
    
    return (
      <div className={`absolute top-full left-0 right-0 mt-2 z-10 ${className}`}>
        <div className={`
          bg-stone-50/95 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-3xl overflow-hidden
          transform transition-all duration-300 ease-out origin-top
          opacity-100 scale-100 translate-y-0
        `}>
          <div className={`overflow-y-auto ${maxHeight} scrollbar-hide`}>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className={`
                  w-full text-left text-gray-700 font-medium 
                  hover:bg-stone-300
                  px-5 py-1 mx-2 my-0.5 rounded-xl
                  transition-all duration-200 ease-out
                  hover:scale-[1.02] hover:shadow-sm
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 h-screen mx-auto left-0 right-0 bg-[#F7EDE2] flex">
      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col pr-12">
        {/* 头部导航 */}
        <div className="h-4"></div>

        {/* 搜索表单 */}
        <div className="flex-1 px-8 py-8">
          <div className="w-[220px] mx-auto space-y-6">
            {/* 项目选择 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-800 mb-3">项目</label>
              <DropdownButton
                value={selectedProject}
                onClick={() => {
                  closeAllDropdowns();
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
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-800 mb-3">地区</label>
              {isRegionSearchMode ? (
                <RegionSearchInput
                  value={regionSearchInput}
                  onChange={handleRegionSearch}
                  onClear={() => {
                    setRegionSearchInput('');
                    setFilteredRegions(regionOptions);
                    setSelectedRegion('全球');
                  }}
                  // 移除 onBlur 处理，避免干扰输入
                />
              ) : (
                <DropdownButton
                  value={selectedRegion}
                  onClick={handleRegionButtonClick}
                  isOpen={showRegionDropdown}
                />
              )}
              <DropdownMenu
                options={regionSearchInput ? filteredRegions : regionOptions}
                onSelect={handleRegionSelect}
                isOpen={showRegionDropdown}
                maxHeight="max-h-96"
              />
            </div>

            {/* 视频类型 */}
            <div className="relative dropdown-container">
              <label className="block text-base font-semibold text-gray-800 mb-3">视频类型</label>
              <DropdownButton
                value={selectedVideoType}
                onClick={() => {
                  closeAllDropdowns();
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
              <label className="block text-base font-semibold text-gray-800 mb-3">粉丝数</label>
              <DropdownButton
                value={selectedFollowers}
                onClick={() => {
                  closeAllDropdowns();
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
              <label className="block text-base font-semibold text-gray-800 mb-3">平均观看数</label>
              <DropdownButton
                value={selectedViews}
                onClick={() => {
                  closeAllDropdowns();
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
                className="w-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white font-semibold py-4 px-8 rounded-3xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  🔍 <span>找相似博主</span>
                </span>
              </button>
            </div>

            {/* 联系工作人员 */}
            <div className="text-center pt-2">
              <button className="text-amber-700 hover:text-amber-800 text-sm font-medium underline underline-offset-2 transition-colors duration-200">
                联系工作人员
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧导航栏 */}
      <div className="fixed right-0 top-0 bottom-0 w-12 bg-[#F7EDE2] border-l border-stone-300 flex flex-col items-center justify-end py-2">
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
            <Wallet className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
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