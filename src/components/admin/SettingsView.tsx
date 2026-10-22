import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Radio,
  Sliders,
  DollarSign,
  Users,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AppSettings, RequiredChannel } from '../../types.ts';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal.toString());
  const [referralReward, setReferralReward] = useState(settings.referralReward.toString());
  const [requiredReferrals, setRequiredReferrals] = useState(settings.requiredReferrals.toString());
  const [channels, setChannels] = useState<RequiredChannel[]>(settings.requiredChannels || []);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUsername, setNewChannelUsername] = useState('');
  const [newChannelLink, setNewChannelLink] = useState('');
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      minWithdrawal: parseFloat(minWithdrawal) || 0.80,
      referralReward: parseFloat(referralReward) || 0.10,
      requiredReferrals: parseInt(requiredReferrals, 10) || 5,
      requiredChannels: channels,
    };

    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChan: RequiredChannel = {
      id: `ch_${Date.now()}`,
      name: newChannelName.trim(),
      username: newChannelUsername.trim().startsWith('@')
        ? newChannelUsername.trim()
        : `@${newChannelUsername.trim()}`,
      link: newChannelLink.trim() || `https://t.me/${newChannelUsername.replace('@', '')}`,
    };

    setChannels([...channels, newChan]);
    setNewChannelName('');
    setNewChannelUsername('');
    setNewChannelLink('');
    setShowAddChannel(false);
  };

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure bot payout rules, referral bounty parameters, and mandatory channel verifications.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="btn-3d-green py-2 px-4 text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration successfully updated and synced with Telegram Mini App!</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. FINANCIAL & REWARDS CONFIGURATION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008069] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Financial & Payout Parameters</h2>
              <p className="text-xs text-slate-500">Thresholds enforced across Mini App and BEP20 payouts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            {/* Minimum Withdrawal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#008069]" />
                <span>Minimum Withdrawal (USDT)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0.10"
                  required
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(e.target.value)}
                  placeholder="0.80"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  USDT
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Configured: <strong>0.80 USDT</strong>
              </span>
            </div>

            {/* Referral Reward */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Referral Reward Bounty (USDT)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={referralReward}
                  onChange={(e) => setReferralReward(e.target.value)}
                  placeholder="0.10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  USDT
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Configured: <strong>0.10 USDT</strong> per friend
              </span>
            </div>

            {/* Required Referrals */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Required Referrals for Payout</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                required
                value={requiredReferrals}
                onChange={(e) => setRequiredReferrals(e.target.value)}
                placeholder="5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#008069] focus:ring-1 focus:ring-[#008069]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Configured: <strong>5 Referrals</strong> required
              </span>
            </div>
          </div>
        </div>

        {/* 2. REQUIRED CHANNELS LIST */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Required Telegram Channels</h2>
                <p className="text-xs text-slate-500">
                  Users must subscribe to these broadcast feeds before unlocking withdrawals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddChannel(!showAddChannel)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Channel</span>
            </button>
          </div>

          {/* Add Channel Inline Form */}
          {showAddChannel && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Add New Mandatory Channel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Channel Name (e.g. VIP Drops)"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#008069]"
                />
                <input
                  type="text"
                  placeholder="Username (@rewardbox_vip)"
                  value={newChannelUsername}
                  onChange={(e) => setNewChannelUsername(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#008069]"
                />
                <input
                  type="text"
                  placeholder="Invite Link (https://t.me/...)"
                  value={newChannelLink}
                  onChange={(e) => setNewChannelLink(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#008069]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChannel(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddChannel}
                  className="px-3.5 py-1.5 rounded-xl bg-[#008069] text-white text-xs font-bold shadow-sm"
                >
                  Confirm Channel
                </button>
              </div>
            </div>
          )}

          {/* Channels List */}
          <div className="space-y-2">
            {channels.map((chan) => (
              <div
                key={chan.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#008069] flex items-center justify-center font-bold text-xs">
                    {chan.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{chan.name}</div>
                    <div className="font-mono text-[11px] text-[#008069]">{chan.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={chan.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemoveChannel(chan.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    title="Remove Channel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#008069] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#008069]/20"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
