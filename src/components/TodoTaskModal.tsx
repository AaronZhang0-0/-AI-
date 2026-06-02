/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TodoTask } from '../types';
import { X, CheckSquare, Square, AlertTriangle, UserCheck, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface TodoTaskModalProps {
  task: TodoTask;
  onClose: () => void;
  onComplete: (taskId: string) => void;
  toast: (msg: string) => void;
}

export default function TodoTaskModal({ task, onClose, onComplete, toast }: TodoTaskModalProps) {
  // Checklists based on task type
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);

  const toggleCheck = (index: number) => {
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
  };

  const isAllChecked = checks.every(c => c === true);

  const handleResolve = () => {
    onComplete(task.id);
    toast(`已顺利处理待办：【${task.title}】！系统状态以及数据看板已做出消号。`);
    onClose();
  };

  const stepDetails = task.title.includes("宣教") 
    ? [
        "组织二采区高空施工承包商在岗全体员工进行安全绳挂扣‘双百分百两挂扣’规范学习（时间：10分钟）",
        "实地巡检二采区高空通道27米生命线是否拉索完好、卡扣螺栓防松扣无松懈缺陷",
        "将宣教班前短照以及现场挂扣巡查情况记录签字上报AI平台台账"
      ]
    : task.title.includes("PPE")
      ? [
        "前往人车交汇坡道口摆挂反光防护告知牌并接管现场进行人车分流抽查",
        "针对在岗无反光背心人员，发放应急暂借反光背心并责令所属班组备案签字",
        "实测并验证通道两侧的AI报警跑马LED灯柱闪烁状态以及定向语音器运行分贝合格"
      ]
    : [
        "派持电气检测证安全技术人员至10kV带压配电室，实地核对红外防区电子网设定距离精度",
        "核实非授权越界闯入实习生工号安全履职信息并谈话叮嘱防电危害",
        "复位配电区现场语音电笛，测试AI电子防区越界感应电子复位"
      ];

  const levelColor = task.level === "高" 
    ? "text-rose-605 bg-rose-50 border-rose-100" 
    : "text-amber-700 bg-amber-50 border-amber-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-150 animate-in zoom-in-95 duration-205 flex flex-col">
        
        {/* Header */}
        <div className="p-4.5 bg-slate-100 border-b border-slate-150 flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-xs font-bold font-sans">
              现场责任待办处置流程
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 inline-block" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4.5 text-left">
          
          {/* Info Tile */}
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono">{task.id}</span>
            <h4 className="text-sm font-extrabold text-slate-800 leading-normal mt-0.5">{task.title}</h4>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${levelColor}`}>
                {task.level}风险
              </span>
              <span className="flex items-center gap-1 font-mono text-[10.5px]">
                <Calendar className="w-3.5 h-3.5" />
                截止时间: {task.deadline}
              </span>
              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                {task.eventCount} 关联
              </span>
            </div>
          </div>

          {/* Checklist Area text instruction */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>现场落实行动导引及核验单</span>
            </div>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              为落实“安全闭环”标准，责任人在前往现场查处后，请在系统内逐项**勾选核验**：
            </p>

            {/* Checklist elements */}
            <div className="space-y-2.5">
              {stepDetails.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    checks[idx] 
                      ? 'bg-blue-50/40 border-blue-200 text-slate-800' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600'
                  }`}
                >
                  <button className="text-blue-600 mt-0.5 shrink-0 cursor-pointer">
                    {checks[idx] ? (
                      <CheckSquare className="w-4.5 h-4.5" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-slate-400" />
                    )}
                  </button>
                  <span className="text-[11px] leading-relaxed select-none">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-closing helper */}
          {isAllChecked ? (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-xl text-[11px] flex items-center gap-1.5 font-semibold animate-in zoom-in-95 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>所有现场审核项已经落实！您现在可以直接进行闭环销号归档。</span>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 text-center italic">
              提示：需勾选完成全部 3 项现场核对，才可以启用闭环归档。
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">责任岗: {task.operator}</span>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-205 hover:bg-slate-100 rounded-lg text-xs text-slate-600 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleResolve}
              disabled={!isAllChecked}
              className={`px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer ${
                isAllChecked
                  ? 'bg-blue-650 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              落实并完成整改
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
