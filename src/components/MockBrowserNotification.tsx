import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Camera, Clock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Pet } from '../types';

export interface MockNotificationPayload {
  title: string;
  body: string;
  pet: Pet;
  timestamp?: string;
  tag?: string;
}

interface MockBrowserNotificationProps {
  notification: MockNotificationPayload | null;
  onClose: () => void;
  onLogMoment: () => void;
  onSnooze: () => void;
}

export const MockBrowserNotification: React.FC<MockBrowserNotificationProps> = ({
  notification,
  onClose,
  onLogMoment,
  onSnooze
}) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key="browser-push-notification"
          initial={{ opacity: 0, y: -60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[92%] max-w-md pointer-events-auto mt-[env(safe-area-inset-top,0px)]"
        >
          <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-stone-700/60 ring-1 ring-black/20">
            {/* Top Browser Metatag */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5 font-medium">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[9px] font-bold">
                  🐾
                </div>
                <span className="text-stone-300 font-semibold">Pet Daily Companion</span>
                <span>•</span>
                <span>Web Push Notification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400">Just now</span>
                <button
                  id="dismiss-mock-notification-btn"
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Body */}
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={notification.pet.photoUrl}
                  alt={notification.pet.name}
                  className="w-11 h-11 rounded-xl object-cover border border-amber-400/40 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px]">
                  ✨
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white tracking-wide truncate">
                  {notification.title}
                </h4>
                <p className="text-[11.5px] text-stone-300 mt-0.5 leading-snug">
                  {notification.body}
                </p>
              </div>
            </div>

            {/* Notification Action Buttons */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-800">
              <button
                id="mock-notification-log-moment-btn"
                onClick={() => {
                  onClose();
                  onLogMoment();
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Log Moment Now</span>
              </button>

              <button
                id="mock-notification-snooze-btn"
                onClick={() => {
                  onSnooze();
                  onClose();
                }}
                className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-98 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Snooze 10m</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
