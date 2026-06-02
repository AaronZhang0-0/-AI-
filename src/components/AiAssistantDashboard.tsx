/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Eye, Cpu, Send, Sparkles, CheckCircle2, Play, Settings, ShieldCheck, HelpCircle } from 'lucide-react';

interface AiAssistantProps {
  onFocusThreeMatters: () => void;
  onFocusPendingEvent: () => void;
  onOpenReport: () => void;
  onOpenChat?: () => void;
}

export default function AiAssistantDashboard({ 
  onFocusThreeMatters, 
  onFocusPendingEvent, 
  onOpenReport,
  onOpenChat
}: AiAssistantProps) {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '您好，我是安全智能体安小邦。今日自动化监控已常驻就绪，您可以向下达指派命令、或查阅当前待办。' }
  ]);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleCommandSubmit = (cmdText: string) => {
    if (!cmdText.trim()) return;
    
    // Add User query
    const userMsg = { role: 'user' as const, text: cmdText };
    setConversation(prev => [...prev, userMsg]);
    setQuery('');
    setIsAnswering(true);

    setTimeout(() => {
      let reply = '';
      const norm = cmdText.toLowerCase();

      if (norm.includes('高风险') || norm.includes('风险') || norm.includes('高危')) {
        reply = '🔍 分析报告：今天系统共捕获到 5 起疑似风险事件，其中二采区「高处作业未系安全带」（09:12）最为紧急。系统已通过现场声柱对其触发广播喊话。建议点击【查看风险】一键快速锁定。';
        // Auto trigger highlight scroll behavior
        onFocusThreeMatters();
      } else if (norm.includes('日报') || norm.includes('报告') || norm.includes('生成日报')) {
        reply = '📊 已收到指令，正在实时抓取截止当前的 32 起厂区偏失巡查画面，正在调起「AI 智能安全简报分析」仪表板... 请查看弹出的日报分析。';
        onOpenReport();
      } else if (norm.includes('确认') || norm.includes('核查') || norm.includes('待处理') || norm.includes('待确认')) {
        reply = '💡 提示：目前有 8 起安全偏失待审核，重点是配电区「越线闯入区域监控」。已为您启动并核对带班值修员现场反馈，建议点击【去处理】一键调阅详情。';
        onFocusPendingEvent();
      } else if (norm.includes('策略') || norm.includes('自动化') || norm.includes('规则')) {
        reply = '⚡ 您当前运行着 3 条全自动安全防御规则：包括“每秒60帧视频源智能分析”、“违规高分贝高空定向语音喊麦”、以及“多端工单同步派发提醒”。一切运转正常，防护率 100%。';
      } else {
        reply = '收到您安全生产的管理指令。安小邦已全天候挂载防区哨兵。今天依然有 3 项需要您亲自审核、人工签字销号的安全干预节点，请在下方列表予以校对。';
      }

      setConversation(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAnswering(false);
    }, 900);
  };

  const quickCommands = [
    { label: '有哪些高风险事件？', text: '有哪些高风险事件？' },
    { label: '帮我生成安全日报', text: '帮我生成今日安全日报' },
    { label: '谁需要人工审核确认？', text: '谁需要人工审核确认？' },
    { label: '查询自动化守护任务', text: '查询自动化策略' }
  ];

  return (
    <section className="space-y-6 max-w-4xl mx-auto w-full select-none text-left font-sans">
      
      {/* Central workbench header layout */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
        
        {/* Soft background glows reminiscent of conversational environment */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Active Copilot Logo Presence */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-tr from-slate-50/50 to-blue-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl border border-slate-100">
                  🤖
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-pulse" />
              </span>
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full tracking-wider">
                Active Guard
              </span>
            </div>
          </div>

          {/* Interactive conversational bubble & instruction query bar */}
          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                您好，我是您的安全智能体安小邦
              </h3>
              <p className="text-xs text-slate-400">
                可对话下达指令，协助您完成安全派发、日报自动汇总与全天候自动侦测
              </p>
            </div>

            {/* Smart Dialog text bubble block showing the latest conversational messages */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-3 shadow-inner">
              {conversation.slice(-1).map((msg, i) => (
                <div key={i} className="flex gap-2">
                  <span className="font-bold text-blue-600 shrink-0">
                    {msg.role === 'ai' ? '[安小邦]' : '[您]'}
                  </span>
                  <p className="font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              ))}
              
              {isAnswering && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1">正在提炼厂区监控数据...</span>
                </div>
              )}
            </div>

            {/* Powerful dialog query input form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCommandSubmit(query);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="键入安全任务指令（例如：'有哪些高风险事件'、'生成今日安全日报'）..."
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-full h-11 pl-4.5 pr-28 text-xs font-medium text-slate-700 shadow-sm transition-all"
              />
              
              <div className="absolute right-1.5 flex items-center gap-1.5">
                {query.trim() && (
                  <button
                    type="submit"
                    className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3 h-3 text-white" />
                    安全指派
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="h-8 px-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center"
                  title="打开高级对话"
                >
                  <Sparkles className="w-3 h-3 text-cyan-600" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions instructs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mr-1">
                快捷任务:
              </span>
              {quickCommands.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCommandSubmit(item.text)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-[10.5px] text-slate-600 font-sans tracking-wide transition-all cursor-pointer active:scale-97 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Dual column: Automated Background rules & What An Xiaobang handles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Solutions An Xiaobang covers */}
        <div className="bg-white rounded-2xl p-5.5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-50">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800 tracking-wide">
              安小邦能解决的问题
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-base">👨‍🏭</span>
              <div>
                <span className="text-xs font-bold text-slate-700 block">违规穿戴与不规范登高监查</span>
                <span className="text-[10.5px] text-slate-450 leading-relaxed block">
                  自动捕捉高处作业不挂双扣、登高无合格PPE（反光皮服/避险隔绝特服）
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-base">📢</span>
              <div>
                <span className="text-xs font-bold text-slate-700 block">红线区域危险闯入即时震退</span>
                <span className="text-[10.5px] text-slate-450 leading-relaxed block">
                  高电压变配电区域越隔离线，联动本地音炮声光雷暴，实施强警告
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-base">📋</span>
              <div>
                <span className="text-xs font-bold text-slate-700 block">多端闭环智能待办单流转</span>
                <span className="text-[10.5px] text-slate-450 leading-relaxed block">
                  自主整理现场异常快照，一键合成工单发往班组长协助进行核减跟进
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Running Automated Background Tasks */}
        <div className="bg-white rounded-2xl p-5.5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-50">
            <Settings className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
            <h4 className="text-xs font-bold text-slate-800 tracking-wide flex items-center justify-between w-full">
              <span>正在静默挂载的自动化守护任务</span>
              <span className="text-[9.5px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                已启用守护守护
              </span>
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-700">128路生产视频毫秒级巡查</p>
                <p className="text-[10px] text-slate-400 mt-0.5">每秒60帧高频率算法轮循无盲区</p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 shrink-0 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                侦听中
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-700">重点高架定向智能语音播报</p>
                <p className="text-[10px] text-slate-400 mt-0.5">高音大喇叭现场喊麦驱离，纠违干预</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 shrink-0 bg-blue-50 px-2 py-0.5 rounded-md">
                已就绪
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-700">多路待确认工单定时唤醒</p>
                <p className="text-[10px] text-slate-400 mt-0.5">触发对逾期未核查工单自动转交短信</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 shrink-0 bg-indigo-50 px-2 py-0.5 rounded-md">
                智能轮询
              </span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}

