/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity } from 'lucide-react';

export default function AiTaskFlow() {
  const activities = [
    { time: '09:15', text: '已通知班组长' },
    { time: '09:13', text: '命中高处作业干预策略' },
    { time: '09:12', text: '识别到高处作业异常' }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full select-none text-left py-2 font-sans">
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        {/* Left header status tag */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100/50 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span className="text-xs font-bold text-slate-800 tracking-wide">
            AI 动态
          </span>
        </div>

        {/* Horizontal flow elements list */}
        <div className="flex-1 flex flex-wrap items-center gap-y-2 gap-x-6 md:justify-end text-xs">
          {activities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-slate-300 hidden md:inline">/</span>}
              <span className="text-slate-400 font-mono font-bold">{item.time}</span>
              <span className="text-slate-650 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

