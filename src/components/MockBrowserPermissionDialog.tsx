import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, Check, X } from 'lucide-react';
import { Pet } from '../types';

interface MockBrowserPermissionDialogProps {
  isOpen: boolean;
  pet: Pet;
  preferredTime: string;
  onAllow: () => void;
  onBlock: () => void;
}

export const MockBrowserPermissionDialog: React.FC<MockBrowserPermissionDialogProps> = ({
  isOpen,
  pet,
  preferredTime,
  onAllow,
  onBlock
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 px-4 bg-black/40 backdrop-blur-2xs">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden ring-1 ring-black/10"
        >
          {/* Browser Address Bar Replica header */}
          <div className="bg-stone-100 px-3.5 py-2 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-600 truncate">
              <span className="text-emerald-600 font-bold">🔒</span>
              <span className="font-semibold text-stone-800 truncate">ais-dev.run.app</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Browser Permission
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-900 leading-snug">
                  "Pet Daily Companion" wants to show notifications
                </h4>
                <p className="text-[11.5px] text-stone-600 leading-relaxed">
                  Send a daily nudge at <strong className="text-amber-800">{preferredTime}</strong> to capture moments and keep your bonding streak with <strong>{pet.name}</strong> alive.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                id="mock-permission-block-btn"
                onClick={onBlock}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-600 transition-colors"
              >
                Block
              </button>
              <button
                id="mock-permission-allow-btn"
                onClick={onAllow}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Allow</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
