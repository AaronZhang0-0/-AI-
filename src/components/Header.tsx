/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  toast: (msg: string) => void;
}

export default function Header({ onSearch, toast }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const clearSearch = () => {
    setSearchVal('');
    onSearch('');
    toast('已重置搜索');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm sticky top-0 z-30">
      {/* Search Bar - matching the exact design HTML input-with-icon style */}
      <div className="flex items-center gap-2">
        <div className="text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text" 
          placeholder="搜索事件、策略、人员、区域等..." 
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onSearch(e.target.value);
          }}
          className="bg-transparent border-none text-sm outline-none w-80 text-slate-700"
        />
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon with dot alert */}
        <button 
          onClick={() => toast('您有 12 条待核查的不安全行为警告')}
          className="relative p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
          <Bell className="w-5 h-5" />
        </button>

        {/* User Card with Border-Left */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity"
          >
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                张安全
              </div>
              <div className="text-[11px] text-slate-500">安全管理员</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              张
            </div>
          </button>

          {/* Profile Dropdown menu */}
          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-700">张安全</div>
                  <div className="text-[10px] text-slate-400 font-mono">lovezz1021@gmail.com</div>
                </div>
                <button
                  onClick={() => {
                    toast('编辑管理员个人资料...');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  个人中心
                </button>
                <button
                  onClick={() => {
                    toast('正在进入系统环境设置与算法规则配置...');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  偏好设置
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    toast('已安全退出登录模拟流程');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
