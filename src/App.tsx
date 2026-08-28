/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Pet,
  DailyEntry,
  BondingChallenge,
  AchievementBadge,
  UserSettings,
  TabType,
  MoodType,
  Activity
} from './types';
import {
  loadStoredPets,
  saveStoredPets,
  loadStoredActivePetId,
  saveStoredActivePetId,
  loadStoredEntries,
  saveStoredEntries,
  loadStoredChallenges,
  saveStoredChallenges,
  loadStoredBadges,
  saveStoredBadges,
  loadStoredSettings,
  saveStoredSettings
} from './utils/storage';
import { calculateCalendarStreak, getTodayKey } from './utils/streak';
import { ACTIVITIES_POOL, INITIAL_PETS, INITIAL_TIMELINE_ENTRIES, INITIAL_PET } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { StatsScreen } from './components/StatsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddMomentModal } from './components/AddMomentModal';
import { AddPetModal } from './components/AddPetModal';
import { ProModal } from './components/ProModal';
import { MockBrowserNotification, MockNotificationPayload } from './components/MockBrowserNotification';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'motion/react';

export default function App() {
  // Multi-Pet State
  const [pets, setPets] = useState<Pet[]>(() => loadStoredPets());
  const [activePetId, setActivePetId] = useState<string>(() => loadStoredActivePetId(loadStoredPets()));

  // Active pet reference
  const activePet: Pet = pets.find(p => p.id === activePetId) || pets[0] || INITIAL_PET;

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Other persistent state
  const [entries, setEntries] = useState<DailyEntry[]>(() => loadStoredEntries());
  const [challenges, setChallenges] = useState<BondingChallenge[]>(() => loadStoredChallenges());
  const [badges, setBadges] = useState<AchievementBadge[]>(() => loadStoredBadges());
  const [settings, setSettings] = useState<UserSettings>(() => loadStoredSettings());
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isAddMomentOpen, setIsAddMomentOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalTitle, setProModalTitle] = useState<string | undefined>(undefined);
  const [proModalDesc, setProModalDesc] = useState<string | undefined>(undefined);

  const [addMomentInitialMood, setAddMomentInitialMood] = useState<MoodType>('happy');
  const [addMomentInitialActivity, setAddMomentInitialActivity] = useState<string>('');
  const [addMomentInitialCaption, setAddMomentInitialCaption] = useState<string | undefined>(undefined);
  const [addMomentInitialPhoto, setAddMomentInitialPhoto] = useState<string | undefined>(undefined);
  const [addMomentExistingEntry, setAddMomentExistingEntry] = useState<DailyEntry | undefined>(undefined);
  const [activeNotification, setActiveNotification] = useState<MockNotificationPayload | null>(null);
  const [snoozeToast, setSnoozeToast] = useState<string | null>(null);

  // Daily activity state
  const [activityIndex, setActivityIndex] = useState(0);
  const currentActivity: Activity = ACTIVITIES_POOL[activityIndex % ACTIVITIES_POOL.length];
  const [isActivityDone, setIsActivityDone] = useState(false);

  // Active challenge
  const currentChallenge = challenges[0] || {
    id: 'ch_1',
    title: 'Belly Rub Special',
    prompt: 'Give 3 dedicated belly rubs today with zero multitasking.',
    rewardPoints: 15,
    completed: false
  };

  // Current calendar date and streaks
  const todayStr = getTodayKey();
  
  // Filter entries for active pet
  const activePetEntries = entries.filter(e => !e.petId || e.petId === activePet.id);
  const todayEntry = activePetEntries.find(e => e.date === todayStr);

  const streakInfo = calculateCalendarStreak(entries, activePet.id, todayStr);
  const currentMood = todayEntry?.mood || 'happy';

  // Persistence effects
  useEffect(() => {
    saveStoredPets(pets);
  }, [pets]);

  useEffect(() => {
    saveStoredActivePetId(activePetId);
  }, [activePetId]);

  useEffect(() => {
    const saved = saveStoredEntries(entries);
    if (!saved) {
      setStorageWarning(
        "Your device's storage is full, so this memory couldn't be saved. Try deleting an old photo memory to free up space."
      );
    }
  }, [entries]);

  useEffect(() => {
    saveStoredChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    saveStoredBadges(badges);
  }, [badges]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Pet selection & management
  const handleSelectPet = (petId: string) => {
    setActivePetId(petId);
    saveStoredActivePetId(petId);
  };

  const handleAddPetClick = () => {
    if (!settings.isPro && pets.length >= 1) {
      handleOpenProWithDetails(
        'Unlock Multi-Pet Companions',
        'Add and track unlimited pets with individual daily streaks, photo timelines, and custom favorites with Pet Companion Pro.'
      );
      return;
    }
    setIsAddPetModalOpen(true);
  };

  const handleAddNewPet = (newPet: Pet) => {
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    setActivePetId(newPet.id);
    setIsAddPetModalOpen(false);
  };

  // Handlers
  const handleSelectMood = (mood: MoodType) => {
    if (todayEntry) {
      const updatedEntries = entries.map(e =>
        e.id === todayEntry.id ? { ...e, mood } : e
      );
      setEntries(updatedEntries);
    } else {
      // Create quick today entry if mood selected (without photo yet)
      const quickEntry: DailyEntry = {
        id: `entry_${Date.now()}`,
        date: todayStr,
        petId: activePet.id,
        photoUrl: '',
        caption: `Feeling ${mood} today with ${activePet.name}! 💕`,
        mood,
        activityDone: currentActivity.title,
        challengeCompleted: false,
        createdAt: new Date().toISOString(),
        tags: ['Daily Check-in', mood]
      };
      setEntries([quickEntry, ...entries]);
    }
  };

  const handleToggleActivityDone = () => {
    setIsActivityDone(!isActivityDone);
  };

  const handleShuffleActivity = () => {
    setActivityIndex(prev => prev + 1);
    setIsActivityDone(false);
  };

  const handleToggleChallenge = () => {
    const updatedChallenges = challenges.map(ch =>
      ch.id === currentChallenge.id ? { ...ch, completed: !ch.completed } : ch
    );
    setChallenges(updatedChallenges);
  };

  const handleOpenAddMoment = (
    initialMood?: MoodType,
    initialActivity?: string,
    initialCaption?: string,
    initialPhoto?: string,
    existingEntry?: DailyEntry
  ) => {
    if (initialMood) setAddMomentInitialMood(initialMood);
    if (initialActivity) setAddMomentInitialActivity(initialActivity);
    setAddMomentInitialCaption(initialCaption);
    setAddMomentInitialPhoto(initialPhoto);
    setAddMomentExistingEntry(
      existingEntry || (todayEntry && (!todayEntry.photoUrl || todayEntry.photoUrl === '') ? todayEntry : undefined)
    );
    setIsAddMomentOpen(true);
  };

  const handleDirectPhotoUpload = (photoUrl: string) => {
    if (todayEntry) {
      const updated = entries.map(e =>
        e.id === todayEntry.id ? { ...e, photoUrl } : e
      );
      setEntries(updated);
    } else {
      const newEntry: DailyEntry = {
        id: `entry_${Date.now()}`,
        date: todayStr,
        petId: activePet.id,
        photoUrl,
        caption: `Captured a sweet moment with ${activePet.name}! 📸✨`,
        mood: currentMood,
        activityDone: currentActivity.title,
        challengeCompleted: true,
        createdAt: new Date().toISOString(),
        tags: ['Daily Snapshot', 'Memories']
      };
      setEntries([newEntry, ...entries]);
    }
  };

  const handleSaveMoment = (newEntry: DailyEntry) => {
    // Ensure petId is set to active pet
    const entryWithPet: DailyEntry = {
      ...newEntry,
      petId: activePet.id,
      date: newEntry.date || todayStr
    };

    // Check if replacing today's entry or adding
    const existingIndex = entries.findIndex(
      e => e.date === entryWithPet.date && (e.petId === activePet.id || !e.petId)
    );

    if (existingIndex >= 0) {
      const updated = [...entries];
      updated[existingIndex] = entryWithPet;
      setEntries(updated);
    } else {
      setEntries([entryWithPet, ...entries]);
    }
  };

  const handleUpdateEntry = (updatedEntry: DailyEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleUpgradePro = (status: boolean) => {
    setSettings(prev => ({ ...prev, isPro: status }));
  };

  const handleOpenProWithDetails = (title?: string, description?: string) => {
    setProModalTitle(title);
    setProModalDesc(description);
    setIsProModalOpen(true);
  };

  const handleResetData = () => {
    setPets(INITIAL_PETS);
    setActivePetId(INITIAL_PETS[0].id);
    setEntries(INITIAL_TIMELINE_ENTRIES);
    setIsActivityDone(false);
  };

  const handleTriggerMockNotification = (customTitle?: string, customBody?: string) => {
    const title = customTitle || `🐾 Time to bond with ${activePet.name}!`;
    const body = customBody || `Have you shared a cuddle or playtime with ${activePet.name} today? Keep your ${streakInfo.currentStreak}-day streak going!`;
    setActiveNotification({
      title,
      body,
      pet: activePet,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleSnoozeNotification = () => {
    setSnoozeToast(`⏰ Reminder snoozed for 10 minutes. We'll nudge you again soon!`);
    setTimeout(() => setSnoozeToast(null), 3500);
    // Simulate re-triggering after 10 seconds for demo purposes
    setTimeout(() => {
      handleTriggerMockNotification(
        `🐾 Snooze reminder: ${activePet.name} is waiting!`,
        `10 minutes have passed! Take a short moment to log your bonding memory today.`
      );
    }, 10000);
  };

  // Theme styling based on settings
  const getThemeBackground = () => {
    if (settings.theme === 'sage') return 'bg-[#F4F9F5]';
    if (settings.theme === 'peach') return 'bg-[#FFF6F6]';
    if (settings.theme === 'lavender') return 'bg-[#F9F6FF]';
    return 'bg-[#FBF8F3]'; // default warm honey
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} flex flex-col items-center justify-start text-stone-800 transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]`}>
      {/* Mobile-first centered app shell */}
      <div className="w-full max-w-md min-h-screen min-h-[100dvh] flex flex-col bg-[#FAF7F2] sm:shadow-2xl relative sm:border-x sm:border-amber-900/10">
        {/* Storage full warning — shown when a save to localStorage fails */}
        {storageWarning && (
          <div className="px-3 pt-2.5 sm:px-4">
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-3 py-2.5">
              <span className="flex-1">{storageWarning}</span>
              <button
                type="button"
                onClick={() => setStorageWarning(null)}
                className="font-bold text-rose-500 hover:text-rose-700 shrink-0"
                aria-label="Dismiss warning"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Sticky Header */}
        <Header
          pet={activePet}
          streak={streakInfo.currentStreak}
          isPro={settings.isPro}
          onOpenPro={() => handleOpenProWithDetails()}
          onSelectTab={setCurrentTab}
          currentTab={currentTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-3 sm:px-4 pt-2.5 pb-20 pb-safe">
          {currentTab === 'home' && (
            <HomeScreen
              pet={activePet}
              pets={pets}
              activePetId={activePetId}
              onSelectPet={handleSelectPet}
              onAddPetClick={handleAddPetClick}
              streak={streakInfo.currentStreak}
              hasLoggedToday={streakInfo.hasLoggedToday}
              isStreakAtRisk={streakInfo.isStreakAtRisk}
              todayEntry={todayEntry}
              onOpenAddMoment={handleOpenAddMoment}
              onDirectPhotoUpload={handleDirectPhotoUpload}
              onSelectMood={handleSelectMood}
              currentMood={currentMood}
              activity={currentActivity}
              isActivityDone={isActivityDone}
              onToggleActivityDone={handleToggleActivityDone}
              onShuffleActivity={handleShuffleActivity}
              challenge={currentChallenge}
              onToggleChallenge={handleToggleChallenge}
              onOpenPro={handleOpenProWithDetails}
              isPro={settings.isPro}
              onViewTimeline={() => setCurrentTab('timeline')}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelineScreen
              entries={activePetEntries}
              pet={activePet}
              onOpenAddMoment={() => handleOpenAddMoment(currentMood, currentActivity.title)}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {currentTab === 'stats' && (
            <StatsScreen
              streak={streakInfo.currentStreak}
              entries={activePetEntries}
              petName={activePet.name}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              pet={activePet}
              onUpdatePet={handleUpdatePet}
              badges={badges}
              streak={streakInfo.currentStreak}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenPro={() => handleOpenProWithDetails()}
              pet={activePet}
              entries={activePetEntries}
              onResetData={handleResetData}
              streak={streakInfo.currentStreak}
              onTriggerMockNotification={handleTriggerMockNotification}
              onShowSplash={() => setShowSplash(true)}
            />
          )}
        </main>

        {/* Animated Splash Screen */}
        <AnimatePresence>
          {showSplash && (
            <SplashScreen
              pet={activePet}
              onFinish={() => setShowSplash(false)}
              streak={streakInfo.currentStreak}
            />
          )}
        </AnimatePresence>

        {/* Mock Push Notification Banner */}
        <MockBrowserNotification
          notification={activeNotification}
          onClose={() => setActiveNotification(null)}
          onLogMoment={() => {
            setActiveNotification(null);
            handleOpenAddMoment(currentMood, currentActivity.title);
          }}
          onSnooze={handleSnoozeNotification}
        />

        {/* Snooze Toast Feedback */}
        {snoozeToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-stone-900/90 text-white rounded-full text-xs font-semibold shadow-xl border border-stone-700 flex items-center gap-2">
            <span>{snoozeToast}</span>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          momentsCount={activePetEntries.length}
        />

        {/* Add Moment Modal */}
        <AddMomentModal
          isOpen={isAddMomentOpen}
          onClose={() => {
            setIsAddMomentOpen(false);
            setAddMomentInitialCaption(undefined);
            setAddMomentInitialPhoto(undefined);
            setAddMomentExistingEntry(undefined);
          }}
          pet={activePet}
          onSaveMoment={handleSaveMoment}
          initialMood={addMomentInitialMood}
          initialActivity={addMomentInitialActivity}
          initialCaption={addMomentInitialCaption}
          initialPhoto={addMomentInitialPhoto}
          existingEntry={addMomentExistingEntry}
        />

        {/* Add Pet Modal */}
        <AddPetModal
          isOpen={isAddPetModalOpen}
          onClose={() => setIsAddPetModalOpen(false)}
          onAddPet={handleAddNewPet}
        />

        {/* Pro Modal */}
        <ProModal
          isOpen={isProModalOpen}
          onClose={() => {
            setIsProModalOpen(false);
            setProModalTitle(undefined);
            setProModalDesc(undefined);
          }}
          isPro={settings.isPro}
          onUpgradePro={handleUpgradePro}
          customTitle={proModalTitle}
          customDescription={proModalDesc}
        />
      </div>
    </div>
  );
}
