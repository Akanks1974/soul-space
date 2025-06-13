import React, { useState } from 'react';
import { Heart, Menu, X, TrendingUp, User, BarChart3 } from 'lucide-react';
import { HomeIcon, CheckInIcon, CalmlyIcon, MeditateIcon, ReflectIcon } from './NavigationIcons';
import { Component as SignInDialog } from './ui/demo';
import { ThemeToggle } from './ui/theme-toggle';
import type { AppView, Emotion, JournalEntry, ReflectionEntry } from '../App';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  emotions: Emotion[];
  journalEntries: JournalEntry[];
  reflectionEntries: ReflectionEntry[];
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  emotions, 
  journalEntries, 
  reflectionEntries 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getProgressStats = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentEmotions = emotions.filter(e => new Date(e.timestamp) >= oneWeekAgo);
    const totalEntries = journalEntries.length + reflectionEntries.length;
    const weeklyActivity = recentEmotions.length;
    
    return { totalEntries, weeklyActivity };
  };

  const stats = getProgressStats();

  const mainNavItems = [
    { view: 'welcome' as AppView, label: 'Home', icon: HomeIcon },
    { view: 'emotions' as AppView, label: 'Check-in', icon: CheckInIcon },
    { view: 'breathing' as AppView, label: 'Calmly', icon: CalmlyIcon },
    { view: 'meditation' as AppView, label: 'Meditate', icon: MeditateIcon },
    { view: 'reflection' as AppView, label: 'Reflect', icon: ReflectIcon },
  ];

  const secondaryNavItems = [
    { view: 'progress' as AppView, label: 'Progress' },
    { view: 'ai-assistant' as AppView, label: 'AI Support' },
  ];

  return (
    <>
      {/* Bolt.new Badge - Fixed position in top right */}
      <div className="fixed top-4 right-4 z-[60] hidden sm:block">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform duration-300 hover:scale-110 hover:rotate-3"
          title="Made with Bolt.new"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Made with Bolt.new"
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </a>
      </div>

      {/* Mobile Bolt.new Badge - Positioned differently to avoid overlap */}
      <div className="fixed top-4 right-4 z-[60] sm:hidden">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform duration-300 hover:scale-110"
          title="Made with Bolt.new"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Made with Bolt.new"
            className="w-10 h-10 rounded-full shadow-lg"
          />
        </a>
      </div>

      <header className="bg-white dark:bg-gray-800 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Soulful Space
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your safe emotional haven</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map(({ view, label }) => (
                <button
                  key={view}
                  onClick={() => onNavigate(view)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentView === view
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right Side - Progress & Actions - Adjusted margin to avoid badge overlap */}
            <div className="flex items-center space-x-3 mr-16 sm:mr-20 lg:mr-0">
              {/* Progress Stats */}
              <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-700">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div className="text-xs">
                    <div className="font-semibold text-purple-800 dark:text-purple-200">{stats.totalEntries}</div>
                    <div className="text-purple-600 dark:text-purple-400">Total</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div className="text-xs">
                    <div className="font-semibold text-green-800 dark:text-green-200">{stats.weeklyActivity}</div>
                    <div className="text-green-600 dark:text-green-400">This Week</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('progress')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors duration-200"
                  title="View Progress"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Sign In Dialog */}
              <div className="hidden sm:block">
                <SignInDialog />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors duration-200"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Main Features
                </div>
                {mainNavItems.map(({ view, label }) => (
                  <button
                    key={view}
                    onClick={() => {
                      onNavigate(view);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentView === view
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
                  Tools & Insights
                </div>
                {secondaryNavItems.map(({ view, label }) => (
                  <button
                    key={view}
                    onClick={() => {
                      onNavigate(view);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentView === view
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="mt-3">
                    <SignInDialog />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 backdrop-blur-md border-t border-gray-100 dark:border-gray-700 z-50 shadow-lg transition-colors duration-300">
        <div className="flex justify-around py-3 px-2">
          {mainNavItems.map(({ view, label, icon: IconComponent }) => (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                currentView === view
                  ? 'bg-gradient-to-t from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border border-purple-200 dark:border-purple-700 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <IconComponent 
                  className="w-6 h-6" 
                  isActive={currentView === view}
                />
              </div>
              <span className={`text-xs font-medium transition-colors duration-200 ${
                currentView === view
                  ? 'text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};