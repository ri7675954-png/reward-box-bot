import React, { useState, useEffect } from 'react';
import { X, Play, Sparkles, ShieldCheck, CheckCircle2, Volume2, Award } from 'lucide-react';
import { soundService } from '../services/sound.ts';
import confetti from 'canvas-confetti';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onReward }) => {
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [canClaim, setCanClaim] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      setCanClaim(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClaim(true);
          soundService.playSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    soundService.playCoin();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#008069', '#10b981', '#fbbf24', '#ffffff'],
    });
    onReward();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-3d bg-white w-full max-w-sm overflow-hidden shadow-2xl border-2 border-[#008069]/30 relative flex flex-col">
        {/* Top Header */}
        <div className="bg-[#008069] text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Adsgram Verified Sponsor</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono text-emerald-200">
              int-55309
            </span>
          </div>

          {canClaim ? (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-[11px] font-mono font-bold bg-black/30 px-2 py-0.5 rounded-full text-amber-300">
              Reward in {timeLeft}s
            </div>
          )}
        </div>

        {/* Video simulation canvas */}
        <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
          <img
            src="/src/assets/images/premium_ads_banner_1792597389459.jpg"
            alt="Sponsor clip"
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />

          {/* Playing overlay animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-white text-[11px]">
              <span className="flex items-center gap-1 font-semibold">
                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Web3 Gaming Partner
              </span>
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
            </div>

            <div className="text-center">
              <span className="text-xs font-extrabold text-amber-300 drop-shadow-md">
                Play & Earn USDT Rewards
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#008069] text-xs font-bold border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            <span>Reward: +0.02 USDT (BEP-20)</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Thank you for supporting Reward Box sponsors! Your view has been logged with blockId{' '}
            <strong className="text-slate-800 font-mono">int-55309</strong>.
          </p>

          {canClaim ? (
            <button
              onClick={handleClaim}
              className="w-full btn-3d-green py-3 text-sm flex items-center justify-center gap-2 shadow-lg animate-bounce"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Claim +0.02 USDT</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 text-sm rounded-2xl bg-slate-100 text-slate-400 font-bold border border-slate-200 cursor-not-allowed"
            >
              Wait {timeLeft}s to Verify...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
