import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, PawPrint, Camera, Sparkles } from 'lucide-react';
import { Pet } from '../types';
import { SAMPLE_PET_PHOTOS } from '../data/mockData';
import { triggerCozyConfetti } from '../utils/confetti';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Pet) => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [breed, setBreed] = useState('');
  const [adoptionDate, setAdoptionDate] = useState('2024-01-01');
  const [birthday, setBirthday] = useState('2023-01-01');
  const [weight, setWeight] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PET_PHOTOS[1]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [favoriteToy, setFavoriteToy] = useState('');
  const [favoriteTreat, setFavoriteTreat] = useState('');
  const [quirk, setQuirk] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPet: Pet = {
      id: `pet_${Date.now()}`,
      name: name.trim(),
      species,
      gender,
      breed: breed.trim() || (species === 'dog' ? 'Mixed Breed' : species === 'cat' ? 'Domestic Shorthair' : 'Companion'),
      birthday: birthday || '2023-01-01',
      adoptionDate: adoptionDate || '2024-01-01',
      weight: weight.trim() || undefined,
      microchipId: microchipId.trim() || undefined,
      bio: bio.trim() || undefined,
      photoUrl: photoUrl || SAMPLE_PET_PHOTOS[0],
      favoriteToy: favoriteToy.trim() || 'Squeaky Plush Toy',
      favoriteTreat: favoriteTreat.trim() || 'Yummy Crunchies',
      personalityQuirks: quirk.trim() ? [quirk.trim()] : ['Loves cozy afternoon cuddles'],
      favoriteActivity: 'Exploring and relaxing together',
      favoriteThings: [
        {
          id: `fav_${Date.now()}_1`,
          category: 'Favorite Toy',
          value: favoriteToy.trim() || 'Squeaky Plush Toy',
          emoji: '🧸'
        },
        {
          id: `fav_${Date.now()}_2`,
          category: 'Favorite Treat',
          value: favoriteTreat.trim() || 'Yummy Crunchies',
          emoji: '🍖'
        }
      ]
    };

    onAddPet(newPet);
    triggerCozyConfetti();
    onClose();
    // Reset
    setName('');
    setBreed('');
    setBio('');
    setWeight('');
    setMicrochipId('');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-100/80 text-stone-800 pb-safe"
          >
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <PawPrint className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Add New Pet Profile</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pet Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pet's Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Luna, Milo, Bella"
                  className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                />
              </div>

              {/* Species & Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Species
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="dog">🐶 Dog</option>
                    <option value="cat">🐱 Cat</option>
                    <option value="other">🐰 Other / Small Pet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="male">♂ Boy (Male)</option>
                    <option value="female">♀ Girl (Female)</option>
                    <option value="other">🐾 Companion</option>
                  </select>
                </div>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Breed / Type
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever, Calico, Frenchie"
                  className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                />
              </div>

              {/* Birthday & Adoption Day */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Gotcha Day
                  </label>
                  <input
                    type="date"
                    value={adoptionDate}
                    onChange={(e) => setAdoptionDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Weight & Microchip ID */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Weight (optional)
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 24 lbs / 11 kg"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Microchip / Tag ID
                  </label>
                  <input
                    type="text"
                    value={microchipId}
                    onChange={(e) => setMicrochipId(e.target.value)}
                    placeholder="e.g. 985141002"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Bio / Personality Notes
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A few loving words about your pet's personality..."
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* Photo selection */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pet Avatar Photo</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Upload file</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] text-stone-600 font-medium hover:underline"
                    >
                      {showUrlInput ? 'Hide URL' : 'Paste URL'}
                    </button>
                  </div>
                </div>

                {/* Selected Photo Preview */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-2xs">
                    <img src={photoUrl} alt="Selected avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">Current Photo</div>
                    <div className="text-[10.5px] text-stone-500 truncate mt-0.5">Select a sample below or upload your pet's photo</div>
                  </div>
                </div>

                {showUrlInput && (
                  <div className="flex items-center gap-1.5 pt-1">
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
                      className="px-3 py-1.5 bg-stone-800 text-white font-bold text-xs rounded-xl shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {SAMPLE_PET_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        photoUrl === url
                          ? 'border-amber-500 ring-2 ring-amber-400/50 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Sample pet" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {photoUrl === url && (
                        <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Favorite Toy
                  </label>
                  <input
                    type="text"
                    value={favoriteToy}
                    onChange={(e) => setFavoriteToy(e.target.value)}
                    placeholder="e.g. Squeaky duck"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Favorite Treat
                  </label>
                  <input
                    type="text"
                    value={favoriteTreat}
                    onChange={(e) => setFavoriteTreat(e.target.value)}
                    placeholder="e.g. Salmon bites"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Pet Profile</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
