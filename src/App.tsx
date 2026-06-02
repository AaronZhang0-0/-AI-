/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_RISK_EVENTS, INITIAL_TIMELINE_ITEMS, INITIAL_TODO_TASKS } from './data';
import { RiskEvent, TodoTask, TimelineItem } from './types';

// Import our modular components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AiAssistantDashboard from './components/AiAssistantDashboard';
import StatusCategoryPanel from './components/StatusCategoryPanel';
import SafetyStatusBanner from './components/SafetyStatusBanner';
import ThreeUrgentMatters from './components/ThreeUrgentMatters';
import AiTaskFlow from './components/AiTaskFlow';
import TodoTaskList from './components/TodoTaskList';
import AiChatbotDrawer from './components/AiChatbotDrawer';
import EventDetailsModal from './components/EventDetailsModal';
import DailyReportModal from './components/DailyReportModal';
import TodoTaskModal from './components/TodoTaskModal';

import { Sparkles, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';

export default function App() {
  // State definitions
  const [currentTab, setCurrentTab] = useState('office');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real active list states
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>(INITIAL_RISK_EVENTS);
  const [todoTasks, setTodoTasks] = useState<TodoTask[]>(INITIAL_TODO_TASKS);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(INITIAL_TIMELINE_ITEMS);

  // Overlay states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<TodoTask | null>(null);
  
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

  const handleOpenDisposalCenter = () => {
    // Standard mock prompt
    triggerToast("即将进入「事件处置中心」...", 'info');
  };

  const handleFocusThreeMatters = () => {
    // Scroll and focus
    setShouldHighlightRiskId("REV-20260602-01");
  };

  const handleFocusPendingEvent = () => {
    const match = riskEvents.find(e => e.id === "REV-20260602-03");
    if (match) {
      setSelectedEvent(match);
      triggerToast("🤖 已为您快速打开配电区「危险区域闯入」人工确认核实中心！");
    }
  };

  const handleInterventionFromHome = (eventId: string) => {
    handleInterventionSuccess(eventId);
  };

  // AI Intervention path callback
  const handleInterventionSuccess = (eventId: string) => {
    // 1. Update event status to '干预中'
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

    // 2. Add action item into timeline
    const newId = `TL-${Date.now()}`;
    const newTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const newTimelineItem: TimelineItem = {
      id: newId,
      time: newTime,
      action: `[现场干预] 已向现场安全员发送核查待办，并针对「${riskEvents.find(e => e.id === eventId)?.event}」触发语音播报提醒`,
      status: "干预中",
      statusType: "active"
    };
    
    setTimelineItems(prev => [newTimelineItem, ...prev]);
    triggerToast("🤖 安小邦已触发安全纠违语音警示及短信推送！现场干预任务现已发送至当班安全代表。", 'success');
  };

  // Complete Todo Task Checklist callback
  const handleCompleteTodoTask = (taskId: string) => {
    // Remove or complete the task
    setTodoTasks(prev => prev.filter(t => t.id !== taskId));
    
    // Add custom notification timeline
    const newId = `TL-${Date.now()}`;
    const newTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const closedTaskName = todoTasks.find(t => t.id === taskId)?.title || "待办项";
    
    const auditTimelineItem: TimelineItem = {
      id: newId,
      time: newTime,
      action: `[现场闭环] 责任人落实「${closedTaskName}」核验销项`,
      status: "完成闭环",
      statusType: "success"
    };

    setTimelineItems(prev => [auditTimelineItem, ...prev]);
    triggerToast(`安全待办任务【${closedTaskName}】已圆满确认处理并通过归档！`, 'success');
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

  const filteredTodoTasks = todoTasks.filter(tsk => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tsk.title.toLowerCase().includes(query) ||
      tsk.id.toLowerCase().includes(query) ||
      tsk.operator.toLowerCase().includes(query) ||
      tsk.level.toLowerCase().includes(query)
    );
  });

  return (
    <div id="saas-container-root" className="min-h-screen bg-[#F4F7FC] flex font-sans text-slate-800 antialiased relative">
      
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
        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
          
          {/* Main Title Row of Workspace Office */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 select-none">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5 leading-normal">
                AI安全办公室
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 tracking-wide">
                当前看板由 AI 督导安小邦进行实时监控，前台自动联动现场纠违语音和告警流转。
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500">
              <span>今日值守安全员: 张安全</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                系统在线值班中
              </span>
            </div>
          </div>

          {/* Module 1: 今日安全态势条 */}
          <SafetyStatusBanner 
            toast={(m) => triggerToast(m, 'info')}
          />

          {/* Module 2: 安小邦智能工作区 */}
          <AiAssistantDashboard 
            onFocusThreeMatters={handleFocusThreeMatters}
            onFocusPendingEvent={handleFocusPendingEvent}
            onOpenReport={handleOpenReport}
            toast={(m) => triggerToast(m, 'info')}
          />

          {/* Module 3: AI工作席位 */}
          <StatusCategoryPanel 
            toast={(m) => triggerToast(m, 'info')}
          />

          {/* Module 4: 今日必须处理的3件事 */}
          <ThreeUrgentMatters 
            riskEvents={filteredRiskEvents}
            onSelectEvent={handleSelectRiskRow}
            onExecuteIntervention={handleInterventionFromHome}
            shouldHighlightRiskId={shouldHighlightRiskId}
            resetHighlight={() => setShouldHighlightRiskId(null)}
            toast={(m) => triggerToast(m, 'info')}
          />

          {/* Module 5: AI 任务流 & 待办任务 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <AiTaskFlow 
                timelineItems={timelineItems}
                toast={(m) => triggerToast(m, 'info')}
              />
            </div>
            
            <div className="lg:col-span-7">
              <TodoTaskList 
                todoTasks={filteredTodoTasks}
                onOpenTodoTask={(todo) => setSelectedTodo(todo)}
                toast={(m) => triggerToast(m, 'info')}
              />
            </div>
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

      {/* 3. Handle to-do task validation modal */}
      {selectedTodo && (
        <TodoTaskModal 
          task={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onComplete={handleCompleteTodoTask}
          toast={(m) => triggerToast(m, 'success')}
        />
      )}

    </div>
  );
}
