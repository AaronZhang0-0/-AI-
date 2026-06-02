/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { RiskEvent } from '../types';
import { ChevronRight } from 'lucide-react';

interface ThreeUrgentMattersProps {
  riskEvents: RiskEvent[];
  onSelectEvent: (event: RiskEvent) => void;
  shouldHighlightRiskId: string | null;
  resetHighlight: () => void;
  toast: (msg: string) => void;
}

export default function ThreeUrgentMatters({
  riskEvents,
  onSelectEvent,
  shouldHighlightRiskId,
  resetHighlight,
  toast
}: ThreeUrgentMattersProps) {
  
  const targetCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldHighlightRiskId === "REV-20260602-01" && targetCardRef.current) {
      targetCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast("已快速聚焦至今日首要的重点事件。");
      resetHighlight();
    }
  }, [shouldHighlightRiskId]);

  // We filter specifically the first 3 events representing Card 1, 2, 3 as defined by the user
  const targetIds = ["REV-20260602-01", "REV-20260602-02", "REV-20260602-03"];
  const matters = targetIds.map(id => riskEvents.find(e => e.id === id)).filter(Boolean) as RiskEvent[];

  return (
    <div className="space-y-4 select-none text-left max-w-4xl mx-auto py-4">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight font-sans pl-1">
          今天最需要处理的事
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matters.map((event) => {
          const isHighRisk = event.level === "高";
          const isGoalHighRisk = event.id === "REV-20260602-01";
          
          let cardStyle = "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md";
          if (isGoalHighRisk) {
            cardStyle = "bg-white border-slate-100 ring-2 ring-blue-500/10 hover:border-blue-500/25 hover:shadow-md";
          }

          // Format minimalist info row:
          // Card 1: 高风险｜二采区｜待核查 (or other statuses)
          // Card 2: 中风险｜运输通道｜已提醒
          // Card 3: 危险区域闯入 -> 中风险｜配电区｜待确认
          let displayStatus = "待确认";
          if (event.id === "REV-20260602-01") {
            displayStatus = event.status === "待处理" ? "待核查" : event.status;
          } else if (event.id === "REV-20260602-02") {
            displayStatus = "已提醒";
          } else if (event.id === "REV-20260602-03") {
            displayStatus = event.status === "待处理" ? "待确认" : event.status;
          }

          const infoLine = `${event.level}风险 ｜ ${event.area} ｜ ${displayStatus}`;

          return (
            <div
              key={event.id}
              ref={isGoalHighRisk ? targetCardRef : null}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-40 ${cardStyle}`}
            >
              <div>
                <h4 className="text-sm font-bold text-slate-800 tracking-wide font-sans mb-2">
                  {event.event}
                </h4>
                <p className="text-xs text-slate-400 font-medium font-sans">
                  {infoLine}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => onSelectEvent(event)}
                  className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100/90 text-slate-600 hover:text-slate-800 rounded-full text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 border border-slate-100/60 active:scale-97"
                >
                  查看
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

