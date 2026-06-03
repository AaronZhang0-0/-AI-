import React, { useState } from 'react';
import { INITIAL_RISK_EVENTS } from './data';
import { RiskEvent } from './types';

// Import our modular components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AiAssistantDashboard from './components/AiAssistantDashboard';
import AiChatbotDrawer from './components/AiChatbotDrawer';
import EventDetailsModal from './components/EventDetailsModal';
import DailyReportModal from './components/DailyReportModal';

import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // State definitions
  const [currentTab, setCurrentTab] = useState('office');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Real active list states
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>(INITIAL_RISK_EVENTS);

  // Overlay states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null);
  
  // Trigger scrolling state
  const [shouldHighlightRiskId, setShouldHighlightRiskId] = useState<string | null>(null);

  // Custom Toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success'>('info');

  const triggerToast = (msg: string, type: 'info' | 'success' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Callback triggers
  const handleSelectRiskRow = (row: RiskEvent) => {
    setSelectedEvent(row);
  };

  const handleOpenReport = () => {
    setIsReportOpen(true);
    triggerToast("📊 正在根据今日轮询报告生成安全日报简牍...", 'info');
  };

  const handleFocusThreeMatters = () => {
    setShouldHighlightRiskId("REV-20260602-01");
  };

  const handleFocusPendingEvent = () => {
    const match = riskEvents.find(e => e.id === "REV-20260602-03");
    if (match) {
      setSelectedEvent(match);
      triggerToast("🤖 已为您打开「危险区域闯入」人工确认详情页");
    }
  };

  // AI Intervention path callback
  const handleInterventionSuccess = (eventId: string) => {
    setRiskEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: '干预中',
          details: {
            ...evt.details,
            conclusion: `【现场语音已送达】已成功向二采区A3部位现场定向语音喇叭播发安全告知。临近现场安全员已收到待核告警工单，正在呼查人员纠正！\n\n(原识别内容：${evt.details.conclusion})`
          }
        };
      }
      return evt;
    }));

    triggerToast("🤖 安维斯 Anvis 已触发安全纠违语音警示及短信推送！现场干预任务现已发送至当班安全代表。", 'success');
  };

  // Search filter lists
  const filteredRiskEvents = riskEvents.filter(evt => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      evt.event.toLowerCase().includes(query) ||
      evt.id.toLowerCase().includes(query) ||
      evt.area.toLowerCase().includes(query) ||
      evt.level.toLowerCase().includes(query)
    );
  });

  return (
    <div id="saas-container-root" className="h-screen overflow-hidden bg-[#F8FAFC] flex font-sans text-slate-800 antialiased relative">
      
      {/* 1. Global Notification Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4.5 py-3 rounded-full bg-slate-900 border border-slate-800/80 text-white flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none select-none text-xs">
          {toastType === 'success' ? (
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-blue-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          )}
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}
 
      {/* 2. Left side deep blue Navigation panel */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab);
          triggerToast(`已切入「${tab === 'office' ? 'AI安全办公室' : tab}」主屏`);
        }} 
        toast={(m) => triggerToast(m, 'info')}
        isCollapsed={isSidebarCollapsed}
      />
 
      {/* 3. Main Dashboard flow layout wrapper */}
      <div id="main-content-flow" className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header bar */}
        <Header 
          onSearch={(query) => setSearchQuery(query)}
          toast={(m) => triggerToast(m, 'info')}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
 
        {/* Dashboard Panels */}
        <main className="flex-1 px-6 lg:px-8 py-3.5 flex flex-col min-h-0 overflow-hidden w-full gap-3.5">
          
          {/* Top Title */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between select-none pb-2 border-b border-slate-100/80 shrink-0 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                安维斯正在值守
              </h2>
              <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                自动检测现场风险，也支持你随时指派临时任务。
              </p>
            </div>
            {/* Simple Enterprise Status */}
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                系统防线已启动
              </span>
            </div>
          </div>
 
          {/* Module 2: 安维斯智能双栏值守工作区 (左栏任务, 右栏对话) */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AiAssistantDashboard 
              riskEvents={filteredRiskEvents}
              onSelectEvent={handleSelectRiskRow}
              onOpenReport={handleOpenReport}
              onMatchPolicy={() => {
                const highEvent = riskEvents.find(e => e.id === "REV-20260602-01");
                if (highEvent) {
                  setSelectedEvent(highEvent);
                  triggerToast("已智能匹配《高处作业管理规范》关联制度条款", 'success');
                }
              }}
              toast={(m, type) => triggerToast(m, type || 'info')}
            />
          </div>
 
        </main>
      </div>

      {/* Floating AI chat window bottom-right */}
      <AiChatbotDrawer 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onOpenReport={handleOpenReport}
        onSelectEventById={(id) => {
          const match = riskEvents.find(e => e.id === id);
          if (match) setSelectedEvent(match);
        }}
        toast={(m) => triggerToast(m, 'info')}
      />

      {/* INTERACTIVE DETAIL DRAWER MODALS */}
      
      {/* 1. Safety Event adjudication detail panel Drawer */}
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onInterventionSuccess={handleInterventionSuccess}
          toast={(m) => triggerToast(m, 'success')}
        />
      )}

      {/* 2. Generate daily report modal */}
      {isReportOpen && (
        <DailyReportModal 
          onClose={() => setIsReportOpen(false)}
          toast={(m) => triggerToast(m, 'success')}
        />
      )}

    </div>
  );
}

