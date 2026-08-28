import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Image as ImageIcon, Sparkles, Check, Heart, Tag } from 'lucide-react';
import { DailyEntry, MoodType, Pet } from '../types';
import { MOOD_OPTIONS, SAMPLE_PET_PHOTOS } from '../data/mockData';
import { triggerCozyConfetti } from '../utils/confetti';
import { compressImageFile, ImageProcessingError } from '../utils/image';

interface AddMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
  onSaveMoment: (entry: DailyEntry) => void;
  initialMood?: MoodType;
  initialActivity?: string;
  initialCaption?: string;
  initialPhoto?: string;
  existingEntry?: DailyEntry;
}

export const AddMomentModal: React.FC<AddMomentModalProps> = ({
  isOpen,
  onClose,
  pet,
  onSaveMoment,
  initialMood = 'happy',
  initialActivity,
  initialCaption,
  initialPhoto,
  existingEntry
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(
    initialPhoto || existingEntry?.photoUrl || SAMPLE_PET_PHOTOS[0]
  );
  const [caption, setCaption] = useState(
    initialCaption || existingEntry?.caption || ''
  );
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    existingEntry?.mood || initialMood
  );
  const [entryDate, setEntryDate] = useState<string>(
    existingEntry?.date || new Date().toISOString().split('T')[0]
  );
  const [activityTag, setActivityTag] = useState(
    existingEntry?.activityDone || initialActivity || ''
  );
  const [bondingNote, setBondingNote] = useState(existingEntry?.bondingNote || '');
  const [customTagInput, setCustomTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(
    existingEntry?.tags || ['Daily Bond', 'Happy Moment']
  );
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or existingEntry / initial props change
  React.useEffect(() => {
    if (isOpen) {
      if (existingEntry) {
        setSelectedPhoto(existingEntry.photoUrl || initialPhoto || SAMPLE_PET_PHOTOS[0]);
        setCaption(existingEntry.caption || initialCaption || '');
        setSelectedMood(existingEntry.mood || initialMood);
        setEntryDate(existingEntry.date || new Date().toISOString().split('T')[0]);
        setActivityTag(existingEntry.activityDone || initialActivity || '');
        setBondingNote(existingEntry.bondingNote || '');
        setTags(existingEntry.tags || ['Daily Bond', 'Happy Moment']);
      } else {
        setSelectedPhoto(initialPhoto || SAMPLE_PET_PHOTOS[0]);
        setCaption(initialCaption || '');
        setSelectedMood(initialMood);
        setEntryDate(new Date().toISOString().split('T')[0]);
        setActivityTag(initialActivity || '');
        setBondingNote('');
        setTags(['Daily Bond', 'Happy Moment']);
      }
      setShowUrlInput(false);
      setCustomPhotoInput('');
    }
  }, [isOpen, existingEntry, initialMood, initialActivity, initialCaption, initialPhoto]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsProcessingPhoto(true);
    try {
      // Downscale + re-encode before it ever touches state/localStorage,
      // otherwise a handful of full-size phone photos can quietly blow
      // the localStorage quota and future saves fail silently.
      const compressed = await compressImageFile(file);
      setSelectedPhoto(compressed);
    } catch (err) {
      const message =
        err instanceof ImageProcessingError
          ? err.message
          : 'Could not process that photo. Please try a different one.';
      setPhotoError(message);
    } finally {
      setIsProcessingPhoto(false);
      // Allow re-selecting the same file again later
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (customTagInput.trim() && !tags.includes(customTagInput.trim())) {
      setTags([...tags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newEntry: DailyEntry = {
      id: existingEntry?.id || `entry_${Date.now()}`,
      date: entryDate || existingEntry?.date || new Date().toISOString().split('T')[0],
      petId: pet.id,
      photoUrl: selectedPhoto?.trim() ? selectedPhoto.trim() : undefined,
      caption: caption.trim(),
      mood: selectedMood,
      activityDone: activityTag.trim() || undefined,
      challengeCompleted: existingEntry?.challengeCompleted !== undefined ? existingEntry.challengeCompleted : true,
      bondingNote: bondingNote.trim() || undefined,
      tags: tags,
      createdAt: existingEntry?.createdAt || new Date().toISOString()
    };

    onSaveMoment(newEntry);
    triggerCozyConfetti();
    onClose();
  };

  const quickPrompts = [
    `That golden smile when we played fetch 🎾`,
    `Curled up right next to my legs while reading 📖`,
    `Did the sweetest head-tilt during breakfast 🥞`,
    `Pure zoomies after morning park stroll 🌿`
  ];

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

          {/* Modal Card / Mobile Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[88vh] sm:max-h-[92vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-100 text-stone-800 pb-safe"
          >
            {/* Mobile Sheet Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700">
                  <Heart className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                    {existingEntry ? "Edit Memory" : "Add Today's Moment"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {existingEntry ? `Update bonding memory with ${pet.name}` : `Capture a tender bonding memory with ${pet.name}`}
                  </p>
                </div>
              </div>
              <button
                id="close-add-moment-modal-button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              {/* Photo Preview & Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Photo of the Moment
                  </label>
                  {selectedPhoto && (
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(undefined)}
                      className="text-[11px] text-stone-400 hover:text-rose-600 font-semibold"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 aspect-4/3 flex items-center justify-center group shadow-xs">
                  {selectedPhoto ? (
                    <img
                      src={selectedPhoto}
                      alt="Moment preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="text-center p-4 cursor-pointer"
                    >
                      <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-600">Tap to upload a photo</p>
                      <p className="text-[10px] text-stone-400">or pick from samples below</p>
                    </div>
                  )}

                  {isProcessingPhoto && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[11px] font-semibold text-stone-600">Optimizing photo\u2026</p>
                    </div>
                  )}

                  {/* Upload overlay button */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      id="upload-custom-photo-button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-semibold shadow-md hover:bg-white flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
                    >
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span>{selectedPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium shadow-md hover:bg-white"
                    >
                      {showUrlInput ? 'Hide' : 'URL'}
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {photoError && (
                  <p className="text-[11px] font-semibold text-rose-600 pt-1.5">
                    {photoError}
                  </p>
                )}

                {showUrlInput && (
                  <div className="flex items-center gap-1.5 pt-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customPhotoInput.trim()) {
                          setSelectedPhoto(customPhotoInput.trim());
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

                {/* Preset Photo selector thumbnail strip */}
                <div className="mt-2.5">
                  <div className="text-[11px] text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>Or choose from sample moments:</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {SAMPLE_PET_PHOTOS.map((photo, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative w-13 h-13 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          selectedPhoto === photo
                            ? 'border-amber-500 ring-2 ring-amber-300/60 scale-105'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Preset ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {selectedPhoto === photo && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date of memory */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Date of Memory
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  How was {pet.name}'s vibe during this moment?
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MOOD_OPTIONS.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    return (
                      <button
                        type="button"
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-amber-100/90 border-amber-400 shadow-sm scale-105'
                            : 'bg-white/80 border-stone-200/70 hover:bg-amber-50/50'
                        }`}
                      >
                        <span className="text-2xl mb-1 filter drop-shadow-xs">{mood.emoji}</span>
                        <span className="text-[10px] font-semibold text-stone-700 text-center leading-tight truncate w-full">
                          {mood.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Today's Caption *
                  </label>
                  <span className="text-[11px] text-stone-400 font-normal">What made you smile?</span>
                </div>
                <textarea
                  id="moment-caption-input"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`e.g., ${pet.name} wouldn't stop wagging his tail when we came back from the meadow...`}
                  className="w-full px-3.5 py-2.5 text-sm bg-white rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all placeholder:text-stone-400"
                  required
                />

                {/* Quick Prompts Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {quickPrompts.slice(0, 2).map((prompt, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCaption(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/50 transition-colors text-left truncate max-w-full"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Note (Optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Journal Note & Reflections (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bondingNote}
                  onChange={(e) => setBondingNote(e.target.value)}
                  placeholder="Any extra thoughts, cute quirks, or private journal reflections..."
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                />
              </div>

              {/* Tags & Activity Done */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Activity Completed
                  </label>
                  <input
                    type="text"
                    id="activity-tag-input"
                    value={activityTag}
                    onChange={(e) => setActivityTag(e.target.value)}
                    placeholder="e.g. Scent Mystery Game"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tags
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      id="custom-tag-input"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag (e.g. River)"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-stone-100 text-stone-700 border border-stone-200/60"
                    >
                      <Tag className="w-3 h-3 text-stone-400" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-stone-900 text-stone-400 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="save-moment-submit-button"
                  disabled={!caption.trim() || isProcessingPhoto}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 fill-amber-200" />
                  <span>{existingEntry ? 'Save Changes' : "Save Today's Bonding Moment"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
