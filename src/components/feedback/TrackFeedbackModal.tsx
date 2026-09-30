import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem } from '../../types';
import { StatusBadge, SentimentBadge } from '../common/Badges';
import { StarRating } from '../common/StarRating';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';

interface TrackFeedbackModalProps {
  initialId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TrackFeedbackModal: React.FC<TrackFeedbackModalProps> = ({
  initialId = '',
  isOpen,
  onClose,
}) => {
  const { feedbacks } = useFeedback();
  const [searchId, setSearchId] = useState(initialId);
  const [searchedItem, setSearchedItem] = useState<FeedbackItem | null>(() => {
    if (initialId) {
      return feedbacks.find((f) => f.id.toLowerCase() === initialId.toLowerCase()) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialId));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    const found = feedbacks.find((f) => f.id.toUpperCase() === clean);
    setSearchedItem(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl anim-same">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Track Feedback Status
              </h3>
              <p className="text-[11px] text-black dark:text-slate-300 font-medium">
                Check resolution progress and administrator responses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-black dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/50 anim-same">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. FB-2026-00101"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-slate-200 font-bold uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5">
          {searchedItem ? (
            <div className="space-y-5">
              {/* Top summary lockup */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-black dark:text-white">
                      {searchedItem.id}
                    </span>
                    <StatusBadge status={searchedItem.status} size="sm" />
                  </div>
                  <p className="text-xs text-black dark:text-slate-300 font-medium">
                    Submitted on {new Date(searchedItem.createdAt).toLocaleDateString()} at{' '}
                    {new Date(searchedItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <StarRating value={searchedItem.rating} readOnly size="sm" />
              </div>

              {/* Status progression bar */}
              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border-2 border-slate-200 dark:border-slate-800 anim-same">
                <span className="text-[10px] uppercase font-bold text-black dark:text-slate-400 block mb-2">
                  Resolution Workflow
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
                  <div
                    className={`py-1.5 px-2 rounded-md ${
                      searchedItem.status === 'New' || searchedItem.status === 'Reviewed' || searchedItem.status === 'Resolved'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    1. Received
                  </div>
                  <div
                    className={`py-1.5 px-2 rounded-md ${
                      searchedItem.status === 'Reviewed' || searchedItem.status === 'Resolved'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    2. In Review
                  </div>
                  <div
                    className={`py-1.5 px-2 rounded-md ${
                      searchedItem.status === 'Resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    3. Resolved
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-black dark:text-slate-400 block mb-1">
                  Submitted Message
                </span>
                <p className="text-xs text-black dark:text-slate-200 bg-white dark:bg-slate-850 p-3 rounded-lg border-2 border-slate-300 dark:border-slate-800 italic font-semibold anim-same">
                  "{searchedItem.message}"
                </p>
              </div>

              {/* Admin response if exists */}
              {searchedItem.adminResponse ? (
                <div className="p-3.5 bg-indigo-50/90 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800/80 rounded-xl anim-same">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Official Institutional Response</span>
                  </div>
                  <p className="text-xs text-black dark:text-indigo-100 leading-relaxed mb-2 font-medium">
                    {searchedItem.adminResponse.text}
                  </p>
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block font-bold">
                    Responded by {searchedItem.adminResponse.responderName} on{' '}
                    {new Date(searchedItem.adminResponse.respondedAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800/50 rounded-xl flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300 font-semibold anim-same">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Administrative review is currently in progress. Check back soon.</span>
                </div>
              )}

              {/* Public Activity Timeline */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block mb-2">
                  Activity Timeline
                </span>
                <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                  {searchedItem.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-4 text-xs">
                      <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {event.title}
                      </div>
                      {event.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {event.description}
                        </p>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                No Record Found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                We couldn't find a feedback entry with ID "{searchId}". Please verify the reference code and try again.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Enter your Feedback Tracking ID above to view real-time review status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
