import React, { useState } from 'react';
import {
  Wallet,
  Play,
  ArrowUpRight,
  UserPlus,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { UserState, AppSettings } from '../types.ts';
import { adsgramService, ADSGRAM_BLOCK_ID } from '../services/adsgram.ts';
import { soundService } from '../services/sound.ts';
import confetti from 'canvas-confetti';

interface HomeTabProps {
  userState: UserState;
  settings?: AppSettings;
  onUpdateBalance: (amount: number, reason: string) => void;
  onNavigateTab: (tab: 'TASKS' | 'REFER' | 'WITHDRAW') => void;
  onOpenAdModal: () => void;
  onOpenAdmin?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userState,
  settings,
  onUpdateBalance,
  onNavigateTab,
  onOpenAdModal,
  onOpenAdmin,
}) => {
  const currentBlockId = settings?.adsgramBlockId || ADSGRAM_BLOCK_ID;
  const currentRewardPerAd = settings?.rewardPerAd || 0.02;
  const currentDailyLimit = settings?.dailyAdLimit || userState.maxDailyAds || 15;
  const currentMinWithdrawal = settings?.minWithdrawal || 0.80;
  const [isVerifyingAd, setIsVerifyingAd] = useState(false);
  const [adFeedback, setAdFeedback] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Daily Streak list
  const streakDays = [
    { day: 1, amount: 0.01, label: 'Day 1' },
    { day: 2, amount: 0.015, label: 'Day 2' },
    { day: 3, amount: 0.02, label: 'Day 3' },
    { day: 4, amount: 0.025, label: 'Day 4' },
    { day: 5, amount: 0.03, label: 'Day 5' },
    { day: 6, amount: 0.04, label: 'Day 6' },
    { day: 7, amount: 0.10, label: 'Day 7 🎁' },
  ];

  const handleClaimDailyStreak = (dayIndex: number) => {
    const day = streakDays[dayIndex];
    soundService.playSuccess();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#008069', '#10b981', '#fbbf24', '#ffffff'],
    });
    onUpdateBalance(day.amount, `Daily streak day ${dayIndex + 1} reward`);
  };

  const handleStartAdsgramAd = async () => {
    soundService.playClick();
    setIsVerifyingAd(true);
    setAdFeedback({
      message: `Initializing Adsgram SDK (blockId: ${currentBlockId})...`,
      type: 'info',
    });

    try {
      const result = await adsgramService.showAd(currentBlockId);

      if (result.success) {
        soundService.playSuccess();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#008069', '#34d399', '#f59e0b'],
        });
        onUpdateBalance(currentRewardPerAd, `Premium Ad view (blockId: ${currentBlockId})`);
        setAdFeedback({
          message: `Success! +${currentRewardPerAd.toFixed(2)} USDT reward added to your balance.`,
          type: 'success',
        });
      } else {
        // Fallback gracefully so testing in browser sandbox is 100% possible
        setAdFeedback({
          message: `${result.message} Opening interactive ad player...`,
          type: 'info',
        });
        setTimeout(() => {
          onOpenAdModal();
        }, 600);
      }
    } catch {
      onOpenAdModal();
    } finally {
      setIsVerifyingAd(false);
      setTimeout(() => {
        setAdFeedback(null);
      }, 5000);
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* 1. MAIN BALANCE CARD */}
      <div className="card-3d p-5 relative overflow-hidden bg-gradient-to-br from-white via-[#f7fbf9] to-[#e6f4f1]">
        {/* Decorative corner accent */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#008069]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#008069] uppercase tracking-wider">
            <Wallet className="w-3.5 h-3.5" />
            <span>Available Balance</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
            BEP-20 Network
          </span>
        </div>

        {/* Big Balance Number */}
        <div className="flex items-baseline gap-2 my-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums font-mono">
            {userState.balance.toFixed(2)}
          </span>
          <span className="text-xl font-bold text-[#008069]">USDT</span>
        </div>

        {/* Balance Subtext & Minimum note */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-1 border-t border-slate-200/60">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Total Earned: <strong className="text-slate-700 font-mono">{userState.totalEarned.toFixed(2)} USDT</strong>
          </span>
          <span className="text-[11px] text-slate-400">Min. withdraw: {currentMinWithdrawal.toFixed(2)} USDT</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              soundService.playClick();
              onNavigateTab('WITHDRAW');
            }}
            className="btn-3d-green py-2.5 px-3 flex items-center justify-center gap-2 text-xs"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onNavigateTab('REFER');
            }}
            className="btn-3d-secondary py-2.5 px-3 flex items-center justify-center gap-2 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Friends</span>
          </button>
        </div>
      </div>

      {/* 2. PREMIUM ADS CARD (ADSGRAM SDK) */}
      <div className="card-3d p-4 relative overflow-hidden border-2 border-[#008069]/20 bg-white">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#008069] to-[#00a88b] flex items-center justify-center text-white shadow-md shadow-[#008069]/30">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                Premium Ads
              </h3>
              <p className="text-[11px] text-slate-500">
                Adsgram Official Partner · <span className="font-mono text-[#008069] font-semibold">{currentBlockId}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-bold font-mono">
              +{currentRewardPerAd.toFixed(2)} USDT
            </span>
          </div>
        </div>

        {/* Banner image or preview graphic */}
        <div className="relative rounded-2xl overflow-hidden mb-3.5 h-32 bg-slate-900 group">
          <img
            src="/src/assets/images/premium_ads_banner_1792597389459.jpg"
            alt="Adsgram Premium Sponsor"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-3">
            <div className="flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Rewarded Ads
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                {userState.adsWatchedToday} / {currentDailyLimit} Today
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar for daily quota */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Daily Ad Quota</span>
            <span className="font-semibold text-[#008069]">
              {Math.max(0, currentDailyLimit - userState.adsWatchedToday)} remaining
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-[#008069] to-[#00b08b] rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (userState.adsWatchedToday / currentDailyLimit) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Feedback message banner if present */}
        {adFeedback && (
          <div
            className={`mb-3 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              adFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : adFeedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#008069]" />
            <span>{adFeedback.message}</span>
          </div>
        )}

        {/* Primary Action Button: "Verify to Start" */}
        <div className="space-y-2">
          <button
            onClick={handleStartAdsgramAd}
            disabled={isVerifyingAd}
            className="w-full btn-3d-green py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#008069]/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifyingAd ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading Adsgram SDK...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Verify to Start</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Instant BEP20 USDT reward
            </span>
            <button
              onClick={() => {
                soundService.playClick();
                onOpenAdModal();
              }}
              className="text-[#008069] hover:underline flex items-center gap-0.5 font-medium"
            >
              Test Preview <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. DAILY REWARDS STREAK */}
      <div className="card-3d p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Daily Check-In</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Streak: {userState.dailyStreak} Days
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Claim free USDT daily. Do not break your streak!
            </p>
          </div>
        </div>

        {/* 7-Day Horizontal Scroll/Grid */}
        <div className="grid grid-cols-7 gap-1.5 py-1">
          {streakDays.map((item, idx) => {
            const isClaimed = idx < userState.dailyStreak;
            const isToday = idx === userState.dailyStreak;

            return (
              <div
                key={item.day}
                onClick={() => {
                  if (isToday) handleClaimDailyStreak(idx);
                }}
                className={`flex flex-col items-center justify-between p-1.5 rounded-xl text-center border transition-all ${
                  isClaimed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : isToday
                    ? 'bg-white border-[#008069] shadow-md shadow-[#008069]/20 cursor-pointer animate-pulse ring-2 ring-[#008069]/20'
                    : 'bg-slate-50 border-slate-200/60 text-slate-400'
                }`}
              >
                <span className="text-[9px] font-semibold block">{item.label}</span>
                <div className="my-1">
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#008069] mx-auto" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold block text-slate-700">
                      +{item.amount}
                    </span>
                  )}
                </div>
                <span className="text-[8px] uppercase tracking-tighter text-slate-400">
                  {isClaimed ? 'Done' : isToday ? 'Claim' : 'Lock'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. LIVE COMMUNITY PAYOUT TICKER */}
      <div className="card-3d p-3.5 bg-white">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span className="flex items-center gap-1.5 text-[#008069]">
            <Clock className="w-3.5 h-3.5" />
            Live BEP20 Payouts
          </span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
            Auto-Processed
          </span>
        </div>

        <div className="space-y-2">
          {[
            { user: '@alex_dex', amount: '2.40 USDT', time: '1m ago', hash: '0x8f...39b1' },
            { user: '@tony_ton', amount: '1.20 USDT', time: '4m ago', hash: '0x1c...a89f' },
            { user: '@fatima_k', amount: '5.00 USDT', time: '9m ago', hash: '0x4e...721d' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#008069] flex items-center justify-center font-bold text-[10px]">
                  {item.user[1]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <span className="font-semibold text-slate-800 text-xs block">{item.user}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.hash}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#008069] font-mono text-xs block">
                  +{item.amount}
                </span>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
