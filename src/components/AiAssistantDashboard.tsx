/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Bell, 
  FileText, 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Paperclip,
  CheckCircle,
  FileDown,
  PlusCircle,
  Clock,
  ExternalLink,
  ClipboardList
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
  actionType: 'view_high' | 'view_med' | 'remind' | 'custom_view' | 'special_patrol';
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
  
  // Dynamic list of Actionable Tasks to demonstrate "Dialogue model forms tasks!"
  const [actionableTasks, setActionableTasks] = useState<ActionableTask[]>([
    {
      id: "REV-20260602-01",
      title: "高处作业未系安全带",
      desc: "高风险 ｜ 二采区 ｜ 待核查",
      actionText: "查看",
      actionType: 'view_high'
    },
    {
      id: "REV-20260602-03",
      title: "危险区域闯入",
      desc: "中风险 ｜ 配电区 ｜ 待确认",
      actionText: "查看",
      actionType: 'view_med'
    },
    {
      id: "REV-20260602-overdue",
      title: "超期闭环",
      desc: "原发现 2 起 ｜ 待催办",
      actionText: "催办",
      actionType: 'remind'
    }
  ]);

  const [conversation, setConversation] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { 
      role: 'ai', 
      text: '你好！我是安维斯（Anvis）。今天已实时捕获异常风险线索 32 起。本侧任务看盘与右侧对话模型深度绑定。您在对话里发表的管控意图或输入的“创建/新建任务”指令，可在此直接自动生成为高风险决策件，实现一键下发指令，闭环派单。' 
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

  // Handle task actions (viewing map, clicking notify, launching special patrol etc.)
  const handleTaskAction = (task: ActionableTask) => {
    if (task.isCompleted) {
      toast("该管控任务已完成闭环派单", "success");
      return;
    }

    if (task.actionType === 'view_high') {
      if (evGoalHigh) {
        onSelectEvent(evGoalHigh);
      } else {
        toast("已成功在视频监控流中为您定位到二采区高风险警报", "info");
      }
    } else if (task.actionType === 'view_med') {
      if (evGoalMed) {
        onSelectEvent(evGoalMed);
      } else {
        toast("已调取中风险配电群组闭路电视流", "info");
      }
    } else if (task.actionType === 'remind') {
      toast("已通过喇叭与对讲机链路向2个超期责任人发送语音催促", "success");
      setActionableTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, isCompleted: true, actionText: "已催办", desc: "催办通知已利用微信/对讲派发完毕" } : t)
      );
    } else if (task.actionType === 'special_patrol') {
      toast("专项特控大排查工单已经启动，派送至对应维护班组", "success");
      setActionableTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, isCompleted: true, actionText: "已启动", desc: "排程工单生效 ｜ 正在推进中" } : t)
      );
    } else {
      toast(`安全指令决议「${task.title}」已下发签备，派送至厂区终端`, "success");
      setActionableTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, isCompleted: true, actionText: "已下发", desc: "自主指令生效 ｜ 正挂载监控" } : t)
      );
    }
  };

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

      // Detection: Dialogue model forms task! (Creates / Adds / Deploys tasks dynamically)
      const isCreateIntent = norm.includes('创建') || norm.includes('新建') || norm.includes('增加') || norm.includes('新设') || norm.includes('添加') || norm.includes('发布') || norm.includes('部署') || norm.includes('task');

      if (isCreateIntent) {
        let taskTitle = "";
        if (norm.includes('创建任务：') || norm.includes('创建任务:')) {
          taskTitle = cmdText.split(/创建任务：|创建任务:/)[1]?.trim();
        } else if (norm.includes('新建任务：') || norm.includes('新建任务:')) {
          taskTitle = cmdText.split(/新建任务：|新建任务:/)[1]?.trim();
        } else if (norm.includes('创建任务') || norm.includes('新建任务')) {
          taskTitle = cmdText.replace(/创建任务|新建任务/g, "").trim();
        } else if (norm.includes('专项') || norm.includes('巡查')) {
          taskTitle = "高处作业重防雷专项安全巡演";
        } else {
          taskTitle = cmdText.replace(/创建|新建|增加|添加|发布|部署/g, "").trim();
        }

        if (!taskTitle || taskTitle.length < 2) {
          taskTitle = "现场安全自主督查巡视";
        }
        if (taskTitle.length > 20) {
          taskTitle = taskTitle.substring(0, 18) + "...";
        }

        const newId = `task-custom-${Date.now()}`;
        const generatedTask: ActionableTask = {
          id: newId,
          title: taskTitle,
          desc: "AI提取 ｜ 对话指令转换 ｜ 待下发",
          actionText: "分发",
          actionType: 'custom_view',
          isAiGenerated: true
        };

        // Append task to our state list
        setActionableTasks(prev => {
          if (prev.some(t => t.title === taskTitle)) return prev;
          return [...prev, generatedTask];
        });

        reply = `【机器人意图提取成功】我已将您的管控决定智能转化为控制流程决策件，并动态插入到左侧【需要你处理】任务栏底册：『${taskTitle}』。请点击其卡片边的【分发】按钮即可使能指令下达！`;
        toast("已根据您的对话指令成功形成安全任务", "success");

        // Focus list scroll
        setTimeout(() => {
          if (taskTrayRef.current) {
            taskTrayRef.current.scrollTo({ top: taskTrayRef.current.scrollHeight, behavior: 'smooth' });
          }
        }, 300);

      } else if (norm.includes('高风险') || norm.includes('风险') || norm.includes('高危') || norm.includes('隐患')) {
        reply = '已为您筛选过滤并强光闪烁定位最新的高危行为：「二采区高处作业未系安全带」（待核查）。详情已投递展台。';
        setHighlightHighRisk(true);
        setTimeout(() => setHighlightHighRisk(false), 5000); 
      } else if (norm.includes('日报') || norm.includes('报告') || norm.includes('生成')) {
        reply = '正在为您搜集今日32大厂区实时安全参数，多端感知一键智能出报... 安全合规日报已经为您配置装载，我同步在左侧任务区新增了『安全巡查合规日报签署核对』控制项，请点击查看。';
        
        // Form a verification task
        const reportTask: ActionableTask = {
          id: "task-report-verification",
          title: "安全巡查合规日报签署",
          desc: "日报草稿输出完毕 ｜ 待确认签署并发布",
          actionText: "核准",
          actionType: 'custom_view',
          isAiGenerated: true
        };
        setActionableTasks(prev => {
          if (prev.some(t => t.id === "task-report-verification")) return prev;
          return [...prev, reportTask];
        });

        onOpenReport();
      } else if (norm.includes('催办') || norm.includes('催督') || norm.includes('超期') || norm.includes('待处理')) {
        reply = '已激活闭环催办机制：通过SMS和扩音播报系统自动向相关的 2 起未按期修正工单班组主管下发合规警戒警告。';
        toast("已向2个超期事件责任人发送提醒", "success");
        // Update item
        setActionableTasks(prev => 
          prev.map(t => t.id === "REV-20260602-overdue" ? { ...t, isCompleted: true, actionText: "已催办", desc: "今日超期整改 ｜ 催办提醒已送达完毕" } : t)
        );
      } else if (norm.includes('制度') || norm.includes('条款') || norm.includes('匹配')) {
        reply = '正在检索安全制度数据库... 已提取到适用法律条款《特种作业安全规程第25条》，严禁高空攀缘在未绑挂红线绳索状态下操作。我已在左侧插入了『GB30871 规范合规核档』。';
        
        const ruleTask: ActionableTask = {
          id: "task-rule-binding",
          title: "GB30871 规范合规核档",
          desc: "匹配规则法条 ｜ 待录入电子档",
          actionText: "核对",
          actionType: 'custom_view',
          isAiGenerated: true
        };
        setActionableTasks(prev => {
          if (prev.some(t => t.id === "task-rule-binding")) return prev;
          return [...prev, ruleTask];
        });

        if (onMatchPolicy) {
          onMatchPolicy();
        }
      } else if (norm.includes('待确认') || norm.includes('配电区') || norm.includes('中风险')) {
        reply = '已将中风险点「配电区危险区域闯入」详情及热图在左侧标识，在【需要你处理】中为您锁定，建议点击查看大图核查。';
        setHighlightPending(true);
        setTimeout(() => setHighlightPending(false), 5000);
      } else {
        reply = '收到您对安防管控的询问。当前128路AI摄像头健康度100%。如果你希望形成一条安全合规督办，请交代诸如“创建任务：核查二采区防跌生命网”以在左侧一键派单。';
      }

      setConversation(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAnswering(false);
    }, 700);
  };

  // Preset recommendations mimicking Marvis prompt card guidelines
  const templates = [
    { 
      emoji: '🚧',
      title: '高处作业专项安全巡演', 
      subtitle: '新建对二采区起吊、系安全挂扣大排排查的临时决策卡',
      text: '创建任务：二采区特种作业安全带隐患专项治理'
    },
    { 
      emoji: '📄',
      title: '生成合规出厂安全日报', 
      subtitle: '检索今日32起行为偏差对齐国标，一键形成任务签署核验',
      text: '生成今日安全日报并匹配GB30871条款'
    },
    { 
      emoji: '⚙️',
      title: '启动一级高压变配电核查', 
      subtitle: '对刚才警报过的中风险变配电重地，在任务柜生成核备项',
      text: '创建任务：配电站红外对射限入专项校合'
    },
    { 
      emoji: '⏰',
      title: '一键语音催督超期闭环', 
      subtitle: '触发中控播音并向对应的工单班长下发微信闭环提醒',
      text: '对不安全事件超期闭环案派发一键催督通告'
    }
  ];

  // Specific risk event objects
  const evGoalHigh = riskEvents.find(e => e.id === "REV-20260602-01");
  const evGoalMed = riskEvents.find(e => e.id === "REV-20260602-03");

  return (
    <section className="w-full h-full flex flex-col min-h-0 font-sans select-none text-slate-800">
      
      {/* 
        Marvis Premium Symmetrical Layout:
        Split into TWO EQUALLY SIZED blocks side-by-side using `grid-cols-1 lg:grid-cols-2`.
        Creates a magnificent, beautifully aligned terminal deck.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full flex-1 min-h-0">
        
        {/* =======================================================
            左侧：安维斯决策大盘 / 任务运行控制台 (Symmetrical Left Box)
            ======================================================= */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.01)] h-full flex flex-col justify-between min-h-0 text-left">
          
          <div className="flex flex-col h-full overflow-hidden gap-3.5 flex-1 min-h-0">
            
            {/* Split A: Header with Unified Metric Indicator Row */}
            <div className="border-b border-slate-100/70 pb-3 shrink-0">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs font-bold text-slate-850 tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  安维斯任务柜
                </h3>
                <span className="text-[10px] bg-slate-50 text-slate-450 font-bold px-2 py-0.5 rounded-md font-mono select-none">
                  任务感知中心
                </span>
              </div>
              
              {/* Perfectly uniform metrics row */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/60 rounded-xl p-2.5 border border-slate-100/50">
                <div className="text-center py-0.5">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">今日线索</span>
                  <span className="text-sm font-extrabold text-slate-850">32</span>
                </div>
                <div className="text-center py-0.5 border-x border-slate-200">
                  <span className="text-[10px] font-semibold text-rose-500 block mb-0.5">高风险</span>
                  <span className="text-sm font-extrabold text-rose-600">5</span>
                </div>
                <div className="text-center py-0.5">
                  <span className="text-[10px] font-semibold text-amber-500 block mb-0.5">待确认</span>
                  <span className="text-sm font-extrabold text-amber-600">8</span>
                </div>
              </div>
            </div>

            {/* Split B: Automatic Sentinel Status Dashboard */}
            <div className="space-y-2 pt-0.5 shrink-0">
              <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                自动值守运行监测
              </h4>
              <div className="bg-slate-50/40 border border-slate-100/80 rounded-xl px-3 py-1 bg-white/50 divide-y divide-slate-100/60">
                
                {/* Sentinel 1 */}
                <div className="py-1.5 flex items-center justify-between gap-3 h-10">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-xs font-bold text-slate-750 block">视频风险检测</span>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      持续轮巡PPE、越界、高空等违章
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Sentinel 2 */}
                <div className="py-1.5 flex items-center justify-between gap-3 h-10">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-xs font-bold text-slate-755 block">高风险提醒</span>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      高危行为实时联动语音外呼
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Sentinel 3 */}
                <div className="py-1.5 flex items-center justify-between gap-3 h-10">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-xs font-bold text-slate-755 block">闭环催办</span>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      超期异常自动派发二级预警
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

                {/* Sentinel 4 */}
                <div className="py-1.5 flex items-center justify-between gap-3 h-10">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-xs font-bold text-slate-755 block">安全日报生成</span>
                    <span className="text-[9.5px] text-slate-400 block truncate">
                      每晚18点合规匹配生成日报
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 select-none">
                    运行中
                  </span>
                </div>

              </div>
            </div>

            {/* Split C: Needs Attention & Dynamically Created Decisions Awaiting Launch */}
            <div className="flex-1 flex flex-col min-h-0 pt-1 space-y-2">
              <div className="flex items-center justify-between pl-1 shrink-0">
                <span className="text-[10.5px] font-bold text-slate-450 uppercase tracking-widest block">
                  需要你处理 (对话生成)
                </span>
                <span className="text-[9.5px] text-slate-400 font-semibold font-mono">
                  共计 {actionableTasks.length} 项工单
                </span>
              </div>

              {/* Actionable scrollable tray - demonstrates the dynamic AI list changes seamlessly */}
              <div 
                ref={taskTrayRef}
                className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar divide-y divide-slate-100/55 scroll-smooth min-h-0"
              >
                {actionableTasks.map((task) => {
                  let isHighlighted = false;
                  if (task.id === "REV-20260602-01" && highlightHighRisk) isHighlighted = true;
                  if (task.id === "REV-20260602-03" && highlightPending) isHighlighted = true;

                  const borderClass = isHighlighted 
                    ? 'border-blue-400 bg-blue-50/40 ring-1 ring-blue-200 shadow-sm scale-[1.008]' 
                    : task.isAiGenerated 
                      ? 'border-emerald-100 bg-emerald-50/20'
                      : 'border-slate-100 bg-white hover:bg-slate-50/20';

                  return (
                    <div 
                      key={task.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-300 first:pt-3 ${borderClass}`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {task.isAiGenerated && (
                            <span className="text-[8.5px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded shrink-0 animate-pulse select-none">
                              AI
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block truncate">
                          {task.desc}
                        </span>
                      </div>

                      <button
                        onClick={() => handleTaskAction(task)}
                        className={`px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 active:scale-97 shrink-0 border cursor-pointer ${
                          task.isCompleted 
                            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                            : task.actionType === 'remind'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-250/30'
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

          {/* Symmetrical Left Footer info strip */}
          <div className="pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400 font-semibold shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              安防后台自动化挂载生效中
            </span>
            <span>更新时间：刚刚</span>
          </div>

        </div>

        {/* =======================================================
            右侧：安维斯 AI 对话服务大厅 (Symmetrical Right Box)
            ======================================================= */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.01)] h-full flex flex-col justify-between min-h-0 relative overflow-hidden text-left">
          
          {/* Ambient graphic elements suggesting elite workspace */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col h-full overflow-hidden gap-3.5 flex-1 min-h-0">
            
            {/* Split A: Profile Banner Block */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100/65 select-none shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                  <span className="text-lg animate-pulse" style={{ animationDuration: '6s' }}>🤖</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-850 tracking-tight font-sans">
                      安维斯 Anvis
                    </h4>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-extrabold font-mono">V2.4</span>
                  </div>
                  <span className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                    安全大脑配置托管中
                  </span>
                </div>
              </div>
              
              <span className="hidden sm:inline-block text-[9.5px] text-slate-400 font-bold font-mono tracking-wider bg-slate-50/60 px-2 py-0.5 rounded-md border border-slate-150/55 select-none">
                MARVIS WORKSPACE
              </span>
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
                      <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 border border-blue-105/50 flex items-center justify-center text-[10px] text-blue-600 shrink-0 font-extrabold select-none">
                        AV
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed font-sans shadow-sm ${
                      isAi 
                        ? 'bg-slate-50 border border-slate-150 text-slate-750 font-medium' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isAnswering && (
                <div className="flex justify-start items-center gap-2 px-1">
                  <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 border border-blue-100/50 flex items-center justify-center text-[10px] text-blue-600 shrink-0 font-extrabold animate-pulse">
                    AV
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-semibold select-none">
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-[9px] text-slate-400 font-bold">安维斯正在解析生成...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Split C: Dynamic Directive Command Board (Tencent Marvis Style Input) */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5 shrink-0">
              
              {/* Sliding Horizontal Mini templates - absolutely stunning, compact, and space-saving! */}
              <div id="quick-directive-chips" className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar pb-0.5 select-none text-[10px]">
                <span className="text-[10px] text-slate-400 font-extrabold shrink-0 flex items-center gap-0.5">
                  <span className="text-blue-500 animate-pulse">✦</span> 快捷提问:
                </span>
                {templates.map((card, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCommandSubmit(card.text)}
                    className="px-2.5 py-1 text-[9.5px] font-bold bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 rounded-full cursor-pointer transition-all active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    <span>{card.emoji}</span>
                    <span>{card.title.replace("专项安全巡演", "专项").replace("合规出厂安全", "")}</span>
                  </button>
                ))}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommandSubmit(query);
                }}
                className="bg-slate-50/60 hover:bg-slate-50 border border-slate-105/85 rounded-xl p-1 flex flex-col transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
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
                  placeholder="请输入管控指令（如：创建任务：二采区特种防护 / 催办超期 / 生成日报）"
                  className="w-full bg-transparent border-0 resize-none px-2.5 py-1 text-xs text-slate-755 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-semibold"
                />
                
                <div className="flex items-center justify-between px-2.5 pb-1 pt-1 select-none">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toast("已向视频服务组件提取128路生产前端异常事件", "info")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[9.5px] text-slate-500 font-bold cursor-pointer transition-all active:scale-97"
                    >
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      关联视频
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("GB30871-2022特种合规规章已载入并关联该哨所环境", "info")}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[9.5px] text-slate-500 font-bold cursor-pointer transition-all active:scale-97"
                    >
                      <FileDown className="w-3 h-3 text-slate-400" />
                      国家规范
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      query.trim() 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-95' 
                        : 'bg-slate-200/50 text-slate-350 cursor-not-allowed'
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
