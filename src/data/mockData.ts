import { Pet, DailyEntry, Activity, BondingChallenge, AchievementBadge, MoodOption, UserSettings } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'sleepy',
    emoji: '😴',
    label: 'Sleepy & Cozy',
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    description: 'Snoozing in sunbeams, cuddly, low-key day'
  },
  {
    id: 'happy',
    emoji: '😊',
    label: 'Content & Sweet',
    color: '#10B981',
    bgLight: '#ECFDF5',
    description: 'Gentle tail wags, peaceful smiles, happily relaxed'
  },
  {
    id: 'playful',
    emoji: '🤩',
    label: 'Full Zoomies!',
    color: '#F59E0B',
    bgLight: '#FFFBEB',
    description: 'Bouncing around, squeaking toys, unstoppable joy'
  },
  {
    id: 'gentle',
    emoji: '😟',
    label: 'Gentle / Needy',
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    description: 'Wanted extra chin scratches and quiet lap cuddles'
  },
  {
    id: 'off_day',
    emoji: '🍂',
    label: 'Off Day / Quiet',
    color: '#6B7280',
    bgLight: '#F3F4F6',
    description: 'Just taking things slow, resting softly today'
  }
];

export const INITIAL_PET: Pet = {
  id: 'pet_max_1',
  name: 'Max',
  species: 'dog',
  breed: 'Golden Retriever',
  birthday: '2022-04-12',
  adoptionDate: '2022-06-20',
  photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  favoriteToy: 'Yellow Squeaky Tennis Ball',
  favoriteTreat: 'Peanut Butter Spoonfuls',
  personalityQuirks: [
    'Always holds a shoe when saying hello',
    'Chases his own tail when excited for dinner',
    'Demands belly rubs before breakfast',
    'Head tilts at doorbell chimes'
  ],
  favoriteActivity: 'River splashing & sunset walks',
  favoriteThings: [
    {
      id: 'fav_1',
      category: 'Favorite Toy',
      value: 'Yellow Squeaky Tennis Ball',
      emoji: '🎾'
    },
    {
      id: 'fav_2',
      category: 'Favorite Treat',
      value: 'Peanut Butter Spoonfuls',
      emoji: '🥜'
    },
    {
      id: 'fav_3',
      category: 'Favorite Nap Spot',
      value: 'Sunny rug near the living room bay window',
      emoji: '☀️'
    },
    {
      id: 'fav_4',
      category: 'Favorite Walk Spot',
      value: 'Pine River Trail & splash zone',
      emoji: '🌲'
    },
    {
      id: 'fav_5',
      category: 'Comfort Item',
      value: 'Old blue fleece blanket',
      emoji: '🧸'
    }
  ]
};

export const INITIAL_PETS: Pet[] = [
  INITIAL_PET,
  {
    id: 'pet_luna_2',
    name: 'Luna',
    species: 'cat',
    breed: 'Calico Shorthair',
    birthday: '2023-03-15',
    adoptionDate: '2023-05-10',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    favoriteToy: 'Feather Wand & Laser Pointer',
    favoriteTreat: 'Salmon Flakes & Catnip Bites',
    personalityQuirks: [
      'Chirps softly at birds through the screen door',
      'Makes biscuits on the fluffiest blanket',
      'Sleeps curled inside sunbeam circles',
      'Slow blinks to say "I love you"'
    ],
    favoriteActivity: 'Sunbeam snoozing & feather stalking',
    favoriteThings: [
      {
        id: 'fav_luna_1',
        category: 'Favorite Toy',
        value: 'Feather Wand on String',
        emoji: '🪶'
      },
      {
        id: 'fav_luna_2',
        category: 'Favorite Treat',
        value: 'Freeze-Dried Salmon Treats',
        emoji: '🐟'
      },
      {
        id: 'fav_luna_3',
        category: 'Favorite Nap Spot',
        value: 'High velvet cat tree perch',
        emoji: '🛋️'
      }
    ]
  }
];

