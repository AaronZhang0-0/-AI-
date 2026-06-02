/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AiAssistantProps {
  onFocusRisks: () => void;
  onOpenReport: () => void;
  toast: (msg: string) => void;
  onOpenDisposalCenter: () => void;
}

export default function AiAssistantDashboard({ onFocusRisks, onOpenReport, onOpenDisposalCenter, toast }: AiAssistantProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 text-white shadow-lg flex items-center gap-8 shrink-0 relative overflow-hidden select-none">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 [background-size:16px_16px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-2 shrink-0 z-10">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl shadow-inner animate-pulse">
            🤖
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-sm">安小邦</div>
          <div className="text-[10px] opacity-70">您的AI安全助手</div>
        </div>
      </div>
      
      <div className="flex-1 border-l border-white/20 pl-8 z-10">
        <h2 className="text-xl font-bold mb-2">安小邦智能工作区</h2>
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 text-slate-100">
          <p className="text-sm leading-relaxed">
            今日共识别事件 <span className="font-bold text-yellow-300">32</span> 起，其中高风险事件 <span className="font-bold text-red-300">5</span> 起。<br/>
            建议重点关注：<span className="underline decoration-dotted text-yellow-250 font-semibold cursor-pointer" onClick={onFocusRisks}>高处作业未系安全带</span>。加强高处作业区域规范佩戴PPE的巡查与安全宣教。
          </p>
          <div className="text-[10px] mt-2 opacity-50">数据更新时间：09:20:36</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0 z-10">
        <button 
          onClick={onFocusRisks}
          className="px-4 py-2 bg-white text-blue-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer text-center"
        >
          查看今日风险
        </button>
        <button 
          onClick={onOpenDisposalCenter}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-all cursor-pointer text-center"
        >
          事件处置中心
        </button>
        <button 
          onClick={onOpenReport}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-all cursor-pointer text-center"
        >
          生成安全日报
        </button>
      </div>
    </section>
  );
}
