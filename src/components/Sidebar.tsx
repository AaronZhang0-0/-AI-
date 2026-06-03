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
  isCollapsed?: boolean;
}

export default function Sidebar({ currentTab, onTabChange, toast, isCollapsed = false }: SidebarProps) {
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
    <aside 
      id="sidebar-container" 
      className={`bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 shadow-xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Logo & Title with Blue Background */}
      <div className={`flex items-center bg-blue-600 shrink-0 transition-all duration-300 h-14 overflow-hidden ${
        isCollapsed ? 'justify-center p-2' : 'px-6 py-4 gap-3'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
          <div className="w-4 h-4 bg-blue-600 rounded-sm rotate-45"></div>
        </div>
        {!isCollapsed && (
          <span className="font-extrabold text-white text-xs leading-sharp tracking-wider animate-in fade-in duration-300 whitespace-nowrap">
            安全值守 AI 智能体
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav-menu" className="flex-1 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentTab;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleMenuClick(item)}
              title={isCollapsed ? item.name : undefined}
              className={`w-full flex items-center transition-all duration-200 cursor-pointer text-left ${
                isCollapsed ? 'justify-center px-4 py-3' : 'gap-3 px-6 py-3 text-xs font-semibold'
              } ${
                isActive 
                  ? 'text-white bg-blue-600/20 border-r-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-blue-400 scale-110' : 'text-slate-500'}`} />
              {!isCollapsed && <span className="truncate animate-in fade-in duration-200">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Panel */}
      <div id="sidebar-status-box" className="border-t border-slate-800 shrink-0">
        {!isCollapsed ? (
          <div className="p-5 space-y-2.5 text-left animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
              <span>系统状态</span>
              <span className="text-green-500 font-bold flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                在线值守
              </span>
            </div>
            <div className="text-[10.5px] text-slate-400 leading-tight">安全探针: 128路 100%</div>
            <div className="text-[9px] text-slate-500 font-mono">v2.3.1 Active</div>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center py-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
