import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Pet } from '../types';
import { PawIcon } from './PawIcon';

interface SplashScreenProps {
  pet: Pet;
  onFinish: () => void;
  streak?: number;
}

const WARM_PET_QUOTES = [
  "Every tail wag and gentle purr is a memory worth keeping ✨",
  "Your pet doesn't need perfection, just your presence 🐾",
  "A little bonding every day builds a lifetime of devotion 💖",
  "Sniff walks and sunbeams make the sweetest moments 🌿",
  "The greatest gift you give your pet is your joyful attention 🐕"
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  pet,
  onFinish,
  streak = 12
}) => {
  const [progress, setProgress] = useState(0);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * WARM_PET_QUOTES.length));
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingSteps = [
    `Waking up ${pet.name}'s journal...`,
    `Gathering tender moments & memories...`,
    `Tuning today's bonding challenges...`,
    `Ready for joyful adventures with ${pet.name}!`
  ];

  useEffect(() => {
    // Smooth progress animation over ~1.9s
    const startTime = Date.now();
    const duration = 1900;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setLoadingTextIndex(0);
      } else if (pct < 65) {
        setLoadingTextIndex(1);
      } else if (pct < 90) {
        setLoadingTextIndex(2);
      } else {
        setLoadingTextIndex(3);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 350);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      id="app-splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.45, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FFF3DC] text-stone-800 p-6 select-none overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-orange-200/35 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />

      {/* Floating subtle paw prints */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-10 text-amber-500 pointer-events-none"
      >
        <PawIcon className="w-8 h-8 rotate-[-15deg]" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-24 right-10 text-amber-600 pointer-events-none"
      >
        <PawIcon className="w-10 h-10 rotate-[25deg]" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-8 text-amber-400 pointer-events-none"
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      {/* Top Header bar with Skip button */}
      <header className="w-full max-w-sm flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-amber-200/70 shadow-2xs">
          <PawIcon className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] font-bold text-amber-900 tracking-wide uppercase">Daily Bonding Journal</span>
        </div>

        <button
          id="splash-skip-btn"
          type="button"
          onClick={onFinish}
          className="group flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-200/80 active:scale-95 text-amber-900 text-xs font-semibold shadow-2xs border border-amber-300/50 transition-all cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* Main Center Content */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto space-y-6">
        {/* Animated Pet Emblem / Avatar */}
        <div className="relative">
          {/* Pulsing glow halo rings */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400/40 via-orange-300/40 to-amber-200/30 blur-md pointer-events-none"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2.5 rounded-full border-2 border-dashed border-amber-400/60 pointer-events-none"
          />

          {/* Avatar Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-amber-900/10 bg-amber-50"
          >
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center"
          >
            <Heart className="w-4 h-4 fill-white" />
          </motion.div>
        </div>

        {/* App Title & Pet Greeting */}
        <div className="space-y-2">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-stone-900">
              Paw<span className="text-amber-600">Bond</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xs font-semibold tracking-wider uppercase text-amber-800/80"
          >
            Cherish Every Moment with {pet.name}
          </motion.p>
        </div>

        {/* Inspiring Warm Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="p-3.5 bg-white/75 backdrop-blur-md rounded-2xl border border-amber-200/60 shadow-2xs text-xs text-stone-700 font-serif italic leading-relaxed max-w-xs"
        >
          "{WARM_PET_QUOTES[quoteIndex]}"
        </motion.div>

        {/* Progress bar and Paw Steps */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🐾
              </motion.span>
              <span>{loadingSteps[loadingTextIndex]}</span>
            </span>
            <span className="text-amber-700 font-mono">{progress}%</span>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-2.5 bg-amber-100/90 rounded-full overflow-hidden border border-amber-200/80 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Paw prints indicating progress milestones */}
          <div className="flex justify-between px-1 pt-0.5">
            {[25, 50, 75, 100].map((step, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scale: progress >= step ? [1, 1.3, 1] : 1,
                  opacity: progress >= step ? 1 : 0.25
                }}
                className={`transition-colors ${progress >= step ? 'text-amber-600' : 'text-stone-300'}`}
              >
                <PawIcon className="w-3.5 h-3.5" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <footer className="w-full max-w-sm flex flex-col items-center gap-2 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span className="flex items-center gap-1 text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200/60">
            🔥 {streak} Day Streak Active
          </span>
          <span>•</span>
          <span>Offline Ready</span>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="text-xs text-stone-400 hover:text-amber-800 transition-colors underline underline-offset-2 cursor-pointer"
        >
          Tap anywhere or click to enter
        </button>
      </footer>
    </motion.div>
  );
};
