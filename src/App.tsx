import React, { useState, useRef } from 'react';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingHero } from './components/landing/LandingHero';
import { FeedbackForm } from './components/feedback/FeedbackForm';
import { TrackFeedbackModal } from './components/feedback/TrackFeedbackModal';
import { FeedbackTable } from './components/feedback/FeedbackTable';
import { FeedbackDetailModal } from './components/feedback/FeedbackDetailModal';
import { StatCards } from './components/dashboard/StatCards';
import {
  RatingDistributionChart,
  SentimentDistributionChart,
  FeedbackTimelineChart,
  CategoryPerformanceChart,
  DepartmentInsightsChart,
} from './components/dashboard/Charts';
import { TopImprovements } from './components/dashboard/TopImprovements';
import { AttentionRequired } from './components/dashboard/AttentionRequired';
import { ExecutiveSnapshot } from './components/dashboard/ExecutiveSnapshot';
import { AIInsightsView } from './components/insights/AIInsightsView';
import { AskFeedbackAI } from './components/insights/AskFeedbackAI';
import { FeedbackHeatmap } from './components/insights/FeedbackHeatmap';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ThemeSelectorModal } from './components/theme/ThemeSelectorModal';
import { JudgesShowcaseBar } from './components/common/JudgesShowcaseBar';
import { SocialAndDevStudio } from './components/social/SocialAndDevStudio';
import { FeedbackItem } from './types';
import {
  Sparkles,
  Menu,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    activeTab,
    selectedFeedback,
    setSelectedFeedback,
    feedbacks,
  } = useFeedback();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [trackInitialId, setTrackInitialId] = useState('');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleOpenTrackModal = (id?: string) => {
    setTrackInitialId(id || '');
    setIsTrackModalOpen(true);
  };

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      {/* Dynamic Ambient Theme Accent Glow */}
      <div className="theme-ambient-glow pointer-events-none fixed top-0 left-0 right-0 h-80 overflow-hidden -z-10 opacity-70" />

      {/* Top Navbar */}
      <Navbar
        onOpenTrackModal={() => handleOpenTrackModal()}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Judges Presentation & 3D Interactive Mode Bar */}
      <JudgesShowcaseBar
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Theme Selection Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Track Feedback Modal (accessible across views) */}
      <TrackFeedbackModal
        isOpen={isTrackModalOpen}
        initialId={trackInitialId}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* Detailed Feedback Inspector & Response Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />

      {/* Main View Router */}
      {currentView === 'student' ? (
        // STUDENT / PUBLIC LANDING VIEW
        <main className="flex-1 pb-16">
          <LandingHero
            onOpenTrackModal={() => handleOpenTrackModal()}
            onScrollToForm={handleScrollToForm}
          />

          {/* Feedback Submission Section */}
          <section id="feedback-form" ref={formSectionRef} className="max-w-4xl mx-auto px-4 pt-6">
            <FeedbackForm onTrackFeedback={(id) => handleOpenTrackModal(id)} />
          </section>

          {/* Quick FAQ / Transparency Section */}
          <section className="max-w-4xl mx-auto px-4 pt-16">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Privacy & Institutional Commitment
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Is Anonymous Mode truly private?
                  </h4>
                  <p>
                    Yes. When submitting in Anonymous Mode, your name and email are neither displayed nor associated with your entry in administrative portals.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    How does AI evaluate feedback?
                  </h4>
                  <p>
                    FeedbackIQ uses Google Gemini to read the contextual tone and nuances of submissions, classifying issues and highlighting actionable improvements without bias.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        // ADMIN DASHBOARD VIEW
        <div className="flex-1 flex">
          {/* Admin Sidebar */}
          <Sidebar
            isOpenMobile={isSidebarOpenMobile}
            onCloseMobile={() => setIsSidebarOpenMobile(false)}
          />

          {/* Main Admin Viewport */}
          <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
            {/* Mobile Sidebar Toggle Header */}
            <div className="lg:hidden p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsSidebarOpenMobile(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </button>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>

            {/* Viewport Content */}
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {activeTab === 'dashboard' && (
                <>
                  {/* Executive Snapshot Pulse */}
                  <ExecutiveSnapshot />

                  {/* High Level Stat KPI Cards */}
                  <StatCards />

                  {/* Urgent Attention Alerts */}
                  <AttentionRequired onSelectFeedback={(f) => setSelectedFeedback(f)} />

                  {/* Primary Grid: Timeline Velocity & Top Improvements */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <FeedbackTimelineChart />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <RatingDistributionChart />
                        <SentimentDistributionChart />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <TopImprovements />
                    </div>
                  </div>

                  {/* Recent Feedback Table Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Recent Feedback Submissions
                      </h3>
                      <span className="text-xs text-slate-500">
                        {feedbacks.length} total entries indexed
                      </span>
                    </div>
                    <FeedbackTable onSelectFeedback={(f) => setSelectedFeedback(f)} />
                  </div>
                </>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Feedback Management Console
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Search, filter, review, and respond to student & stakeholder submissions
                      </p>
                    </div>
                  </div>
                  <FeedbackTable onSelectFeedback={(f) => setSelectedFeedback(f)} />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Deep Dive Institutional Analytics
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cross-department ratings, sentiment velocity, and category concentration
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RatingDistributionChart />
                    <SentimentDistributionChart />
                  </div>

                  <FeedbackTimelineChart />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CategoryPerformanceChart />
                    <DepartmentInsightsChart />
                  </div>

                  <FeedbackHeatmap />
                </div>
              )}

              {activeTab === 'insights' && <AIInsightsView />}

              {activeTab === 'improvements' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Institutional Improvement Radar
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Data-driven remediation priorities and resource allocation directives
                    </p>
                  </div>
                  <TopImprovements />
                  <FeedbackHeatmap />
                </div>
              )}

              {activeTab === 'ask-ai' && <AskFeedbackAI />}

              {activeTab === 'social' && (
                <SocialAndDevStudio initialFeedbackId={selectedFeedback?.id} />
              )}

              {activeTab === 'reports' && <ReportsView />}

              {activeTab === 'settings' && <SettingsView />}
            </div>
          </main>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">FeedbackIQ</span>
            <span>·</span>
            <span>Turn feedback into intelligent action</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Assured</span>
            <span>·</span>
            <span>Gemini AI Engine</span>
            <span>·</span>
            <span>v2.6 Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FeedbackProvider>
      <AppContent />
    </FeedbackProvider>
  );
}
