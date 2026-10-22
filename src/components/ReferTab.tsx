import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Gift,
  Coins,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { UserState } from '../types.ts';
import { soundService } from '../services/sound.ts';
import confetti from 'canvas-confetti';

interface ReferTabProps {
  userState: UserState;
  onSimulateInviteBonus?: () => void;
}

export const ReferTab: React.FC<ReferTabProps> = ({ userState }) => {
  const [copied, setCopied] = useState(false);

  const botUsername = 'RewardBoxOfficialBot';
  const referralLink = `https://t.me/${botUsername}?start=${userState.referralCode}`;
  const shareText = encodeURIComponent(
    `🎁 Join Reward Box Mini App! Earn free BEP-20 USDT by watching premium Adsgram ads and completing tasks. Withdraw directly to your wallet! \n👉 ${referralLink}`
  );
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    referralLink
  )}&text=${shareText}`;

  const handleCopyLink = () => {
    soundService.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
    }
    setCopied(true);
    soundService.triggerHaptic('medium');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    soundService.playClick();
    soundService.triggerHaptic('heavy');
    window.open(telegramShareUrl, '_blank');
  };

  const mockInvitedFriends = [
    { username: '@crypto_dan', date: 'Yesterday', earned: '0.10 USDT', status: 'Active' },
    { username: '@elena_tg', date: '2 days ago', earned: '0.10 USDT', status: 'Active' },
    { username: '@mark_bep', date: '4 days ago', earned: '0.10 USDT', status: 'Active' },
    { username: '@satoshi_fan', date: '5 days ago', earned: '0.10 USDT', status: 'Active' },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* 1. HERO REFERRAL CARD */}
      <div className="card-3d p-5 bg-gradient-to-br from-white via-emerald-50/40 to-[#e4f5f0] border border-emerald-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-emerald-200 shrink-0 bg-white">
            <img
              src="/src/assets/images/reward_box_logo_1792597389387.jpg"
              alt="Reward Box Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008069]">
              Affiliate Program
            </span>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              Invite & Earn USDT
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Get <span className="font-bold text-[#008069]">0.10 USDT</span> per friend +{' '}
              <span className="font-bold text-[#008069]">10%</span> lifetime ad commissions!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-emerald-200/60">
          <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5 text-[#008069]" />
              <span>Friends Invited</span>
            </div>
            <span className="text-xl font-black text-slate-900 font-mono">
              {userState.referredCount}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Referral Earnings</span>
            </div>
            <span className="text-xl font-black text-[#008069] font-mono">
              {userState.referralEarnings.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* 2. REFERRAL LINK & SHARE BUTTONS */}
      <div className="card-3d p-4 bg-white">
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Your Exclusive Invite Link
        </label>

        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 mb-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="bg-transparent text-xs text-slate-700 font-mono flex-1 outline-none truncate select-all"
          />
          <button
            onClick={handleCopyLink}
            className="btn-3d-secondary py-1.5 px-3 text-xs flex items-center gap-1 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Telegram Direct Share Button */}
        <button
          onClick={handleShareTelegram}
          className="w-full btn-3d-green py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Link in Telegram</span>
        </button>
      </div>

      {/* 3. HOW IT WORKS */}
      <div className="card-3d p-4 bg-white">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[#008069]" />
          <span>How Referral Rewards Work</span>
        </h3>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Share your personal invite link',
              desc: 'Send to Telegram chats, crypto channels, or friends.',
            },
            {
              step: '2',
              title: 'Friend opens app & verifies first ad',
              desc: 'Both of you instantly receive welcome bonus credit.',
            },
            {
              step: '3',
              title: 'Earn 10% commission on every ad',
              desc: 'Continuous passive USDT credited to your balance forever.',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#008069] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECENT INVITED FRIENDS LIST */}
      <div className="card-3d p-4 bg-white">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-sm text-slate-900">Recent Referrals</h3>
          <span className="text-[11px] font-semibold text-slate-400">
            {userState.referredCount} Total
          </span>
        </div>

        <div className="space-y-2">
          {mockInvitedFriends.map((friend, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600/10 text-[#008069] flex items-center justify-center font-bold text-xs">
                  {friend.username[1].toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">
                    {friend.username}
                  </span>
                  <span className="text-[10px] text-slate-400">{friend.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#008069] font-mono text-xs block">
                  +{friend.earned}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {friend.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
