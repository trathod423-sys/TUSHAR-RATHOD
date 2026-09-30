import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { THEME_LIST, AppTheme } from '../../utils/themeConfig';
import {
  Settings,
  Database,
  Trash2,
  RefreshCw,
  Bell,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Palette,
  Check,
  Sparkles,
  Flame,
  Sun,
  Terminal,
  BookOpen,
  Layers,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    feedbacks,
    loadDemoData,
    clearDemoData,
    auditLogs,
    theme,
    appTheme,
    setAppTheme,
    cycleTheme,
    toggleTheme,
  } = useFeedback();

  const [message, setMessage] = useState<string | null>(null);

  const demoCount = feedbacks.filter((f) => f.isDemo).length;
  const realCount = feedbacks.filter((f) => !f.isDemo).length;

  const handleLoadDemo = () => {
    loadDemoData();
    setMessage('Demo dataset successfully populated with 60+ realistic submissions.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearDemo = () => {
    if (confirm('Clear all mock demo records? Real submissions will be preserved.')) {
      clearDemoData();
      setMessage('Demo records cleared.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            System Settings & Hackathon Demo Controls
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage sample datasets, inspect administrative audit trails, and configure platform preferences
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Demo Data Management Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Dataset Controls (Demo vs Real Submissions)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            FeedbackIQ safely isolates mock evaluation data from genuine student feedback submissions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Real Student Submissions</span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
              {realCount} records
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Sample / Demo Records</span>
            <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {demoCount} records
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload 60+ Demo Records</span>
          </button>
          <button
            type="button"
            onClick={handleClearDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Demo Data (Keep Real)</span>
          </button>
        </div>
      </div>

      {/* Platform Theme Studio (Bespoke Themes Showcase) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-500" />
              <span>Campus Aesthetics & 3D Theme Studio</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Engineered for hackathon judges with full-rating legibility, zero-strain contrast, and tactile 3D cards.
            </p>
          </div>
          <button
            type="button"
            onClick={cycleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
          >
            <span>Cycle Theme ↻</span>
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_LIST.map((t) => {
            const isSelected = appTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setAppTheme(t.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between card-3d-depth ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/25 bg-slate-50 dark:bg-slate-850 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </span>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                        {t.badge.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
                    {t.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: t.palette.canvas }}
                      title="Canvas background"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: t.palette.surface }}
                      title="Card surface"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: t.palette.accent }}
                      title="Primary accent"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: t.palette.accentGlow }}
                      title="Highlight glow"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                    {isSelected ? 'Applied' : 'Select →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick notification preference */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Negative Feedback Immediate Priority Alert
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Highlights 1 & 2-star ratings and urgent infrastructure issues with high-visibility badges
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Admin Audit Trail */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Administrative Audit Log</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of system events, status changes, and administrator responses
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 font-mono"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block font-sans">
                  {log.action}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
                  {log.details}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Actor: {log.actor}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