export const ACTIVITIES_POOL: Activity[] = [
  {
    id: 'act_1',
    title: 'The Scent Mystery Game',
    category: 'explore',
    duration: '2 min',
    description: 'Hide 3 small treats under plastic cups or folded towels and let Max sniff them out with that brilliant golden snoot.',
    benefit: 'Calms the mind & triggers happy foraging instincts',
    iconName: 'Sparkles'
  },
  {
    id: 'act_2',
    title: 'Golden Sunset Cuddle Session',
    category: 'cuddle',
    duration: '3 min',
    description: 'Put your phone away, sit together on the rug, and do slow long-stroke ear massages from base to tip.',
    benefit: 'Lowers cortisol for both pet and owner instantly',
    iconName: 'Heart'
  },
  {
    id: 'act_3',
    title: 'Gentle "Paw Shake & High Five"',
    category: 'training',
    duration: '2 min',
    description: 'Practice alternating left paw and right paw with generous praise and happy verbal cheer.',
    benefit: 'Builds mutual trust & mental focus',
    iconName: 'Award'
  },
  {
    id: 'act_4',
    title: 'Hide-and-Seek Behind the Door',
    category: 'play',
    duration: '3 min',
    description: 'Tell Max to "Wait", sneak into the hallway corner, and softly call his name until he finds you with joyful tail wags!',
    benefit: 'Deepens recall response through joyful play',
    iconName: 'Smile'
  },
  {
    id: 'act_5',
    title: 'Texture Exploration Stroll',
    category: 'walk',
    duration: '5 min',
    description: 'Take a relaxed sniffing stroll letting Max stop and thoroughly inspect 5 new outdoor scents at his own pace.',
    benefit: 'A "sniffari" provides rich sensory enrichment',
    iconName: 'Compass'
  },
  {
    id: 'act_6',
    title: 'The Mirror Goofiness Check',
    category: 'play',
    duration: '1 min',
    description: 'Stand in front of a mirror together and tell Max 3 reasons why he is the goodest boy in the universe.',
    benefit: 'Pure emotional warmth and bonding reassurance',
    iconName: 'Sun'
  }
];

export const BONDING_CHALLENGES: BondingChallenge[] = [
  {
    id: 'ch_1',
    title: 'Belly Rub Special',
    prompt: 'Give 3 dedicated belly rubs today with zero multitasking.',
    rewardPoints: 15,
    completed: false
  },
  {
    id: 'ch_2',
    title: 'Eye Contact & Soft Whisper',
    prompt: 'Hold 10 seconds of soft eye contact while gently petting his favorite spot behind the ears.',
    rewardPoints: 20,
    completed: false
  },
  {
    id: 'ch_3',
    title: 'Secret Word Celebration',
    prompt: 'Use your pet\'s favorite happy word ("Treat? Walk?") and capture that adorable head tilt moment.',
    rewardPoints: 15,
    completed: false
  },
  {
    id: 'ch_4',
    title: 'Nap Together Time',
    prompt: 'Take a 10-minute cozy couch breather resting next to your pet.',
    rewardPoints: 25,
    completed: false
  }
];

