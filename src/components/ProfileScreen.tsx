import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Heart,
  Sparkles,
  Award,
  Edit3,
  Camera,
  Gift,
  Smile,
  X,
  Check,
  Flame,
  Star,
  Plus,
  Trash2
} from 'lucide-react';
import { Pet, AchievementBadge, FavoriteThing } from '../types';
import { calculateDaysTogether } from '../utils/storage';
import { PawIcon } from './PawIcon';
import { SAMPLE_PET_PHOTOS, INITIAL_PET } from '../data/mockData';
import { triggerCozyConfetti } from '../utils/confetti';

interface ProfileScreenProps {
  pet: Pet;
  onUpdatePet: (updatedPet: Pet) => void;
  badges: AchievementBadge[];
  streak: number;
}

const PRESET_FAVORITE_CATEGORIES = [
  { category: 'Favorite Nap Spot', emoji: '☀️', placeholder: 'e.g. Sunny rug near the bay window' },
  { category: 'Favorite Toy', emoji: '🎾', placeholder: 'e.g. Squeaky plush duck or tennis ball' },
  { category: 'Favorite Treat', emoji: '🥜', placeholder: 'e.g. Peanut butter spoonfuls, beef jerky' },
  { category: 'Favorite Walk Spot', emoji: '🌲', placeholder: 'e.g. Pine River Trail & lake bank' },
  { category: 'Comfort Item', emoji: '🧸', placeholder: 'e.g. Old blue fleece puppy blanket' },
  { category: 'Favorite Game', emoji: '🪢', placeholder: 'e.g. Gentle tug of war in hallway' },
  { category: 'Favorite Scratch Spot', emoji: '💖', placeholder: 'e.g. Right behind the left ear' },
  { category: 'Morning Ritual', emoji: '🌅', placeholder: 'e.g. Big full-body stretch & snout boop' }
];

