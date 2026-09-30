import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem, FeedbackStatus } from '../../types';
import { StarRating } from '../common/StarRating';
import { StatusBadge, SentimentBadge, PriorityBadge } from '../common/Badges';
import {
  X,
  MessageSquare,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  Send,
  Trash2,
  CheckCircle,
  Tag,
  Building,
  Calendar,
  Instagram,
} from 'lucide-react';

interface FeedbackDetailModalProps {
  feedback: FeedbackItem | null;
  onClose: () => void;
}

interface FeedbackDetailContentProps {
  feedback: FeedbackItem;
  onClose: () => void;
}

const FeedbackDetailContent: React.FC<FeedbackDetailContentProps> = ({
  feedback,
  onClose,
}) => {
  const { updateStatus, respondToFeedback, deleteFeedback, setActiveTab } = useFeedback();

  const [responseText, setResponseText] = useState(feedback.adminResponse?.text || '');
  const [responderName, setResponderName] = useState(
    feedback.adminResponse?.responderName || 'Dinesh Rathod (Admin)'
  );
  const [isEditingResponse, setIsEditingResponse] = useState(!feedback.adminResponse?.text);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    respondToFeedback(feedback.id, responseText.trim(), responderName.trim());
    setIsEditingResponse(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleStatusChange = (newStatus: FeedbackStatus) => {
    updateStatus(feedback.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden anim-same">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-base font-bold text-black dark:text-white">
              {feedback.id}
            </span>
            <StatusBadge status={feedback.status} />
            <PriorityBadge priority={feedback.priority} score={feedback.priorityScore} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-black dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white dark:bg-slate-850 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-xs anim-same">
            <div>
              <span className="text-[10px] text-black dark:text-slate-400 block uppercase font-bold">
                Submitter
              </span>
              <span className="font-bold text-black dark:text-slate-200 truncate flex items-center gap-1 mt-0.5">
                {feedback.isAnonymous ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Anonymous</span>
                  </>
                ) : (
                  feedback.userName
                )}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-black dark:text-slate-400 block uppercase font-bold">
                Department
              </span>
              <span className="font-bold text-black dark:text-slate-200 truncate block mt-0.5">
                {feedback.department}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-black dark:text-slate-400 block uppercase font-bold">
                Service / Event
              </span>
              <span className="font-bold text-black dark:text-slate-200 truncate block mt-0.5">
                {feedback.eventService}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-black dark:text-slate-400 block uppercase font-bold">
                Rating
              </span>
              <div className="mt-0.5">
                <StarRating value={feedback.rating} readOnly size="sm" />
              </div>
            </div>
          </div>

          {/* Feedback Text Message */}
          <div>
            <span className="text-[10px] font-bold text-black dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Original Feedback Message
            </span>
            <div className="p-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-black dark:text-slate-200 leading-relaxed font-sans shadow-2xs font-semibold anim-same">
              "{feedback.message}"
            </div>
          </div>

          {/* AI Intelligence Breakdown */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Sentiment & Urgency Assessment</span>
              </div>
              <SentimentBadge sentiment={feedback.sentiment} score={feedback.sentimentScore} />
            </div>

            <p className="text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
              {feedback.sentimentReason}
            </p>

            {feedback.keyTopics && feedback.keyTopics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-medium">
                  Detected Topics:
                </span>
                {feedback.keyTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status Workflow Selector */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Workflow Status
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Update progress through the resolution pipeline
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {(['New', 'Reviewed', 'Resolved'] as FeedbackStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                    feedback.status === st
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Response Section */}
          <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Administrator Response</span>
              </div>
              {feedback.adminResponse && !isEditingResponse && (
                <button
                  type="button"
                  onClick={() => setIsEditingResponse(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  Edit Response
                </button>
              )}
            </div>

            {isEditingResponse ? (
              <form onSubmit={handleSaveResponse} className="space-y-3">
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Draft institutional response or state resolution actions taken..."
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={responderName}
                    onChange={(e) => setResponderName(e.target.value)}
                    placeholder="Responder name & title"
                    className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 w-1/2"
                  />
                  <div className="flex items-center gap-2">
                    {feedback.adminResponse?.text && (
                      <button
                        type="button"
                        onClick={() => setIsEditingResponse(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Save Response</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                  "{feedback.adminResponse?.text}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  <span>Author: {feedback.adminResponse?.responderName}</span>
                  <span>
                    Responded:{' '}
                    {feedback.adminResponse?.respondedAt
                      ? new Date(feedback.adminResponse.respondedAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {saveSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                <CheckCircle className="w-3.5 h-3.5" /> Response recorded and status updated.
              </p>
            )}
          </div>

          {/* Activity Timeline */}
          <div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
              Action & Audit Timeline
            </span>
            <div className="space-y-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 text-xs">
              {feedback.timeline.map((event, idx) => (
                <div key={idx} className="relative pl-4">
                  <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {event.title}
                  </div>
                  {event.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {event.description}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                    {event.author ? ` · by ${event.author}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this feedback record?')) {
                deleteFeedback(feedback.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Feedback</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('social');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Create Instagram Post</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  onClose,
}) => {
  if (!feedback) return null;

  return <FeedbackDetailContent key={feedback.id} feedback={feedback} onClose={onClose} />;
};
