import {
  UserState,
  WithdrawalRecord,
  TaskItem,
  AppSettings,
  ManagedUser,
} from '../types.ts';

const USER_STATE_KEY = 'reward_box_user_state_v1';
const WITHDRAWALS_KEY = 'reward_box_withdrawals_v1';
const SETTINGS_KEY = 'reward_box_settings_v1';
const USERS_LIST_KEY = 'reward_box_managed_users_v1';
const TASKS_KEY = 'reward_box_tasks_v1';
const ADMIN_AUTH_KEY = 'reward_box_admin_auth_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  minWithdrawal: 0.80, // Requested: Minimum Withdrawal (0.80 USDT)
  referralReward: 0.10, // Requested: Referral Reward (0.10 USDT)
  requiredReferrals: 5, // Requested: Required Referrals (5)
  rewardPerAd: 0.02, // Requested: Reward per ad (0.02 USDT)
  dailyAdLimit: 15, // Requested: Premium Ads Daily Limit
  adsgramBlockId: 'int-55309', // Requested: blockId int-55309
  requiredChannels: [
    {
      id: 'ch_1',
      name: 'Reward Box Announcements',
      username: '@rewardbox_ann',
      link: 'https://t.me/rewardbox_ann',
    },
    {
      id: 'ch_2',
      name: 'Global Community Chat',
      username: '@rewardbox_chat',
      link: 'https://t.me/rewardbox_chat',
    },
    {
      id: 'ch_3',
      name: 'Verified Bounty & Drops',
      username: '@rewardbox_drops',
      link: 'https://t.me/rewardbox_drops',
    },
  ],
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tg_channel',
    title: 'Join Reward Box Announcement',
    category: 'telegram',
    reward: 0.10,
    iconType: 'telegram',
    link: 'https://t.me/rewardbox_ann',
    description: 'Subscribe to our official broadcast channel for daily reward codes and updates.',
    buttonLabel: 'Join Channel',
    verificationDurationSeconds: 4,
    isActive: true,
  },
  {
    id: 'tg_chat',
    title: 'Join Global Community Chat',
    category: 'telegram',
    reward: 0.08,
    iconType: 'telegram',
    link: 'https://t.me/rewardbox_chat',
    description: 'Chat with 120k+ hunters, share tips, and participate in weekend drops.',
    buttonLabel: 'Join Chat',
    verificationDurationSeconds: 4,
    isActive: true,
  },
  {
    id: 'twitter_follow',
    title: 'Follow @RewardBox on X',
    category: 'social',
    reward: 0.05,
    iconType: 'twitter',
    link: 'https://x.com/rewardbox',
    description: 'Follow our official X handle and retweet the pinned campaign post.',
    buttonLabel: 'Follow on X',
    verificationDurationSeconds: 5,
    isActive: true,
  },
  {
    id: 'youtube_sub',
    title: 'Watch & Subscribe on YouTube',
    category: 'social',
    reward: 0.05,
    iconType: 'youtube',
    link: 'https://youtube.com/@rewardbox',
    description: 'Watch the BEP20 withdrawal walkthrough video and subscribe to the channel.',
    buttonLabel: 'Subscribe',
    verificationDurationSeconds: 6,
    isActive: true,
  },
  {
    id: 'tg_boost',
    title: 'Boost Reward Box Channel',
    category: 'telegram',
    reward: 0.15,
    iconType: 'star',
    link: 'https://t.me/boost/rewardbox_ann',
    description: 'Telegram Premium users: give 1 boost to unlock double ad reward multipliers.',
    buttonLabel: 'Boost Channel',
    verificationDurationSeconds: 5,
    isActive: true,
  },
  {
    id: 'daily_ad_sprint',
    title: 'Complete 5 Ads in a Day',
    category: 'daily',
    reward: 0.06,
    iconType: 'fire',
    link: '#ads',
    description: 'Watch 5 verified Adsgram sponsor clips to claim this daily milestone.',
    buttonLabel: 'Go to Ads',
    verificationDurationSeconds: 0,
    isActive: true,
  },
  {
    id: 'partner_binance',
    title: 'Register on Binance Web3',
    category: 'partner',
    reward: 0.25,
    iconType: 'gift',
    link: 'https://binance.com',
    description: 'Create or connect your BEP20 wallet on Binance Web3 partner portal.',
    buttonLabel: 'Explore Partner',
    verificationDurationSeconds: 8,
    isActive: true,
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'tx_req_01',
    userId: 'USR-1082',
    userName: '@hunter_88',
    timestamp: Date.now() - 1000 * 60 * 18, // 18 mins ago
    network: 'BEP20',
    address: '0x71C942e6840742d87e0294b45E0a19a4fF814982',
    amount: 0.46, // Requested: Pending Withdrawals (0.46 USDT example)
    fee: 0.00,
    receiveAmount: 0.46,
    status: 'Pending',
    txHash: '0x3a9f193850dc87e83f2182092cb47185bbd8291048f0e9140b925b302c3182b8',
  },
  {
    id: 'tx_req_02',
    userId: 'USR-1081',
    userName: '@crypto_dan',
    timestamp: Date.now() - 1000 * 60 * 75,
    network: 'BEP20',
    address: '0x892a0142d87e0294b45E0a19a4fF814982bb9001',
    amount: 1.80,
    fee: 0.00,
    receiveAmount: 1.80,
    status: 'Pending',
    txHash: '0x7f9a12bb0921acb47185bbd8291048f0e9140b925b302c3182b83a9f193850dc',
  },
  {
    id: 'tx_demo_01',
    userId: 'USR-1080',
    userName: '@elena_tg',
    timestamp: Date.now() - 86400000 * 2,
    network: 'BEP20',
    address: '0x4E3b02840742d87e0294b45E0a19a4fF81498255',
    amount: 1.50,
    fee: 0.00,
    receiveAmount: 1.50,
    status: 'Approved',
    txHash: '0x3a9f193850dc87e83f2182092cb47185bbd8291048f0e9140b925b302c3182b8',
  },
  {
    id: 'tx_demo_02',
    userId: 'USR-1079',
    userName: '@alex_dex',
    timestamp: Date.now() - 86400000 * 3,
    network: 'BEP20',
    address: '0x99aB02840742d87e0294b45E0a19a4fF81498212',
    amount: 2.10,
    fee: 0.00,
    receiveAmount: 2.10,
    status: 'Approved',
    txHash: '0x99e82cba12489c728a8d147bb4f382a890471b6d1947e30d70f92b7746193e50',
  },
];

