import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Star, TrendingUp, BarChart2, PieChart, Layers } from 'lucide-react';

export const RatingDistributionChart: React.FC = () => {
  const { stats, setFilter, setActiveTab } = useFeedback();
  const total = stats.totalFeedback || 1;

  const handleBarClick = (star: number) => {
    setFilter((prev) => ({ ...prev, rating: star }));
    setActiveTab('feedback');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Rating Distribution
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Interactive breakdown from 1 to 5 stars
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold font-mono">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{stats.averageRating} avg</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.ratingDistribution[star] || 0;
          const pct = Math.round((count / total) * 100);

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleBarClick(star)}
              className="w-full group text-left cursor-pointer focus:outline-none"
              title={`Click to filter feedback with ${star} stars`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                  <span>{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    star >= 4
                      ? 'bg-emerald-500'
                      : star === 3
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const SentimentDistributionChart: React.FC = () => {
  const { stats, setFilter, setActiveTab } = useFeedback();
  const total = stats.totalFeedback || 1;

  const segments = [
    {
      name: 'Positive',
      count: stats.positiveCount,
      pct: stats.positivePercentage,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      name: 'Neutral',
      count: stats.neutralCount,
      pct: stats.neutralPercentage,
      color: 'bg-slate-400 dark:bg-slate-500',
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-200 dark:border-slate-700',
    },
    {
      name: 'Negative',
      count: stats.negativeCount,
      pct: stats.negativePercentage,
      color: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-200 dark:border-rose-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Sentiment Split
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            AI-evaluated emotional disposition
          </p>
        </div>
      </div>

      {/* Progress segmented bar */}
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex mb-5 shadow-inner">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className={`${seg.color} transition-all duration-500`}
            style={{ width: `${seg.pct}%` }}
            title={`${seg.name}: ${seg.pct}% (${seg.count})`}
          />
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-3 gap-2">
        {segments.map((seg) => (
          <button
            key={seg.name}
            type="button"
            onClick={() => {
              setFilter((prev) => ({ ...prev, sentiment: seg.name }));
              setActiveTab('feedback');
            }}
            className={`p-2.5 rounded-lg border text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${seg.borderColor}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${seg.color}`} />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {seg.name}
              </span>
            </div>
            <div className={`text-base font-bold font-mono ${seg.textColor} tabular-nums`}>
              {seg.pct}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {seg.count} items
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const FeedbackTimelineChart: React.FC = () => {
  const { stats } = useFeedback();
  const timeline = stats.sentimentTimeline;
  const [activeMetric, setActiveMetric] = useState<'volume' | 'rating'>('volume');

  const maxTotal = Math.max(1, ...timeline.map((t) => t.total));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Feedback Timeline & Velocity
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Daily submission volume and sentiment dynamics
          </p>
        </div>
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveMetric('volume')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeMetric === 'volume'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Submission Volume
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('rating')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeMetric === 'rating'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Average Rating
          </button>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400">
          No historical timeline data recorded.
        </div>
      ) : (
        <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
          {timeline.map((item, idx) => {
            const heightPct =
              activeMetric === 'volume'
                ? Math.max(12, Math.round((item.total / maxTotal) * 100))
                : Math.max(15, Math.round((item.avgRating / 5) * 100));

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1.5 group relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
                  <span>{item.label}</span>
                  <span className="font-mono text-indigo-300">
                    {item.total} entries · {item.avgRating} ⭐
                  </span>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mb-1" />
                </div>

                {/* Bar */}
                <div className="w-full max-w-[28px] h-32 flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 ${
                      activeMetric === 'volume'
                        ? 'bg-indigo-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                {/* X-axis label */}
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CategoryPerformanceChart: React.FC = () => {
  const { stats, setFilter, setActiveTab } = useFeedback();
  const categories = Object.keys(stats.categoryDistribution);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Category Breakdown
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Average ratings and complaint concentrations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.slice(0, 6).map((cat) => {
          const item = stats.categoryDistribution[cat];
          const isLow = item.avgRating < 3.2;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFilter((prev) => ({ ...prev, category: cat }));
                setActiveTab('feedback');
              }}
              className="w-full p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate group-hover:text-indigo-600">
                  {cat}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {item.count} submissions · {item.negativeCount} negative
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    isLow
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {item.avgRating} ⭐
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DepartmentInsightsChart: React.FC = () => {
  const { stats, setFilter, setActiveTab } = useFeedback();
  const departments = Object.keys(stats.departmentDistribution);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Department Performance
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Cross-department sentiment comparison
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {departments.slice(0, 6).map((dept) => {
          const item = stats.departmentDistribution[dept];
          const posPct = item.count > 0 ? Math.round((item.positiveCount / item.count) * 100) : 0;

          return (
            <button
              key={dept}
              type="button"
              onClick={() => {
                setFilter((prev) => ({ ...prev, department: dept }));
                setActiveTab('feedback');
              }}
              className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600">
                  {dept}
                </span>
                <span className="font-mono text-slate-500 text-[11px] shrink-0">
                  {item.avgRating} ⭐ · {item.count} items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${posPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {posPct}% positive
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
