import React from 'react';
import { Home, CheckSquare, Users, Wallet } from 'lucide-react';
import { TabType } from '../types.ts';
import { soundService } from '../services/sound.ts';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingTasksCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  pendingTasksCount = 0,
}) => {
  const tabs: { key: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'HOME', label: 'HOME', icon: Home },
    { key: 'TASKS', label: 'TASKS', icon: CheckSquare },
    { key: 'REFER', label: 'REFER', icon: Users },
    { key: 'WITHDRAW', label: 'WITHDRAW', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-emerald-900/10 shadow-[0_-4px_20px_rgba(0,128,105,0.08)] pb-safe">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => {
                if (currentTab !== tab.key) {
                  soundService.playClick();
                  soundService.triggerHaptic('selection');
                  onTabChange(tab.key);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive ? 'text-[#008069]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Active Tab indicator glow pill */}
              {isActive && (
                <div className="absolute inset-x-2 -top-1.5 h-0.5 bg-[#008069] rounded-full shadow-[0_2px_8px_rgba(0,128,105,0.6)]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.key === 'TASKS' && pendingTasksCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                    {pendingTasksCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-wider font-bold mt-1 uppercase ${
                  isActive ? 'text-[#008069]' : 'text-slate-500 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
