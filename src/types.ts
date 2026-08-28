export type MoodType = 'sleepy' | 'happy' | 'playful' | 'gentle' | 'off_day';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
  bgLight: string;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  category: 'play' | 'walk' | 'training' | 'cuddle' | 'explore';
  duration: string;
  description: string;
  benefit: string;
  iconName: string;
}

export interface BondingChallenge {
  id: string;
  title: string;
  prompt: string;
  rewardPoints: number;
  completed: boolean;
}

export interface DailyEntry {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  petId: string;
  photoUrl?: string;
  caption: string;
  mood: MoodType;
  activityDone?: string;
  challengeCompleted?: boolean;
  bondingNote?: string;
  tags?: string[];
  createdAt: string;
}

export interface FavoriteThing {
  id: string;
  category: string;
  value: string;
  emoji: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  birthday: string; // YYYY-MM-DD
  adoptionDate: string; // YYYY-MM-DD
  photoUrl: string;
  favoriteToy: string;
  favoriteTreat: string;
  personalityQuirks: string[];
  favoriteActivity: string;
  favoriteThings?: FavoriteThing[];
  gender?: 'male' | 'female' | 'other';
  weight?: string;
  microchipId?: string;
  bio?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  total: number;
}

export type NudgeStyle = 'cuddle' | 'streak' | 'playful';

export interface UserSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  reminderStyle?: NudgeStyle;
  browserPermission?: 'granted' | 'default' | 'denied';
  notificationSound?: boolean;
  theme: 'honey' | 'sage' | 'peach' | 'lavender';
  isPro: boolean;
  hapticsEnabled: boolean;
}

export type TabType = 'home' | 'timeline' | 'stats' | 'profile' | 'settings';
