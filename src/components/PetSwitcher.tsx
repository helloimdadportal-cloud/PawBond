import React from 'react';
import { Plus, Crown, Check } from 'lucide-react';
import { Pet } from '../types';
import { PawIcon } from './PawIcon';

interface PetSwitcherProps {
  pets: Pet[];
  activePetId: string;
  onSelectPet: (petId: string) => void;
  onAddPetClick: () => void;
  isPro: boolean;
}

export const PetSwitcher: React.FC<PetSwitcherProps> = ({
  pets,
  activePetId,
  onSelectPet,
  onAddPetClick,
  isPro
}) => {
  return (
    <div className="bg-[#FFFDF9] rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
        <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider">
          <PawIcon className="w-3.5 h-3.5" color="#D97706" />
          <span>My Pets ({pets.length})</span>
        </div>

        {!isPro && (
          <button
            onClick={onAddPetClick}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-800 hover:bg-amber-200 text-[10.5px] font-bold transition-all shrink-0"
            title="Unlock unlimited pets with Pro"
          >
            <Crown className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
            <span>Multi-Pet (Pro)</span>
          </button>
        )}
      </div>

      {/* Avatar Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar scrollbar-none">
        {pets.map((petItem) => {
          const isActive = petItem.id === activePetId;
          return (
            <button
              key={petItem.id}
              id={`pet-switcher-btn-${petItem.id}`}
              onClick={() => onSelectPet(petItem.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-bold ring-2 ring-amber-400/40'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80 font-medium'
              }`}
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/80">
                <img
                  src={petItem.photoUrl}
                  alt={petItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </div>
              <span className="text-xs truncate max-w-[80px]">{petItem.name}</span>
              <span className="text-[10px] opacity-80 capitalize">({petItem.species})</span>
            </button>
          );
        })}

        {/* Add Pet Button */}
        <button
          id="pet-switcher-add-pet-btn"
          onClick={onAddPetClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/60 text-amber-800 text-xs font-bold transition-all shrink-0 active:scale-95"
          title={isPro ? 'Add another pet' : 'Add another pet (Pro)'}
        >
          <Plus className="w-3.5 h-3.5 text-amber-600" />
          <span>Add Pet</span>
          {!isPro && <Crown className="w-3 h-3 fill-amber-500 text-amber-600" />}
        </button>
      </div>
    </div>
  );
};