export const INITIAL_TIMELINE_ENTRIES: DailyEntry[] = [
  {
    id: 'entry_today',
    date: '2026-08-27',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    caption: 'Brought his favorite yellow ball right to my desk chair during morning coffee. Irresistible golden charm! 🎾✨',
    mood: 'playful',
    activityDone: 'The Scent Mystery Game',
    challengeCompleted: true,
    bondingNote: 'Gave him 5 minutes of extra chin scratches.',
    tags: ['Morning Cuddles', 'Ball Obsession'],
    createdAt: '2026-08-27T08:30:00Z'
  },
  {
    id: 'entry_yesterday',
    date: '2026-08-26',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    caption: 'Long sunset walk along the creek. He splashed in the shallow water and gave the biggest golden smile.',
    mood: 'happy',
    activityDone: 'Texture Exploration Stroll',
    challengeCompleted: true,
    bondingNote: 'Walked an extra block just to smell the lavender bushes.',
    tags: ['Sunset Walk', 'Happy Boy'],
    createdAt: '2026-08-26T18:45:00Z'
  },
  {
    id: 'entry_3',
    date: '2026-08-25',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    caption: 'Rainy afternoon snooze. Slept with his head propped right on my slipper like a warm fuzzy pillow.',
    mood: 'sleepy',
    activityDone: 'Golden Sunset Cuddle Session',
    challengeCompleted: true,
    bondingNote: 'Peaceful rainy day rhythm.',
    tags: ['Rainy Nap', 'Cuddle Bug'],
    createdAt: '2026-08-25T15:20:00Z'
  },
  {
    id: 'entry_4',
    date: '2026-08-24',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    caption: 'Mastered the "high five" trick! He was so proud he carried his stuffed duck around the living room.',
    mood: 'playful',
    activityDone: 'Gentle "Paw Shake & High Five"',
    challengeCompleted: true,
    bondingNote: 'Such a smart gentle soul.',
    tags: ['Tricks', 'Proud Pup'],
    createdAt: '2026-08-24T17:10:00Z'
  },
  {
    id: 'entry_5',
    date: '2026-08-23',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    caption: 'A gentle rest day. He just wanted to lean against my knees while I read a book on the porch.',
    mood: 'gentle',
    activityDone: 'Golden Sunset Cuddle Session',
    challengeCompleted: false,
    bondingNote: 'Deep quiet comfort.',
    tags: ['Porch Time', 'Gentle Heart'],
    createdAt: '2026-08-23T16:00:00Z'
  },
  {
    id: 'entry_6',
    date: '2026-08-22',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
    caption: 'Zoomies after the lawn sprinkler turned on! Ran 4 circles around the garden patch with pure glee.',
    mood: 'playful',
    activityDone: 'Hide-and-Seek Behind the Door',
    challengeCompleted: true,
    bondingNote: 'Laughed so hard at his joyful sprint.',
    tags: ['Zoomies', 'Summer Days'],
    createdAt: '2026-08-22T11:15:00Z'
  },
  {
    id: 'entry_7',
    date: '2026-07-28',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    caption: 'Park picnic afternoon. Max made friends with a gentle golden retriever puppy and shared shade.',
    mood: 'happy',
    activityDone: 'Texture Exploration Stroll',
    challengeCompleted: true,
    bondingNote: 'He is always so patient and kind with smaller dogs.',
    tags: ['Park Day', 'Friendship'],
    createdAt: '2026-07-28T14:30:00Z'
  },
  {
    id: 'entry_8',
    date: '2026-07-15',
    petId: 'pet_max_1',
    photoUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    caption: 'Gotcha anniversary weekend trip! Splashed in the lake until sunset. The happiest ears in the world.',
    mood: 'playful',
    activityDone: 'The Scent Mystery Game',
    challengeCompleted: true,
    bondingNote: 'Unforgettable memory by the dock.',
    tags: ['Lake Day', 'Gotcha Celebration'],
    createdAt: '2026-07-15T19:00:00Z'
  },
  {
    id: 'entry_luna_1',
    date: '2026-08-27',
    petId: 'pet_luna_2',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    caption: 'Purred like a tiny motor while curling right over my keyboard during afternoon work. 🐾💖',
    mood: 'happy',
    activityDone: 'Hide-and-Seek Behind the Door',
    challengeCompleted: true,
    bondingNote: 'Gave her 10 gentle chin scratches under the sunlamp.',
    tags: ['Afternoon Snooze', 'Purr Machine'],
    createdAt: '2026-08-27T09:15:00Z'
  },
  {
    id: 'entry_luna_2',
    date: '2026-08-26',
    petId: 'pet_luna_2',
    photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    caption: 'Feather wand hunting practice in the hallway. High flying acrobatics!',
    mood: 'playful',
    activityDone: 'The Scent Mystery Game',
    challengeCompleted: true,
    bondingNote: 'Caught the red feather 5 times in a row.',
    tags: ['Playtime', 'Feather Wand'],
    createdAt: '2026-08-26T17:40:00Z'
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge_1',
    title: '7-Day Bonding Flame',
    description: 'Logged daily moments 7 days in a row without missing a single beat.',
    icon: '🔥',
    unlockedAt: '2026-08-21',
    progress: 7,
    total: 7
  },
  {
    id: 'badge_2',
    title: 'Belly Rub Champion',
    description: 'Completed 10 daily bonding challenges together.',
    icon: '🐾',
    unlockedAt: '2026-08-26',
    progress: 10,
    total: 10
  },
  {
    id: 'badge_3',
    title: 'Memory Keeper',
    description: 'Saved 25 heartwarming photo journal entries.',
    icon: '📸',
    progress: 8,
    total: 25
  },
  {
    id: 'badge_4',
    title: 'Zen Sniffer',
    description: 'Completed 15 scent and enrichment activities.',
    icon: '🌿',
    progress: 12,
    total: 15
  },
  {
    id: 'badge_5',
    title: 'Golden Love Heart',
    description: '30 continuous days of pet companionship.',
    icon: '💛',
    progress: 12,
    total: 30
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  reminderEnabled: true,
  reminderTime: '20:30',
  theme: 'honey',
  isPro: false,
  hapticsEnabled: true
};

export const SAMPLE_PET_PHOTOS = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80'
];
