import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { exportFeedbacksToCSV } from '../../utils/csvExport';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  BarChart3,
  CheckCircle2,
  Printer,
  Sparkles,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { feedbacks, stats } = useFeedback();
  const [selectedRange, setSelectedRange] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');

  const handleExport = () => {
    exportFeedbacksToCSV(
      feedbacks,
      `feedbackiq-${selectedRange}-report-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Reports & CSV Generation
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate executive compliance summaries and export raw audit datasets for committees
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full CSV</span>
          </button>
        </div>
      </div>

      {/* Range filter selector */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl inline-flex gap-1 text-xs font-medium">
        {(['daily', 'weekly', 'monthly', 'all'] as const).map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setSelectedRange(range)}
            className={`px-4 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
              selectedRange === range
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {range === 'all' ? 'All Time' : `${range} Summary`}
          </button>
        ))}
      </div>

      {/* Printable Executive Report Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Institutional Quality Audit
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Campus Feedback Intelligence Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Period: {selectedRange.toUpperCase()} · Generated on{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
              FeedbackIQ v2.6 Enterprise
            </span>
            <span className="text-[10px] text-slate-400">Verified System Audit</span>
          </div>
        </div>

        {/* High-level Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Submissions Audited
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {stats.totalFeedback}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Average Rating
            </span>
            <span className="text-xl font-bold font-mono text-amber-500 mt-1 block">
              {stats.averageRating} / 5.0
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Positive Sentiment
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
              {stats.positivePercentage}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Resolution Efficacy
            </span>
            <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block">
              {stats.resolutionRate}%
            </span>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            1. Executive Assessment
          </h4>
          <p>
            During the evaluated reporting interval, campus sentiment remained healthy with an overall average score of{' '}
            <strong>{stats.averageRating} out of 5</strong> across {stats.totalFeedback} authenticated and anonymous student entries. Academic curriculum delivery and guest industry seminars recorded the highest satisfaction levels.
          </p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pt-2">
            2. Primary Operational Friction Points
          </h4>
          <p>
            Negative feedback ({stats.negativePercentage}%) continues to concentrate primarily within <strong>Infrastructure</strong> and <strong>Food Services</strong>. The most acute operational complaints cite Wi-Fi dropouts during computer science lab hours, delayed cafeteria queues during peak lunch periods, and projector bulb flickering in large lecture halls.
          </p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pt-2">
            3. Recommended Quality Action Directives
          </h4>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Deploy high-bandwidth Wi-Fi 6 access points across CS Labs and Central Library by end of month.</li>
            <li>Introduce an express cafeteria lunch counter and dual digital POS checkout stations to reduce waiting time.</li>
            <li>Ensure at least a 24-hour preparation window between difficult numerical examinations in the upcoming semester schedule.</li>
          </ul>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Prepared by: Administration Office & Student Welfare Committee</span>
          <span className="font-mono">Document Ref: RPT-2026-FDBK-01</span>
        </div>
      </div>
    </div>
  );
};
