import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import {
  Sparkles,
  Sun,
  Moon,
  Bell,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Search,
  X,
  Palette,
  Shuffle,
} from 'lucide-react';

interface NavbarProps {
  onOpenTrackModal?: () => void;
  onOpenThemeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrackModal, onOpenThemeModal }) => {
  const {
    currentView,
    setCurrentView,
    theme,
    appTheme,
    cycleTheme,
    toggleTheme,
    unreadAlertCount,
    urgentFeedbacks,
    setSelectedFeedback,
    setActiveTab,
    filter,
    setFilter,
  } = useFeedback();

  const currentThemeConfig = THEME_CONFIGS[appTheme] || THEME_CONFIGS.cobalt;

  const [showNotifications, setShowNotifications] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setFilter((prev) => ({ ...prev, searchQuery: quickSearch.trim() }));
      if (currentView === 'admin') {
        setActiveTab('feedback');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentView === 'admin') setActiveTab('dashboard');
              else setCurrentView('student');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                FeedbackIQ
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
                Feedback Intelligence Platform
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation / Quick Search */}
        <div className="flex-1 max-w-md hidden md:block">
          {currentView === 'admin' ? (
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback ID, topic, department..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              {quickSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickSearch('');
                    setFilter((prev) => ({ ...prev, searchQuery: '' }));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          ) : (
            <nav className="flex items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
              <a href="#feedback-form" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Submit Feedback
              </a>
              <button
                type="button"
                onClick={onOpenTrackModal}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Track Status
              </button>
              <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                How It Works
              </a>
              <a href="#intelligence" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                AI Intelligence
              </a>
            </nav>
          )}
        </div>

        {/* Zone 3: 1-2 primary actions + toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown (Admin only) */}
          {currentView === 'admin' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Attention Alerts ({unreadAlertCount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {urgentFeedbacks.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No critical alerts require attention.
                      </div>
                    ) : (
                      urgentFeedbacks.slice(0, 5).map((alert) => (
                        <button
                          key={alert.id}
                          type="button"
                          onClick={() => {
                            setSelectedFeedback(alert);
                            setShowNotifications(false);
                          }}
                          className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                {alert.id}
                              </span>
                              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                {alert.rating} ⭐ · {alert.priority}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {alert.message}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  {urgentFeedbacks.length > 5 && (
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('feedback');
                          setFilter((prev) => ({ ...prev, priority: 'Critical' }));
                          setShowNotifications(false);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                      >
                        View all {urgentFeedbacks.length} urgent entries →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Distinctive Theme Selector Button */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer group"
            title="Switch Platform Theme (Unique bespoke palettes)"
            aria-label="Open theme picker"
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0 transition-transform group-hover:scale-110 shadow-xs"
              style={{ backgroundColor: currentThemeConfig.accentColor }}
            />
            <span className="hidden sm:inline font-semibold">
              {currentThemeConfig.name}
            </span>
            <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-100 transition-colors ml-0.5" />
          </button>

          {/* Quick Theme Cycler */}
          <button
            type="button"
            onClick={cycleTheme}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={`Cycle to next theme (${currentThemeConfig.name} active)`}
            aria-label="Cycle theme"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Mode Switcher Button */}
          {currentView === 'student' ? (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('student')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
          )}

          {/* Admin Avatar Profile */}
          {currentView === 'admin' && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                DR
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  Dinesh Rathod
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                  Administrator
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
