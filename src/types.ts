export type TabType = 'HOME' | 'TASKS' | 'REFER' | 'WITHDRAW';

export interface TelegramUser {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export interface UserState {
  balance: number; // in USDT, starts at 0.46
  totalEarned: number;
  adsWatchedToday: number;
  maxDailyAds: number;
  referralCode: string;
  referredCount: number;
  referralEarnings: number;
  dailyStreak: number;
  lastDailyClaim: string | null; // ISO Date string
  completedTaskIds: string[];
  pendingTaskIds: string[];
  userProfile: {
    name: string;
    username: string;
    avatar: string;
    tier: string;
  };
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'telegram' | 'social' | 'daily' | 'partner';
  reward: number; // USDT
  iconType: 'telegram' | 'twitter' | 'youtube' | 'star' | 'gift' | 'fire';
  link: string;
  description: string;
  buttonLabel: string;
  verificationDurationSeconds?: number;
  isActive?: boolean;
}

export interface WithdrawalRecord {
  id: string;
  userId?: string;
  userName?: string;
  timestamp: number;
  network: 'BEP20' | 'TON' | 'TRC20';
  address: string;
  amount: number;
  fee: number;
  receiveAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Processing';
  txHash: string;
  rejectionReason?: string;
}

export interface DailyRewardDay {
  day: number;
  reward: number; // USDT
  claimed: boolean;
  isCurrent: boolean;
  isMystery?: boolean;
}

// Admin Models
export interface ManagedUser {
  id: string;
  username: string;
  name: string;
  balance: number;
  referrals: number;
  joinedDate: string;
  status: 'Active' | 'Banned';
  bep20Address?: string;
}

export interface RequiredChannel {
  id: string;
  name: string;
  username: string;
  link: string;
}

export interface AppSettings {
  minWithdrawal: number; // 0.80 USDT
  referralReward: number; // 0.10 USDT
  requiredReferrals: number; // 5
  rewardPerAd: number; // 0.02 USDT
  dailyAdLimit: number; // 15
  adsgramBlockId: string; // int-55309
  requiredChannels: RequiredChannel[];
}
