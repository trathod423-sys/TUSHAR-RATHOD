import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { THEME_CONFIGS } from '../../utils/themeConfig';
import { Card3D } from '../common/Card3D';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Flame,
  CheckCircle2,
  TrendingUp,
  Search,
  MessageSquare,
  Instagram,
  Heart,
  Share2,
} from 'lucide-react';

interface LandingHeroProps {
  onOpenTrackModal: () => void;
  onScrollToForm: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenTrackModal,
  onScrollToForm,
}) => {
  const { stats, setCurrentView, setActiveTab, appTheme } = useFeedback();
  const currentThemeConfig = THEME_CONFIGS[appTheme] || THEME_CONFIGS.cobalt;

  return (
    <div className="space-y-14 pb-8">
      {/* Hero Section */}
      <section className="relative text-center pt-8 sm:pt-14 pb-8 max-w-4xl mx-auto px-4">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Feedback Intelligence Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
          Your Voice. Our Intelligence.{' '}
          <span className={`bg-gradient-to-r ${currentThemeConfig.gradient} bg-clip-text text-transparent`}>
            Better Experiences.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Share your academic, facility, and campus feedback in seconds. FeedbackIQ analyzes sentiment, extracts recurring pain points, and gives administrators the intelligence to take measurable action.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <button
            type="button"
            onClick={onScrollToForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share Your Feedback</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenTrackModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Track Submission Status</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 rounded-xl transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Explore Admin Dashboard</span>
          </button>
        </div>

        {/* 3D Pulse Bar Ticker */}
        <Card3D maxTilt={5} scale={1.01} className="max-w-xl mx-auto">
          <div className="p-3.5 bg-slate-50/90 dark:bg-slate-850/90 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              <span className="font-medium">
                AI analyzed <strong className="font-mono text-slate-900 dark:text-white">{stats.totalFeedback}</strong> feedback entries
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {stats.averageRating} ⭐ avg score
            </span>
          </div>
        </Card3D>
      </section>

      {/* The 5-Step Feedback Loop Pipeline */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The Closed-Loop Intelligence Framework
          </h2>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Collect → Understand → Prioritize → Act → Improve
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Collect',
              desc: 'Seamless student feedback forms with anonymous mode and smart validation.',
            },
            {
              step: '02',
              title: 'Understand',
              desc: 'Gemini AI evaluates nuanced sentiment, emotion scores, and extracted topics.',
            },
            {
              step: '03',
              title: 'Prioritize',
              desc: 'Algorithmic ranking detects common complaints and top 5 improvement areas.',
            },
            {
              step: '04',
              title: 'Act',
              desc: 'Admins review issues, log corrective actions, and respond with public status.',
            },
            {
              step: '05',
              title: 'Improve',
              desc: 'Measure satisfaction trends over time with verifiable compliance health metrics.',
            },
          ].map((item, idx) => (
            <Card3D key={idx} maxTilt={6} scale={1.02} className="h-full">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative group hover:border-indigo-400 transition-colors shadow-2xs h-full flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* Social Transparency & Instagram Spotlight Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <Card3D maxTilt={4} scale={1.01}>
          <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold tracking-wider uppercase border border-pink-500/30">
                <Instagram className="w-3 h-3" />
                <span>Social Transparency Studio</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Turn Student Feedback Into Instagram Posts & Stories
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Post "You Spoke, We Listened" resolution updates, weekly sentiment infographics, and faculty kudos directly to social media with 5+ post formats and 1-click 1080p export.
              </p>
            </div>

            <div className="shrink-0 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('admin');
                  setActiveTab('social');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 rounded-xl shadow-lg shadow-pink-500/30 transition-all cursor-pointer hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
                <span>Launch Instagram Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card3D>
      </section>

      {/* Key Feature Highlights */}
      <section id="intelligence" className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card3D maxTilt={6} scale={1.02} className="h-full">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Anonymous & Safe
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Students can report sensitive issues with complete privacy protection. Identity is neither stored nor visible to reviewers.
              </p>
            </div>
          </Card3D>

          <Card3D maxTilt={6} scale={1.02} className="h-full">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gemini AI Sentiment
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Understands tone context. A 3-star rating with constructive criticism is accurately synthesized rather than misclassified.
              </p>
            </div>
          </Card3D>

          <Card3D maxTilt={6} scale={1.02} className="h-full">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Actionable Workflows
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Issues advance from New → Reviewed → Resolved. Students can track their unique reference ID to verify institutional follow-through.
              </p>
            </div>
          </Card3D>
        </div>
      </section>
    </div>
  );
};
