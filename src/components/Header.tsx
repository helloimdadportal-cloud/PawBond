import React from 'react';
import { Sparkles, Crown, Bell } from 'lucide-react';
import { Pet, TabType } from '../types';
import { PawIcon } from './PawIcon';

interface HeaderProps {
  pet: Pet;
  streak: number;
  isPro: boolean;
  onOpenPro: () => void;
  onSelectTab: (tab: TabType) => void;
  currentTab: TabType;
}

export const Header: React.FC<HeaderProps> = ({
  pet,
  streak,
  isPro,
  onOpenPro,
  onSelectTab,
  currentTab
}) => {
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-amber-900/5 px-3 sm:px-4 pt-safe pt-2 pb-2.5 transition-all">
      {/* Top tier status banner if free */}
      {!isPro && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-100/80 border border-amber-200/80 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-amber-900 min-w-0 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
            <span className="truncate">1 pet · Basic journal · Free tier</span>
          </div>
          <button
            id="header-upgrade-pro-btn"
            onClick={onOpenPro}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-[10.5px] sm:text-[11px] font-bold shadow-2xs transition-all shrink-0 whitespace-nowrap"
          >
            <Crown className="w-3 h-3 fill-white shrink-0" />
            <span>Go Pro ($4.99)</span>
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Pet Name & Avatar */}
        <button
          id="header-pet-profile-btn"
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group min-w-0 flex-1"
        >
          <div className="relative shrink-0">
            <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-400 group-hover:border-amber-500 shadow-xs transition-all group-hover:scale-105">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs border-2 border-white">
              <PawIcon className="w-2 h-2" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold tracking-wider text-amber-800/80 uppercase whitespace-nowrap overflow-hidden">
              <span className="truncate">Bonding Journal</span>
              <span className="text-amber-500 font-bold">•</span>
              <span className="text-stone-500 font-medium shrink-0">{formattedDate}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold font-['Playfair_Display',serif] text-stone-900 truncate leading-tight group-hover:text-amber-900 transition-colors">
              Today with {pet.name}
            </h1>
          </div>
        </button>

        {/* Right side actions: Streak pill & Pro badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Streak Counter Pill */}
          <button
            id="header-streak-badge-btn"
            onClick={() => onSelectTab('stats')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] sm:text-xs shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
            title="View bonding streak & stats"
          >
            <span>🔥</span>
            <span>{streak} days</span>
          </button>

          {isPro ? (
            <button
              onClick={onOpenPro}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 active:scale-95 flex items-center justify-center transition-colors shrink-0"
              title="Pro Member Active"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </button>
          ) : (
            <button
              onClick={onOpenPro}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-800 active:scale-95 flex items-center justify-center transition-colors shrink-0"
              title="Upgrade to Pro"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
