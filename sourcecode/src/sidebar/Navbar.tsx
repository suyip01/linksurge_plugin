import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-12 bg-gray-50 border-l border-gray-200 flex flex-col items-center justify-end py-2">
      <div className="flex flex-col items-center space-y-5">
        {/* 历史任务 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="历史任务"
        >
          <i className="fas fa-history text-gray-600 group-hover:text-blue-600"></i>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">历史任务</span>
        </button>

        {/* 教程 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="教程"
        >
          <i className="fas fa-book-open text-gray-600 group-hover:text-blue-600"></i>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">教程</span>
        </button>

        {/* 余额 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="余额"
        >
          <i className="fas fa-wallet text-gray-600 group-hover:text-blue-600"></i>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">余额</span>
        </button>

        {/* 用户头像 */}
        <button 
          className="w-10 h-10 bg-white rounded-full border-2 border-blue-300 flex items-center justify-center hover:border-blue-400 transition-colors card-shadow"
          title="用户中心"
        >
          <i className="fas fa-user text-blue-600"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;