import React from 'react';
import { FeedbackStatus, Sentiment, PriorityLevel } from '../../types';
import { CheckCircle2, Clock, AlertCircle, ArrowUpRight, Flame } from 'lucide-react';

export const StatusBadge: React.FC<{ status: FeedbackStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const styles = {
    New: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    Reviewed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  };

  const icons = {
    New: <Clock className="w-3 h-3 shrink-0" />,
    Reviewed: <AlertCircle className="w-3 h-3 shrink-0" />,
    Resolved: <CheckCircle2 className="w-3 h-3 shrink-0" />,
  };

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${styles[status]} ${padding}`}
    >
      {icons[status]}
      <span>{status}</span>
    </span>
  );
};

export const SentimentBadge: React.FC<{ sentiment: Sentiment; score?: number }> = ({
  sentiment,
  score,
}) => {
  const styles = {
    Positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    Neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    Negative: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  };

  const dots = {
    Positive: 'bg-emerald-500',
    Neutral: 'bg-slate-400 dark:bg-slate-500',
    Negative: 'bg-rose-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border rounded-md ${styles[sentiment]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[sentiment]}`} aria-hidden="true" />
      <span>{sentiment}</span>
      {score !== undefined && (
        <span className="opacity-70 font-mono text-[10px]">
          ({Math.round(score * 100)}%)
        </span>
      )}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; score?: number }> = ({
  priority,
  score,
}) => {
  const styles = {
    Critical: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    High: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    Medium: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800',
    Low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-md ${styles[priority]}`}
    >
      {priority === 'Critical' ? (
        <Flame className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
      ) : priority === 'High' ? (
        <ArrowUpRight className="w-3 h-3 text-orange-600 dark:text-orange-400 shrink-0" />
      ) : null}
      <span>{priority}</span>
      {score !== undefined && (
        <span className="font-mono text-[10px] opacity-75">
          {score}
        </span>
      )}
    </span>
  );
};
