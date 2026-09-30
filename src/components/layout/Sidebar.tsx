import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  BrainCircuit,
  Flame,
  BotMessageSquare,
  FileSpreadsheet,
  Settings,
  X,
  Database,
  CheckCircle2,
  Instagram,
  Palette,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, unreadAlertCount, feedbacks, loadDemoData, appTheme, cycleTheme } = useFeedback();
  const currentThemeConfig = THEME_CONFIGS[appTheme] || THEME_CONFIGS.cobalt;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'feedback',
      label: 'Feedback Table',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadAlertCount > 0 ? `${unreadAlertCount} alerts` : null,
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: 'Smart',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      id: 'improvements',
      label: 'Improvement Radar',
      icon: <Flame className="w-4 h-4" />,
      badge: 'Top 5',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      id: 'ask-ai',
      label: 'Ask Feedback AI',
      icon: <BotMessageSquare className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'social',
      label: 'Instagram, LinkedIn & GitHub',
      icon: <Instagram className="w-4 h-4" />,
      badge: 'Multi-Post',
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold',
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings & Data',
      icon: <Settings className="w-4 h-4" />,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 lg:hidden">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Navigation
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`transition-colors ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Status & Hackathon Demo Helper */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
          {/* Active Theme Badge & Cycler */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3 h-3 text-blue-400" />
                <span>Visual Theme</span>
              </span>
              <button
                type="button"
                onClick={cycleTheme}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                title="Switch to next theme"
              >
                Change ↻
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20 shrink-0"
                  style={{ backgroundColor: currentThemeConfig.accentColor }}
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                  {currentThemeConfig.name}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                {currentThemeConfig.badge.split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Database Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
              {feedbacks.length} records indexed
            </p>
          </div>

          <button
            type="button"
            onClick={loadDemoData}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Reload Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
