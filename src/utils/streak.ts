import { DailyEntry } from '../types';

/**
 * Gets a formatted YYYY-MM-DD string for a Date object
 */
export const formatDateToKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Gets today's date key. Default reference is current system date or simulated '2026-08-27'
 */
export const getTodayKey = (): string => {
  // Use today's calendar date, default reference 2026-08-27 if in fixed timeline
  const now = new Date();
  const year = now.getFullYear();
  if (year >= 2026) {
    return formatDateToKey(now);
  }
  return '2026-08-27';
};

/**
 * Returns previous date key for YYYY-MM-DD
 */
export const getPreviousDateKey = (dateKey: string): string => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return formatDateToKey(date);
};

export interface StreakCalculation {
  currentStreak: number;
  hasLoggedToday: boolean;
  isStreakAtRisk: boolean;
  lastLoggedDate: string | null;
}

/**
 * Calculates calendar day streak for a given pet:
 * - Only counts ONCE per calendar day
 * - If today is logged, counts today + consecutive previous days
 * - If today is NOT logged yet, but yesterday is logged, streak is still intact (at risk!)
 * - If yesterday was missed, streak resets to 0
 */
export const calculateCalendarStreak = (
  entries: DailyEntry[],
  petId: string,
  todayStr: string = getTodayKey()
): StreakCalculation => {
  const petEntries = entries.filter(e => e.petId === petId);
  const uniqueDates = new Set(petEntries.map(e => e.date));

  if (uniqueDates.size === 0) {
    return {
      currentStreak: 0,
      hasLoggedToday: false,
      isStreakAtRisk: false,
      lastLoggedDate: null
    };
  }

  const hasLoggedToday = uniqueDates.has(todayStr);
  const yesterdayStr = getPreviousDateKey(todayStr);
  const hasLoggedYesterday = uniqueDates.has(yesterdayStr);

  let currentStreak = 0;
  let checkDate = hasLoggedToday ? todayStr : (hasLoggedYesterday ? yesterdayStr : null);

  if (checkDate) {
    while (uniqueDates.has(checkDate)) {
      currentStreak += 1;
      checkDate = getPreviousDateKey(checkDate);
    }
  }

  // Sort dates descending to get last logged date
  const sortedDates = Array.from(uniqueDates).sort().reverse();
  const lastLoggedDate = sortedDates[0] || null;

  const isStreakAtRisk = !hasLoggedToday && hasLoggedYesterday && currentStreak > 0;

  return {
    currentStreak,
    hasLoggedToday,
    isStreakAtRisk,
    lastLoggedDate
  };
};
