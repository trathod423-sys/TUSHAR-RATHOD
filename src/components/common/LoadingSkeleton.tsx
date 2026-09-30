import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-lg w-full flex items-center px-4 gap-4"
        >
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>
      ))}
    </div>
  );
};

export const AISummarySkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-48" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
      </div>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-28 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800" />
        <div className="h-28 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800" />
      </div>
    </div>
  );
};
