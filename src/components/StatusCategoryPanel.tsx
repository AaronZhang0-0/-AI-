/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scan, BrainCircuit, Activity, CheckSquare, ShieldCheck, AlertCircle } from 'lucide-react';

interface StatusCategoryPanelProps {
  toast: (msg: string) => void;
}

export default function StatusCategoryPanel({ toast }: StatusCategoryPanelProps) {
  const desks = [
    {
      id: 'desk-1',
      role: '识别席',
      status: '正在监测128路视频点位',
      completed: '识别疑似事件32起',
      warning: '二采区高处作业风险升高',
      icon: Scan,
      activeColor: 'bg-blue-50 text-blue-600 border-blue-100',
      statusColor: 'text-blue-600 bg-blue-500/10'
    },
    {
      id: 'desk-2',
      role: '研判席',
      status: '正在研判8起待确认事件',
      completed: '完成风险分级24起',
      warning: '2起事件建议升级复核',
      icon: BrainCircuit,
      activeColor: 'bg-purple-50 text-purple-600 border-purple-100',
      statusColor: 'text-purple-600 bg-purple-500/10'
    },
    {
      id: 'desk-3',
      role: '干预席',
      status: '正在执行14张干预策略卡',
      completed: '触发现场提醒12次',
      warning: '2起事件超过反馈时限',
      icon: Activity,
      activeColor: 'bg-orange-50 text-orange-600 border-orange-100',
      statusColor: 'text-orange-600 bg-orange-500/10'
    },
    {
      id: 'desk-4',
      role: '闭环席',
      status: '正在跟踪6起整改任务',
      completed: '闭环归档4起',
      warning: '2起事件存在超期风险',
      icon: CheckSquare,
      activeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      statusColor: 'text-emerald-600 bg-emerald-500/10'
    }
  ];

  const handleDeskClick = (role: string) => {
    toast(`已关联「${role}」AI全自动席位。系统运转参数良好，正在辅助主班值班人员实时安监。`);
  };

  return (
    <div className="space-y-3.5 shrink-0 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
          <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
          三、 AI能力席位运行专区
        </label>
        <span className="text-[10px] text-slate-400 font-mono">
          状态轮询机制: 1秒/次
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {desks.map((desk) => {
          const Icon = desk.icon;
          return (
            <div
              key={desk.id}
              onClick={() => handleDeskClick(desk.role)}
              className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group"
            >
              {/* Header: Role, icon, and working beacon */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${desk.activeColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-slate-800 tracking-wide font-sans">
                    {desk.role}
                  </span>
                </div>
                {/* Micro working lamp status indicator */}
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  运行中
                </span>
              </div>

              {/* Body details info */}
              <div className="space-y-2 mt-1">
                <div>
                  <span className="text-[9px] text-slate-400 block tracking-wide">当前状态</span>
                  <div className="text-[11.5px] font-bold text-slate-700 font-sans truncate pr-1">
                    {desk.status}
                  </div>
                </div>
                
                <div>
                  <span className="text-[9px] text-slate-400 block tracking-wide">今日完成</span>
                  <div className="text-[11.5px] font-medium text-slate-650 font-sans">
                    {desk.completed}
                  </div>
                </div>

                {/* Exception alert row */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-450 shrink-0" />
                  <span className="truncate">{desk.warning}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
