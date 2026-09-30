import React, { useState } from 'react';
import { FeedbackItem } from '../../types';
import { CheckCircle2, Copy, Check, ArrowRight, ShieldCheck, Search } from 'lucide-react';

interface SubmissionSuccessProps {
  feedback: FeedbackItem;
  onReset: () => void;
  onTrack: (feedbackId: string) => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  feedback,
  onReset,
  onTrack,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(feedback.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-sm text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Feedback Submitted Successfully!
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        Thank you for helping us improve our campus environment. Your submission has been indexed and analyzed by FeedbackIQ.
      </p>

      {/* Unique Feedback ID Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Tracking Reference ID
          </span>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {feedback.id}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy ID'}</span>
        </button>
      </div>

      {/* Snapshot details */}
      <div className="grid grid-cols-2 gap-3 text-left text-xs mb-6 p-3 bg-slate-50/50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Department</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
            {feedback.department}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Event / Service</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
            {feedback.eventService}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Rating</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 block">
            {feedback.rating} / 5 Stars
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Identity</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
            {feedback.isAnonymous ? (
              <>
                <ShieldCheck className="w-3 h-3 text-indigo-500" /> Anonymous
              </>
            ) : (
              feedback.userName
            )}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          Submit Another Feedback
        </button>
        <button
          type="button"
          onClick={() => onTrack(feedback.id)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>View Submission Status</span>
        </button>
      </div>
    </div>
  );
};
