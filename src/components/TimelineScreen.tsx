import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Heart,
  Sparkles,
  Filter,
  Search,
  Tag,
  X,
  Image as ImageIcon,
  ChevronRight,
  LayoutGrid,
  List,
  Camera,
  Maximize2,
  Edit3,
  Check,
  Smile,
  Pencil,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { DailyEntry, MoodType, Pet } from '../types';
import { MOOD_OPTIONS, SAMPLE_PET_PHOTOS } from '../data/mockData';
import { PawIcon } from './PawIcon';

interface TimelineScreenProps {
  entries: DailyEntry[];
  pet: Pet;
  onOpenAddMoment: () => void;
  onUpdateEntry?: (updatedEntry: DailyEntry) => void;
  onDeleteEntry?: (entryId: string) => void;
}

type ViewMode = 'timeline' | 'gallery';

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  entries,
  pet,
  onOpenAddMoment,
  onUpdateEntry,
  onDeleteEntry
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);

  // Comprehensive Edit mode state inside modal
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState('');
  const [editMood, setEditMood] = useState<MoodType>('happy');
  const [editDate, setEditDate] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | undefined>(undefined);
  const [editActivity, setEditActivity] = useState('');
  const [editBondingNote, setEditBondingNote] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [editChallengeCompleted, setEditChallengeCompleted] = useState(true);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    const matchesSearch =
      searchQuery === '' ||
      entry.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.activityDone && entry.activityDone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.tags && entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesMood && matchesSearch;
  });

  const photoEntries = filteredEntries.filter((entry) => !!entry.photoUrl);
  const totalPhotosCount = entries.filter((entry) => !!entry.photoUrl).length;

  const groupedByMonth: { [month: string]: DailyEntry[] } = {};

  filteredEntries.forEach((entry) => {
    const dateObj = new Date(entry.date + 'T12:00:00');
    const monthKey = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(entry);
  });

  const formatEntryDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + 'T12:00:00');
    return {
      day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: dateObj.getDate(),
      month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
      full: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  const getMoodEmoji = (mood: MoodType) => {
    return MOOD_OPTIONS.find(m => m.id === mood)?.emoji || '🐾';
  };

  const populateEditState = (entry: DailyEntry) => {
    setEditCaption(entry.caption);
    setEditMood(entry.mood);
    setEditDate(entry.date);
    setEditPhotoUrl(entry.photoUrl || '');
    setEditActivity(entry.activityDone || '');
    setEditBondingNote(entry.bondingNote || '');
    setEditTags(entry.tags || []);
    setEditChallengeCompleted(entry.challengeCompleted ?? true);
    setShowUrlInput(false);
    setCustomPhotoUrlInput('');
  };

  const handleOpenEntry = (entry: DailyEntry) => {
    setSelectedEntry(entry);
    populateEditState(entry);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setSaveSuccess(false);
  };

  const handleStartEditFromCard = (entry: DailyEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    populateEditState(entry);
    setIsEditing(true);
    setShowDeleteConfirm(false);
    setSaveSuccess(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !editTags.includes(newTagInput.trim())) {
      setEditTags([...editTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(t => t !== tagToRemove));
  };

  const handleSaveEdit = () => {
    if (!selectedEntry) return;
    const updated: DailyEntry = {
      ...selectedEntry,
      caption: editCaption.trim() || selectedEntry.caption,
      mood: editMood,
      date: editDate || selectedEntry.date,
      photoUrl: editPhotoUrl?.trim() ? editPhotoUrl.trim() : undefined,
      activityDone: editActivity.trim() || undefined,
      bondingNote: editBondingNote.trim() || undefined,
      tags: editTags.length > 0 ? editTags : undefined,
      challengeCompleted: editChallengeCompleted
    };

    if (onUpdateEntry) {
      onUpdateEntry(updated);
    }
    setSelectedEntry(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 600);
  };

  const handleCancelEdit = () => {
    if (selectedEntry) {
      populateEditState(selectedEntry);
    }
    setIsEditing(false);
  };

  const handleDeleteCurrentEntry = () => {
    if (!selectedEntry) return;
    if (onDeleteEntry) {
      onDeleteEntry(selectedEntry.id);
    }
    setSelectedEntry(null);
    setShowDeleteConfirm(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header Bar */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-sm space-y-3">
        {/* Row 1: Title and Add Memory Button */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Memory Journal</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-['Playfair_Display',serif] text-stone-900 mt-0.5 leading-tight">
              {viewMode === 'timeline' ? `Bonding Timeline with ${pet.name}` : `Photo Gallery for ${pet.name}`}
            </h2>
          </div>

          <button
            id="timeline-add-moment-btn"
            onClick={onOpenAddMoment}
            className="shrink-0 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <PawIcon className="w-3.5 h-3.5" color="#FFF" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Row 2: View Switcher (Timeline vs Gallery) + Search */}
        <div className="pt-2 border-t border-stone-100/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* View Mode Toggle Pill */}
          <div className="bg-stone-100 p-0.5 rounded-xl flex items-center border border-stone-200/80 shrink-0 self-start sm:self-auto w-full sm:w-auto">
            <button
              id="view-mode-timeline-btn"
              onClick={() => setViewMode('timeline')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Timeline List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              id="view-mode-gallery-btn"
              onClick={() => setViewMode('gallery')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'gallery'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Memory Gallery Masonry View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Gallery</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${viewMode === 'gallery' ? 'bg-amber-600/80 text-white' : 'bg-stone-200 text-stone-700'}`}>
                {totalPhotosCount}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="timeline-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                viewMode === 'gallery'
                  ? `Search ${photoEntries.length} photo moments...`
                  : 'Search memories, tags, or activities...'
              }
              className="w-full pl-8.5 pr-8 py-1.5 sm:py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Mood Filter pills */}
        <div className="pt-0.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap transition-all ${
                selectedMoodFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All {viewMode === 'gallery' ? `Photos (${totalPhotosCount})` : `(${entries.length})`}
            </button>
            {MOOD_OPTIONS.map((mood) => {
              const count = viewMode === 'gallery'
                ? entries.filter(e => e.mood === mood.id && !!e.photoUrl).length
                : entries.filter(e => e.mood === mood.id).length;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMoodFilter(mood.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 whitespace-nowrap flex items-center gap-1 transition-all ${
                    selectedMoodFilter === mood.id
                      ? 'bg-amber-500 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label.split(' ')[0]}</span>
                  {count > 0 && <span className="text-[10px] opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: MEMORY GALLERY (MASONRY GRID) */}
      {viewMode === 'gallery' && (
        <div>
          {entries.length === 0 ? (
            /* Empty state for totally empty pet memories */
            <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 text-center border border-amber-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
                  No memories yet
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Capture your first moment with <strong>{pet.name}</strong> today! Snap a photo or write a heartfelt note to start your scrapbook.
                </p>
              </div>
              <button
                id="empty-gallery-add-first-moment-btn"
                onClick={onOpenAddMoment}
                className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-xs transition-all inline-flex items-center gap-2"
              >
                <PawIcon className="w-4 h-4" color="#FFF" />
                <span>Capture First Moment</span>
              </button>
            </div>
          ) : photoEntries.length === 0 ? (
            <div className="bg-[#FFFDF9] rounded-3xl p-8 text-center border border-stone-200/70 shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No photo memories found</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {searchQuery || selectedMoodFilter !== 'all'
                  ? 'Try clearing your search or filters to see more photos.'
                  : `Add your first snapshot of ${pet.name} to start the visual gallery!`}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                {(searchQuery || selectedMoodFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMoodFilter('all');
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  onClick={onOpenAddMoment}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                >
                  + Add Photo Memory
                </button>
              </div>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 gap-3 space-y-3">
              {photoEntries.map((entry, index) => {
                const dateInfo = formatEntryDate(entry.date);
                const moodInfo = MOOD_OPTIONS.find(m => m.id === entry.mood);
                const aspectRatios = ['aspect-square', 'aspect-4/5', 'aspect-3/4', 'aspect-4/3'];
                const aspectClass = aspectRatios[index % aspectRatios.length];

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => handleOpenEntry(entry)}
                    className="break-inside-avoid relative group rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer block"
                  >
                    {/* Image */}
                    <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                      <img
                        src={entry.photoUrl}
                        alt={entry.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />

                      {/* Dark gradient overlay on hover/focus */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white text-[10px] font-bold">
                          <span>{moodInfo?.emoji || '🐾'}</span>
                          <span className="capitalize">{entry.mood.replace('_', ' ')}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Bottom Caption & Date Info */}
                      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 text-white">
                        <div className="text-[10px] text-amber-200 font-semibold mb-0.5">
                          {dateInfo.full}
                        </div>
                        <p className="text-xs font-medium line-clamp-2 leading-snug drop-shadow-xs">
                          {entry.caption}
                        </p>

                        {entry.activityDone && (
                          <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-amber-100/90 font-medium truncate">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                            <span className="truncate">{entry.activityDone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: TIMELINE LIST FEED */}
      {viewMode === 'timeline' && (
        <>
          {entries.length === 0 ? (
            /* Friendly Empty state for new pet / 0 entries */
            <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 text-center border border-amber-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Heart className="w-8 h-8 fill-amber-300 text-amber-600" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
                  No memories yet
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Capture your first moment with <strong>{pet.name}</strong> today! Each memory deepens your lifelong bond and builds your daily streak.
                </p>
              </div>
              <button
                id="empty-timeline-add-first-moment-btn"
                onClick={onOpenAddMoment}
                className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-xs transition-all inline-flex items-center gap-2"
              >
                <PawIcon className="w-4 h-4" color="#FFF" />
                <span>Capture First Moment</span>
              </button>
            </div>
          ) : Object.keys(groupedByMonth).length === 0 ? (
            <div className="bg-[#FFFDF9] rounded-3xl p-8 text-center border border-stone-200/70 shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No memories match your filter</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Try adjusting your search query or add a brand new snapshot of {pet.name}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMoodFilter('all');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([month, monthEntries]) => (
              <div key={month} className="space-y-3">
                {/* Month Header Pill */}
                <div className="flex items-center gap-2 px-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 font-bold text-xs tracking-wide">
                    {month}
                  </span>
                  <div className="h-px flex-1 bg-amber-200/60" />
                  <span className="text-[11px] text-stone-400 font-medium">
                    {monthEntries.length} {monthEntries.length === 1 ? 'memory' : 'memories'}
                  </span>
                </div>

                {/* List of Entries for Month */}
                <div className="space-y-3">
                  {monthEntries.map((entry) => {
                    const dateInfo = formatEntryDate(entry.date);
                    const moodInfo = MOOD_OPTIONS.find(m => m.id === entry.mood);

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleOpenEntry(entry)}
                        className="bg-[#FFFDF9] rounded-3xl p-4 border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex gap-3.5 items-start">
                          {/* Date Badge */}
                          <div className="shrink-0 w-12 text-center py-1.5 px-1 bg-amber-50 rounded-2xl border border-amber-200/60 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-amber-700">{dateInfo.day}</span>
                            <span className="text-lg font-black text-stone-800 leading-tight">{dateInfo.dateNum}</span>
                            <span className="text-xl mt-0.5 filter drop-shadow-2xs">{moodInfo?.emoji}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Photo if present */}
                            {entry.photoUrl && (
                              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 mb-2.5 border border-stone-200/70 group-hover:scale-[1.01] transition-transform">
                                <img
                                  src={entry.photoUrl}
                                  alt="Bonding memory"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-xs">
                                  {moodInfo?.label.split(' ')[0]}
                                </div>
                              </div>
                            )}

                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed flex-1">
                                {entry.caption}
                              </p>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  id={`quick-edit-${entry.id}`}
                                  onClick={(e) => handleStartEditFromCard(entry, e)}
                                  className="p-1 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-100/80 active:scale-95 transition-all"
                                  title="Edit Caption or Mood"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Activity or tags */}
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {entry.activityDone && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/60">
                                  <Sparkles className="w-3 h-3 text-emerald-600" />
                                  {entry.activityDone}
                                </span>
                              )}

                              {entry.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                                >
                                  <Tag className="w-2.5 h-2.5 text-stone-400" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Memory Detail & Edit Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                } else {
                  setSelectedEntry(null);
                }
              }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-amber-100 text-stone-800 pb-safe"
            >
              {/* Mobile Drag Indicator */}
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />

              {/* Modal Top Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  {isEditing ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      <Pencil className="w-3 h-3 text-amber-700" />
                      <span>Edit Memory</span>
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold">
                      Memory Details
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      id="modal-header-edit-btn"
                      onClick={() => setIsEditing(true)}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Edit Caption or Mood"
                    >
                      <Edit3 className="w-3 h-3 text-amber-700" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      id="modal-header-cancel-btn"
                      onClick={handleCancelEdit}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleCancelEdit();
                      }
                      setSelectedEntry(null);
                    }}
                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VIEW MODE */}
              {!isEditing ? (
                <div className="space-y-3.5">
                  {selectedEntry.photoUrl && (
                    <div className="rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 mb-2 border border-stone-200">
                      <img
                        src={selectedEntry.photoUrl}
                        alt="Memory detail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl filter drop-shadow-2xs">{getMoodEmoji(selectedEntry.mood)}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {new Date(selectedEntry.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[11px] text-amber-700 font-medium capitalize">
                          Vibe: {selectedEntry.mood.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-100">
                    <p className="text-sm text-stone-800 font-serif leading-relaxed italic">
                      "{selectedEntry.caption}"
                    </p>
                  </div>

                  {selectedEntry.activityDone && (
                    <div className="text-xs text-stone-600 flex items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-100">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span><strong>Bonding Activity:</strong> {selectedEntry.activityDone}</span>
                    </div>
                  )}

                  {selectedEntry.bondingNote && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong className="text-stone-700">Journal Note:</strong> {selectedEntry.bondingNote}
                      </p>
                    </div>
                  )}

                  {/* Delete Confirmation Box if active */}
                  {showDeleteConfirm ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Delete this memory?</span>
                      </div>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        This action cannot be undone. This moment will be removed from your timeline.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold text-xs"
                        >
                          Keep
                        </button>
                        <button
                          type="button"
                          id="confirm-delete-memory-btn"
                          onClick={handleDeleteCurrentEntry}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        id="modal-open-edit-mode-btn"
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Caption or Mood</span>
                      </button>

                      <button
                        id="modal-delete-entry-btn"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2.5 rounded-2xl bg-stone-100 hover:bg-rose-100 hover:text-rose-700 text-stone-500 transition-colors"
                        title="Delete Memory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* COMPREHENSIVE EDIT MODE */
                <div className="space-y-4">
                  {/* 1. Photo Management */}
                  <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-600" />
                        <span>Memory Photo</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {editPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditPhotoUrl(undefined)}
                            className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preview Box */}
                    {editPhotoUrl ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 shadow-2xs group">
                        <img
                          src={editPhotoUrl}
                          alt="Memory preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-white text-stone-900 font-bold text-xs shadow-md flex items-center gap-1.5"
                          >
                            <Camera className="w-3.5 h-3.5 text-amber-600" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-4 text-center cursor-pointer hover:bg-amber-100/50 transition-colors"
                      >
                        <Camera className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                        <div className="text-xs font-bold text-amber-900">Add a Photo to this Memory</div>
                        <div className="text-[10px] text-stone-500">Tap to upload from device or pick a sample below</div>
                      </div>
                    )}

                    {/* Photo Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        id="edit-moment-upload-file-btn"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{editPhotoUrl ? 'Upload New Photo' : 'Upload from Device'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                      >
                        {showUrlInput ? 'Hide URL' : 'Paste Image URL'}
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {/* Optional URL input */}
                    {showUrlInput && (
                      <div className="pt-1 flex items-center gap-1.5">
                        <input
                          type="url"
                          placeholder="https://example.com/moment.jpg"
                          value={customPhotoUrlInput}
                          onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customPhotoUrlInput.trim()) {
                              setEditPhotoUrl(customPhotoUrlInput.trim());
                              setCustomPhotoUrlInput('');
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
                        Or pick from sample moments:
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {SAMPLE_PET_PHOTOS.map((photo, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setEditPhotoUrl(photo)}
                            className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                              editPhotoUrl === photo
                                ? 'border-amber-500 ring-2 ring-amber-300 scale-105 shadow-xs'
                                : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {editPhotoUrl === photo && (
                              <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. Date Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Date of Memory</span>
                    </label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>

                  {/* 3. Mood Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <span>How was {pet.name}'s vibe?</span>
                      <span className="text-[11px] text-stone-400 font-normal">(Tap to change)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {MOOD_OPTIONS.map((mood) => {
                        const isSelected = editMood === mood.id;
                        return (
                          <button
                            key={mood.id}
                            type="button"
                            id={`edit-mood-btn-${mood.id}`}
                            onClick={() => setEditMood(mood.id as MoodType)}
                            className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-400/40 shadow-2xs'
                                : 'border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700 font-medium'
                            }`}
                          >
                            <span className="text-lg shrink-0">{mood.emoji}</span>
                            <span className="truncate text-[11px] flex-1">{mood.label.split(' ')[0]}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Caption Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800">
                        Caption / Memory Highlight *
                      </label>
                      <span className="text-[10px] text-stone-400">
                        {editCaption.length} characters
                      </span>
                    </div>
                    <textarea
                      id="edit-memory-caption-textarea"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder={`What made this memory with ${pet.name} special?`}
                      rows={3}
                      className="w-full p-3 text-xs sm:text-sm bg-white rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-stone-800 leading-relaxed resize-none shadow-2xs"
                    />
                  </div>

                  {/* 5. Bonding Activity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Bonding Activity</span>
                    </label>
                    <input
                      type="text"
                      value={editActivity}
                      onChange={(e) => setEditActivity(e.target.value)}
                      placeholder="e.g. Forest Sniff Walk, Tug of War, Sunbeam Cuddle"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {['Morning Sniff Walk 🌲', 'Tug of War 🪢', 'Brush & Belly Rub 💖', 'Trick Training 🎓', 'Sweet Nap 💤'].map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setEditActivity(preset)}
                          className="shrink-0 px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 text-[10px] font-medium transition-colors whitespace-nowrap"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. Journal Note (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                      <span>Journal Note (Optional)</span>
                    </label>
                    <textarea
                      id="edit-memory-journal-note-textarea"
                      value={editBondingNote}
                      onChange={(e) => setEditBondingNote(e.target.value)}
                      placeholder="Add extra thoughts, feelings, cute quirks, or private notes..."
                      rows={2}
                      className="w-full p-2.5 text-xs bg-white rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-stone-700 resize-none shadow-2xs"
                    />
                  </div>

                  {/* 7. Tags Manager */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Memory Tags</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {editTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-amber-700 hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add a tag (e.g. ParkDay, NapTime)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* 8. Daily Challenge Toggle */}
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer hover:bg-amber-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={editChallengeCompleted}
                      onChange={(e) => setEditChallengeCompleted(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400"
                    />
                    <div className="text-xs font-bold text-stone-800">
                      Counts towards Daily Bonding Challenge ⭐
                    </div>
                  </label>

                  {/* Form Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      id="edit-memory-cancel-btn"
                      onClick={handleCancelEdit}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="edit-memory-save-btn"
                      onClick={handleSaveEdit}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        saveSuccess
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                          : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
