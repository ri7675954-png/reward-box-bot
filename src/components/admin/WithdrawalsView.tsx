import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { WithdrawalRecord } from '../../types.ts';

interface WithdrawalsViewProps {
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawal: (updated: WithdrawalRecord) => void;
}

export const WithdrawalsView: React.FC<WithdrawalsViewProps> = ({
  withdrawals,
  onUpdateWithdrawal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = withdrawals.filter((w) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (w.userId && w.userId.toLowerCase().includes(term)) ||
      (w.userName && w.userName.toLowerCase().includes(term)) ||
      w.address.toLowerCase().includes(term) ||
      w.id.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (record: WithdrawalRecord) => {
    const updated: WithdrawalRecord = {
      ...record,
      status: 'Approved',
      txHash: record.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
    onUpdateWithdrawal(updated);
  };

  const handleReject = (record: WithdrawalRecord) => {
    const updated: WithdrawalRecord = {
      ...record,
      status: 'Rejected',
      rejectionReason: 'Invalid BEP20 wallet or suspected multi-account activity.',
    };
    onUpdateWithdrawal(updated);
  };

  const pendingCount = withdrawals.filter((w) => w.status === 'Pending').length;
  const pendingTotal = withdrawals
    .filter((w) => w.status === 'Pending')
    .reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Withdrawal Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and approve USDT payouts to Binance Smart Chain (BEP-20) wallet addresses.
          </p>
        </div>

        {/* Quick Pending Alert Badge */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {pendingCount} Pending ({pendingTotal.toFixed(2)} USDT)
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID, @username, or 0x address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
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

      {/* Withdrawals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">TX ID & Date</th>
                <th className="py-3 px-4">User ID / Handle</th>
                <th className="py-3 px-4">Amount (USDT)</th>
                <th className="py-3 px-4">BEP20 Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approve / Reject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No withdrawal requests matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => {
                  const isPending = w.status === 'Pending';
                  const isApproved = w.status === 'Approved' || w.status === 'Completed';

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-700 text-xs">{w.id}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(w.timestamp).toLocaleDateString()} ·{' '}
                          {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {w.userName || '@hunter_88'}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {w.userId || 'USR-1082'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-extrabold text-sm text-slate-900">
                          {w.amount.toFixed(2)} USDT
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          0.00 Fee (Net: {w.receiveAmount.toFixed(2)})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg max-w-[170px] truncate">
                            {w.address}
                          </span>
                          <button
                            onClick={() => handleCopy(w.address, w.id)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Copy Address"
                          >
                            {copiedId === w.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          Network: {w.network}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3" />}
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {w.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(w)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(w)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-mono">
                            <span>Settled</span>
                            {w.txHash && (
                              <a
                                href={`https://bscscan.com/tx/${w.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#008069] hover:underline flex items-center gap-0.5"
                                title="View on BSCScan"
                              >
                                BSCScan <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
