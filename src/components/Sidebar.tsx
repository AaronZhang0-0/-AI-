/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Eye, 
  ClipboardList, 
  Zap, 
  CheckCircle, 
  FileBarChart2, 
  SlidersHorizontal,
  Wifi,
  Radio,
  ToggleLeft
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  toast: (msg: string) => void;
}

export default function Sidebar({ currentTab, onTabChange, toast }: SidebarProps) {
  const menuItems = [
    { id: 'office', name: 'AI安全办公室', icon: Cpu },
    { id: 'events', name: 'AI识别事件池', icon: Eye },
    { id: 'details', name: '事件处置详情', icon: ClipboardList },
    { id: 'strategies', name: '干预策略中心', icon: Zap },
    { id: 'closed', name: '闭环处置中心', icon: CheckCircle },
    { id: 'portraits', name: '风险画像与复盘', icon: FileBarChart2 },
    { id: 'rules', name: '规则配置', icon: SlidersHorizontal },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.id === 'office') {
      onTabChange(item.id);
    } else {
      toast(`即将为您跳转到「${item.name}」页面...`);
    }
  };

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 shadow-xl">
      {/* Brand Logo & Title with Blue Background */}
      <div className="p-6 flex items-center gap-3 bg-blue-600 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
          <div className="w-4 h-4 bg-blue-600 rounded-sm rotate-45"></div>
        </div>
        <span className="font-bold text-white text-sm leading-tight">
          不安全行为识别<br/>干预AI智能体系统
        </span>
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav-menu" className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentTab;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                isActive 
                  ? 'text-white bg-blue-600/20 border-r-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Panel */}
      <div id="sidebar-status-box" className="p-6 border-t border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
          <span>系统状态</span>
          <span className="text-green-500 font-bold">● 正常运行</span>
        </div>
        <div className="text-[11px] text-slate-400">监控接入: 128/128 在线</div>
        <div className="text-[11px] text-slate-400">AI 模型版本: v2.3.1 最新</div>
      </div>
    </aside>
  );
}
