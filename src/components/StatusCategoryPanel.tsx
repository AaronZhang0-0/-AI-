/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scan, BrainCircuit, Activity, RotateCcw } from 'lucide-react';

interface StatusCategoryPanelProps {
  toast: (msg: string) => void;
}

export default function StatusCategoryPanel({ toast }: StatusCategoryPanelProps) {
  const cards = [
    {
      id: 'sc-1',
      title: '自动识别中',
      mainCount: 32,
      subField: '高风险',
      subCount: 5,
      bgIcon: 'bg-blue-50 text-blue-600',
      textSubColor: 'text-red-500',
      icon: Scan,
      desc: '系统正实时分析128路高清监控流...'
    },
    {
      id: 'sc-2',
      title: '智能研判中',
      mainCount: 8,
      subField: '待确认',
      subCount: 2,
      bgIcon: 'bg-purple-50 text-purple-600',
      textSubColor: 'text-slate-500',
      icon: BrainCircuit,
      desc: 'AI正在匹配企业制度与安全法规...'
    },
    {
      id: 'sc-3',
      title: '策略执行中',
      mainCount: 14,
      subField: '已干预',
      subCount: 9,
      bgIcon: 'bg-orange-50 text-orange-600',
      textSubColor: 'text-green-600',
      icon: Activity,
      desc: '多端干预推送和自动广播中...'
    },
    {
      id: 'sc-4',
      title: '闭环跟踪中',
      mainCount: 6,
      subField: '已闭环',
      subCount: 4,
      bgIcon: 'bg-green-50 text-green-600',
      textSubColor: 'text-slate-500',
      icon: RotateCcw,
      desc: '追踪班组整改反馈并核对消项照片...'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none shrink-0">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => toast(`当前查看「${card.title}」流程引擎：运行状态全绿在线。`)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <span className={`p-1.5 rounded text-xs flex items-center justify-center shrink-0 ${card.bgIcon}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-end gap-2.5 mt-1">
              <div className="text-2xl font-bold text-slate-800 font-sans tracking-tight">{card.mainCount}</div>
              <div className={`text-xs mb-1 font-medium ${card.textSubColor}`}>
                {card.subField} {card.subCount}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 truncate">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
