/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TodoTask } from '../types';

interface TodoTaskListProps {
  todoTasks: TodoTask[];
  onOpenTodoTask: (task: TodoTask) => void;
  toast: (msg: string) => void;
}

export default function TodoTaskList({ todoTasks, onOpenTodoTask, toast }: TodoTaskListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden select-none shrink-0">
      {/* Table Header Header */}
      <div className="p-4 border-b border-slate-100 shrink-0">
        <h3 className="text-sm font-bold text-slate-800">待办任务</h3>
      </div>

      {/* Task table list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 border-b border-slate-100 uppercase bg-slate-50/50">
              <th className="px-4 py-2.5">任务内容</th>
              <th className="px-4 py-2.5">风险等级</th>
              <th className="px-4 py-2.5">关联事件</th>
              <th className="px-4 py-2.5">截止时间</th>
              <th className="px-4 py-2.5">责任岗位</th>
              <th className="px-4 py-2.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-[11px] divide-y divide-slate-100">
            {todoTasks.map((task) => {
              // Level Badge styling
              let badgeStyle = "bg-green-150 text-green-700 font-bold";
              if (task.level === "高") badgeStyle = "bg-red-100 text-red-650 font-bold";
              if (task.level === "中") badgeStyle = "bg-orange-100 text-orange-650 font-bold";

              let relationColorClass = "text-slate-550";
              if (task.level === "高") relationColorClass = "text-red-500 font-semibold";
              if (task.level === "中") relationColorClass = "text-orange-500 font-semibold";

              return (
                <tr 
                  key={task.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Task Title */}
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <span className="font-semibold block">{task.title}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{task.id}</span>
                  </td>

                  {/* Level Badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${badgeStyle}`}>
                      {task.level}
                    </span>
                  </td>

                  {/* Associated Events */}
                  <td className={`px-4 py-3 ${relationColorClass}`}>
                    {task.eventCount}
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {task.deadline}
                  </td>

                  {/* Responsible party */}
                  <td className="px-4 py-3 text-slate-500">
                    {task.operator}
                  </td>

                  {/* Operations button */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onOpenTodoTask(task)}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                    >
                      去处理
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
