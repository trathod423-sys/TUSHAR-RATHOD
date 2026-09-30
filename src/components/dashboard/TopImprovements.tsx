import React, { useMemo } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { computeTopImprovementAreas } from '../../utils/analytics';
import { PriorityBadge } from '../common/Badges';
import { Flame, ArrowRight, Lightbulb, ShieldAlert } from 'lucide-react';

export const TopImprovements: React.FC = () => {
  const { feedbacks, setFilter, setActiveTab } = useFeedback();

  const improvementAreas = useMemo(() => {
    return computeTopImprovementAreas(feedbacks);
  }, [feedbacks]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Top 5 Improvement Areas
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ranked dynamically by complaint frequency, negative sentiment, and rating deficit
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {improvementAreas.slice(0, 5).map((item, index) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.area}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  · {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {item.mentions} mentions · {item.avgRating} ⭐
                </span>
                <PriorityBadge priority={item.impact} />
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Suggested Action:{' '}
                </span>
                <span>{item.suggestedAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
