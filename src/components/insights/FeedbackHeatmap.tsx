import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Flame, Layers } from 'lucide-react';

export const FeedbackHeatmap: React.FC = () => {
  const { feedbacks, setFilter, setActiveTab } = useFeedback();

  const categories = [
    'Infrastructure',
    'Food',
    'Academic',
    'Faculty',
    'Administration',
    'Placement',
    'Support',
  ];

  // Matrix: count positive, neutral, negative per category
  const matrix: Record<string, { positive: number; neutral: number; negative: number; total: number }> = {};
  categories.forEach((cat) => {
    matrix[cat] = { positive: 0, neutral: 0, negative: 0, total: 0 };
  });

  feedbacks.forEach((f) => {
    if (matrix[f.category]) {
      matrix[f.category].total += 1;
      if (f.sentiment === 'Positive') matrix[f.category].positive += 1;
      else if (f.sentiment === 'Negative') matrix[f.category].negative += 1;
      else matrix[f.category].neutral += 1;
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Category vs Sentiment Heatmap
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Visual friction matrix identifying where negative sentiment concentrates
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500">
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-center">Positive Volume</th>
              <th className="py-2.5 px-3 text-center">Neutral Volume</th>
              <th className="py-2.5 px-3 text-center">Negative Friction (Heat)</th>
              <th className="py-2.5 px-3 text-right">Total Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => {
              const row = matrix[cat];
              const negPct = row.total > 0 ? Math.round((row.negative / row.total) * 100) : 0;

              // Heat color scale based on negative percentage
              const heatClass =
                negPct > 50
                  ? 'bg-rose-500 text-white font-bold'
                  : negPct > 30
                  ? 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 font-semibold'
                  : negPct > 10
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';

              return (
                <tr
                  key={cat}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, category: cat }));
                    setActiveTab('feedback');
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {cat}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-600 dark:text-emerald-400">
                    {row.positive}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                    {row.neutral}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono tabular-nums ${heatClass}`}
                    >
                      {row.negative} ({negPct}%)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                    {row.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
