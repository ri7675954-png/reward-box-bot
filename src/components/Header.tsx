import { Volume2, VolumeX, ShieldCheck, Flame, Sliders } from 'lucide-react';
import { UserState } from '../types.ts';
import { soundService } from '../services/sound.ts';

interface HeaderProps {
  userState: UserState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  soundEnabled,
  onToggleSound,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#008069] text-white px-4 pt-3 pb-3 shadow-md">
      <div className="flex items-center justify-between gap-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-sm text-white overflow-hidden shadow-inner">
              {userState.userProfile.avatar ? (
                <img
                  src={userState.userProfile.avatar}
                  alt={userState.userProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userState.userProfile.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#008069] rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm leading-tight text-white truncate max-w-[140px]">
                {userState.userProfile.name}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/30 text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="w-2.5 h-2.5" />
                VIP 1
              </span>
            </div>
            <div className="text-[11px] text-emerald-100/80 truncate">
              {userState.userProfile.username}
            </div>
          </div>
        </div>

        {/* Right side stats & controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Daily Streak */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/20 text-amber-300 text-xs font-bold border border-white/10 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{userState.dailyStreak}d</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundService.playClick();
            }}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-transform text-white border border-white/20"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-100" />
            ) : (
              <VolumeX className="w-4 h-4 text-emerald-200/60" />
            )}
          </button>

          {/* Admin Panel Link */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                soundService.playClick();
                onOpenAdmin();
              }}
              className="px-2 py-1 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 active:scale-95 flex items-center gap-1 text-[11px] font-bold text-emerald-200 border border-white/20 shadow-inner transition-transform"
              title="Open Admin Panel"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-300" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
