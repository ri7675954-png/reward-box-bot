import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ClipboardPaste,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { UserState, WithdrawalRecord, AppSettings } from '../types.ts';
import { soundService } from '../services/sound.ts';
import confetti from 'canvas-confetti';

interface WithdrawTabProps {
  userState: UserState;
  withdrawals: WithdrawalRecord[];
  settings?: AppSettings;
  onWithdraw: (withdrawal: WithdrawalRecord) => void;
  onNavigateTab: (tab: 'HOME' | 'TASKS') => void;
}

export const WithdrawTab: React.FC<WithdrawTabProps> = ({
  userState,
  withdrawals,
  settings,
  onWithdraw,
  onNavigateTab,
}) => {
  const [network, setNetwork] = useState<'BEP20' | 'TON' | 'TRC20'>('BEP20');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MIN_WITHDRAW = settings?.minWithdrawal || 0.80;
  const numAmount = parseFloat(amount) || 0;
  const fee = 0.00; // Zero fee promotion
  const receiveAmount = Math.max(0, numAmount - fee);

  const handlePasteAddress = async () => {
    soundService.playClick();
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setAddress(text.trim());
          setErrorMsg(null);
        }
      } else {
        // Fallback demo address
        setAddress('0x71C942e6840742d87e0294b45E0a19a4fF814982');
      }
    } catch {
      // Permission denied or not supported in iframe sandbox, provide sample
      setAddress('0x71C942e6840742d87e0294b45E0a19a4fF814982');
    }
  };

  const handleSetMax = () => {
    soundService.playClick();
    setAmount(userState.balance.toFixed(2));
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setErrorMsg('Please enter your BEP-20 USDT wallet address.');
      soundService.triggerHaptic('heavy');
      return;
    }

    if (network === 'BEP20') {
      if (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
        setErrorMsg('Invalid BEP-20 address. It must start with "0x" and be exactly 42 characters.');
        soundService.triggerHaptic('heavy');
        return;
      }
    }

    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      soundService.triggerHaptic('heavy');
      return;
    }

    if (numAmount < MIN_WITHDRAW) {
      setErrorMsg(`Minimum withdrawal amount is ${MIN_WITHDRAW.toFixed(2)} USDT.`);
      soundService.triggerHaptic('heavy');
      return;
    }

    if (numAmount > userState.balance) {
      setErrorMsg(`Insufficient balance. You currently have ${userState.balance.toFixed(2)} USDT.`);
      soundService.triggerHaptic('heavy');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRecord: WithdrawalRecord = {
        id: `tx_${Date.now()}`,
        timestamp: Date.now(),
        network: network,
        address: `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`,
        amount: numAmount,
        fee: fee,
        receiveAmount: receiveAmount,
        status: 'Processing',
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      };

      onWithdraw(newRecord);
      setIsSubmitting(false);
      setSuccessMsg(`Withdrawal of ${numAmount.toFixed(2)} USDT submitted to BEP-20 address!`);
      soundService.playSuccess();
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#008069', '#10b981', '#fbbf24'],
      });

      setAmount('');
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* 1. BALANCE OVERVIEW */}
      <div className="card-3d p-4 bg-gradient-to-br from-[#008069] to-[#005c4b] text-white">
        <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Wallet className="w-4 h-4" />
            Withdrawable Balance
          </span>
          <span className="bg-emerald-950/40 border border-emerald-300/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
            BEP-20 (BSC)
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold tabular-nums font-mono">
            {userState.balance.toFixed(2)}
          </span>
          <span className="text-lg font-bold text-emerald-200">USDT</span>
        </div>

        <div className="flex items-center justify-between text-xs text-emerald-100/80 pt-2 border-t border-white/10 mt-2">
          <span>Minimum Payout: <strong>{MIN_WITHDRAW.toFixed(2)} USDT</strong></span>
          {userState.balance < MIN_WITHDRAW && (
            <button
              onClick={() => onNavigateTab('HOME')}
              className="text-amber-300 underline font-semibold text-[11px]"
            >
              Earn +{(MIN_WITHDRAW - userState.balance).toFixed(2)} to Unlock
            </button>
          )}
        </div>
      </div>

      {/* 2. WITHDRAWAL FORM */}
      <div className="card-3d p-4 bg-white">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
          <ArrowUpRight className="w-4 h-4 text-[#008069]" />
          <span>Request USDT Payout</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Network Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Blockchain Network
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'BEP20', label: 'BEP-20 (BSC)', recommended: true },
                { key: 'TON', label: 'TON Network', recommended: false },
                { key: 'TRC20', label: 'TRC-20 (TRON)', recommended: false },
              ].map((net) => (
                <button
                  key={net.key}
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setNetwork(net.key as typeof network);
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                    network === net.key
                      ? 'bg-emerald-50 border-[#008069] text-[#008069] ring-1 ring-[#008069]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate">{net.label}</div>
                  {net.recommended && (
                    <span className="text-[9px] text-[#008069] block font-bold">Fast & Low Fee</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Address Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                BEP-20 USDT Wallet Address
              </label>
              <button
                type="button"
                onClick={handlePasteAddress}
                className="text-xs text-[#008069] hover:underline flex items-center gap-1 font-semibold"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="0x... (e.g. Trust Wallet, Binance, MetaMask)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Supports Binance Smart Chain (BEP20) USDT addresses.
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Withdrawal Amount (USDT)
              </label>
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs text-[#008069] hover:underline font-bold"
              >
                Max ({userState.balance.toFixed(2)})
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069] pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                USDT
              </span>
            </div>
          </div>

          {/* Fee & Calculation Summary */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Network Gas Fee</span>
              <span className="font-mono text-emerald-600 font-bold">0.00 USDT (Promo Free)</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200/60">
              <span>You Will Receive</span>
              <span className="font-mono text-[#008069]">
                {receiveAmount.toFixed(2)} USDT
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#008069]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-3d-green py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing BEP-20 Transaction...</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirm Withdrawal</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 3. WITHDRAWAL HISTORY */}
      <div className="card-3d p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#008069]" />
            <span>Withdrawal History</span>
          </h3>
          <span className="text-[11px] text-slate-400">{withdrawals.length} Total</span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No withdrawal records yet.
          </div>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((record) => (
              <div
                key={record.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-slate-900 font-mono">
                      {record.amount.toFixed(2)} USDT
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      {record.network}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    To: {record.address}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      record.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : record.status === 'Processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {record.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
