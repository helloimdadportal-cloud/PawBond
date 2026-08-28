import React from 'react';
import { Home, BookOpen, BarChart3, User, Settings, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { PawIcon } from './PawIcon';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  momentsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  momentsCount
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Today',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'timeline' as TabType,
      label: 'Moments',
      icon: <BookOpen className="w-5 h-5" />,
      badge: momentsCount > 0 ? momentsCount : undefined
    },
    {
      id: 'stats' as TabType,
      label: 'Stats',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: <PawIcon className="w-5 h-5" />
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-amber-900/10 shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex-1 min-w-[56px] min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-amber-700 font-bold'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              {/* Active Background Pill */}
              {isActive && (
                <div className="absolute inset-1 bg-amber-100/75 rounded-xl -z-10 animate-fade-in" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </div>
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500 text-white shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span className={`text-[10.5px] mt-1 leading-none tracking-tight ${isActive ? 'text-amber-900 font-bold' : 'text-stone-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
