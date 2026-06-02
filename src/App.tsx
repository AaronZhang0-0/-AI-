import React, { useState } from 'react';
import { INITIAL_RISK_EVENTS } from './data';
import { RiskEvent } from './types';

// Import our modular components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AiAssistantDashboard from './components/AiAssistantDashboard';
import ThreeUrgentMatters from './components/ThreeUrgentMatters';
import AiTaskFlow from './components/AiTaskFlow';
import AiChatbotDrawer from './components/AiChatbotDrawer';
import EventDetailsModal from './components/EventDetailsModal';
import DailyReportModal from './components/DailyReportModal';

import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // State definitions
  const [currentTab, setCurrentTab] = useState('office');
  const [searchQuery, setSearchQuery] = useState('');
  
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

    triggerToast("🤖 安小邦已触发安全纠违语音警示及短信推送！现场干预任务现已发送至当班安全代表。", 'success');
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
    <div id="saas-container-root" className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 antialiased relative">
      
      {/* 1. Global Notification Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4.5 py-3 rounded-full bg-slate-900 border border-slate-755 text-white flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none select-none text-xs">
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
      />

      {/* 3. Main Dashboard flow layout wrapper */}
      <div id="main-content-flow" className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <Header 
          onSearch={(query) => setSearchQuery(query)}
          toast={(m) => triggerToast(m, 'info')}
        />

        {/* Dashboard Panels */}
        <main className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full overflow-y-auto">
          
          {/* Top Title & Quick Minimalist stats */}
          <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 select-none border-b border-slate-100/80">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight font-sans">
                安小邦正在值守
              </h2>
              <p className="text-xs text-slate-400 font-medium font-sans mt-1">
                今日发现 32 起风险线索
              </p>
            </div>
            
            {/* Minimalist Stats */}
            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-slate-400">高风险</span>
                <span className="font-extrabold text-slate-800 text-sm">5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-slate-400">待确认</span>
                <span className="font-extrabold text-slate-800 text-sm">8</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-slate-400">已干预</span>
                <span className="font-extrabold text-slate-800 text-sm">12</span>
              </div>
            </div>
          </div>

          {/* Module 2: 安小邦智能工作区 */}
          <AiAssistantDashboard 
            onFocusThreeMatters={handleFocusThreeMatters}
            onFocusPendingEvent={handleFocusPendingEvent}
            onOpenReport={handleOpenReport}
            onOpenChat={() => setIsChatOpen(true)}
          />

          {/* Module 3: 今日必须处理的3件事 */}
          <ThreeUrgentMatters 
            riskEvents={filteredRiskEvents}
            onSelectEvent={handleSelectRiskRow}
            shouldHighlightRiskId={shouldHighlightRiskId}
            resetHighlight={() => setShouldHighlightRiskId(null)}
            toast={(m) => triggerToast(m, 'info')}
          />

          {/* Module 4: AI 任务流 / 动态 */}
          <AiTaskFlow />

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

