/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PRESET_CHAT_ANSWERS } from '../data';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Cpu,
  Trash2,
  CalendarCheck,
  LifeBuoy
} from 'lucide-react';

interface AiChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenReport: () => void;
  onSelectEventById: (id: string) => void;
  toast: (msg: string) => void;
}

export default function AiChatbotDrawer({ 
  isOpen, 
  onToggle, 
  onOpenReport, 
  onSelectEventById, 
  toast 
}: AiChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-m1",
      sender: "ai",
      text: "您好，我是您的AI安全督导助手**安维斯 Anvis**。我正在实时监听128路生产监控视频流并协同匹配安全制度。您随时可以询问我厂区实时风险、特定工位、或请求帮您处理闭环事务！",
      timestamp: "09:20"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const presetQuestions = [
    "今天有哪些高风险事件？",
    "哪些事件需要我确认？",
    "帮我生成今日安全日报。",
    "哪个区域问题最多？"
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add User message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // 2. Simulate AI delay
    setTimeout(() => {
      let replyText = "抱歉安维斯刚才没有听清，建议您向我咨询「今日高风险」等预设厂区核心安全数据。";
      
      // Lookup matches in preset questions
      const matchKey = Object.keys(PRESET_CHAT_ANSWERS).find(k => k.includes(text) || text.includes(k));
      if (matchKey) {
        replyText = PRESET_CHAT_ANSWERS[matchKey].reply;
      } else {
        // Fallback text parsing
        const lower = text.toLowerCase();
        if (lower.includes("高架") || lower.includes("高处") || lower.includes("安全带") || lower.includes("坠落")) {
          replyText = "发现您对高处作业感兴趣。今日 **09:12** 在二采区曾触发「高处作业未系安全带」紧急事件。系统已调动二采区音柱全智能督导喊麦。需要为您**定位并打开该事件的研究面板**吗？";
        } else if (lower.includes("你好") || lower.includes("在吗") || lower.includes("你好呀")) {
          replyText = "您好！我是安维斯 Anvis，您的智能安全助手。很高兴为您服务。请问今天有什么安全检查任务需要我辅助判定或生成汇报吗？";
        } else if (lower.includes("日报") || lower.includes("简报") || lower.includes("报告")) {
          replyText = PRESET_CHAT_ANSWERS["帮我生成今日安全日报。"].reply;
        } else if (lower.includes("配电") || lower.includes("闯入") || lower.includes("配电房")) {
          replyText = "今天 **09:08** 在配电隔离检修区发生实习电工越界越红线。系统已进行了防烟吼暴笛震退。请相关带班主任复检。";
        }
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Special action triggers
      if (text.includes("生成今日安全日报")) {
        toast("📊 监测到日报生成请求，已为您打开安全简报台账...");
        onOpenReport();
      } else if (text.includes("高风险")) {
        toast("🔍 请查看列表中高亮项，包含09:12的特种平台裸登违章。");
      }
    }, 1200);
  };

  const clearChatLogs = () => {
    setMessages([
      {
        id: "init-m1",
        sender: "ai",
        text: "聊天历史记录已清理。我是安维斯，继续为您常驻在岗安全排查和策略协同！",
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    toast("已清空助理会话历史");
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex flex-col items-center justify-center text-white border-4 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <div className="text-xl group-hover:animate-bounce">🤖</div>
        <div className="text-[10px] font-bold font-sans">安维斯</div>
      </button>

      {/* 2. Side Dialog Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-slate-105 animate-in slide-in-from-right duration-250 select-none">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-lg flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold font-sans">安维斯智能安全督导</div>
                <div className="text-[9px] text-cyan-305 font-mono tracking-wider">AI AGENT ONLINE COM</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={clearChatLogs}
                title="清空会话"
                className="p-1 text-slate-300 hover:text-rose-400 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={onToggle}
                className="p-1 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Preset trigger quick panel toolbar */}
          <div className="bg-slate-50 p-2.5 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest px-1 mb-1.5 flex items-center gap-1">
              <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
              小邦快捷查询指令
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-150 hover:border-blue-300 text-[10.5px] text-slate-600 hover:text-blue-600 transition-all font-sans cursor-pointer text-left whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Logs Body */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar"
          >
            {messages.map((m) => {
              const isAi = m.sender === "ai";
              return (
                <div 
                  key={m.id}
                  className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Bot mini icon */}
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-750 flex items-center justify-center shrink-0 text-cyan-300">
                      <Cpu className="w-4.5 h-4.5" />
                    </div>
                  )}

                  {/* Message Bubble box */}
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-[11.5px] leading-relaxed shadow-sm ${
                    isAi 
                      ? 'bg-white border border-slate-150 text-slate-800 rounded-tl-none font-sans' 
                      : 'bg-blue-600 text-white rounded-tr-none font-sans'
                  }`}>
                    {/* Render message with bold line matching support */}
                    <p className="whitespace-pre-wrap">
                      {m.text}
                    </p>
                    <span className={`block text-[9px] text-right font-mono mt-1 w-full ${isAi ? 'text-slate-400' : 'text-blue-150'}`}>
                      {m.timestamp}
                    </span>
                  </div>

                  {/* User mini badge */}
                  {!isAi && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600 text-xs font-bold">
                      安
                    </div>
                  )}
                </div>
              );
            })}

            {/* Simulated writing wait bar */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-755 flex items-center justify-center text-cyan-300">
                  <Cpu className="w-4.5 h-4.5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Typing Area input footer */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(userInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="键入关于特定行为的监控判定..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 h-9 px-3 text-xs border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl bg-slate-50 text-slate-705"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all font-bold cursor-pointer ${
                  userInput.trim() && !isTyping
                    ? 'bg-blue-650 hover:bg-blue-700 text-white shadow shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-350 cursor-not-allowed'
                }`}
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
