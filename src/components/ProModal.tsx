import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Heart, ShieldCheck, Crown } from 'lucide-react';
import { PawIcon } from './PawIcon';
import { triggerCozyConfetti } from '../utils/confetti';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onUpgradePro: (status: boolean) => void;
  customTitle?: string;
  customDescription?: string;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onUpgradePro,
  customTitle,
  customDescription
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [justUpgraded, setJustUpgraded] = useState(false);

  const perks = [
    {
      title: 'Unlimited Pet Profiles',
      desc: 'Add dogs, cats, bunnies, and track unique bonds for every fur baby.',
      icon: <PawIcon className="w-5 h-5 text-amber-500" />
    },
    {
      title: 'AI Daily Activity Generator',
      desc: 'Fresh, personalized 2-minute games tailored to your pet\'s energy.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    },
    {
      title: 'Cozy Custom Color Themes',
      desc: 'Unlock Sage Meadow, Peach Sunset, and Lavender Dream palettes.',
      icon: <Heart className="w-5 h-5 text-rose-500" />
    },
    {
      title: 'Full-Res Printable Memory Book',
      desc: 'Export monthly polaroids and heartfelt milestones as high-res memories.',
      icon: <Crown className="w-5 h-5 text-amber-500" />
    },
    {
      title: '100% Ad-Free Quiet Journal',
      desc: 'Pure cozy bonding time with zero interruptions or distractions.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
    }
  ];

  const handleUpgrade = () => {
    onUpgradePro(true);
    setJustUpgraded(true);
    triggerCozyConfetti();
    setTimeout(() => {
      setJustUpgraded(false);
      onClose();
    }, 1800);
  };

  const handleDowngrade = () => {
    onUpgradePro(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
          />

          {/* Dialog / Mobile Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-100/80 text-stone-800 pb-safe"
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />
            {/* Close Button */}
            <button
              id="close-pro-modal-button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Crown icon */}
            <div className="text-center pt-2 pb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mb-3 shadow-inner">
                <Crown className="w-8 h-8 fill-amber-500 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900">
                {customTitle || (isPro ? 'You are a Pet Companion Pro Member!' : 'Pet Daily Companion Pro')}
              </h2>
              <p className="text-sm text-stone-600 mt-1.5 px-2">
                {customDescription || (isPro ? 'Enjoy unlimited bonding moments, cozy themes, and custom memory albums.' : 'Deepen your everyday connection with heartfelt activities, unlimited pets, and ad-free serenity.')}
              </p>
            </div>

            {isPro ? (
              <div className="space-y-4 my-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold mb-1">
                    <Check className="w-5 h-5 text-emerald-600" /> Pro Membership Active
                  </div>
                  <p className="text-xs text-emerald-700">Thank you for supporting cozy daily bonding with your furry best friend.</p>
                </div>
                <button
                  id="manage-plan-downgrade-button"
                  onClick={handleDowngrade}
                  className="w-full py-2.5 px-4 text-xs text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors font-medium"
                >
                  Switch back to Free Tier (Prototype Toggle)
                </button>
              </div>
            ) : (
              <>
                {/* Plan Toggle */}
                <div className="grid grid-cols-2 gap-2.5 my-4 p-1 bg-amber-50/80 rounded-2xl border border-amber-200/60">
                  <button
                    id="plan-yearly-button"
                    onClick={() => setSelectedPlan('yearly')}
                    className={`py-2.5 px-3 rounded-xl text-left transition-all relative ${
                      selectedPlan === 'yearly'
                        ? 'bg-white shadow-sm border border-amber-200 text-stone-900'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-amber-500 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                      Save 33%
                    </span>
                    <div className="text-xs font-semibold text-stone-500">Yearly Plan</div>
                    <div className="text-lg font-bold text-amber-900">$3.33<span className="text-xs font-normal text-stone-500">/mo</span></div>
                    <div className="text-[11px] text-stone-500">$39.99 billed annually</div>
                  </button>

                  <button
                    id="plan-monthly-button"
                    onClick={() => setSelectedPlan('monthly')}
                    className={`py-2.5 px-3 rounded-xl text-left transition-all ${
                      selectedPlan === 'monthly'
                        ? 'bg-white shadow-sm border border-amber-200 text-stone-900'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <div className="text-xs font-semibold text-stone-500">Monthly Plan</div>
                    <div className="text-lg font-bold text-amber-900">$4.99<span className="text-xs font-normal text-stone-500">/mo</span></div>
                    <div className="text-[11px] text-stone-500">Cancel anytime</div>
                  </button>
                </div>

                {/* Perks list */}
                <div className="space-y-3 my-4">
                  {perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/50">
                      <div className="mt-0.5 shrink-0 p-1 bg-white rounded-lg shadow-2xs border border-amber-100">
                        {perk.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-800">{perk.title}</div>
                        <div className="text-[11px] text-stone-500 leading-relaxed">{perk.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="mt-6 space-y-2">
                  <button
                    id="try-pro-button"
                    onClick={handleUpgrade}
                    disabled={justUpgraded}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {justUpgraded ? (
                      <>
                        <Check className="w-5 h-5" /> Welcome to Pro! ✨
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-amber-200" /> Start 7-Day Free Trial
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-stone-400">
                    No commitment · Cancel anytime with 1 tap
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
