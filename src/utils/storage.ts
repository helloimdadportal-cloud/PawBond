import { Pet, DailyEntry, BondingChallenge, AchievementBadge, UserSettings } from '../types';
import {
   INITIAL_PET,
   INITIAL_PETS,
   INITIAL_TIMELINE_ENTRIES,
   BONDING_CHALLENGES,
   INITIAL_BADGES,
   INITIAL_SETTINGS
 } from '../data/mockData';

const PETS_LIST_STORAGE_KEY = 'pet_companion_pets_list';
const ACTIVE_PET_ID_STORAGE_KEY = 'pet_companion_active_pet_id';
const ENTRIES_STORAGE_KEY = 'pet_companion_entries';
const CHALLENGES_STORAGE_KEY = 'pet_companion_challenges';
const BADGES_STORAGE_KEY = 'pet_companion_badges';
const SETTINGS_STORAGE_KEY = 'pet_companion_settings';
const STREAK_STORAGE_KEY = 'pet_companion_streak';

export const loadStoredPets = (): Pet[] => {
  try {
    const data = localStorage.getItem(PETS_LIST_STORAGE_KEY);
    if (data) {
      const parsed: Pet[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Check old single pet key for migration
    const oldSingle = localStorage.getItem('pet_companion_pet');
    if (oldSingle) {
      const parsedSingle: Pet = JSON.parse(oldSingle);
      return [parsedSingle];
    }
    return INITIAL_PETS;
  } catch {
    return INITIAL_PETS;
  }
};

export const saveStoredPets = (pets: Pet[]) => {
  try {
    localStorage.setItem(PETS_LIST_STORAGE_KEY, JSON.stringify(pets));
  } catch (e) {
    console.error('Error saving pets list', e);
  }
};

export const loadStoredActivePetId = (availablePets: Pet[]): string => {
  try {
    const id = localStorage.getItem(ACTIVE_PET_ID_STORAGE_KEY);
    if (id && availablePets.some(p => p.id === id)) {
      return id;
    }
    return availablePets[0]?.id || INITIAL_PET.id;
  } catch {
    return availablePets[0]?.id || INITIAL_PET.id;
  }
};

export const saveStoredActivePetId = (petId: string) => {
  try {
    localStorage.setItem(ACTIVE_PET_ID_STORAGE_KEY, petId);
  } catch (e) {
    console.error('Error saving active pet id', e);
  }
};

export const loadStoredPet = (): Pet => {
  const pets = loadStoredPets();
  const activeId = loadStoredActivePetId(pets);
  return pets.find(p => p.id === activeId) || pets[0] || INITIAL_PET;
};

export const saveStoredPet = (pet: Pet) => {
  try {
    const currentPets = loadStoredPets();
    const idx = currentPets.findIndex(p => p.id === pet.id);
    let updatedPets: Pet[];
    if (idx >= 0) {
      updatedPets = [...currentPets];
      updatedPets[idx] = pet;
    } else {
      updatedPets = [...currentPets, pet];
    }
    saveStoredPets(updatedPets);
    saveStoredActivePetId(pet.id);
  } catch (e) {
    console.error('Error saving pet', e);
  }
};

export const loadStoredEntries = (): DailyEntry[] => {
  try {
    const data = localStorage.getItem(ENTRIES_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_TIMELINE_ENTRIES;
  } catch {
    return INITIAL_TIMELINE_ENTRIES;
  }
};

/**
 * Detects the classic "storage quota exceeded" error across browsers.
 * Names/codes differ (Chrome/Edge vs Firefox vs Safari), so we check both.
 */
const isQuotaExceededError = (e: unknown): boolean => {
  if (!(e instanceof DOMException)) return false;
  return (
    e.name === 'QuotaExceededError' ||
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    e.code === 22 ||
    e.code === 1014
  );
};

/**
 * Saves entries to localStorage. Returns true on success, false if the
 * save failed (most commonly because localStorage is full of base64
 * photos). Callers should surface a visible warning on `false` instead
 * of letting the save fail silently - otherwise a user can keep adding
 * memories that look saved in the UI but never actually persist.
 */
export const saveStoredEntries = (entries: DailyEntry[]): boolean => {
  try {
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (e) {
    if (isQuotaExceededError(e)) {
      console.error('Storage full: could not save entries', e);
    } else {
      console.error('Error saving entries', e);
    }
    return false;
  }
};

export const loadStoredChallenges = (): BondingChallenge[] => {
  try {
    const data = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    return data ? JSON.parse(data) : BONDING_CHALLENGES;
  } catch {
    return BONDING_CHALLENGES;
  }
};

export const saveStoredChallenges = (challenges: BondingChallenge[]) => {
  try {
    localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
  } catch (e) {
    console.error('Error saving challenges', e);
  }
};

export const loadStoredBadges = (): AchievementBadge[] => {
  try {
    const data = localStorage.getItem(BADGES_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_BADGES;
  } catch {
    return INITIAL_BADGES;
  }
};

export const saveStoredBadges = (badges: AchievementBadge[]) => {
  try {
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
  } catch (e) {
    console.error('Error saving badges', e);
  }
};

export const loadStoredSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
};

export const loadStoredStreak = (): number => {
  try {
    const data = localStorage.getItem(STREAK_STORAGE_KEY);
    return data ? parseInt(data, 10) : 12;
  } catch {
    return 12;
  }
};

export const saveStoredStreak = (streak: number) => {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, streak.toString());
  } catch (e) {
    console.error('Error saving streak', e);
  }
};

export const calculateDaysTogether = (adoptionDateStr: string): number => {
  const adoptionDate = new Date(adoptionDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - adoptionDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1528;
};
