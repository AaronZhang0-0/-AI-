/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Sparkles, ShieldCheck, Activity, RefreshCw, Bell, FileText, CheckCircle } from 'lucide-react';

interface AiAssistantProps {
  onFocusThreeMatters: () => void;
  onFocusPendingEvent: () => void;
  onOpenReport: () => void;
  onOpenChat?: () => void;
  onMatchPolicy?: () => void;
  toast: (msg: string, type?: 'info' | 'success') => void;
}

export default function AiAssistantDashboard({ 
  onFocusThreeMatters, 
  onFocusPendingEvent, 
  onOpenReport,
  onOpenChat,
  onMatchPolicy,
  toast
}: AiAssistantProps) {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '您好，我是安全守护智能体安维斯 Anvis。当前AI视频分析、高风险提醒、自动督办正常驻后台值守。您可以随时下达临时管理指令，如查询特定事件或编制简报等。' }
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
        reply = '🔍 已为您筛选并定位今天发生的 3 类关键不合规事件。推荐优先确认最上方「二采区高处作业未系安全带」（高风险）并予以人工确认。';
        onFocusThreeMatters();
      } else if (norm.includes('日报') || norm.includes('报告') || norm.includes('生成日报')) {
        reply = '📊 已收到指令，正在一键抓取并总结截止今日当前 2026/06/02 的全部 32 起厂区偏失巡查画面... 智能安全日报正在为您生成就绪，请阅读弹窗简牍。';
        onOpenReport();
      } else if (norm.includes('催办') || norm.includes('超期') || norm.includes('待处理')) {
        reply = '⚡ 已针对超期未闭合的 2 起作业事件（主要为二采区与破碎通道超期偏失项），自动向对应两名当班班组责任人推送了短信催办工单并致电提醒。';
        toast("已向2个超期事件责任人发送提醒", "success");
      } else if (norm.includes('巡查') || norm.includes('创建') || norm.includes('专项')) {
        reply = '📝 审核成功：已基于近期突出的二采区登高未挂双保险带警示，一键创建「二采区高空特种作业防坠」专项闭合巡查。整改验证工单已自动派遣。';
        toast("已创建二采区高处作业专项巡查草稿", "success");
      } else if (norm.includes('制度') || norm.includes('条款') || norm.includes('匹配')) {
        reply = '📘 正在核验国家 GB30871-2022 特种高空作业标准，已成功帮您匹配到安全制度规定，并调出了关联高处作业不安全行为的细分核准信息。';
        if (onMatchPolicy) {
          onMatchPolicy();
        }
      } else {
        reply = '收到您的安全管控指令。安维斯 Anvis 正在后台全天候执行视频防区哨兵监察，一切运行良好，暂无次级预警泄漏风险。';
      }

      setConversation(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAnswering(false);
    }, 700);
  };

  const quickCommands = [
    { label: '查今日高风险', text: '查今日高风险' },
    { label: '生成安全日报', text: '生成今日安全报告' },
    { label: '催办超期闭环', text: '催促整改超期未闭环事件' },
    { label: '创建专项巡查', text: '针对高空操作创建专项巡查' },
    { label: '匹配制度条款', text: '匹配国家特种高空作业管理制度条款' }
  ];

  return (
    <section className="space-y-8 max-w-4xl mx-auto w-full font-sans">
      
      {/* Central intelligent agent workbench card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.015)] relative overflow-hidden">
        
        {/* Soft background glow resembling Marvis workspace */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-sky-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          
          {/* Active Copilot Robot Avatar */}
          <div className="relative flex flex-col items-center">
            <div className="relative p-1 bg-slate-50 border border-slate-100/80 rounded-3xl shadow-sm">
              <div className="w-18 h-18 bg-white border border-slate-100/50 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-4xl animate-pulse" style={{ animationDuration: '4s' }}>🤖</span>
              </div>
            </div>
            
            {/* Elegant live status beacon */}
            <span className="absolute bottom-0 right-1 px-2.5 py-0.5 rounded-full bg-emerald-500 border-2 border-white text-[8px] font-bold text-white flex items-center gap-1 shadow-sm leading-none">
              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
              安维斯值守中
            </span>
          </div>

          {/* Anvis current thinking / conversation bubble space */}
          <div className="w-full max-w-xl">
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/60 text-xs text-slate-700 font-medium leading-relaxed shadow-inner font-sans relative">
              {conversation.slice(-1).map((msg, i) => (
                <div key={i} className="flex gap-2 justify-center sm:justify-start items-start">
                  <span className="font-bold text-blue-600 shrink-0 text-left">
                    [安维斯 Anvis] :
                  </span>
                  <p className="text-slate-600 text-left whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
              
              {isAnswering && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium mt-1">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-0.5">正在读取厂区AI智能监控流并研判...</span>
                </div>
              )}
            </div>
          </div>

          {/* Core double capacities representation: 自动值守中 & 临时任务 */}
          <div className="w-full max-w-2xl border-t border-slate-50 pt-5 space-y-4">
            
            {/* 1. 自动值守中 state row */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between px-3 text-xs gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                自动值守中
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 text-slate-450 font-medium text-[11px]">
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">视频风险检测</span>
                <span className="text-slate-200">｜</span>
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">高风险提醒</span>
                <span className="text-slate-200">｜</span>
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">闭环催办</span>
                <span className="text-slate-200">｜</span>
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">日报生成</span>
              </div>
            </div>

            {/* 2. 临时任务 dynamic command section */}
            <div className="space-y-3.5 text-left bg-slate-50/30 p-4 rounded-2xl border border-slate-100/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  临时任务
                </span>
                <span className="text-[10px] text-slate-400 font-medium">输入即可触发一键下达控制</span>
              </div>

              {/* Dynamic dialog input form */}
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
                  placeholder="让安维斯 Anvis 帮你查风险、催闭环、生成报告或创建任务……"
                  className="w-full bg-white border border-slate-100/90 focus:border-blue-500 focus:outline-none rounded-2xl h-10 px-4 text-xs font-medium text-slate-700 shadow-inner transition-all placeholder:text-slate-350"
                />
                
                <div className="absolute right-1 flex items-center gap-1">
                  {query.trim() && (
                    <button
                      type="submit"
                      className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-97"
                    >
                      <Send className="w-2.5 h-2.5" />
                      下达
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="h-8 w-8 hover:bg-slate-200/50 text-slate-500 hover:text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    title="安维斯 Anvis 深度诊断助手"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                </div>
              </form>

              {/* Quick Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickCommands.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCommandSubmit(item.text)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-100/80 hover:border-slate-200 text-[11px] text-slate-600 font-sans font-medium transition-all cursor-pointer active:scale-97 hover:text-slate-900"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 三、自动值守任务 list of four specific state cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pl-1">
          <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" style={{ animationDuration: '10s' }} />
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            自动值守任务
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1: 视频风险检测 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-36">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-750 block">1. 视频风险检测</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                持续识别PPE、越界、高处作业等风险线索
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-slate-405">值守监测</span>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                运行中
              </span>
            </div>
          </div>

          {/* Card 2: 高风险提醒 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-36">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-750 block">2. 高风险提醒</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                发现高风险事件后自动通知责任人
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-slate-405">微信/短信通知</span>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                运行中
              </span>
            </div>
          </div>

          {/* Card 3: 闭环催办 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-36">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-750 block">3. 闭环催办</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                超期未反馈事件自动提醒责任人
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-slate-405">自动催办</span>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                运行中
              </span>
            </div>
          </div>

          {/* Card 4: 日报生成 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-36">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-750 block">4. 日报生成</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                每天18:00自动生成安全日报草稿
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-slate-405">定时汇总</span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                已启用
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

