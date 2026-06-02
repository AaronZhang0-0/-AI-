/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { RiskEvent } from '../types';
import { ChevronRight, BellRing } from 'lucide-react';

interface ThreeUrgentMattersProps {
  riskEvents: RiskEvent[];
  onSelectEvent: (event: RiskEvent) => void;
  shouldHighlightRiskId: string | null;
  resetHighlight: () => void;
  toast: (msg: string, type?: 'info' | 'success') => void;
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
      toast("已快速聚焦至今日首要的高危险线索案例。", "info");
      resetHighlight();
    }
  }, [shouldHighlightRiskId]);

  // Retrieve Card 1 and Card 2 elements from actual data list
  const card1 = riskEvents.find(e => e.id === "REV-20260602-01");
  const card2 = riskEvents.find(e => e.id === "REV-20260602-03");

  return (
    <div className="space-y-4 select-none text-left max-w-4xl mx-auto py-4">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight font-sans pl-1">
          需要你处理
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: 高处作业未系安全带 */}
        {card1 && (
          <div
            ref={targetCardRef}
            className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-40"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 tracking-wide font-sans mb-2">
                高处作业未系安全带
              </h4>
              <p className="text-xs text-slate-450 font-medium font-sans">
                高风险 ｜ 二采区 ｜ {card1.status === "待处理" ? "待核查" : card1.status}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => onSelectEvent(card1)}
                className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 border border-slate-100/50 active:scale-97 text-[11px]"
              >
                查看
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Card 2: 危险区域闯入 */}
        {card2 && (
          <div
            className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-40"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 tracking-wide font-sans mb-2">
                危险区域闯入
              </h4>
              <p className="text-xs text-slate-450 font-medium font-sans">
                中风险 ｜ 配电区 ｜ {card2.status === "待处理" ? "待确认" : card2.status}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => onSelectEvent(card2)}
                className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 border border-slate-100/50 active:scale-97 text-[11px]"
              >
                查看
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Card 3: 超期闭环 */}
        <div
          className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-40"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-wide font-sans mb-2">
              超期闭环
            </h4>
            <p className="text-xs text-slate-450 font-medium font-sans">
              2起 ｜ 待催办
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                toast("已向2个超期事件责任人发送提醒", "success");
              }}
              className="px-4 py-1.5 bg-rose-50/60 hover:bg-rose-100/80 text-rose-600 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 border border-rose-100/20 active:scale-97 text-[11px]"
            >
              <BellRing className="w-3 h-3 text-rose-500" />
              催办
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

