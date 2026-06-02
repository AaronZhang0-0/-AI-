/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, TrendingUp, HelpCircle, FileText } from 'lucide-react';

interface SafetyStatusBannerProps {
  toast: (msg: string) => void;
}

export default function SafetyStatusBanner({ toast }: SafetyStatusBannerProps) {
  const stats = [
    { label: '今日疑似', count: '32起', comment: '同比昨天 -8.5%' },
    { label: '高风险', count: '5起', comment: '未规避红线作业', highlight: true },
    { label: '待人工确认', count: '8起', comment: '关键干预节点' },
    { label: '超期未闭环', count: '2起', comment: '时限警告中' }
  ];

  return (
    <div 
      onClick={() => toast("AI安全办公室今日评估：受二采区特种在岗人员流动密集影响，不挂生命绳偶发率呈局部点位上升。请密切配合线上工单流转。")}
      className="bg-orange-50/50 border border-orange-200/80 rounded-xl p-3 px-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all select-none text-left shrink-0"
    >
      {/* Left: AI Assessment Badge & Sentence */}
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <span className="bg-orange-550 text-white text-[10px] font-bold px-2 py-0.5 rounded font-sans tracking-wide shrink-0">
            安全态势：需重点关注
          </span>
        </div>
        
        <p className="text-xs font-semibold text-slate-800 leading-normal font-sans">
          <span className="text-orange-600 font-bold mr-1.5">[AI 实时诊断]</span>
          二采区高处作业未系安全带事件连续出现，风险水平高于近7日均值。
        </p>
      </div>

      {/* Right: Flat stats table list */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200/70 lg:pl-5 shrink-0 w-full lg:w-auto text-xs">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-2 min-w-[100px] lg:min-w-0">
            <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium shrink-0">{stat.label}:</span>
            <span className={`font-extrabold font-sans ${stat.highlight ? 'text-rose-600' : 'text-slate-700'}`}>
              {stat.count}
            </span>
            <span className="text-[9px] text-slate-350 font-medium">({stat.comment})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
