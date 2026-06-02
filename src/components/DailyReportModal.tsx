/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, FileText, Download, Printer, Copy, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface DailyReportModalProps {
  onClose: () => void;
  toast: (msg: string) => void;
}

export default function DailyReportModal({ onClose, toast }: DailyReportModalProps) {
  
  const handleCopy = () => {
    toast("日报内容已成功复制至系统剪贴板！可立即分发给各班组生产线群。");
  };

  const handleDownload = () => {
    toast("正在生成《AI智能安全工作日报-20260602.pdf》... 正在打包下载项");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-150 animate-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold font-sans">企业AI智能工作区：安小邦安全统计预警简报</h3>
              <p className="text-[10px] text-slate-300 font-mono tracking-wider mt-0.5">HSSE COMPLIANCE AUTOMATION LOGS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 bg-white/15 hover:bg-white/20 text-xs rounded-xl cursor-pointer hover:text-white text-slate-300 transition-colors"
          >
            <X className="w-4 h-4 inline-block mr-1" />
            关闭
          </button>
        </div>

        {/* Report Content Body Document */}
        <div className="flex-1 overflow-y-auto p-8 text-slate-800 space-y-6 bg-slate-50/50 scrollbar font-sans">
          
          {/* Formal Letterhead */}
          <div className="text-center space-y-2 border-b border-dashed border-slate-205 pb-5">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              现场不安全行为干预与策略闭环统计日报
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
              <span>生成人：安全助理·安小邦</span>
              <span>发布时间：2026年06月02日 09:20 (第194期)</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                数据已认证
              </span>
            </div>
          </div>

          {/* Section 1: Target Stats Panel */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-l-3 border-blue-600 pl-2">
              一、 厂区实时安全运行指标
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white border border-slate-150 shadow-sm text-left">
                <span className="text-[10.5px] text-slate-400">今日主动侦测事件</span>
                <div className="text-xl font-bold font-mono text-slate-800 mt-1">32 起</div>
                <span className="text-[9.5px] text-emerald-600 font-medium">同比昨日下降 8.5% ↓</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-150 shadow-sm text-left">
                <span className="text-[10.5px] text-slate-400">策略自动激活执行</span>
                <div className="text-xl font-bold font-mono text-slate-800 mt-1">14 次</div>
                <span className="text-[9.5px] text-amber-600 font-medium">涉及智能定向音柱 5 次</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-150 shadow-sm text-left">
                <span className="text-[10.5px] text-slate-400">事件干预达成闭环</span>
                <div className="text-xl font-bold font-mono text-slate-850 mt-1">92.4%</div>
                <span className="text-[9.5px] text-cyan-600 font-medium">28起归档 | 4起跟踪中</span>
              </div>
            </div>
          </div>

          {/* Section 2: Violation Breakdown table */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-l-3 border-blue-600 pl-2">
              二、 隐患及不安全行为构成明细
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-2.5 font-bold">不安全行为类别</th>
                    <th className="p-2.5 font-bold">发生频次</th>
                    <th className="p-2.5 font-bold">高危触发区域</th>
                    <th className="p-2.5 font-bold">匹配策略应对方式</th>
                    <th className="p-2.5 text-right font-bold">处置状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">特种登高挂钩缺失 (致命风险)</td>
                    <td className="p-2.5 font-mono">1 起</td>
                    <td className="p-2.5">二采区 A3 主框架</td>
                    <td className="p-2.5">定向声暴喊话 + 督导短信 + 班组长强制卡</td>
                    <td className="p-2.5 text-emerald-600 text-right font-medium">● 已触发干预并锁定</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">未着反光安全夹克防护 (人员伤害)</td>
                    <td className="p-2.5 font-mono">11 起</td>
                    <td className="p-2.5">人车交错运输主通道</td>
                    <td className="p-2.5">闪烁提醒 LED跑马灯 + 发微信至部门经理</td>
                    <td className="p-2.5 text-emerald-600 text-right font-medium">● 派发周报汇总记录</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">高压操作防区越界 (涉电绝缘)</td>
                    <td className="p-2.5 font-mono">1 起</td>
                    <td className="p-2.5">10kV 检修室高电区</td>
                    <td className="p-2.5">红外网联锁 + 防静电电笛驱退 + 电力联锁限位</td>
                    <td className="p-2.5 text-emerald-600 text-right font-medium">● 现场拦截完毕</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">机械飞轮防护栏罩漏安 (缺陷曝露)</td>
                    <td className="p-2.5 font-mono">3 起</td>
                    <td className="p-2.5">破碎进料二车间</td>
                    <td className="p-2.5">建立检修缺陷工单推入4小时重点轮巡</td>
                    <td className="p-2.5 text-amber-600 text-right font-medium">● 维修班组已领单</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: AI Advice & Closing recommendations */}
          <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>三、 企业治理高阶AI诊断意见</span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              <p>
                1. <strong>管理死角警示</strong>：本周「二采区」登高不挂生命挂扣行为已累计抓捕3次，表明现场登高施工时重速度、轻防护的现象有所反弹，建议在今日安全晨会上对该承包商班组长进行黄牌口头申诫。
              </p>
              <p>
                2. <strong>设备全周期建议</strong>：破碎车间滚筒固定挡罩在检修后极易被遗留在地漏扣锁紧，建议启用AI智能体联动“设备断电点位安全闭锁”策略，不锁紧固定外罩无法强行启动转机。
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">智慧安监·AI安全办公室数字凭证</span>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 border border-slate-250 hover:bg-slate-100 rounded-xl text-xs text-slate-600 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              复制文本
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              下载 PDF 简报
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
