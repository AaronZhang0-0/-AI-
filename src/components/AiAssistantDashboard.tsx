/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Eye, Cpu } from 'lucide-react';

interface AiAssistantProps {
  onFocusThreeMatters: () => void;
  onFocusPendingEvent: () => void;
  onOpenReport: () => void;
}

export default function AiAssistantDashboard({ 
  onFocusThreeMatters, 
  onFocusPendingEvent, 
  onOpenReport
}: AiAssistantProps) {
  return (
    <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center relative overflow-hidden select-none max-w-2xl mx-auto py-10">
      {/* Background glow resembling Marvis subtle agent environment */}
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
      
      {/* Center Avatar of Agent 安小邦 */}
      <div className="relative group z-10 mb-5">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50/60 rounded-full flex items-center justify-center p-3 border border-slate-100/80 shadow-inner group-hover:scale-102 transition-all duration-300">
          <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border border-slate-100">
            🤖
          </div>
        </div>
        
        {/* Breathing live working beacon */}
        <span className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
        </span>
      </div>

      {/* Modern Whisper Conversational Bubble */}
      <div className="z-10 w-full px-4 mb-8">
        <div className="inline-block relative">
          {/* Bubble content */}
          <div className="bg-slate-50/70 text-slate-700 px-6 py-4 rounded-2xl border border-slate-100 text-sm font-medium tracking-wide leading-relaxed font-sans shadow-sm max-w-md mx-auto">
            发现二采区高处作业异常，建议优先核查。
          </div>
          {/* Tiny decorative arrow */}
          <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 rotate-45" />
        </div>
      </div>

      {/* Sleek Horizontal Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md z-10">
        <button
          onClick={onFocusThreeMatters}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold tracking-wide shadow-md shadow-blue-200/50 hover:shadow-blue-300/60 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          查看风险
        </button>

        <button
          onClick={onFocusPendingEvent}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-full text-xs font-bold tracking-wide border border-slate-200/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Eye className="w-3.5 h-3.5 text-blue-500" />
          处理待确认
        </button>

        <button
          onClick={onOpenReport}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wide border border-slate-200/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          生成日报
        </button>
      </div>
    </section>
  );
}