const PRESET_EMOJIS = ['🎾', '🥜', '☀️', '🌲', '🧸', '🪢', '💖', '🍖', '🛋️', '🥩', '🐾', '🌅', '💤', '🛁'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  pet,
  onUpdatePet,
  badges,
  streak
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pet.name);
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>(pet.species || 'dog');
  const [breed, setBreed] = useState(pet.breed);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(pet.gender || 'male');
  const [weight, setWeight] = useState(pet.weight || '28 lbs');
  const [microchipId, setMicrochipId] = useState(pet.microchipId || '');
  const [bio, setBio] = useState(pet.bio || 'Gentle soul with a heart of gold. Loves sunshine, belly rubs, and playing catch.');
  const [birthday, setBirthday] = useState(pet.birthday);
  const [adoptionDate, setAdoptionDate] = useState(pet.adoptionDate);
  const [photoUrl, setPhotoUrl] = useState(pet.photoUrl);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [favoriteToy, setFavoriteToy] = useState(pet.favoriteToy);
  const [favoriteTreat, setFavoriteTreat] = useState(pet.favoriteTreat);
  const [favoriteActivity, setFavoriteActivity] = useState(pet.favoriteActivity);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state when pet changes or edit modal opens
  React.useEffect(() => {
    setName(pet.name);
    setSpecies(pet.species || 'dog');
    setBreed(pet.breed);
    setGender(pet.gender || 'male');
    setWeight(pet.weight || '28 lbs');
    setMicrochipId(pet.microchipId || '');
    setBio(pet.bio || 'Gentle soul with a heart of gold. Loves sunshine, belly rubs, and playing catch.');
    setBirthday(pet.birthday);
    setAdoptionDate(pet.adoptionDate);
    setPhotoUrl(pet.photoUrl);
    setFavoriteToy(pet.favoriteToy);
    setFavoriteTreat(pet.favoriteTreat);
    setFavoriteActivity(pet.favoriteActivity);
  }, [pet, isEditing]);

  // Favorite Things Modal & Item State
  const [isFavModalOpen, setIsFavModalOpen] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<FavoriteThing | null>(null);
  const [favCategory, setFavCategory] = useState('');
  const [favValue, setFavValue] = useState('');
  const [favEmoji, setFavEmoji] = useState('🎾');

  const daysTogether = calculateDaysTogether(pet.adoptionDate);

  const favoriteThingsList: FavoriteThing[] =
    pet.favoriteThings && pet.favoriteThings.length > 0
      ? pet.favoriteThings
      : INITIAL_PET.favoriteThings || [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Pet = {
      ...pet,
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: weight.trim(),
      microchipId: microchipId.trim() || undefined,
      bio: bio.trim() || undefined,
      birthday,
      adoptionDate,
      photoUrl,
      favoriteToy: favoriteToy.trim(),
      favoriteTreat: favoriteTreat.trim(),
      favoriteActivity: favoriteActivity.trim()
    };
    onUpdatePet(updated);
    setIsEditing(false);
    triggerCozyConfetti();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddFavorite = () => {
    setEditingFavorite(null);
    setFavCategory('Favorite Nap Spot');
    setFavValue('');
    setFavEmoji('☀️');
    setIsFavModalOpen(true);
  };

  const handleStartEditFavorite = (item: FavoriteThing) => {
    setEditingFavorite(item);
    setFavCategory(item.category);
    setFavValue(item.value);
    setFavEmoji(item.emoji || '🎾');
    setIsFavModalOpen(true);
  };

  const handleSaveFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!favCategory.trim() || !favValue.trim()) return;

    let updatedList: FavoriteThing[];

    if (editingFavorite) {
      updatedList = favoriteThingsList.map((item) =>
        item.id === editingFavorite.id
          ? { ...item, category: favCategory.trim(), value: favValue.trim(), emoji: favEmoji }
          : item
      );
    } else {
      const newItem: FavoriteThing = {
        id: `fav_${Date.now()}`,
        category: favCategory.trim(),
        value: favValue.trim(),
        emoji: favEmoji
      };
      updatedList = [...favoriteThingsList, newItem];
    }

    // Sync legacy properties if toy or treat is edited
    const updatedPet: Pet = {
      ...pet,
      favoriteThings: updatedList
    };

    if (favCategory.toLowerCase().includes('toy')) {
      updatedPet.favoriteToy = favValue.trim();
      setFavoriteToy(favValue.trim());
    } else if (favCategory.toLowerCase().includes('treat')) {
      updatedPet.favoriteTreat = favValue.trim();
      setFavoriteTreat(favValue.trim());
    }

    onUpdatePet(updatedPet);
    setIsFavModalOpen(false);
    triggerCozyConfetti();
  };

  const handleDeleteFavorite = (id: string) => {
    const updatedList = favoriteThingsList.filter((item) => item.id !== id);
    onUpdatePet({
      ...pet,
      favoriteThings: updatedList
    });
  };

  const calculateAge = (bdayStr: string) => {
    const bday = new Date(bdayStr);
    const now = new Date('2026-08-27');
    let years = now.getFullYear() - bday.getFullYear();
    const m = now.getMonth() - bday.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bday.getDate())) {
      years--;
    }
    return `${years} years old`;
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* 1. Hero Card: Pet Profile Photo & Days Together */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-amber-200/70 shadow-sm relative overflow-hidden text-stone-800">
        {/* Edit Button */}
        <button
          id="open-edit-pet-profile-btn"
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Avatar with Golden Ring */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-md">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-sm">
              <PawIcon className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-3">
            {pet.name}
          </h2>
          <p className="text-xs font-semibold text-amber-800">
            {pet.breed} • {calculateAge(pet.birthday)}
          </p>

          {/* Days Together Counter (Prominent) */}
          <div className="mt-4 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 flex items-center justify-around">
            <div className="text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Days Together
              </div>
              <div className="text-2xl font-extrabold text-amber-900 flex items-center justify-center gap-1">
                <span>💛</span>
                <span>{daysTogether.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-stone-500">Since Gotcha Day</div>
            </div>

            <div className="w-px h-10 bg-amber-200" />

            <div className="text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Bonding Streak
              </div>
              <div className="text-2xl font-extrabold text-orange-600 flex items-center justify-center gap-1">
                <span>🔥</span>
                <span>{streak} days</span>
              </div>
              <div className="text-[10px] text-stone-500">Active rhythm</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Favorite Things Section (User-Editable List) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{pet.name}'s Favorite Things</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5 truncate">
              Comfort items, favorite spots & treats that make {pet.name} happiest
            </p>
          </div>

          <button
            id="add-favorite-thing-btn"
            onClick={handleOpenAddFavorite}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Favorite</span>
          </button>
        </div>

        {/* Favorite items list */}
        <div className="space-y-2">
          {favoriteThingsList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-stone-50/80 hover:bg-amber-50/40 border border-stone-200/80 hover:border-amber-200/80 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9.5 h-9.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider truncate">
                    {item.category}
                  </div>
                  <div className="text-xs font-bold text-stone-800 truncate mt-0.5">
                    {item.value}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleStartEditFavorite(item)}
                  className="w-7 h-7 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-100/60 active:scale-95 flex items-center justify-center transition-all"
                  title="Edit favorite item"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteFavorite(item.id)}
                  className="w-7 h-7 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 flex items-center justify-center transition-all"
                  title="Remove favorite item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips to add fast */}
        <div className="pt-1 border-t border-stone-100">
          <div className="text-[10.5px] font-semibold text-stone-400 mb-1.5">
            Quick suggestion ideas:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {PRESET_FAVORITE_CATEGORIES.slice(0, 4).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setEditingFavorite(null);
                  setFavCategory(preset.category);
                  setFavEmoji(preset.emoji);
                  setFavValue('');
                  setIsFavModalOpen(true);
                }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 text-[10.5px] font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <span>{preset.emoji}</span>
                <span>+{preset.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Key Bio Details */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-stone-200/70 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>About {pet.name}</span>
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Info</span>
          </button>
        </div>

        {pet.bio && (
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs text-stone-800 leading-relaxed font-serif italic">
            "{pet.bio}"
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Birthday</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5">
              {new Date(pet.birthday + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Gotcha Day</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5">
              {new Date(pet.adoptionDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Gender</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5 capitalize flex items-center gap-1">
              <span>{pet.gender === 'female' ? '♀ Girl' : '♂ Boy'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Weight</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5">
              {pet.weight || '28 lbs'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Favorite Toy</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5 flex items-center gap-1 truncate">
              <span>🎾</span>
              <span className="truncate">{pet.favoriteToy}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] text-stone-400 font-medium">Favorite Treat</div>
            <div className="text-xs font-bold text-stone-800 mt-0.5 flex items-center gap-1 truncate">
              <span>🥜</span>
              <span className="truncate">{pet.favoriteTreat}</span>
            </div>
          </div>
        </div>

        {pet.microchipId && (
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium text-[11px]">Microchip ID:</span>
            <span className="font-mono font-bold text-stone-800 text-[11px]">{pet.microchipId}</span>
          </div>
        )}

        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
          <div className="text-[11px] text-amber-800 font-bold">Favorite Bonding Activity</div>
          <div className="text-xs font-medium text-stone-700 mt-0.5">
            {pet.favoriteActivity}
          </div>
        </div>

        {/* Personality Quirks */}
        <div>
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            Personality Quirks We Love
          </div>
          <div className="space-y-1.5">
            {pet.personalityQuirks.map((quirk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                  🐾
                </span>
                <span>{quirk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bonding Milestones & Badges */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Bonding Badges</span>
          </h3>
          <span className="inline-flex items-center text-[10.5px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap shadow-2xs">
            {badges.filter(b => b.unlockedAt).length}/{badges.length} Unlocked
          </span>
        </div>

        <div className="space-y-2.5">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-stone-50/50 border-stone-200 opacity-75'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs ${
                    isUnlocked ? 'bg-white border border-amber-200' : 'bg-stone-200/60 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        Earned ✨
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] text-stone-600 font-semibold bg-stone-100 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {badge.progress}/{badge.total}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Favorite Thing Modal */}
      <AnimatePresence>
        {isFavModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFavModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-100 text-stone-800 pb-safe"
            >
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{favEmoji}</span>
                  <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                    {editingFavorite ? `Edit ${favCategory || 'Favorite'}` : `Add to ${pet.name}'s Favorites`}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFavModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveFavorite} className="space-y-4">
                {/* Category Preset Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Category / Label
                  </label>
                  <input
                    type="text"
                    value={favCategory}
                    onChange={(e) => setFavCategory(e.target.value)}
                    placeholder="e.g. Favorite Nap Spot, Favorite Toy, Favorite Treat"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                  <div className="flex gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar -mx-0.5 px-0.5">
                    {PRESET_FAVORITE_CATEGORIES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFavCategory(preset.category);
                          setFavEmoji(preset.emoji);
                        }}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                          favCategory === preset.category
                            ? 'bg-amber-500 text-white font-bold shadow-2xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                      >
                        {preset.emoji} {preset.category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emoji Picker */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Icon Emoji
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {PRESET_EMOJIS.map((emoji, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFavEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border transition-all ${
                          favEmoji === emoji
                            ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 scale-105'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value / Description */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Specific Favorite Detail
                  </label>
                  <input
                    type="text"
                    value={favValue}
                    onChange={(e) => setFavValue(e.target.value)}
                    placeholder="e.g. Sunny rug near the living room window"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFavModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-favorite-thing-btn"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingFavorite ? 'Save Update' : 'Add to Favorites'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md max-h-[88vh] sm:max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-100 text-stone-800 pb-safe"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                  Edit {pet.name}'s Profile
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* 1. Pet Photo Management Section */}
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pet Profile Photo</span>
                    </label>
                    <span className="text-[10px] text-amber-800 font-medium">Custom or Sample</span>
                  </div>

                  {/* Photo Preview & Quick Upload Action */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-amber-400 shrink-0 shadow-md">
                      <img
                        src={photoUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          id="profile-upload-device-photo-btn"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-stone-500">
                        Supports camera photos, device files, or web URLs
                      </p>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Optional URL input */}
                  {showUrlInput && (
                    <div className="pt-1 flex items-center gap-1.5">
                      <input
                        type="url"
                        placeholder="https://example.com/pet.jpg"
                        value={customPhotoInput}
                        onChange={(e) => setCustomPhotoInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoInput.trim()) {
                            setPhotoUrl(customPhotoInput.trim());
                            setCustomPhotoInput('');
                            setShowUrlInput(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl shadow-2xs"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Sample Photos Gallery Strip */}
                  <div className="pt-1">
                    <span className="text-[10.5px] font-semibold text-stone-600 block mb-1.5">
                      Or pick from sample pet portraits:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {SAMPLE_PET_PHOTOS.map((photo, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setPhotoUrl(photo)}
                          className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                            photoUrl === photo
                              ? 'border-amber-500 ring-2 ring-amber-300 scale-105 shadow-xs'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {photoUrl === photo && (
                            <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Basic Info */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Pet Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Species</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['dog', 'cat', 'other'] as const).map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => setSpecies(sp)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                          species === sp
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {sp === 'dog' ? '🐶 Dog' : sp === 'cat' ? '🐱 Cat' : '🐰 Other'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breed & Gender */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Breed / Mix</label>
                    <input
                      type="text"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="male">♂ Boy (Male)</option>
                      <option value="female">♀ Girl (Female)</option>
                      <option value="other">🐾 Companion</option>
                    </select>
                  </div>
                </div>

                {/* Birthday & Gotcha Day */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Birthday</label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Gotcha / Adoption Day</label>
                    <input
                      type="date"
                      value={adoptionDate}
                      onChange={(e) => setAdoptionDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Weight & Microchip ID */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 28 lbs / 12 kg"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Microchip / Tag ID</label>
                    <input
                      type="text"
                      value={microchipId}
                      onChange={(e) => setMicrochipId(e.target.value)}
                      placeholder="e.g. 985141002"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bio / Personality description */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Bio / Personality</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe their lovable quirks, personality, or what brings them joy..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Favorites */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Favorite Toy</label>
                    <input
                      type="text"
                      value={favoriteToy}
                      onChange={(e) => setFavoriteToy(e.target.value)}
                      placeholder="e.g. Plush duck"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Favorite Treat</label>
                    <input
                      type="text"
                      value={favoriteTreat}
                      onChange={(e) => setFavoriteTreat(e.target.value)}
                      placeholder="e.g. Peanut butter"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Favorite Activity</label>
                    <input
                      type="text"
                      value={favoriteActivity}
                      onChange={(e) => setFavoriteActivity(e.target.value)}
                      placeholder="e.g. Sunny cuddle"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-edited-pet-profile-btn"
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes ✨</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
