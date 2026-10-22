import React, { useState } from 'react';
import {
  Play,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { TaskItem, AppSettings } from '../../types.ts';

interface TasksManagementViewProps {
  settings: AppSettings;
  tasks: TaskItem[];
  onSaveSettings: (settings: AppSettings) => void;
  onSaveTasks: (tasks: TaskItem[]) => void;
}

export const TasksManagementView: React.FC<TasksManagementViewProps> = ({
  settings,
  tasks,
  onSaveSettings,
  onSaveTasks,
}) => {
  // Adsgram Ad Config State
  const [dailyLimit, setDailyLimit] = useState(settings.dailyAdLimit.toString());
  const [rewardPerAd, setRewardPerAd] = useState(settings.rewardPerAd.toString());
  const [blockId, setBlockId] = useState(settings.adsgramBlockId);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Edit / Create Task Modal State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);

  const handleSaveAdSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseInt(dailyLimit, 10) || 15;
    const reward = parseFloat(rewardPerAd) || 0.02;

    const newSettings: AppSettings = {
      ...settings,
      dailyAdLimit: limit,
      rewardPerAd: reward,
      adsgramBlockId: blockId.trim() || 'int-55309',
    };

    onSaveSettings(newSettings);
    setSavedBanner('Premium Ads settings successfully updated!');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleToggleTaskStatus = (task: TaskItem) => {
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, isActive: t.isActive === false ? true : false } : t
    );
    onSaveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const updated = tasks.filter((t) => t.id !== taskId);
      onSaveTasks(updated);
    }
  };

  const handleSaveTaskModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    if (isNewTask) {
      onSaveTasks([...tasks, editingTask]);
    } else {
      const updated = tasks.map((t) => (t.id === editingTask.id ? editingTask : t));
      onSaveTasks(updated);
    }

    setEditingTask(null);
    setIsNewTask(false);
  };

  const openNewTaskModal = () => {
    setIsNewTask(true);
    setEditingTask({
      id: `task_${Date.now()}`,
      title: 'New Community Partner Task',
      category: 'telegram',
      reward: 0.10,
      iconType: 'telegram',
      link: 'https://t.me/partner',
      description: 'Join our verified partner channel to receive your USDT bounty.',
      buttonLabel: 'Join Channel',
      verificationDurationSeconds: 4,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tasks Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Adsgram SDK block parameters and customize community bounty tasks.
          </p>
        </div>

        <button
          onClick={openNewTaskModal}
          className="btn-3d-green py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bonus Task</span>
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* 1. ADSGRAM PREMIUM ADS CONFIGURATION CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#008069] text-white flex items-center justify-center shadow-md shadow-[#008069]/20">
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Premium Adsgram Video Settings</h2>
            <p className="text-xs text-slate-500">
              Directly tunes the Adsgram SDK blockId & user reward rates
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveAdSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adsgram Block ID
              </label>
              <input
                type="text"
                required
                value={blockId}
                onChange={(e) => setBlockId(e.target.value)}
                placeholder="int-55309"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Active rewarded interstitial</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reward Per Completed Ad (USDT)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.005"
                  min="0.001"
                  required
                  value={rewardPerAd}
                  onChange={(e) => setRewardPerAd(e.target.value)}
                  placeholder="0.02"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                  USDT
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 0.02 USDT</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Daily Ad Limit Per User
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="15"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 15 ads / day</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#008069] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#008069]/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Premium Ads Config</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. BONUS TASKS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#008069]" />
            <h2 className="text-base font-bold text-slate-900">Bonus Bounties & Tasks</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">{tasks.length} Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bounty Reward</th>
                <th className="py-3 px-4">Target Link</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{task.title}</div>
                    <div className="text-[11px] text-slate-400 max-w-xs truncate">
                      {task.description}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px]">
                      {task.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-extrabold text-xs text-[#008069] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      +{task.reward.toFixed(2)} USDT
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#008069] flex items-center gap-1"
                    >
                      <span className="truncate max-w-[140px]">{task.link}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleTaskStatus(task)}
                      className="flex items-center gap-1 font-semibold text-xs"
                      title="Toggle Active"
                    >
                      {task.isActive !== false ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-bold">
                          <ToggleRight className="w-5 h-5 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5 text-slate-400" /> Paused
                        </span>
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setIsNewTask(false);
                          setEditingTask(task);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Edit / Create Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#008069]" />
                <span>{isNewTask ? 'Create New Bonus Task' : 'Edit Task Details'}</span>
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008069]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reward (USDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={editingTask.reward}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, reward: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingTask.category}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        category: e.target.value as TaskItem['category'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#008069]"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="social">Social</option>
                    <option value="partner">Partner</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Link (URL)
                </label>
                <input
                  type="text"
                  required
                  value={editingTask.link}
                  onChange={(e) => setEditingTask({ ...editingTask, link: e.target.value })}
                  placeholder="https://t.me/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#008069]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008069]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#008069] hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-[#008069]/20"
                >
                  {isNewTask ? 'Add Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
