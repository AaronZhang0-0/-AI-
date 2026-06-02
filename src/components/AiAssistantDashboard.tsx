/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';

interface AiAssistantProps {
  onFocusThreeMatters: () => void;
  onFocusPendingEvent: () => void;
  onOpenReport: () => void;
  toast: (msg: string) => void;
}

export default function AiAssistantDashboard({ 
  onFocusThreeMatters, 
  onFocusPendingEvent, 
  onOpenReport, 
  toast 
}: AiAssistantProps) {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden select-none border border-slate-800">
      {/* Dynamic tech-grid backdrop overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Left: 安小邦 AI Active Avatar / Status */}
      <div className="flex flex-col items-center gap-2.5 shrink-0 z-10 w-full md:w-32">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-blue-600/30 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
            <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center text-blue-700 text-3xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              🤖
            </div>
          </div>
          {/* Active status pulse lamp */}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
          </span>
        </div>
        <div className="text-center">
          <div className="font-bold text-sm tracking-wide text-blue-300 flex items-center justify-center gap-1">
            安小邦
          </div>
          <div className="text-[10px] opacity-60 font-mono">AI 安全智脑值守中</div>
        </div>
      </div>
      
      {/* Center: AI Active briefing content */}
      <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-6 z-10 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded tracking-widest uppercase">
            ACTIVE SERVICE
          </span>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
            安小邦正在值守
          </h2>
        </div>
        <div className="bg-white/5 p-4.5 rounded-xl border border-white/10 text-slate-205">
          <p className="text-xs md:text-sm leading-relaxed text-slate-100 font-medium font-sans">
            带班值班员张安全，您好。我已开启全天候智能防御监控。今日累计协助发现与提示现场偏失行为 <span className="font-extrabold text-yellow-300">32</span> 起。其中我已通过定向扩音器呼叫触发了 <span className="font-bold text-blue-300">12</span> 次不规范现场纠正提醒。
            目前仍有 <span className="font-bold text-amber-300">8</span> 起判定事件正处于待您确认审核的关键控制节点。
            <br />
            <span className="block mt-2.5 text-slate-300 text-xs font-semibold border-l-2 border-yellow-500/80 pl-2">
              值守助手当前建议：请优先在控制台确认二采区高阻攀爬未扣生命绳的安全异常，一键下发现场整改任务；并建议本班内启动高空作业特种PPE穿戴专项预防宣导。
            </span>
          </p>
          <div className="text-[9px] mt-2.5 opacity-40 font-mono tracking-wide flex items-center justify-between">
            <span>智能巡航效率: 每秒60帧无间断检测 | 自动策略调度挂载</span>
            <span>巡查快照：09:20:36</span>
          </div>
        </div>
      </div>

      {/* Right: Interactive command nodes */}
      <div className="flex flex-col gap-2 shrink-0 z-10 w-full md:w-44">
        <button 
          onClick={onFocusThreeMatters}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer text-center border border-blue-500 flex items-center justify-center gap-1.5 active:scale-98"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          查看重点风险
        </button>
        <button 
          onClick={onFocusPendingEvent}
          className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          处理待确认事件
        </button>
        <button 
          onClick={onOpenReport}
          className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 hover:border-slate-600/30 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          生成安全日报
        </button>
      </div>
    </section>
  );
}
