/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { TimelineItem, RiskEvent } from '../types';
import { MapPin, Clock, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

interface TaskTimelineAndRisksProps {
  timelineItems: TimelineItem[];
  riskEvents: RiskEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: RiskEvent) => void;
  shouldHighlightRiskId: string | null;
  resetHighlight: () => void;
  toast: (msg: string) => void;
}

export default function TaskTimelineAndRisks({ 
  timelineItems, 
  riskEvents, 
  selectedEventId, 
  onSelectEvent,
  shouldHighlightRiskId,
  resetHighlight,
  toast
}: TaskTimelineAndRisksProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (shouldHighlightRiskId && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast("已为您快速聚焦今日首要风险事件！点击该行可深度研判事件。");
      
      const timer = setTimeout(() => {
        resetHighlight();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [shouldHighlightRiskId]);

  return (
    <div id="risk-display-section" ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none shrink-0">
      
      {/* 1. AI Task Flow Column (4 of 12 cols, like 1/3 layout) */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-sm font-bold text-slate-800">AI 任务流</h3>
          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
            实时监测
          </span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {timelineItems.slice(0, 5).map((item, idx) => {
            const isLast = idx === 4 || idx === timelineItems.length - 1;

            // Simple clean bullet status colors from the guidelines
            let bulletColor = "bg-blue-500";
            let statusTextColor = "text-blue-600";
            if (item.status === "识别完成") {
              bulletColor = "bg-blue-500";
              statusTextColor = "text-blue-600";
            } else if (item.status === "策略执行" || item.status === "干预中") {
              bulletColor = "bg-orange-500";
              statusTextColor = "text-orange-655";
            } else if (item.status === "研判完成") {
              bulletColor = "bg-purple-500";
              statusTextColor = "text-purple-600";
            } else if (item.status === "通知完成" || item.status === "完成闭环") {
              bulletColor = "bg-green-500";
              statusTextColor = "text-green-600";
            }

            return (
              <div key={item.id} className="flex gap-3 relative">
                {/* Bullet node */}
                <div className={`w-2 h-2 rounded-full ${bulletColor} mt-1.5 z-10 shrink-0`} />
                
                {/* Vertical line connector */}
                {!isLast && (
                  <div className="absolute left-[3.5px] top-3.5 bottom-0 w-[1px] bg-slate-200" />
                )}

                <div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.time}</div>
                  <div className="text-xs font-bold text-slate-700 leading-normal">{item.action}</div>
                  <div className={`text-[10px] font-medium ${statusTextColor}`}>
                    状态：{item.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Today's Key Risks Column (8 of 12 cols, like 2/3 layout) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-bold text-slate-800">今日重点风险</h3>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-2.5">风险事件</th>
                <th className="px-4 py-2.5">风险等级</th>
                <th className="px-4 py-2.5">所属区域</th>
                <th className="px-4 py-2.5 text-right">发现时间</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {riskEvents.map((row) => {
                const isSelected = selectedEventId === row.id;
                const isGoalHighRisk = row.id === "REV-20260602-01";
                const isHighlightedNow = shouldHighlightRiskId === row.id;

                let levelBadge = "bg-green-100 text-green-600";
                if (row.level === "高") levelBadge = "bg-red-100 text-red-600";
                if (row.level === "中") levelBadge = "bg-orange-100 text-orange-600";

                return (
                  <tr
                    key={row.id}
                    ref={isHighlightedNow ? highlightedRowRef : null}
                    onClick={() => onSelectEvent(row)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors group ${
                      isHighlightedNow ? 'bg-amber-50/70 border-y border-amber-200' : ''
                    } ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-705 group-hover:text-blue-600 relative">
                      {isGoalHighRisk && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                      <div className="pl-1">
                        <span className="font-semibold">{row.event}</span>
                        <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${levelBadge}`}>
                        {row.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {row.area}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 font-mono tracking-wide">
                      {row.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
