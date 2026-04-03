export type Plan = 'FREE' | 'PRO' | 'PRO_MAX';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  plan: Plan;
  balance: number;
  referralCode: string;
  referredBy?: string;
  streak: number;
  lastActive: string;
  videosCountToday: number;
  totalEarnings: number;
  role?: 'admin' | 'user';
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  description: string;
  hashtags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  type: 'VIRAL' | 'SALES';
  createdAt: any;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'REFERRAL' | 'VIDEO_BONUS' | 'STREAK_BONUS';
  description: string;
  createdAt: any;
}

export interface Referral {
  referrerId: string;
  refereeId: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: any;
}

export interface Trend {
  id: string;
  title: string;
  format: string;
  product?: string;
  platform: 'TikTok' | 'Kwai' | 'YouTube Shorts';
}
