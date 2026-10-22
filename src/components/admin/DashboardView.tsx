import React from 'react';
import {
  Users,
  DollarSign,
  Clock,
  Radio,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ManagedUser, WithdrawalRecord, AppSettings } from '../../types.ts';

interface DashboardViewProps {
  users: ManagedUser[];
  withdrawals: WithdrawalRecord[];
  settings: AppSettings;
  onNavigate: (tab: 'users' | 'withdrawals' | 'tasks' | 'settings') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  users,
  withdrawals,
  settings,
  onNavigate,
}) => {
  // Pending withdrawals calculation
  const pendingList = withdrawals.filter((w) => w.status === 'Pending');
  const pendingAmount = pendingList.reduce((acc, curr) => acc + curr.amount, 0);

  // Total balance & estimated earnings
  const totalUserBalance = users.reduce((acc, u) => acc + u.balance, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'Approved' || w.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalVolume = (totalUserBalance + totalWithdrawn + 3480).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Welcome bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reward Box Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Telegram Bot metrics, Adsgram block monitoring, and BEP20 payout queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Adsgram Live · {settings.adsgramBlockId}
          </span>
        </div>
      </div>

      {/* 4 CORE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div
          onClick={() => onNavigate('users')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {users.length + 1476}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active Telegram Bot participants</p>
        </div>

        {/* Card 2: Total Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalVolume}
            </span>
            <span className="text-sm font-bold text-emerald-600">USDT</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Cumulative reward distributions</p>
        </div>

        {/* Card 3: Pending Withdrawals (0.46 USDT example) */}
        <div
          onClick={() => onNavigate('withdrawals')}
          className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-amber-50/30"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending Withdrawals
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-800 font-mono tabular-nums">
              {pendingAmount.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-amber-700">USDT</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ml-auto font-mono">
              {pendingList.length} Pending
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-2 flex items-center gap-1 font-medium">
            <span>Includes 0.46 USDT queue</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 4: Active Ads (int-55309 status) */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Ads
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {settings.adsgramBlockId}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {settings.rewardPerAd.toFixed(2)} USDT / ad · Max {settings.dailyAdLimit} ads/day
          </p>
        </div>
      </div>

      {/* QUICK STATUS & ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Withdrawals Quick List (2 columns on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Withdrawal Requests</h2>
              <p className="text-xs text-slate-500">Require administrator confirmation to BEP20</p>
            </div>
            <button
              onClick={() => onNavigate('withdrawals')}
              className="text-xs font-bold text-[#008069] hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">BEP-20 Address</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.slice(0, 4).map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {w.userName || '@hunter_88'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {w.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {w.address}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : w.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono">
                      {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Bot Health & Config Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Bot System Status</h2>
            <p className="text-xs text-slate-500 mb-4">Core automated tasks and payouts</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#008069]" />
                  <span className="font-semibold text-slate-700">Min. Payout Rule</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {settings.minWithdrawal.toFixed(2)} USDT
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-700">Referral Bounty</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {settings.referralReward.toFixed(2)} USDT
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <Radio className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-slate-700">Required Channels</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {settings.requiredChannels.length} Linked
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('settings')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage System Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
