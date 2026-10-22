import React, { useState } from 'react';
import {
  CheckCircle,
  ExternalLink,
  Send,
  Twitter,
  Youtube,
  Star,
  Gift,
  Flame,
  Check,
  Award,
} from 'lucide-react';
import { TaskItem, UserState } from '../types.ts';
import { INITIAL_TASKS } from '../services/storage.ts';
import { soundService } from '../services/sound.ts';
import confetti from 'canvas-confetti';

interface TasksTabProps {
  userState: UserState;
  tasks?: TaskItem[];
  onUpdateBalance: (amount: number, reason: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  userState,
  tasks = INITIAL_TASKS,
  onUpdateBalance,
  onCompleteTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'telegram' | 'social' | 'partner'>('all');
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const activeTasks = tasks.filter((t) => t.isActive !== false);

  const filteredTasks = activeTasks.filter((task) => {
    if (filter === 'all') return true;
    return task.category === filter;
  });

  const getTaskIcon = (type: TaskItem['iconType']) => {
    switch (type) {
      case 'telegram':
        return <Send className="w-4 h-4 text-[#008069]" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-sky-500" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'star':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'gift':
        return <Gift className="w-4 h-4 text-purple-500" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#008069]" />;
    }
  };

  const handleStartTask = (task: TaskItem) => {
    if (userState.completedTaskIds.includes(task.id) || verifyingTaskId === task.id) return;

    soundService.playClick();

    // Open link if external
    if (task.link.startsWith('http')) {
      window.open(task.link, '_blank', 'noopener,noreferrer');
    }

    const duration = task.verificationDurationSeconds || 4;
    setVerifyingTaskId(task.id);
    setCountdown(duration);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVerifyingTaskId(null);
          // Complete and award
          soundService.playSuccess();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#008069', '#10b981', '#fbbf24'],
          });
          onCompleteTask(task.id);
          onUpdateBalance(task.reward, `Completed task: ${task.title}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completedCount = activeTasks.filter((t) => userState.completedTaskIds.includes(t.id)).length;
  const totalTasks = activeTasks.length;

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* Header Summary Card */}
      <div className="card-3d p-4 bg-gradient-to-r from-emerald-800 to-[#008069] text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200">
              Community Tasks
            </span>
            <h2 className="text-xl font-extrabold text-white">Tasks & Bounties</h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Complete simple sponsor actions to earn extra BEP-20 USDT
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 pt-3 border-t border-white/15">
          <div className="flex items-center justify-between text-xs mb-1 text-emerald-100">
            <span>Completed Tasks</span>
            <span className="font-mono font-bold">
              {completedCount} / {totalTasks}
            </span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Tasks' },
          { key: 'telegram', label: 'Telegram' },
          { key: 'social', label: 'Social' },
          { key: 'partner', label: 'Partners' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              soundService.playClick();
              setFilter(tab.key as typeof filter);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.key
                ? 'bg-[#008069] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => {
          const isCompleted = userState.completedTaskIds.includes(task.id);
          const isVerifying = verifyingTaskId === task.id;

          return (
            <div
              key={task.id}
              className={`card-3d p-3.5 transition-all bg-white flex flex-col justify-between gap-3 ${
                isCompleted ? 'opacity-85 border-emerald-100' : 'hover:border-[#008069]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                  {getTaskIcon(task.iconType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
                      {task.title}
                    </h4>
                    <span className="shrink-0 text-xs font-extrabold font-mono text-[#008069] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      +{task.reward.toFixed(2)} USDT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 capitalize">
                  Category: {task.category}
                </span>

                {isCompleted ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Completed</span>
                  </div>
                ) : isVerifying ? (
                  <button
                    disabled
                    className="btn-3d-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-wait"
                  >
                    <div className="w-3 h-3 border-2 border-[#008069] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying ({countdown}s)...</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartTask(task)}
                    className="btn-3d-green py-1.5 px-3.5 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{task.buttonLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
