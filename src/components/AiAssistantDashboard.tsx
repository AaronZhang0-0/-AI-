import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Paperclip,
  BookOpen,
  CheckCircle,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';
import { RiskEvent } from '../types';

interface AiAssistantProps {
  riskEvents: RiskEvent[];
  onSelectEvent: (event: RiskEvent) => void;
  onOpenReport: () => void;
  onMatchPolicy?: () => void;
  toast: (msg: string, type?: 'info' | 'success') => void;
}

interface ActionableTask {
  id: string;
  title: string;
  desc: string;
  actionText: string;
  actionType: 'view_high' | 'view_med' | 'remind' | 'custom_view';
  isAiGenerated?: boolean;
  isCompleted?: boolean;
}

export default function AiAssistantDashboard({ 
  riskEvents,
  onSelectEvent, 
  onOpenReport,
  onMatchPolicy,
  toast
}: AiAssistantProps) {
  const [query, setQuery] = useState('');
  const [highlightHighRisk, setHighlightHighRisk] = useState(false);
  const [highlightPending, setHighlightPending] = useState(false);
  
  // Tasks state
  const [actionableTasks, setActionableTasks] = useState<ActionableTask[]>([
    {
      id: "REV-20260602-01",
      title: "高处作业未系安全带",
      desc: "高风险｜二采区｜待核查",
      actionText: "查看",
      actionType: 'view_high'
    },
    {
      id: "REV-20260602-03",
      title: "危险区域闯入",
      desc: "中风险｜配电区｜待确认",
      actionText: "查看",
      actionType: 'view_med'
    },
    {
      id: "REV-20260602-overdue",
      title: "超期闭环",
      desc: "2起｜待催办",
      actionText: "催办",
      actionType: 'remind'
    }
  ]);

  const [conversation, setConversation] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { 
      role: 'ai', 
      text: '你好，我是安维斯 Anvis。我正在自动检测现场风险。你可以让我查风险、催闭环、生成报告或创建任务。' 
    }
  ]);
  const [isAnswering, setIsAnswering] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const taskTrayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isAnswering]);

  // Handle actions on left tasks list
  const handleTaskAction = (task: ActionableTask) => {
    if (task.isCompleted) {
      const finishedMsg = task.actionText === '已催办' ? '催办提醒已发送' : '该任务已分发完毕';
      toast(finishedMsg, 'success');
      return;
    }

    if (task.actionType === 'view_high') {
      const match = riskEvents.find(e => e.id === "REV-20260602-01");
      if (match) {
        onSelectEvent(match);
      } else {
        toast("已打开高处作业事件核查详情", "info");
      }
    } else if (task.actionType === 'view_med') {
      const match = riskEvents.find(e => e.id === "REV-20260602-03");
      if (match) {
        onSelectEvent(match);
      } else {
        toast("已打开危险区域闯入详情", "info");
      }
    } else if (task.actionType === 'remind') {
      toast("已向2个超期事件责任人发送提醒", "success");
      setActionableTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, isCompleted: true, actionText: "已催办", desc: "2起｜已催办" } : t)
      );
    } else {
      // General custom task dispatching
      toast(`任务已下发分发`, "success");
      setActionableTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, isCompleted: true, actionText: "已分发", desc: `由安维斯根据对话创建｜已分发` } : t)
      );
    }
  };

  // Submit standard/custom commands
  const handleCommandSubmit = (cmdText: string) => {
    if (!cmdText.trim()) return;
    
    // Add user message
    setConversation(prev => [...prev, { role: 'user', text: cmdText }]);
    setQuery('');
    setIsAnswering(true);

    setTimeout(() => {
      let reply = '';
      const norm = cmdText.toLowerCase();

      if (norm.includes('查今日高风险') || norm.includes('查高风险')) {
        reply = "已找到今日重点风险。建议优先核查“高处作业未系安全带”，我已在左侧为你标记。";
        setHighlightHighRisk(true);
        setTimeout(() => setHighlightHighRisk(false), 5000);

        // Auto open details callback to give stunning visual alignment
        const match = riskEvents.find(e => e.id === "REV-20260602-01");
        if (match) {
          onSelectEvent(match);
        }
      } 
      else if (norm.includes('生成今日安全日报') || norm.includes('生成日报')) {
        reply = "正在生成今日安全日报。我会整理风险线索、处置进展和待确认事项。";
        
        // Open report window directly
        onOpenReport();
      } 
      else if (norm.includes('催办超期闭环') || norm.includes('催办闭环')) {
        reply = "已向2个超期事件责任人发送提醒。";
        // Mark left status
        setActionableTasks(prev => 
          prev.map(t => t.id === "REV-20260602-overdue" ? { ...t, isCompleted: true, actionText: "已催办", desc: "2起｜已催办" } : t)
        );
      } 
      else if (norm.includes('创建二采区高处作业专项巡查') || norm.includes('创建巡查')) {
        reply = "已创建“二采区高处作业专项巡查”任务，并加入左侧待处理列表。";
        
        const newTask: ActionableTask = {
          id: `task-custom-patrol-${Date.now()}`,
          title: "二采区高处作业专项巡查",
          desc: "由安维斯根据对话创建｜待分发",
          actionText: "分发",
          actionType: 'custom_view',
          isAiGenerated: true
        };

        setActionableTasks(prev => {
          if (prev.some(t => t.title === newTask.title)) return prev;
          return [...prev, newTask];
        });

        // Scroll Left list to end
        setTimeout(() => {
          if (taskTrayRef.current) {
            taskTrayRef.current.scrollTo({ top: taskTrayRef.current.scrollHeight, behavior: 'smooth' });
          }
        }, 150);
      } 
      else if (norm.includes('匹配高处作业相关制度条款') || norm.includes('匹配制度')) {
        reply = "已匹配高处作业相关制度条款，正在打开事件详情。";
        if (onMatchPolicy) {
          onMatchPolicy();
        }
      } 
      // User creates custom tasks by entering "创建任务：xxxx"
      else if (norm.includes('创建任务') || norm.includes('创建任务：') || norm.includes('创建任务:')) {
        let taskTitle = "";
        if (cmdText.includes('：')) {
          taskTitle = cmdText.split('：')[1]?.trim();
        } else if (cmdText.includes(':')) {
          taskTitle = cmdText.split(':')[1]?.trim();
        } else {
          taskTitle = cmdText.replace(/创建任务/g, "").replace(/：|:/g, "").trim();
        }

        if (!taskTitle) {
          taskTitle = "临时安全检查巡视";
        }

        reply = "已根据你的指令创建任务，并加入左侧待处理列表。";

        const customTask: ActionableTask = {
          id: `task-custom-${Date.now()}`,
          title: taskTitle,
          desc: "由安维斯根据对话创建｜待分发",
          actionText: "分发",
          actionType: 'custom_view',
          isAiGenerated: true
        };

        setActionableTasks(prev => [...prev, customTask]);

        // Scroll Left list to end
        setTimeout(() => {
          if (taskTrayRef.current) {
            taskTrayRef.current.scrollTo({ top: taskTrayRef.current.scrollHeight, behavior: 'smooth' });
          }
        }, 150);
      } 
      else {
        // Fallback generic reply
        reply = "收到指令。如需创建临时任务，你可以直接输入如“创建任务：核查二采区高处拉绳”。";
      }

      setConversation(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAnswering(false);
    }, 700);
  };

  // 100% compliant compact directive button options defined in Section 8
  const quickCommands = [
    { label: '查高风险', command: '查今日高风险' },
    { label: '生成日报', command: '生成今日安全日报' },
    { label: '催办闭环', command: '催办超期闭环' },
    { label: '创建巡查', command: '创建二采区高处作业专项巡查' },
    { label: '匹配制度', command: '匹配高处作业相关制度条款' },
  ];

  return (
    <section className="w-full h-full flex flex-col min-h-0 text-slate-800">
      
      {/* Symmetrical Two Column Layout: matching height, bounding visual perfectly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full flex-1 min-h-0">
        
        {/* =======================================================
            左栏：安维斯任务柜 (Symmetrical Left Box)
            ======================================================= */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-md h-full flex flex-col justify-between min-h-0 text-left">
          
          <div className="flex flex-col h-full overflow-hidden gap-4.5 flex-1 min-h-0">
            
            {/* Split A: Left Header */}
            <div className="border-b border-slate-100/70 pb-3 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  安维斯任务
                </h3>
              </div>
              
              {/* Top Overview: 3 equal width columns, centered numbers */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/60 rounded-xl p-3 border border-slate-100/70">
                <div className="text-center py-0.5">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">今日线索</span>
                  <span className="text-base font-extrabold text-slate-800">32</span>
                </div>
                <div className="text-center py-0.5 border-x border-slate-200">
                  <span className="text-[10px] font-bold text-rose-500 block mb-0.5">高风险</span>
                  <span className="text-base font-extrabold text-rose-600">5</span>
                </div>
                <div className="text-center py-0.5">
                  <span className="text-[10px] font-bold text-amber-500 block mb-0.5">待确认</span>
                  <span className="text-base font-extrabold text-amber-600">8</span>
                </div>
              </div>
            </div>

            {/* Split B: Automatic Sentinel Status Dashboard */}
            <div className="space-y-2 shrink-0">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1">
                自动值守
              </h4>
              <div className="bg-slate-50/45 border border-slate-100/60 rounded-xl px-4 py-1 divide-y divide-slate-100/60">
                
                {/* Task 1 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[11.5px] font-bold text-slate-700 block">视频风险检测</span>
                    <span className="text-[9.5px] text-slate-400 block truncate font-medium">
                      识别PPE、越界、高处作业等风险线索
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Task 2 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[11.5px] font-bold text-slate-700 block">高风险提醒</span>
                    <span className="text-[9.5px] text-slate-400 block truncate font-medium">
                      发现高风险事件后通知责任人
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Task 3 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[11.5px] font-bold text-slate-700 block">闭环催办</span>
                    <span className="text-[9.5px] text-slate-400 block truncate font-medium">
                      超期未反馈时自动提醒
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Task 4 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[11.5px] font-bold text-slate-700 block">安全日报生成</span>
                    <span className="text-[9.5px] text-slate-400 block truncate font-medium">
                      每天18:00生成日报草稿
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full shrink-0 select-none">
                    18:00执行
                  </span>
                </div>

              </div>
            </div>

            {/* Split C: Needs Attention / Pending actions */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <div className="flex items-center justify-between pl-1 shrink-0">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  需要你处理
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">
                  共 {actionableTasks.length} 项
                </span>
              </div>

              {/* Actionable scrollable tray */}
              <div 
                ref={taskTrayRef}
                className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar scroll-smooth min-h-0"
              >
                {actionableTasks.map((task) => {
                  let isHighlighted = false;
                  if (task.id === "REV-20260602-01" && highlightHighRisk) isHighlighted = true;
                  if (task.id === "REV-20260602-03" && highlightPending) isHighlighted = true;

                  const borderClass = isHighlighted 
                    ? 'border-blue-400 bg-blue-50/60 ring-2 ring-blue-50 shadow-xs scale-[1.01]' 
                    : task.isAiGenerated 
                      ? 'border-emerald-100 bg-emerald-50/30'
                      : 'border-slate-100/80 bg-slate-50/30 hover:bg-slate-50/90 hover:border-slate-200/60 hover:shadow-xs';

                  return (
                    <div 
                      key={task.id}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-300 ${borderClass}`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {task.isAiGenerated && (
                            <span className="inline-flex text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded shrink-0 select-none leading-none">
                              AI
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block truncate">
                          {task.desc}
                        </span>
                      </div>

                      <button
                        onClick={() => handleTaskAction(task)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 active:scale-95 shrink-0 border cursor-pointer ${
                          task.isCompleted 
                            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                            : task.actionType === 'remind'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                              : task.isAiGenerated
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                                : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                        }`}
                      >
                        {task.actionText}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Clean footer footer line */}
          <div className="pt-3 border-t border-slate-100/60 flex items-center justify-between text-[10px] text-slate-400 font-bold shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              自动任务运行中
            </span>
            <span>更新时间：刚刚</span>
          </div>

        </div>

        {/* =======================================================
            右栏：安维斯 AI 对话区 (Symmetrical Right Box)
            ======================================================= */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-md h-full flex flex-col justify-between min-h-0 relative overflow-hidden text-left">
          
          <div className="flex flex-col h-full overflow-hidden gap-4.5 flex-1 min-h-0">
            
            {/* Split A: Profile Banner Block */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100/70 select-none shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50/65 border border-slate-100 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                      安维斯 Anvis
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                    安全值守中
                  </span>
                </div>
              </div>
            </div>

            {/* Split B: Scrollable Conversation logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar relative min-h-0">
              {conversation.map((msg, index) => {
                const isAi = msg.role === 'ai';
                return (
                  <div 
                    key={index}
                    className={`flex ${isAi ? 'justify-start' : 'justify-end'} items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {isAi && (
                      <div className="w-7 h-7 rounded-lg bg-blue-50/40 border border-blue-100/40 flex items-center justify-center text-[10px] text-blue-600 shrink-0 font-extrabold select-none">
                        AV
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans ${
                      isAi 
                        ? 'bg-slate-50 border border-slate-100/60 text-slate-700 font-medium' 
                        : 'bg-blue-600 text-white font-medium shadow-xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isAnswering && (
                <div className="flex justify-start items-center gap-2 px-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50/40 border border-blue-100/40 flex items-center justify-center text-[10px] text-blue-600 shrink-0 font-extrabold animate-pulse">
                    AV
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold select-none">
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-[9px] text-slate-400">正在解析生成...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Split C: Quick Commands & User Inputs */}
            <div className="border-t border-slate-100/60 pt-3 flex flex-col gap-2.5 shrink-0">
              
              {/* Symmetrical mini templates chips row */}
              <div id="quick-directive-chips" className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar pb-0.5 select-none text-[10px]">
                {quickCommands.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCommandSubmit(chip.command)}
                    className="px-3 py-1 text-[10px] font-bold bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 rounded-full cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Message inputs form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommandSubmit(query);
                }}
                className="bg-slate-50/60 hover:bg-slate-50 border border-slate-200 rounded-xl p-1 flex flex-col transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
              >
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCommandSubmit(query);
                    }
                  }}
                  rows={2}
                  placeholder="让安维斯帮你查风险、催闭环、生成报告或创建任务……"
                  className="w-full bg-transparent border-0 resize-none px-2.5 py-1 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-bold"
                />
                
                <div className="flex items-center justify-between px-2 pb-1 pt-1 select-none">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toast("已关联当前事件视频片段", "info")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold cursor-pointer transition-all active:scale-95"
                    >
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      关联视频
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("已打开相关制度条款", "info")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold cursor-pointer transition-all active:scale-95"
                    >
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      制度库
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      query.trim() 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
