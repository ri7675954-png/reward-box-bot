import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Ban,
  CheckCircle,
  Filter,
  DollarSign,
  X,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { ManagedUser } from '../../types.ts';

interface UsersViewProps {
  users: ManagedUser[];
  onUpdateUser: (user: ManagedUser) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onUpdateUser }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Banned'>('All');
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<ManagedUser | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<string>('0.50');
  const [balanceMode, setBalanceMode] = useState<'add' | 'set'>('add');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleBan = (user: ManagedUser) => {
    const newStatus = user.status === 'Active' ? 'Banned' : 'Active';
    onUpdateUser({ ...user, status: newStatus });
  };

  const handleApplyBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    const val = parseFloat(balanceDelta);
    if (isNaN(val)) return;

    let newBalance = selectedUserForBalance.balance;
    if (balanceMode === 'add') {
      newBalance = +(newBalance + val).toFixed(4);
    } else {
      newBalance = Math.max(0, +val.toFixed(4));
    }

    onUpdateUser({
      ...selectedUserForBalance,
      balance: newBalance,
    });
    setSelectedUserForBalance(null);
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Users Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage bot subscribers, modify balances, and oversee referral activities.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Total Users: <strong className="text-slate-800 font-mono">{users.length}</strong>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username, user ID, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {(['All', 'Active', 'Banned'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Username & Name</th>
                <th className="py-3 px-4">Balance (USDT)</th>
                <th className="py-3 px-4">Referrals</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {user.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{user.username}</div>
                      <div className="text-[11px] text-slate-400">{user.name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-sm text-[#008069] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                        {user.balance.toFixed(2)} USDT
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {user.referrals} friends
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {user.joinedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.status === 'Active' ? (
                          <UserCheck className="w-3 h-3" />
                        ) : (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Add Balance button */}
                        <button
                          onClick={() => setSelectedUserForBalance(user)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#008069] font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-colors"
                          title="Modify Balance"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Balance</span>
                        </button>

                        {/* Ban / Unban button */}
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 border transition-colors ${
                            user.status === 'Active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {user.status === 'Active' ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Ban</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Unban</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Edit Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-[#008069]" />
                <span>Adjust User Balance</span>
              </h3>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
              <div className="text-slate-500">Target User:</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {selectedUserForBalance.username} ({selectedUserForBalance.name})
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-slate-500">Current Balance:</span>
                <strong className="font-mono text-[#008069]">
                  {selectedUserForBalance.balance.toFixed(2)} USDT
                </strong>
              </div>
            </div>

            <form onSubmit={handleApplyBalance} className="space-y-4">
              {/* Mode switch */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBalanceMode('add')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    balanceMode === 'add'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Add USDT
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode('set')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    balanceMode === 'set'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Set Fixed Amount
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {balanceMode === 'add' ? 'Amount to Add (USDT)' : 'New Total Balance (USDT)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={balanceDelta}
                    onChange={(e) => setBalanceDelta(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    USDT
                  </span>
                </div>
              </div>

              {/* Quick Preset Chips */}
              {balanceMode === 'add' && (
                <div className="flex gap-1.5">
                  {['+0.10', '+0.50', '+1.00', '+5.00'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBalanceDelta(preset.replace('+', ''))}
                      className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono font-bold text-slate-700"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#008069] hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-[#008069]/20"
                >
                  Save Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
