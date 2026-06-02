/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { RiskEvent } from '../types';
import { MapPin, Clock, ShieldAlert, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ThreeUrgentMattersProps {
  riskEvents: RiskEvent[];
  onSelectEvent: (event: RiskEvent) => void;
  onExecuteIntervention: (eventId: string) => void;
  shouldHighlightRiskId: string | null;
  resetHighlight: () => void;
  toast: (msg: string) => void;
}

export default function ThreeUrgentMatters({
  riskEvents,
  onSelectEvent,
  onExecuteIntervention,
  shouldHighlightRiskId,
  resetHighlight,
  toast
}: ThreeUrgentMattersProps) {
  
  const targetCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldHighlightRiskId === "REV-20260602-01" && targetCardRef.current) {
      targetCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast("已快速聚焦至今日首要的高危险重点事件，查看AI应对干预策略！");
      resetHighlight();
    }
  }, [shouldHighlightRiskId]);

  // We filter specifically the first 3 events representing Card 1, 2, 3 as defined by the user
  const targetIds = ["REV-20260602-01", "REV-20260602-02", "REV-20260602-03"];
  const matters = targetIds.map(id => riskEvents.find(e => e.id === id)).filter(Boolean) as RiskEvent[];

  return (
    <div className="space-y-3.5 select-none text-left shrink-0">
      <div>
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pl-1 leading-none">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
          四、 今日必须处理的3件事
        </h3>
        <p className="text-[11px] text-slate-450 mt-1 pl-1 font-medium font-sans">
          安小邦已根据风险等级、持续时间、区域重要性和闭环状态筛选。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {matters.map((event, idx) => {
          const isHighRisk = event.level === "高";
          const isGoalHighRisk = event.id === "REV-20260602-01";
          
          let cardBg = "bg-white border-slate-205 hover:border-slate-350";
          let alertLabel = "bg-amber-100 text-amber-700 border-amber-200/50";
          
          if (isHighRisk) {
            cardBg = "bg-rose-50/25 border-rose-200/80 hover:border-rose-450 ring-1 ring-rose-500/5 hover:bg-rose-50/40";
            alertLabel = "bg-rose-100 text-rose-700 border-rose-200/60";
          }

          // Let's map custom sub-fields to match the instructions perfectly
          let hitStrategy = "";
          let aiTips = "";
          let displayStatus = "";

          if (event.id === "REV-20260602-01") {
            hitStrategy = "高处作业安全带未规范系挂高风险干预策略";
            aiTips = "立即核查现场状态，确认是否进入三违认定流程。";
            // Check status dynamically
            displayStatus = event.status === "待处理" ? "待现场核查" : event.status;
          } else if (event.id === "REV-20260602-02") {
            hitStrategy = "PPE不规范中风险提醒策略";
            aiTips = "纳入夜班PPE专项巡查，关注重复发生人员。";
            displayStatus = event.status === "待处理" ? "已现场提醒" : event.status;
          } else {
            hitStrategy = "危险区域闯入升级提醒策略";
            aiTips = "核查电子围栏边界与人员准入记录。";
            displayStatus = event.status === "待处理" ? "待人工确认" : event.status;
          }

          return (
            <div
              key={event.id}
              ref={isGoalHighRisk ? targetCardRef : null}
              className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 flex flex-col justify-between ${cardBg}`}
            >
              <div className="space-y-4">
                {/* ID & Status Line */}
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-slate-400 font-bold">{event.id}</span>
                  <span className="font-mono text-slate-450 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                  </span>
                </div>

                {/* Main Title & Level Indicator */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${alertLabel}`}>
                      {event.level}风险
                    </span>
                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {event.area}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800 leading-normal">
                    {event.event}
                  </h4>
                </div>

                {/* Details list item lines */}
                <div className="space-y-2.5 text-[11px] border-t border-slate-100 pt-3.5">
                  <div>
                    <span className="text-slate-400 block tracking-wide">当前状态</span>
                    <span className={`font-semibold inline-flex items-center gap-1 ${
                      displayStatus === "待现场核查" 
                        ? "text-rose-600 font-bold" 
                        : displayStatus === "待人工确认" 
                          ? "text-amber-600 font-bold" 
                          : "text-blue-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        displayStatus === "待现场核查" ? "bg-rose-500 animate-pulse" : displayStatus === "待人工确认" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      {displayStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block tracking-wide">命中策略</span>
                    <p className="text-slate-700 font-medium font-sans">
                      {hitStrategy}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 block tracking-wide">AI 建议</span>
                    <p className="text-slate-700 leading-relaxed font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-150/60 font-semibold text-[10.5px]">
                      {aiTips}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card CTA Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <button
                  onClick={() => onSelectEvent(event)}
                  className="flex-1 py-2 border border-slate-205 hover:bg-slate-100 text-slate-600 hover:text-slate-850 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center"
                >
                  查看详情
                </button>
                
                {isGoalHighRisk && event.status === "待处理" && (
                  <button
                    onClick={() => onExecuteIntervention(event.id)}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-extrabold shadow hover:shadow-rose-400/20 transition-all cursor-pointer text-center"
                  >
                    执行干预
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
