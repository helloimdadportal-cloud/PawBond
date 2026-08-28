import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Lock,
  Sparkles,
  Crown,
  Palette,
  PlusCircle,
  Download,
  RotateCcw,
  Check,
  Heart,
  Volume2,
  VolumeX,
  Clock,
  Send,
  ShieldCheck,
  Zap,
  Flame,
  Smile
} from 'lucide-react';
import { UserSettings, Pet, DailyEntry, NudgeStyle } from '../types';
import { PawIcon } from './PawIcon';
import { triggerCozyConfetti } from '../utils/confetti';
import { playNotificationChime } from '../utils/audio';
import { MockBrowserPermissionDialog } from './MockBrowserPermissionDialog';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenPro: () => void;
  pet: Pet;
  entries: DailyEntry[];
  onResetData: () => void;
  streak?: number;
  onTriggerMockNotification?: (title?: string, body?: string) => void;
  onShowSplash?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenPro,
  pet,
  entries,
  onResetData,
  streak = 12,
  onTriggerMockNotification,
  onShowSplash
}) => {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const themes = [
    {
      id: 'honey' as const,
      name: 'Warm Honey (Default)',
      color: '#F59E0B',
      accent: 'bg-amber-100',
      isPro: false
    },
    {
      id: 'sage' as const,
      name: 'Sage Meadow',
      color: '#10B981',
      accent: 'bg-emerald-100',
      isPro: true
    },
    {
      id: 'peach' as const,
      name: 'Peach Sunset',
      color: '#FB7185',
      accent: 'bg-rose-100',
      isPro: true
    },
    {
      id: 'lavender' as const,
      name: 'Lavender Dream',
      color: '#A855F7',
      accent: 'bg-purple-100',
      isPro: true
    }
  ];

  const timePresets = [
    { label: '🌅 Morning Walk', time: '08:00' },
    { label: '☀️ Afternoon Play', time: '13:00' },
    { label: '🌆 Evening Cuddle', time: '20:30' },
    { label: '🌙 Bedtime Snuggle', time: '22:00' }
  ];

  const nudgeStyles: { id: NudgeStyle; title: string; desc: string; icon: typeof Heart }[] = [
    {
      id: 'cuddle',
      title: 'Cozy Cuddle Nudge',
      desc: `Gentle reminder for ear rubs & cuddle time with ${pet.name}`,
      icon: Heart
    },
    {
      id: 'streak',
      title: 'Streak Safeguard',
      desc: `Protect your ${streak}-day bonding streak before day's end`,
      icon: Flame
    },
    {
      id: 'playful',
      title: 'Play & Activity Spark',
      desc: `Prompt for zoomies, trick practice & scent games`,
      icon: Smile
    }
  ];

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return '8:30 PM';
    const [hoursStr, minsStr] = timeStr.split(':');
    const h = parseInt(hoursStr, 10);
    const m = minsStr || '00';
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleReminder = () => {
    if (!settings.reminderEnabled) {
      // If turning on and browser permission not granted yet, show permission dialog
      if (settings.browserPermission !== 'granted') {
        setShowPermissionDialog(true);
        return;
      }
      onUpdateSettings({
        ...settings,
        reminderEnabled: true
      });
      showToast(`🔔 Daily notifications active for ${formatDisplayTime(settings.reminderTime)}`);
    } else {
      onUpdateSettings({
        ...settings,
        reminderEnabled: false
      });
      showToast('🔕 Daily notifications paused');
    }
  };

  const handleAllowPermission = () => {
    setShowPermissionDialog(false);
    onUpdateSettings({
      ...settings,
      reminderEnabled: true,
      browserPermission: 'granted',
      notificationSound: settings.notificationSound ?? true
    });
    playNotificationChime();
    showToast(`✨ Browser notifications allowed! Set to ${formatDisplayTime(settings.reminderTime)}`);

    // Fire an immediate preview notification
    if (onTriggerMockNotification) {
      setTimeout(() => {
        onTriggerMockNotification(
          `🐾 Notifications Enabled for ${pet.name}!`,
          `We'll nudge you every day at ${formatDisplayTime(settings.reminderTime)} to log your bonding moment.`
        );
      }, 400);
    }
  };

  const handleBlockPermission = () => {
    setShowPermissionDialog(false);
    onUpdateSettings({
      ...settings,
      reminderEnabled: false,
      browserPermission: 'denied'
    });
    showToast('Permission blocked in simulated browser settings.');
  };

  const handleTimeChange = (time: string) => {
    onUpdateSettings({
      ...settings,
      reminderTime: time
    });
    showToast(`⏰ Reminder time set to ${formatDisplayTime(time)}`);
  };

  const handleNudgeStyleSelect = (style: NudgeStyle) => {
    onUpdateSettings({
      ...settings,
      reminderStyle: style
    });
    showToast('Nudge style updated!');
  };

  const handleToggleSound = () => {
    const nextSound = !(settings.notificationSound ?? true);
    onUpdateSettings({
      ...settings,
      notificationSound: nextSound
    });
    if (nextSound) playNotificationChime();
  };

  const handleSendTestNotification = () => {
    if (settings.notificationSound ?? true) {
      playNotificationChime();
    }

    const style = settings.reminderStyle || 'cuddle';
    let title = `🐾 Time to bond with ${pet.name}!`;
    let body = `It's ${formatDisplayTime(settings.reminderTime)} — have you shared cuddle time with ${pet.name} today? Tap to log your moment!`;

    if (style === 'streak') {
      title = `🔥 Keep your ${streak}-day bonding streak!`;
      body = `Don't let today pass without logging a moment with ${pet.name}. One quick photo keeps the flame burning!`;
    } else if (style === 'playful') {
      title = `🎾 ${pet.name} is waiting for play time!`;
      body = `Ready for today's bonding activity? Grab a toy, spend 3 quality minutes, and record the memory.`;
    }

    if (onTriggerMockNotification) {
      onTriggerMockNotification(title, body);
    }
  };

  const handleThemeSelect = (themeId: 'honey' | 'sage' | 'peach' | 'lavender', isProTheme: boolean) => {
    if (isProTheme && !settings.isPro) {
      onOpenPro();
    } else {
      onUpdateSettings({
        ...settings,
        theme: themeId
      });
      triggerCozyConfetti();
    }
  };

  const handleExportJournal = () => {
    const memoryExport = {
      petName: pet.name,
      breed: pet.breed,
      daysTogether: 1528,
      exportedAt: new Date().toISOString(),
      memories: entries.map(e => ({
        date: e.date,
        caption: e.caption,
        mood: e.mood,
        activity: e.activityDone,
        tags: e.tags
      }))
    };

    const blob = new Blob([JSON.stringify(memoryExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pet.name}_Bonding_Journal_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 text-stone-800">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-semibold shadow-xl border border-stone-700 flex items-center gap-2"
        >
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Simulated Browser Permission Modal */}
      <MockBrowserPermissionDialog
        isOpen={showPermissionDialog}
        pet={pet}
        preferredTime={formatDisplayTime(settings.reminderTime)}
        onAllow={handleAllowPermission}
        onBlock={handleBlockPermission}
      />

      {/* 1. NOTIFICATION & REMINDER PREFERENCE */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-amber-200/70 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Daily Bonding Reminders
                </h3>
                {settings.reminderEnabled && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-stone-500 mt-0.5 leading-snug">
                Mock browser push notifications to nudge your daily check-in
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            id="toggle-daily-reminder-switch"
            onClick={handleToggleReminder}
            aria-label="Toggle daily bonding notifications"
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              settings.reminderEnabled ? 'bg-amber-500' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform ${
                settings.reminderEnabled ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {settings.reminderEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-stone-100 space-y-4"
          >
            {/* Preferred Time Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Preferred Time of Day</span>
                </label>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {formatDisplayTime(settings.reminderTime)}
                </span>
              </div>

              {/* Time Input */}
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  id="reminder-time-input"
                  value={settings.reminderTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Quick Time Preset Chips */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {timePresets.map((preset) => {
                  const isSelected = settings.reminderTime === preset.time;
                  return (
                    <button
                      key={preset.time}
                      id={`preset-time-${preset.time.replace(':', '-')}`}
                      onClick={() => handleTimeChange(preset.time)}
                      className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold text-left transition-all border ${
                        isSelected
                          ? 'bg-amber-100/70 border-amber-400 text-amber-900 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nudge Tone / Style Selection */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Nudge Tone & Message</span>
              </label>

              <div className="space-y-1.5">
                {nudgeStyles.map((style) => {
                  const isSelected = (settings.reminderStyle || 'cuddle') === style.id;
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      id={`nudge-style-${style.id}`}
                      onClick={() => handleNudgeStyleSelect(style.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-300'
                          : 'bg-stone-50/60 hover:bg-stone-100/80 border-stone-200'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{style.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <p className="text-[10.5px] text-stone-500 mt-0.5 leading-tight truncate">
                          {style.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound & Web Push Permission Settings */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  id="toggle-notification-sound-btn"
                  onClick={handleToggleSound}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    settings.notificationSound ?? true
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {settings.notificationSound ?? true ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sound: On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Sound: Muted</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Web Push</span>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="pt-1">
              <button
                id="test-notification-sample-btn"
                onClick={handleSendTestNotification}
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Mock Push Notification Now</span>
              </button>
              <p className="text-[10.5px] text-stone-400 text-center mt-1.5">
                Simulates real-time browser push with immediate "Log Moment" action
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 2. ADD NEW PET (Locked behind Pro) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-stone-200/70 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Add Another Pet
              </h3>
              <p className="text-[11px] text-stone-500">
                Track dogs, cats, bunnies, and multiple fur companions
              </p>
            </div>
          </div>

          {!settings.isPro && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> PRO
            </span>
          )}
        </div>

        {settings.isPro ? (
          <button
            onClick={() => showToast('Multi-pet manager unlocked in Pro mode!')}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-sm"
          >
            + Add New Pet Profile
          </button>
        ) : (
          <button
            id="add-new-pet-pro-lock-btn"
            onClick={onOpenPro}
            className="w-full py-3 px-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-dashed border-stone-300 hover:border-amber-300 transition-all flex items-center justify-center gap-2 text-stone-600 hover:text-amber-900 text-xs font-semibold"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Unlock Unlimited Pet Profiles with Pro ($4.99)</span>
          </button>
        )}
      </div>

      {/* 3. THEME SELECTOR (Locked behind Pro) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-stone-200/70 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Theme Color Palette
              </h3>
              <p className="text-[11px] text-stone-500">
                Cozy custom aesthetic palettes
              </p>
            </div>
          </div>

          {!settings.isPro && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" /> PRO
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {themes.map((t) => {
            const isSelected = settings.theme === t.id;
            const isLocked = t.isPro && !settings.isPro;

            return (
              <button
                key={t.id}
                id={`theme-select-${t.id}`}
                onClick={() => handleThemeSelect(t.id, t.isPro)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-300/50 bg-amber-50/40'
                    : 'border-stone-200/80 bg-stone-50/50 hover:bg-stone-100/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="w-5 h-5 rounded-full shadow-2xs border border-white"
                    style={{ backgroundColor: t.color }}
                  />
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  ) : isSelected ? (
                    <Check className="w-4 h-4 text-amber-600 font-bold" />
                  ) : null}
                </div>

                <div className="text-xs font-bold text-stone-800 truncate">{t.name}</div>
                <div className="text-[10px] text-stone-400">{t.isPro ? 'Pro Palette' : 'Free Default'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. EXPORT & DATA BACKUP */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-stone-200/70 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Download className="w-4 h-4 text-amber-600" />
          <span>Journal Backup & Export</span>
        </h3>

        <p className="text-xs text-stone-600 leading-relaxed">
          Download a complete copy of all photo captions, bonding moods, and milestones for {pet.name}.
        </p>

        <button
          id="export-journal-backup-btn"
          onClick={handleExportJournal}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export {pet.name}'s Memory Book (JSON)</span>
        </button>

        {exportSuccess && (
          <p className="text-xs text-emerald-700 font-medium text-center">
            ✨ Memory backup downloaded successfully!
          </p>
        )}

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] text-stone-400">Experience controls</span>
          <div className="flex items-center gap-3">
            {onShowSplash && (
              <button
                type="button"
                id="replay-splash-screen-btn"
                onClick={onShowSplash}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>✨ View Splash Screen</span>
              </button>
            )}
            <button
              id="reset-sample-data-btn"
              onClick={() => {
                if (confirm('Reset to initial sample data for Max?')) {
                  onResetData();
                }
              }}
              className="text-[11px] text-stone-500 hover:text-stone-700 flex items-center gap-1 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset sample data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
