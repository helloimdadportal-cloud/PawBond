import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  RefreshCw,
  Heart,
  ChevronRight,
  Crown,
  Clock,
  Award,
  Smile,
  Compass,
  Sun,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Pet, DailyEntry, Activity, BondingChallenge, MoodType, MoodOption } from '../types';
import { MOOD_OPTIONS, ACTIVITIES_POOL } from '../data/mockData';
import { PawIcon } from './PawIcon';
import { PetSwitcher } from './PetSwitcher';
import { triggerCozyConfetti, triggerStreakConfetti } from '../utils/confetti';

interface HomeScreenProps {
  pet: Pet;
  pets: Pet[];
  activePetId: string;
  onSelectPet: (petId: string) => void;
  onAddPetClick: () => void;
  streak: number;
  hasLoggedToday: boolean;
  isStreakAtRisk: boolean;
  todayEntry?: DailyEntry;
  onOpenAddMoment: (
    initialMood?: MoodType,
    initialActivity?: string,
    initialCaption?: string,
    initialPhoto?: string,
    existingEntry?: DailyEntry
  ) => void;
  onDirectPhotoUpload?: (photoUrl: string) => void;
  onSelectMood: (mood: MoodType) => void;
  currentMood?: MoodType;
  activity: Activity;
  isActivityDone: boolean;
  onToggleActivityDone: () => void;
  onShuffleActivity: () => void;
  challenge: BondingChallenge;
  onToggleChallenge: () => void;
  onOpenPro: (customTitle?: string, customDescription?: string) => void;
  isPro: boolean;
  onViewTimeline: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  pet,
  pets,
  activePetId,
  onSelectPet,
  onAddPetClick,
  streak,
  hasLoggedToday,
  isStreakAtRisk,
  todayEntry,
  onOpenAddMoment,
  onDirectPhotoUpload,
  onSelectMood,
  currentMood,
  activity,
  isActivityDone,
  onToggleActivityDone,
  onShuffleActivity,
  challenge,
  onToggleChallenge,
  onOpenPro,
  isPro,
  onViewTimeline
}) => {
  const [showMoodAffirmation, setShowMoodAffirmation] = useState(false);
  const [selectedMoodInfo, setSelectedMoodInfo] = useState<MoodOption | null>(
    MOOD_OPTIONS.find(m => m.id === currentMood) || null
  );

  // Check if today's entry has a real photo attached
  const hasPhotoInTodayEntry = Boolean(
    todayEntry && todayEntry.photoUrl && todayEntry.photoUrl.trim() !== ''
  );

  const handleMoodClick = (mood: MoodOption) => {
    onSelectMood(mood.id);
    setSelectedMoodInfo(mood);
    setShowMoodAffirmation(true);
    triggerCozyConfetti();
    setTimeout(() => {
      setShowMoodAffirmation(false);
    }, 4000);
  };

  const handleStreakClick = () => {
    triggerStreakConfetti();
  };

  const handleDirectPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDirectPhotoUpload) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onDirectPhotoUpload(reader.result);
          triggerCozyConfetti();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-500" />;
      case 'Smile': return <Smile className="w-5 h-5 text-emerald-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-blue-500" />;
      case 'Sun': return <Sun className="w-5 h-5 text-orange-500" />;
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const currentMoodOption = MOOD_OPTIONS.find(m => m.id === (todayEntry?.mood || currentMood));

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* 0. "MY PETS" SWITCHER */}
      <PetSwitcher
        pets={pets}
        activePetId={activePetId}
        onSelectPet={onSelectPet}
        onAddPetClick={onAddPetClick}
        isPro={isPro}
      />

      {/* 1. DAILY STREAK HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 text-white p-5 shadow-lg shadow-amber-500/15"
      >
        {/* Background decorative paw pattern */}
        <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
          <PawIcon className="w-36 h-36" color="#FFFFFF" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-100 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span>Daily Bonding Rhythm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              🔥 {streak} {streak === 1 ? 'day' : 'days'} together
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-[240px] leading-relaxed">
              Every day with {pet.name} creates a lifelong memory of unconditional love.
            </p>
          </div>

          <button
            id="streak-hero-celebrate-btn"
            onClick={handleStreakClick}
            className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all active:scale-95 shadow-inner"
            title="Celebrate streak!"
          >
            <PawIcon className="w-5 h-5" color="#FFFFFF" />
          </button>
        </div>

        {/* Mini streak week indicator */}
        <div className="mt-3.5 pt-2.5 border-t border-white/20 flex items-center justify-between">
          <span className="text-[10.5px] sm:text-[11px] font-medium text-amber-100">
            {hasLoggedToday ? '✅ Today logged!' : '⏳ Today pending'}
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              const isToday = idx === 3;
              const isCompleted = idx < 3 || (idx === 3 && hasLoggedToday);
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5">
                  <div
                    className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-white text-amber-700 shadow-2xs font-extrabold'
                        : 'bg-white/20 text-white/70'
                    } ${isToday ? 'ring-2 ring-amber-200 ring-offset-1 ring-offset-amber-600 scale-105' : ''}`}
                  >
                    {isCompleted ? '🐾' : day}
                  </div>
                  <span className="text-[8.5px] sm:text-[9px] text-amber-100/80">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* PHOTO REMINDER BANNER (If today's entry exists but NO photo has been added yet) */}
      {todayEntry && !hasPhotoInTodayEntry && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 sm:p-4.5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/10 border-2 border-amber-400 text-stone-900 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Camera className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                  Photo Reminder
                </span>
                <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold text-[9.5px]">
                  Missing Today's Snapshot
                </span>
              </div>

              <h4 className="text-sm font-bold text-stone-900 mt-0.5 leading-snug">
                Remember to capture a photo of {pet.name} today!
              </h4>

              <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                You checked in {pet.name}'s mood ({currentMoodOption?.emoji || '😊'} {currentMoodOption?.label.split(' ')[0] || 'Happy'}), but haven't added a photo to today's entry yet. Add a snapshot to complete today's memory journal!
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  id="photo-reminder-capture-btn"
                  onClick={() => onOpenAddMoment(currentMood, activity.title, todayEntry.caption, undefined, todayEntry)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture / Add Photo</span>
                </button>

                <label
                  id="photo-reminder-device-upload-btn"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-amber-300 active:scale-95 text-stone-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDirectPhotoFileChange}
                  />
                </label>
              </div>

              {/* Quick inspiration prompts */}
              <div className="mt-2.5 pt-2 border-t border-amber-200/80">
                <span className="text-[10px] font-semibold text-stone-600 block mb-1">
                  💡 Snapshot idea:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {[
                    { emoji: '😴', label: 'Sweet snooze', prompt: `Sleeping peacefully in ${pet.species === 'cat' ? 'her' : 'his'} favorite warm spot` },
                    { emoji: '🎾', label: 'Toy playtime', prompt: `Playing happily with favorite toy` },
                    { emoji: '☀️', label: 'Sunbeam cuddle', prompt: `Basking in the warm afternoon sun` },
                    { emoji: '👀', label: 'Head tilt', prompt: `Doing the sweetest curious head tilt` }
                  ].map((idea, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpenAddMoment(currentMood, activity.title, idea.prompt, undefined, todayEntry)}
                      className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border border-amber-200 text-[10.5px] font-medium text-stone-700 whitespace-nowrap shadow-2xs transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>{idea.emoji}</span>
                      <span>{idea.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* GENTLE STREAK REMINDER BANNER (If NO entry logged yet today) */}
      {!todayEntry && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/90 text-amber-950 flex items-center justify-between gap-2.5 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-900 truncate">
                Don't break your streak!
              </div>
              <p className="text-[11px] text-amber-800/90 truncate">
                Log today's moment & photo with {pet.name} to protect your daily flame.
              </p>
            </div>
          </div>
          <button
            id="streak-reminder-log-btn"
            onClick={() => onOpenAddMoment(currentMood, activity.title)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-[11px] shrink-0 shadow-xs transition-all flex items-center gap-1"
          >
            <PawIcon className="w-3 h-3" color="#FFF" />
            <span>Log Today</span>
          </button>
        </motion.div>
      )}

      {/* 2. PRIMARY ACTION: TODAY'S SNAPSHOT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Today's Snapshot</h3>
              <p className="text-[11px] text-stone-500">Capture a tender moment or golden smile</p>
            </div>
          </div>

          {todayEntry && hasPhotoInTodayEntry ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          ) : todayEntry && !hasPhotoInTodayEntry ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5 text-amber-600" /> Photo Pending
            </span>
          ) : null}
        </div>

        {todayEntry && hasPhotoInTodayEntry ? (
          /* Today's recorded moment card WITH photo */
          <div className="space-y-2.5">
            <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-stone-100 border border-stone-200">
              <img
                src={todayEntry.photoUrl}
                alt="Today's memory"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1">
                <span>{MOOD_OPTIONS.find(m => m.id === todayEntry.mood)?.emoji || '😊'}</span>
                <span className="capitalize">{todayEntry.mood.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{todayEntry.caption}"
              </p>
              {todayEntry.tags && todayEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {todayEntry.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                id="update-todays-moment-btn"
                onClick={() => onOpenAddMoment(currentMood, activity.title, todayEntry.caption, todayEntry.photoUrl, todayEntry)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 py-1"
              >
                <Plus className="w-3.5 h-3.5" /> Change photo / edit note
              </button>
              <button
                id="view-all-memories-link-btn"
                onClick={onViewTimeline}
                className="text-xs font-semibold text-stone-500 hover:text-stone-700 flex items-center gap-0.5"
              >
                <span>View journal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : todayEntry && !hasPhotoInTodayEntry ? (
          /* Today's entry recorded (e.g. mood check-in), but NO PHOTO attached yet */
          <div className="space-y-3">
            <div
              onClick={() => onOpenAddMoment(currentMood, activity.title, todayEntry.caption, undefined, todayEntry)}
              className="relative rounded-2xl overflow-hidden aspect-16/10 bg-amber-50/70 border-2 border-dashed border-amber-300 hover:border-amber-500 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-2">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-amber-900">
                No photo added to today's entry yet!
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Tap here to snap or choose a photo of {pet.name}
              </div>
              <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Attach Today's Photo</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-amber-900">
                <span>{currentMoodOption?.emoji || '😊'}</span>
                <span>{todayEntry.mood ? `Checked in feeling ${todayEntry.mood.replace('_', ' ')}` : 'Checked in today'}</span>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{todayEntry.caption}"
              </p>
            </div>
          </div>
        ) : (
          /* Button to add today's moment when no entry exists at all */
          <button
            id="add-todays-moment-btn"
            onClick={() => onOpenAddMoment(currentMood, activity.title)}
            className="w-full py-3.5 px-3 sm:px-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-[0.99]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-xs border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-amber-900">
              Add today's moment & photo
            </div>
            <div className="text-[10.5px] sm:text-[11px] text-stone-500">
              Upload photo + short caption with {pet.name}
            </div>
          </button>
        )}
      </motion.div>

      {/* 3. MOOD CHECK-IN: "How was [Pet Name] today?" */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#FFFDF9] rounded-3xl p-3.5 sm:p-5 border border-stone-200/70 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              How was {pet.name} today?
            </h3>
            <p className="text-[10.5px] sm:text-[11px] text-stone-500">
              Tap an emotion to track {pet.species === 'cat' ? 'her' : 'his'} daily spirit
            </p>
          </div>
          {currentMood && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
              Checked in
            </span>
          )}
        </div>

        {/* 5 Mood Emoji Buttons */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = currentMood === mood.id;
            return (
              <button
                key={mood.id}
                id={`mood-btn-${mood.id}`}
                onClick={() => handleMoodClick(mood)}
                className={`relative py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border min-w-0 ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-400 shadow-xs scale-102 ring-2 ring-amber-300/50'
                    : 'bg-white border-stone-200/70 hover:bg-stone-50 hover:border-amber-200 active:scale-95'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-1.5 border-white flex items-center justify-center">
                    <PawIcon className="w-1.5 h-1.5 text-white" />
                  </span>
                )}
                <span className="text-xl sm:text-2xl mb-0.5 filter drop-shadow-2xs transition-transform active:scale-125">
                  {mood.emoji}
                </span>
                <span className={`text-[9.5px] sm:text-[10px] font-bold text-center leading-tight truncate w-full px-0.5 ${
                  isSelected ? 'text-amber-900' : 'text-stone-600'
                }`}>
                  {mood.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Affirmation Toast */}
        {showMoodAffirmation && selectedMoodInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2.5 text-xs"
          >
            <span className="text-lg">{selectedMoodInfo.emoji}</span>
            <div>
              <span className="font-bold">{selectedMoodInfo.label}: </span>
              <span className="text-amber-800">{selectedMoodInfo.description}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 4. TODAY'S 2-MINUTE ACTIVITY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl p-4 sm:p-5 border transition-all shadow-sm ${
          isActivityDone
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-[#FFFDF9] border-amber-200/80'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              {getActivityIcon(activity.iconName)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block truncate">
                Today's {activity.duration} Activity
              </span>
              <p className="text-[11px] text-stone-500 capitalize truncate">
                {activity.category} & connection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 shrink-0 whitespace-nowrap shadow-2xs">
              <Clock className="w-3 h-3 text-amber-700 shrink-0" />
              <span>{activity.duration}</span>
            </span>

            <button
              id="shuffle-activity-btn"
              onClick={onShuffleActivity}
              className="w-8 h-8 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 flex items-center justify-center transition-all shrink-0"
              title="Try another bonding activity"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <h4 className="text-base font-bold text-stone-900">
            {activity.title}
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            {activity.description}
          </p>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px] text-amber-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span><strong>Why it bonds:</strong> {activity.benefit}</span>
          </div>
        </div>

        <div className="mt-3.5 pt-1">
          <button
            id="toggle-activity-done-btn"
            onClick={() => {
              onToggleActivityDone();
              if (!isActivityDone) triggerCozyConfetti();
            }}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              isActivityDone
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-black text-white shadow-sm'
            }`}
          >
            {isActivityDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span className="truncate">Activity Completed with {pet.name}! ✨</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 shrink-0" />
                <span className="truncate">Mark {activity.duration} Activity Done</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 5. BONDING CHALLENGE OF THE DAY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider truncate block">
                Daily Bonding Challenge
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-0.5 truncate">
                {challenge.title}
              </h4>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0 whitespace-nowrap shadow-2xs">
            +{challenge.rewardPoints} Love pts
          </span>
        </div>

        <p className="text-xs text-stone-600 mt-2 mb-3 leading-relaxed">
          "{challenge.prompt}"
        </p>

        <button
          id="toggle-challenge-btn"
          onClick={() => {
            onToggleChallenge();
            if (!challenge.completed) triggerCozyConfetti();
          }}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
            challenge.completed
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/70'
          }`}
        >
          {challenge.completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Challenge Accomplished today! ❤️</span>
            </>
          ) : (
            <>
              <PawIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>I did this with {pet.name} today!</span>
            </>
          )}
        </button>
      </motion.div>

      {/* 6. PRO UPSELL CARD */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider truncate">
                  Pet Daily Companion Pro
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 shrink-0">PRO</span>
              </div>
              <p className="text-xs text-stone-700 font-medium mt-1 leading-snug">
                Unlock unlimited pets, AI daily activities & printable scrapbook — $4.99/mo
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  id="pro-upsell-card-cta-btn"
                  onClick={() => onOpenPro('Unlock Pet Companion Pro', 'Get unlimited pet profiles, personalized AI activity generation, custom themes, and full-resolution printable photo memories.')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-amber-200" />
                  <span>Try 7 Days Free</span>
                </button>
                <span className="text-[10.5px] text-stone-500 truncate">Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
