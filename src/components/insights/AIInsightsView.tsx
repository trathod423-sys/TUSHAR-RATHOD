import React, { useState, useEffect } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateAIInsightsAPI } from '../../services/aiService';
import { AIInsightsData } from '../../types';
import { detectCommonComplaints, detectCommonSuggestions } from '../../utils/analytics';
import { AISummarySkeleton } from '../common/LoadingSkeleton';
import { FeedbackHeatmap } from './FeedbackHeatmap';
import {
  BrainCircuit,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Flame,
} from 'lucide-react';

export const AIInsightsView: React.FC = () => {
  const { feedbacks } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const [insights, setInsights] = useState<AIInsightsData>(() => {
    return {
      executiveSummary:
        'Students express high praise for curriculum depth, accessible faculty office hours, and modern research resources. However, acute operational friction is localized around campus Wi-Fi instability during lab sessions, cafeteria lunch-hour bottlenecks, and consecutive examination timetables.',
      whatUsersLike: [
        'Practical coding bootcamps and corporate mentorship workshops',
        'Approachable faculty office hours and individualized academic guidance',
        'Institutional research database access (IEEE, ScienceDirect, Bloomberg)',
        'Supportive student mental health and counseling services',
      ],
      whatUsersDislike: [
        'Intermittent Wi-Fi disconnections across CS Department labs',
        'Canteen queue delays and failing digital POS payment scanners',
        'Classroom projector flickering in Seminar Hall B and studio ventilation issues',
        'Back-to-back numerical midterm exam schedules with zero revision gap',
      ],
      emergingIssues: [
        'Hostel Block 1 & 3 electrical breaker trips during evening hours',
        'Workshop lathe machine safety guard maintenance requirements',
        'Exam hall seating plan confusion announced too late at entrance',
      ],
      commonComplaints: detectCommonComplaints(feedbacks),
      commonSuggestions: detectCommonSuggestions(feedbacks),
      topImprovementAreas: [],
      lastGeneratedAt: new Date().toLocaleTimeString(),
    };
  });

  const handleRefreshInsights = async () => {
    setLoading(true);
    try {
      const generated = await generateAIInsightsAPI(feedbacks);
      setInsights((prev) => ({
        ...prev,
        ...generated,
        commonComplaints: detectCommonComplaints(feedbacks),
        commonSuggestions: detectCommonSuggestions(feedbacks),
        lastGeneratedAt: new Date().toLocaleTimeString(),
      }));
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Feedback Intelligence & Synthesis
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Gemini AI. Last synthesized:{' '}
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {lastRefreshed}
            </span>
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleRefreshInsights}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing...' : 'Refresh AI Insights'}</span>
        </button>
      </div>

      {loading ? (
        <AISummarySkeleton />
      ) : (
        <>
          {/* Executive Summary Box */}
          <div className="bg-gradient-to-r from-indigo-50/70 via-white to-slate-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-850 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Executive Synthesis</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              "{insights.executiveSummary}"
            </p>
          </div>

          {/* Likes vs Dislikes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What Users Like */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ThumbsUp className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  What Students Appreciate Most
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {insights.whatUsersLike.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Users Dislike */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <ThumbsDown className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Top Recurring Frustrations
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {insights.whatUsersDislike.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common Complaints & Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Complaints Detection */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Common Complaint Frequency
              </h3>
              <div className="space-y-2.5">
                {insights.commonComplaints.slice(0, 5).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                        {comp.issue}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {comp.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        {comp.count} mentions
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {comp.percentage}% of complaints
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Suggestions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Actionable Student Suggestions
              </h3>
              <div className="space-y-2.5">
                {insights.commonSuggestions.slice(0, 5).map((sugg, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed block">
                          {sugg.suggestion}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sugg.category} · {sugg.count} requests
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                      {sugg.feasibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Heatmap */}
          <FeedbackHeatmap />
        </>
      )}
    </div>
  );
};
