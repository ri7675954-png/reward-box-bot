import React, { useState, useEffect } from 'react';
import { TabType, UserState, WithdrawalRecord, AppSettings, ManagedUser, TaskItem } from './types.ts';
import {
  loadUserState,
  saveUserState,
  loadWithdrawals,
  saveWithdrawals,
  loadAppSettings,
  saveAppSettings,
  loadManagedUsers,
  saveManagedUsers,
  loadTasks,
  saveTasks,
  checkAdminAuth,
  setAdminAuth,
} from './services/storage.ts';
import { soundService } from './services/sound.ts';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HomeTab } from './components/HomeTab.tsx';
import { TasksTab } from './components/TasksTab.tsx';
import { ReferTab } from './components/ReferTab.tsx';
import { WithdrawTab } from './components/WithdrawTab.tsx';
import { AdModal } from './components/AdModal.tsx';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { DashboardView } from './components/admin/DashboardView.tsx';
import { UsersView } from './components/admin/UsersView.tsx';
import { WithdrawalsView } from './components/admin/WithdrawalsView.tsx';
import { TasksManagementView } from './components/admin/TasksManagementView.tsx';
import { SettingsView } from './components/admin/SettingsView.tsx';

export default function App() {
  // Mini App navigation state
  const [currentTab, setCurrentTab] = useState<TabType>('HOME');
  const [userState, setUserState] = useState<UserState>(() => loadUserState());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => loadWithdrawals());
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() => loadManagedUsers());
  const [appSettings, setAppSettings] = useState<AppSettings>(() => loadAppSettings());
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);

  // Routing State
  const checkIsAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#/admin')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminUrl);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => checkAdminAuth());
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'withdrawals' | 'tasks' | 'settings'>('dashboard');

  // Handle URL change listeners
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminRoute(checkIsAdminUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Initialize Telegram WebApp API if present
  useEffect(() => {
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void; setHeaderColor?: (c: string) => void; setBackgroundColor?: (c: string) => void } } }).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        if (tg.setHeaderColor) tg.setHeaderColor('#008069');
        if (tg.setBackgroundColor) tg.setBackgroundColor('#f2f6f5');
      }
    } catch {
      // not in telegram environment
    }
  }, []);

  // Update sound service when toggled
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setSoundEnabled(next);
  };

  // User Mini App: update balance
  const handleUpdateBalance = (amount: number, reason?: string) => {
    setUserState((prev) => {
      const next: UserState = {
        ...prev,
        balance: +(prev.balance + amount).toFixed(4),
        totalEarned: +(prev.totalEarned + amount).toFixed(4),
        adsWatchedToday: prev.adsWatchedToday + (amount === (appSettings.rewardPerAd || 0.02) ? 1 : 0),
      };
      saveUserState(next);
      return next;
    });

    // Sync in managed users table
    setManagedUsers((prev) => {
      const next = prev.map((u) =>
        u.id === 'USR-1082' ? { ...u, balance: +(u.balance + amount).toFixed(4) } : u
      );
      saveManagedUsers(next);
      return next;
    });
  };

  // User Mini App: complete task
  const handleCompleteTask = (taskId: string) => {
    setUserState((prev) => {
      if (prev.completedTaskIds.includes(taskId)) return prev;
      const next: UserState = {
        ...prev,
        completedTaskIds: [...prev.completedTaskIds, taskId],
      };
      saveUserState(next);
      return next;
    });
  };

  // User Mini App: create withdrawal
  const handleWithdrawal = (record: WithdrawalRecord) => {
    setUserState((prev) => {
      const next: UserState = {
        ...prev,
        balance: +(prev.balance - record.amount).toFixed(4),
      };
      saveUserState(next);
      return next;
    });

    setWithdrawals((prev) => {
      const next = [record, ...prev];
      saveWithdrawals(next);
      return next;
    });

    // Sync balance in managed users
    setManagedUsers((prev) => {
      const next = prev.map((u) =>
        u.id === 'USR-1082' ? { ...u, balance: +(u.balance - record.amount).toFixed(4) } : u
      );
      saveManagedUsers(next);
      return next;
    });
  };

  // Admin: Update user record
  const handleAdminUpdateUser = (updatedUser: ManagedUser) => {
    setManagedUsers((prev) => {
      const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      saveManagedUsers(next);
      return next;
    });

    // If updated user is the current active session user (@hunter_88), sync userState
    if (updatedUser.id === 'USR-1082') {
      setUserState((prev) => {
        const next: UserState = {
          ...prev,
          balance: updatedUser.balance,
        };
        saveUserState(next);
        return next;
      });
    }
  };

  // Admin: Update withdrawal record
  const handleAdminUpdateWithdrawal = (updatedWithdrawal: WithdrawalRecord) => {
    setWithdrawals((prev) => {
      const next = prev.map((w) => (w.id === updatedWithdrawal.id ? updatedWithdrawal : w));
      saveWithdrawals(next);
      return next;
    });
  };

  // Admin: Save settings
  const handleAdminSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveAppSettings(newSettings);
  };

  // Admin: Save tasks
  const handleAdminSaveTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Admin Auth handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setAdminAuth(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminAuth(false);
  };

  // Navigation between Mini App and Admin
  const navigateToAdmin = () => {
    setIsAdminRoute(true);
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      window.location.hash = '#/admin';
    }
  };

  const navigateToMiniApp = () => {
    setIsAdminRoute(false);
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '#/';
    }
  };

  // Count pending tasks for Mini App bottom navigation badge
  const pendingTasksCount = tasks
    .filter((t) => t.isActive !== false)
    .filter((t) => !userState.completedTaskIds.includes(t.id)).length;

  // ==========================================
  // RENDER: ADMIN ROUTE (/admin)
  // ==========================================
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToApp={navigateToMiniApp}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onLogout={handleAdminLogout}
        onBackToMiniApp={navigateToMiniApp}
        withdrawals={withdrawals}
      >
        {adminTab === 'dashboard' && (
          <DashboardView
            users={managedUsers}
            withdrawals={withdrawals}
            settings={appSettings}
            onNavigate={setAdminTab}
          />
        )}

        {adminTab === 'users' && (
          <UsersView
            users={managedUsers}
            onUpdateUser={handleAdminUpdateUser}
          />
        )}

        {adminTab === 'withdrawals' && (
          <WithdrawalsView
            withdrawals={withdrawals}
            onUpdateWithdrawal={handleAdminUpdateWithdrawal}
          />
        )}

        {adminTab === 'tasks' && (
          <TasksManagementView
            settings={appSettings}
            tasks={tasks}
            onSaveSettings={handleAdminSaveSettings}
            onSaveTasks={handleAdminSaveTasks}
          />
        )}

        {adminTab === 'settings' && (
          <SettingsView
            settings={appSettings}
            onSaveSettings={handleAdminSaveSettings}
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // RENDER: TELEGRAM MINI APP VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-[#e8efed] flex flex-col justify-between items-center text-slate-800">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#f2f6f5] min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/50">
        {/* Top Header */}
        <Header
          userState={userState}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenAdmin={navigateToAdmin}
        />

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {currentTab === 'HOME' && (
            <HomeTab
              userState={userState}
              settings={appSettings}
              onUpdateBalance={handleUpdateBalance}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenAdModal={() => setIsAdModalOpen(true)}
              onOpenAdmin={navigateToAdmin}
            />
          )}

          {currentTab === 'TASKS' && (
            <TasksTab
              userState={userState}
              tasks={tasks}
              onUpdateBalance={handleUpdateBalance}
              onCompleteTask={handleCompleteTask}
            />
          )}

          {currentTab === 'REFER' && (
            <ReferTab userState={userState} />
          )}

          {currentTab === 'WITHDRAW' && (
            <WithdrawTab
              userState={userState}
              withdrawals={withdrawals}
              settings={appSettings}
              onWithdraw={handleWithdrawal}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}
        </main>

        {/* Bottom Tab Navigation */}
        <Navigation
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          pendingTasksCount={pendingTasksCount}
        />

        {/* Interactive Ad Reward Modal */}
        <AdModal
          isOpen={isAdModalOpen}
          onClose={() => setIsAdModalOpen(false)}
          onReward={() =>
            handleUpdateBalance(
              appSettings.rewardPerAd || 0.02,
              `Watched Premium Ad (${appSettings.adsgramBlockId || 'int-55309'})`
            )
          }
        />
      </div>
    </div>
  );
}
