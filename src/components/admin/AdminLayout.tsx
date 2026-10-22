import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  WalletCards,
  CheckSquare,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Bell,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { WithdrawalRecord } from '../../types.ts';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'users' | 'withdrawals' | 'tasks' | 'settings';
  onTabChange: (tab: 'dashboard' | 'users' | 'withdrawals' | 'tasks' | 'settings') => void;
  onLogout: () => void;
  onBackToMiniApp: () => void;
  withdrawals: WithdrawalRecord[];
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  onBackToMiniApp,
  withdrawals,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = withdrawals.filter((w) => w.status === 'Pending').length;

  interface NavItem {
    key: 'dashboard' | 'users' | 'withdrawals' | 'tasks' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'users', label: 'Users', icon: Users },
    {
      key: 'withdrawals',
      label: 'Withdrawals',
      icon: WalletCards,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { key: 'tasks', label: 'Tasks Management', icon: CheckSquare },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: typeof currentTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. DARK SIDEBAR (Shopify Style) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0b1320] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Wordmark & Tag */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#008069] to-emerald-400 flex items-center justify-center text-white shadow-md shadow-[#008069]/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight block">
                  Reward Box
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleSelectTab(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#008069] text-white shadow-md shadow-[#008069]/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Quick link to Mini App */}
          <button
            onClick={onBackToMiniApp}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Mini App</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Current Admin User */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">admin</span>
                <span className="text-[10px] text-slate-400 block truncate">Super Admin</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 2. MAIN WHITE CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800 capitalize font-bold">{currentTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Switch to Mini App button for rapid testing */}
            <button
              onClick={onBackToMiniApp}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#008069] border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View User Bot View</span>
            </button>

            {/* Notification bell */}
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell className="w-4 h-4" />
              </div>
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
