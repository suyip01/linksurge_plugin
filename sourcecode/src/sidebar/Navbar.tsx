import React from 'react';
import { User, BookOpen, Clock, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-12 bg-[#F7EDE2] border-l border-stone-300 flex flex-col items-center justify-end py-2">
      <div className="flex flex-col items-center space-y-5">
        {/* 历史任务 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
          title="历史任务"
        >
          <Clock className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-800">历史任务</span>
        </button>

        {/* 教程 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
          title="教程"
        >
          <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-800">教程</span>
        </button>

        {/* 余额 */}
        <button 
          className="flex flex-col items-center gap-1 p-2 hover:bg-orange-200 rounded-lg transition-colors group"
          title="余额"
        >
          <Wallet className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-800">余额</span>
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
  );
};

export default Navbar;