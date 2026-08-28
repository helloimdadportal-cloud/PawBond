import React from 'react';
import { motion } from 'motion/react';
import { Flame, Award, Heart, Sparkles, TrendingUp, Calendar, Smile } from 'lucide-react';
import { DailyEntry, MoodType } from '../types';
import { MOOD_OPTIONS } from '../data/mockData';
import { PawIcon } from './PawIcon';
import { triggerStreakConfetti } from '../utils/confetti';

interface StatsScreenProps {
  streak: number;
  entries: DailyEntry[];
  petName: string;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  streak,
  entries,
  petName
}) => {
  const longestStreak = Math.max(streak, 28);
  const totalMemories = entries.length;
  const totalBondingMinutes = entries.length * 15 + streak * 5; // gentle fun estimate

  // Calculate Mood distributions
  const moodCounts: Record<MoodType, number> = {
    sleepy: 0,
    happy: 0,
    playful: 0,
    gentle: 0,
    off_day: 0
  };

  entries.forEach((entry) => {
    if (moodCounts[entry.mood] !== undefined) {
      moodCounts[entry.mood]++;
    }
  });

  const maxCount = Math.max(...Object.values(moodCounts), 1);

  // Calculate dominant positive percentage
  const happyPlayfulCount = moodCounts.happy + moodCounts.playful;
  const positivePercentage = Math.round((happyPlayfulCount / (entries.length || 1)) * 100);

  return (
    <div className="space-y-4 pb-24 pt-1 text-stone-800">
      {/* 1. STREAK CELEBRATION HERO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 shadow-lg shadow-amber-500/15 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <PawIcon className="w-48 h-48" color="#FFFFFF" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span>Bonding Consistency</span>
            </span>

            <button
              id="confetti-stats-streak-btn"
              onClick={triggerStreakConfetti}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold text-white backdrop-blur-sm border border-white/30 transition-all active:scale-95"
            >
              Celebrate 🎉
            </button>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black">
              🔥 {streak}
            </span>
            <span className="text-lg font-bold text-amber-100">
              days streak
            </span>
          </div>

          <p className="text-xs text-amber-100 mt-2 leading-relaxed">
            You have spent dedicated one-on-one time with {petName} for {streak} continuous days.
          </p>

          {/* Grid of Key Stats */}
          <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
              <div className="text-[10px] text-amber-100 font-semibold uppercase">Longest</div>
              <div className="text-lg font-extrabold text-white mt-0.5">{longestStreak}d</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
              <div className="text-[10px] text-amber-100 font-semibold uppercase">Memories</div>
              <div className="text-lg font-extrabold text-white mt-0.5">{totalMemories}</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
              <div className="text-[10px] text-amber-100 font-semibold uppercase">Bond Mins</div>
              <div className="text-lg font-extrabold text-white mt-0.5">{totalBondingMinutes}m</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. MOOD TRENDS BAR CHART (Non-medical, cozy vibe) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#FFFDF9] rounded-3xl p-5 border border-amber-200/70 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Vibe Breakdown</span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-0.5 truncate">
              {petName}'s Mood Trends
            </h3>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold shrink-0 whitespace-nowrap shadow-2xs">
            {positivePercentage}% Joy & Play
          </span>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3 pt-1">
          {MOOD_OPTIONS.map((mood) => {
            const count = moodCounts[mood.id] || 0;
            const percentage = Math.round((count / (entries.length || 1)) * 100);
            const widthPercentage = (count / maxCount) * 100;

            return (
              <div key={mood.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span className="text-base">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </span>
                  <span className="text-stone-500 font-medium">
                    {count} {count === 1 ? 'day' : 'days'} ({percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(widthPercentage, 4)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun pet insight card */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl text-amber-600 shadow-2xs border border-amber-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              Emotional Insight for {petName}
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              {petName} enjoys the highest playful energy on days with outdoor scent exploration games and evening belly rubs.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. BONDING CALENDAR HEATMAP (August 2026) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#FFFDF9] rounded-3xl p-5 border border-stone-200/70 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>August 2026 Activity Grid</span>
          </div>
          <span className="text-xs text-amber-800 font-semibold">27/31 Active</span>
        </div>

        {/* Calendar Grid 7 columns */}
        <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] font-bold text-stone-400 pb-1">
              {d}
            </div>
          ))}

          {/* Days 1 to 31 */}
          {Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const isLogged = dayNum <= 27;
            const isToday = dayNum === 27;

            return (
              <div
                key={dayNum}
                className={`h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative ${
                  isToday
                    ? 'bg-amber-500 text-white shadow-xs scale-105 ring-2 ring-amber-300'
                    : isLogged
                    ? 'bg-amber-100/90 text-amber-900'
                    : 'bg-stone-100/70 text-stone-400'
                }`}
              >
                {isLogged ? (
                  <span className="text-[11px]">{dayNum}</span>
                ) : (
                  <span className="text-[10px] opacity-60">{dayNum}</span>
                )}
                {isLogged && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-600" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-md bg-amber-500"></span>
            <span>Today</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-md bg-amber-100"></span>
            <span>Bond logged</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-md bg-stone-100"></span>
            <span>Upcoming</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
