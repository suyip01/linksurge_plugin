import React, { useState, useEffect } from 'react';
import { Download, Square, HelpCircle } from 'lucide-react';
import Navbar from './Navbar';
import { useRouter } from './Router';

const ResultsPage: React.FC = () => {
  const { navigateTo } = useRouter();
  const [includeEmail, setIncludeEmail] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const current = 20;
  const total = 80;
  const percentage = Math.min((current / total) * 100, 100);

  // 动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const handleBackToSearch = () => {
    navigateTo('search');
  };

  return (
    <div className="fixed top-0 h-screen mx-auto left-0 right-0 bg-[#F7EDE2] flex">
      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col pr-12">
        {/* 头部导航 */}
        <header className="px-6 py-4 flex items-center justify-center">
          <div className="flex-1 max-w-md mx-4">
            <div className="bg-white rounded-full px-4 py-3 shadow-sm relative overflow-hidden">
              {/* 进度条背景 */}
              <div className="absolute inset-0 bg-gray-100"></div>
              
              {/* 进度条填充 */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-1000 ease-out"
                style={{ width: `${animatedProgress}%` }}
              >
                {/* 进度条光泽效果 */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {/* 进度文字 */}
              <div className="relative flex items-center justify-between z-10">
                <span className="text-sm font-medium text-gray-700">今天任务完成情况</span>
                <span className="text-sm font-bold text-gray-800">{current}/{total}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <div className="flex-1 px-8 py-8">
          <div className="w-[240px] mx-auto space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 font-medium">本次搜索任务</p>
                    <h1 className="text-xl font-bold text-gray-800">相似来源</h1>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-base">👤</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button className="h-8 px-4 rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent flex items-center gap-1 transition-colors text-sm">
                      <Square className="h-3 w-3 fill-red-500" />
                      停止
                    </button>
                    <button className="h-8 px-4 rounded-full border-2 border-gray-800 hover:bg-orange-200 bg-transparent flex items-center gap-1 transition-colors text-sm">
                      <Download className="h-3 w-3" />
                      表格
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-around pt-3 border-t border-stone-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">待筛选</p>
                    <p className="text-2xl font-bold text-gray-800">80</p>
                  </div>
                  <div className="h-12 w-px bg-stone-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">已收藏</p>
                    <p className="text-2xl font-bold text-gray-800">0</p>
                  </div>
                </div>
              </div>

              {/* Email Toggle */}
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-gray-800">是否有联系方式</span>
                  <button className="group relative">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      邮箱、whatsapp、linktree等
                    </div>
                  </button>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmail}
                    onChange={(e) => setIncludeEmail(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-400"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button className="w-full h-12 rounded-2xl border-2 border-gray-800 bg-white hover:bg-orange-100 text-base font-medium transition-colors flex items-center justify-center">
                  ❌ 不合适
                </button>

                <button className="w-full h-12 rounded-2xl border-2 border-gray-800 bg-[#fef9e7] hover:bg-[#fef5d4] text-base font-medium transition-colors flex items-center justify-center">
                  ✅ 收藏
                </button>

                <button className="w-full h-12 rounded-2xl bg-[#fef3c7] hover:bg-[#fde68a] text-gray-800 text-base font-medium border-2 border-gray-800 transition-colors flex items-center justify-center gap-2">
                  根据{" "}
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs">👤</span>
                  </div>{" "}
                  找相似
                </button>
              </div>

              {/* Back Link */}
              <div className="text-center pt-4">
                <button 
                  onClick={handleBackToSearch}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  返回搜索
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

export default ResultsPage;