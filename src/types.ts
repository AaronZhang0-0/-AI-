/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventDetails {
  conclusion: string;      // AI识别结论
  regulation: string;      // 匹配制度
  strategy: string;        // 命中策略
  aiActions: string[];     // AI建议动作
  confirmNodes: string[];  // 人工确认节点
  photoUrl?: string;       // 模拟图像 (SVG 或 CSS绘制)
  complianceRate?: number; // 关联区域达标率
}

export interface RiskEvent {
  id: string;
  event: string;           // 风险事件
  level: '高' | '中' | '低';  // 风险等级
  area: string;            // 所属区域
  time: string;            // 发现时间
  status: '待处理' | '干预中' | '已闭环'; // 事件状态
  details: EventDetails;
}

export interface TimelineItem {
  id: string;
  time: string;
  action: string;
  status: string;
  statusType: 'success' | 'warn' | 'info' | 'active';
}

export interface TodoTask {
  id: string;
  title: string;           // 任务内容
  level: '高' | '中' | '低';  // 风险等级
  eventCount: string;      // 关联事件
  deadline: string;        // 截止时间
  status: '待办' | '处理中' | '已完成';
  operator: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionId: string }[];
}