export const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'USR-1082',
    username: '@hunter_88',
    name: 'Crypto Hunter',
    balance: 0.46, // Requested initial balance
    referrals: 7,
    joinedDate: '2026-10-18',
    status: 'Active',
    bep20Address: '0x71C942e6840742d87e0294b45E0a19a4fF814982',
  },
  {
    id: 'USR-1081',
    username: '@crypto_dan',
    name: 'Dan R.',
    balance: 1.84,
    referrals: 12,
    joinedDate: '2026-10-16',
    status: 'Active',
    bep20Address: '0x892a0142d87e0294b45E0a19a4fF814982bb9001',
  },
  {
    id: 'USR-1080',
    username: '@elena_tg',
    name: 'Elena Rostova',
    balance: 0.92,
    referrals: 4,
    joinedDate: '2026-10-15',
    status: 'Active',
    bep20Address: '0x4E3b02840742d87e0294b45E0a19a4fF81498255',
  },
  {
    id: 'USR-1079',
    username: '@alex_dex',
    name: 'Alexander V.',
    balance: 3.20,
    referrals: 19,
    joinedDate: '2026-10-14',
    status: 'Active',
    bep20Address: '0x99aB02840742d87e0294b45E0a19a4fF81498212',
  },
  {
    id: 'USR-1078',
    username: '@bot_spammer_9',
    name: 'Auto Script 9',
    balance: 0.00,
    referrals: 0,
    joinedDate: '2026-10-13',
    status: 'Banned',
  },
  {
    id: 'USR-1077',
    username: '@satoshi_fan',
    name: 'Hal Finney Fan',
    balance: 0.64,
    referrals: 8,
    joinedDate: '2026-10-12',
    status: 'Active',
    bep20Address: '0x12Fa90840742d87e0294b45E0a19a4fF81498234',
  },
];

