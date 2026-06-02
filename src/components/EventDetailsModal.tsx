/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { RiskEvent } from '../types';
import { 
  X, 
  ShieldAlert, 
  BookOpen, 
  Sliders, 
  Cpu, 
  UserCheck, 
  Play, 
  Volume2, 
  MessageSquare, 
  FileSpreadsheet, 
  CheckCircle2, 
  MapPin, 
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface EventDetailsModalProps {
  event: RiskEvent;
  onClose: () => void;
  onInterventionSuccess: (eventId: string) => void;
  toast: (msg: string) => void;
}

export default function EventDetailsModal({ 
  event, 
  onClose, 
  onInterventionSuccess, 
  toast 
}: EventDetailsModalProps) {
  const [interventionState, setInterventionState] = useState<'idle' | 'executing' | 'success'>('idle');
  
  // Hardcoded default checkboxes for human confirmation
  const [confirmViolation, setConfirmViolation] = useState(false);
  const [confirmClosure, setConfirmClosure] = useState(false);

  const handleExecuteIntervention = () => {
    if (interventionState !== 'idle') return;
    
    setInterventionState('executing');
    toast("🤖 安小邦通报现场：启动不安全行为语音播发并派发核查工单...");

    setTimeout(() => {
      setInterventionState('success');
      // AI cannot substitute human checks: confirmViolation remains manual (unchecked)
      onInterventionSuccess(event.id);
      toast("📢 语音播报及告警通知推送已全部下发，请现场人员配合复核并反馈状态！");
    }, 1500);
  };

  const levelColor = event.level === "高" 
    ? "text-rose-600 bg-rose-50 border-rose-100" 
    : event.level === "中" 
      ? "text-amber-650 bg-amber-50 border-amber-150" 
      : "text-emerald-600 bg-emerald-50 border-emerald-100";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Main Drawer container */}
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono tracking-wider">{event.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border leading-none bg-rose-500/10 text-rose-400 border-rose-500/30`}>
                  AI智能体研判中
                </span>
              </div>
              <h3 className="text-sm font-bold mt-0.5 font-sans">
                安全事件深度核验与闭环策略中心
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5.5 select-none scrollbar">
          
          {/* Main info tile */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-slate-400">风险事件</span>
              <div className="text-xs font-bold text-slate-800 mt-1">{event.event}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">风险等级</span>
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${levelColor}`}>
                  {event.level}风险
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">所属区域</span>
              <div className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.area}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">发现时间</span>
              <div className="text-xs font-mono font-bold text-slate-600 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-450" />
                {event.time}
              </div>
            </div>
          </div>

          {/* AI Observation Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Cpu className="w-4.5 h-4.5 text-blue-600" />
              <span>一、AI 捕获与识别实录</span>
            </div>
            <div className="p-4 bg-blue-50/40 border border-blue-105 rounded-xl text-[12.5px] leading-relaxed text-slate-700 relative">
              <p className="font-sans">{event.details.conclusion}</p>
              
              {/* Graphic Wireframe Mock placeholder representing industrial video capture */}
              <div className="mt-3.5 h-32 rounded-lg bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]" />
                
                {/* Green tracking box on person */}
                <div className="absolute border border-rose-500 w-24 h-20 flex flex-col justify-between p-1">
                  <span className="text-[8px] bg-rose-500 text-white font-mono scale-[0.8] origin-top-left font-bold px-0.5">
                    ZH-091 : NO_PPE_SAFETY_BELT
                  </span>
                  <div className="w-2 h-2 border-b-2 border-r-2 border-rose-500 self-end" />
                </div>

                <div className="text-white/40 text-[10px] font-mono tracking-widest flex items-center gap-1.5 z-10 select-none">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  LIVE CAMERA CAPTURE [09:12]
                </div>
                <div className="absolute bottom-2 right-2 text-[8px] text-slate-500 font-mono tracking-wider">
                  FPS: 30 | RES: 1080P | DEV_KEY: C-027
                </div>
              </div>
            </div>
          </div>

          {/* Regular Matching Standard */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
              <span>二、匹配企业制度规章</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-slate-600 space-y-2">
              <p className="italic leading-relaxed font-sans mt-0.5">
                {event.details.regulation}
              </p>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-150">
                <span>绑定规制号: HSSE-P-高处作业通用细则-3.1</span>
                <span className="text-blue-500 hover:underline cursor-pointer flex items-center gap-0.5">
                  查看源制度白皮书
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Hit Intervention Policy Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sliders className="w-4.5 h-4.5 text-amber-600" />
              <span>三、自动命中干预策略卡</span>
            </div>
            <div className="p-4 bg-amber-50/30 border border-amber-205 rounded-xl space-y-3">
              <div className="text-xs font-bold text-amber-800">
                策略卡：{event.details.strategy}
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-bold text-[11px] text-slate-400">AI 推荐执行动作：</p>
                <div className="space-y-2 pl-1">
                  {event.details.aiActions.map((action, index) => (
                    <div key={index} className="flex gap-2.5 items-start leading-relaxed text-[11px]">
                      <span className="w-4.5 h-4.5 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {index + 1}
                      </span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Manual Gate Check */}
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>四、人工审核确认节点</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox"
                  checked={confirmViolation}
                  onChange={(e) => setConfirmViolation(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-left leading-normal">
                  <div className="text-xs font-bold text-slate-700">三违行为客观认定确认</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">确认此AI抓包行为属实并记入其电子安全档案档案卷</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox"
                  checked={confirmClosure}
                  onChange={(e) => setConfirmClosure(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-left leading-normal">
                  <div className="text-xs font-bold text-slate-700">销号前复查核验确认</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">确认现场提交的整改照片合规真实后方可关闭消除工单</p>
                </div>
              </label>

            </div>
          </div>

          {/* Live Action response feedback if clicked */}
          {interventionState !== 'idle' && (
            <div className="p-4.5 rounded-2xl bg-slate-900 text-white space-y-3 border border-blue-500/30 animate-in fade-in zoom-in-95 duration-305 text-left">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>不安全行为人工智能策略执行中 (实时回执)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {/* Step 1: Broadcasting Voice */}
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>语音融合音柱定向播报警告语音</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold">● 已播发 (09:12:45)</span>
                </div>

                {/* Step 2: SMS dispatch */}
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400 animate-pulse" />
                    <span>推送待核告警工单至安全监管代表张安全终端手机</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold">● 已送达 (09:12:48)</span>
                </div>

                {/* Step 3: Work Order */}
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                    <span>创建核实待办任务并派发至带班安全监护人员</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold">● 待办中</span>
                </div>
              </div>

              {interventionState === 'success' && (
                <div className="pt-2 bg-gradient-to-r from-emerald-500/10 to-transparent p-2 rounded border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>已打通识别、研判、自动干预的全部业务逻辑，形成多端闭环追踪！</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Drawer Action Bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4.5 py-2 border border-slate-250 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:text-slate-800 transition-colors cursor-pointer"
          >
            关闭详情
          </button>

          {event.status === '已闭环' ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              该安全事件已闭环处理
            </div>
          ) : (
            <button
              onClick={handleExecuteIntervention}
              disabled={interventionState !== 'idle'}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                interventionState === 'idle'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {interventionState === 'idle' && (
                <>
                  <Play className="w-4 h-4" />
                  一键执行干预策略
                </>
              )}
              {interventionState === 'executing' && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin mr-1.5" />
                  小邦正在分发指令...
                </>
              )}
              {interventionState === 'success' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-450" />
                  干预工作流已启动
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
