import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Card3D } from '../common/Card3D';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Activity,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { stats } = useFeedback();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Feedback */}
        <Card3D maxTilt={7} className="h-full anim-same">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between anim-same">
            <div>
              <div className="flex items-center justify-between text-black dark:text-slate-300 mb-2">
                <span className="text-xs font-bold text-black dark:text-white">Total Feedback</span>
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-black dark:text-white tabular-nums tracking-tight">
                {stats.totalFeedback.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.8% vs last cohort</span>
            </div>
          </div>
        </Card3D>

        {/* Average Rating */}
        <Card3D maxTilt={7} className="h-full anim-same">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between anim-same">
            <div>
              <div className="flex items-center justify-between text-black dark:text-slate-300 mb-2">
                <span className="text-xs font-bold text-black dark:text-white">Average Rating</span>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 shadow-2xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-black dark:text-white tabular-nums tracking-tight">
                  {stats.averageRating}
                </span>
                <span className="text-xs text-black dark:text-slate-400 font-bold">/ 5.0</span>
              </div>
            </div>
            <div className="text-[11px] text-black dark:text-slate-300 mt-2 flex items-center gap-1 font-semibold">
              <span>Overall campus benchmark</span>
            </div>
          </div>
        </Card3D>

        {/* Positive Sentiment */}
        <Card3D maxTilt={7} className="h-full anim-same">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between anim-same">
            <div>
              <div className="flex items-center justify-between text-black dark:text-slate-300 mb-2">
                <span className="text-xs font-bold text-black dark:text-white">Positive Sentiment</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <ThumbsUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums tracking-tight">
                {stats.positivePercentage}%
              </div>
            </div>
            <div className="text-[11px] text-black dark:text-slate-300 mt-2 tabular-nums font-semibold">
              {stats.positiveCount} satisfied entries
            </div>
          </div>
        </Card3D>

        {/* Negative Sentiment */}
        <Card3D maxTilt={7} className="h-full anim-same">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between anim-same">
            <div>
              <div className="flex items-center justify-between text-black dark:text-slate-300 mb-2">
                <span className="text-xs font-bold text-black dark:text-white">Negative Sentiment</span>
                <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-2xs">
                  <ThumbsDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-700 dark:text-rose-400 tabular-nums tracking-tight">
                {stats.negativePercentage}%
              </div>
            </div>
            <div className="text-[11px] text-black dark:text-slate-300 mt-2 tabular-nums font-semibold">
              {stats.negativeCount} flagged pain points
            </div>
          </div>
        </Card3D>

        {/* Health Score */}
        <Card3D maxTilt={7} className="col-span-2 lg:col-span-1 h-full anim-same">
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-800/80 rounded-xl p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between relative overflow-hidden anim-same">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-black dark:text-slate-300 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-black dark:text-white">Feedback Health</span>
                  <button
                    type="button"
                    onClick={() => setShowFormulaModal(true)}
                    className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 cursor-pointer"
                    title="How is this score computed?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shadow-2xs">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-700 dark:text-indigo-400 tabular-nums tracking-tight">
                  {stats.healthScore}
                </span>
                <span className="text-xs text-black dark:text-slate-400 font-bold">/ 100</span>
              </div>
            </div>
            <div className="text-[11px] text-black dark:text-slate-300 mt-2 flex items-center justify-between font-semibold">
              <span>Resolution Rate:</span>
              <strong className="font-mono text-black dark:text-white font-bold">
                {stats.resolutionRate}%
              </strong>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Health Score Transparent Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Transparent Health Score Formula</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Unlike arbitrary AI scores, the FeedbackIQ Health Score is mathematically computed from three verifiable institutional metrics:
            </p>
            <div className="space-y-2.5 text-xs bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
              <div className="flex justify-between">
                <span>Rating Component (40%):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.round((stats.averageRating / 5) * 40)} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span>Positive Sentiment (35%):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.round(stats.positivePercentage * 0.35)} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resolution Rate (25%):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.round(stats.resolutionRate * 0.25)} pts
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                <span>Total Score:</span>
                <span>{stats.healthScore} / 100</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFormulaModal(false)}
              className="mt-5 w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