export function getInitialUserState(): UserState {
  let tgUser: { first_name?: string; username?: string; photo_url?: string } | undefined;
  try {
    const tg = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { first_name?: string; username?: string; photo_url?: string } } } } }).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      tgUser = tg.initDataUnsafe.user;
    }
  } catch {
    // fallback
  }

  const defaultName = tgUser?.first_name || 'Crypto Hunter';
  const defaultUsername = tgUser?.username ? `@${tgUser.username}` : '@hunter_88';

return {
  balance: 0,
  totalEarned: 0,
  adsWatchedToday: 0,
  maxDailyAds: 15,
  referralCode: 'RB-98421',
  referredCount: 0,
  referralEarnings: 0,
  dailyStreak: 0,
  lastDailyClaim: null,
  completedTaskIds: [],
    pendingTaskIds: [],
    userProfile: {
      name: defaultName,
      username: defaultUsername,
      avatar: tgUser?.photo_url || '',
      tier: 'VIP Gold',
    },
  };
}

export function loadUserState(): UserState {
  if (typeof window === 'undefined') return getInitialUserState();
  try {
    const data = localStorage.getItem(USER_STATE_KEY);
    if (!data) {
      const initial = getInitialUserState();
      saveUserState(initial);
      return initial;
    }
    const parsed = JSON.parse(data) as UserState;
    if (typeof parsed.balance !== 'number') parsed.balance = 0.46;
    return parsed;
  } catch {
    return getInitialUserState();
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
    // Also sync the active user record in ManagedUsers list
    syncActiveUserInManagedList(state.balance);
  } catch {
    // storage error
  }
}

export function loadWithdrawals(): WithdrawalRecord[] {
  if (typeof window === 'undefined') return INITIAL_WITHDRAWALS;
  try {
    const data = localStorage.getItem(WITHDRAWALS_KEY);
    if (!data) {
      saveWithdrawals(INITIAL_WITHDRAWALS);
      return INITIAL_WITHDRAWALS;
    }
    return JSON.parse(data) as WithdrawalRecord[];
  } catch {
    return INITIAL_WITHDRAWALS;
  }
}

export function saveWithdrawals(withdrawals: WithdrawalRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
  } catch {
    // storage error
  }
}

export function loadAppSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      saveAppSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage error
  }
}

export function loadManagedUsers(): ManagedUser[] {
  if (typeof window === 'undefined') return INITIAL_MANAGED_USERS;
  try {
    const data = localStorage.getItem(USERS_LIST_KEY);
    if (!data) {
      saveManagedUsers(INITIAL_MANAGED_USERS);
      return INITIAL_MANAGED_USERS;
    }
    return JSON.parse(data) as ManagedUser[];
  } catch {
    return INITIAL_MANAGED_USERS;
  }
}

export function saveManagedUsers(users: ManagedUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  } catch {
    // storage error
  }
}

function syncActiveUserInManagedList(balance: number) {
  try {
    const users = loadManagedUsers();
    const updated = users.map((u) => (u.id === 'USR-1082' ? { ...u, balance } : u));
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    return JSON.parse(data) as TaskItem[];
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: TaskItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // storage error
  }
}

export function checkAdminAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuth(isAuth: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (isAuth) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch {
    // storage error
  }
}
