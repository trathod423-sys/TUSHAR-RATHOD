import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { detectCommonComplaints, detectCommonSuggestions, computeTopImprovementAreas } from '../../utils/analytics';
import { Card3D } from '../common/Card3D';
import {
  Sparkles,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  Flame,
  Award,
  Instagram,
  ArrowRight,
} from 'lucide-react';

export const ExecutiveSnapshot: React.FC = () => {
  const { stats, feedbacks, setActiveTab } = useFeedback();

  const topComplaint = detectCommonComplaints(feedbacks)[0] || {
    issue: 'Wi-Fi connectivity in CS labs & Library',
    count: 12,
  };

  const topSuggestion = detectCommonSuggestions(feedbacks)[0] || {
    suggestion: 'Extend Library reading room operating hours until 11:00 PM during exam weeks',
    count: 8,
  };

  const topImprovement = computeTopImprovementAreas(feedbacks)[0] || {
    area: 'Wi-Fi & Network Stability',
    impact: 'Critical',
    suggestedAction: 'Install high-density Wi-Fi 6 access points in CS Labs and Central Library 2nd floor.',
  };

  return (
    <Card3D maxTilt={4} glare={true}>
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border border-indigo-500/30">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold tracking-wide uppercase mb-1 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Pulse Snapshot</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Institutional Feedback Health & Action Priorities
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 transition-all shadow-md shadow-pink-500/20 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Post on Instagram</span>
              </button>
            </div>
          </div>

          {/* 6 Core Pillars Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {/* 1. Volume */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Total Feedback
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {stats.totalFeedback}
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">Active dataset</span>
            </div>

            {/* 2. Rating */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Average Rating
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {stats.averageRating} ⭐
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Scale of 5.0</span>
            </div>

            {/* 3. Sentiment */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Sentiment Ratio
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {stats.positivePercentage}% Pos
              </div>
              <span className="text-[10px] text-rose-400 mt-1 block">
                {stats.negativePercentage}% Neg
              </span>
            </div>

            {/* 4. Top Complaint */}
            <div className="col-span-2 lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-rose-300 block uppercase font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                Top Complaint
              </span>
              <div className="text-xs font-semibold text-white mt-1 line-clamp-2">
                {topComplaint.issue}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                {topComplaint.count} recurring reports
              </span>
            </div>

            {/* 5. Top Suggestion */}
            <div className="col-span-2 lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-cyan-300 block uppercase font-medium flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-cyan-400" />
                Top Suggestion
              </span>
              <div className="text-xs font-semibold text-white mt-1 line-clamp-2">
                {topSuggestion.suggestion}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                {topSuggestion.count} student requests
              </span>
            </div>

            {/* 6. Top Improvement Area */}
            <div className="col-span-2 lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-amber-300 block uppercase font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                #1 Priority Area
              </span>
              <div className="text-xs font-semibold text-white mt-1 line-clamp-2">
                {topImprovement.area}
              </div>
              <span className="text-[10px] text-amber-400 mt-1 block font-medium">
                {topImprovement.impact} Urgency
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card3D>
  );
};
