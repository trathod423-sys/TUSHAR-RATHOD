import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AttentionRequiredProps {
  onSelectFeedback: (feedback: FeedbackItem) => void;
}

export const AttentionRequired: React.FC<AttentionRequiredProps> = ({ onSelectFeedback }) => {
  const { urgentFeedbacks, setFilter, setActiveTab } = useFeedback();

  if (urgentFeedbacks.length === 0) return null;

  return (
    <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Attention Required ({urgentFeedbacks.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setFilter((prev) => ({ ...prev, sentiment: 'Negative', status: 'New' }));
            setActiveTab('feedback');
          }}
          className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all in table</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
        Submissions with low ratings (&le; 2 stars) or negative sentiment requiring administrative review.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {urgentFeedbacks.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectFeedback(item)}
            className="p-3 bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40 rounded-xl hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                {item.id}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">{item.rating} ⭐</span>
                <StatusBadge status={item.status} size="sm" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
              "{item.message}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="truncate max-w-[120px] font-medium text-slate-600 dark:text-slate-400">
                {item.department} · {item.category}
              </span>
              <span>
                {new Date(item.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
