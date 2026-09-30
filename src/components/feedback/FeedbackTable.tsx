import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem, FeedbackStatus } from '../../types';
import { StarRating } from '../common/StarRating';
import { StatusBadge, SentimentBadge, PriorityBadge } from '../common/Badges';
import { EmptyState } from '../common/EmptyState';
import { exportFeedbacksToCSV } from '../../utils/csvExport';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RotateCcw,
  Eye,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Instagram,
} from 'lucide-react';

interface FeedbackTableProps {
  onSelectFeedback: (feedback: FeedbackItem) => void;
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({ onSelectFeedback }) => {
  const {
    feedbacks,
    filteredFeedbacks,
    filter,
    setFilter,
    resetFilter,
    sort,
    setSort,
    updateStatus,
    setActiveTab,
  } = useFeedback();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage) || 1;
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const departments = [
    'Computer Science',
    'Information Technology',
    'Commerce',
    'Management',
    'Engineering',
    'Arts',
    'Science',
    'Other',
  ];

  const categories = [
    'Academic',
    'Faculty',
    'Infrastructure',
    'Event',
    'Administration',
    'Food',
    'Technology',
    'Support',
    'Placement',
    'Other',
  ];

  const handleExportCSV = () => {
    exportFeedbacksToCSV(
      filteredFeedbacks,
      `feedback-export-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, student, keyword, department, event..."
              value={filter.searchQuery}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Quick Actions: Export CSV & Clear */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-black dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer anim-same"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                resetFilter();
                setCurrentPage(1);
              }}
              title="Reset all filters"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-black dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-750 rounded-lg transition-colors cursor-pointer anim-same"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          {/* Department */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Department
            </label>
            <select
              value={filter.department}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, department: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, category: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Sentiment
            </label>
            <select
              value={filter.sentiment}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, sentiment: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Sentiments</option>
              <option value="Positive">🟢 Positive</option>
              <option value="Neutral">🟡 Neutral</option>
              <option value="Negative">🔴 Negative</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Rating
            </label>
            <select
              value={filter.rating}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  rating: e.target.value === 'all' ? 'all' : Number(e.target.value),
                }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, status: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">🟡 New</option>
              <option value="Reviewed">🔵 Reviewed</option>
              <option value="Resolved">🟢 Resolved</option>
            </select>
          </div>

          {/* Sort order */}
          <div>
            <label className="text-[10px] font-bold text-black dark:text-white block mb-1">
              Sort By
            </label>
            <select
              value={`${sort.field}_${sort.order}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('_');
                setSort(f as any, o as any);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="priorityScore_desc">Highest Priority</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Filter stats counter */}
        <div className="flex items-center justify-between text-[11px] text-black dark:text-slate-300 pt-1 font-semibold">
          <span>
            Showing <strong className="text-black dark:text-white font-bold">{filteredFeedbacks.length}</strong> of{' '}
            {feedbacks.length} feedback entries
          </span>
          {filteredFeedbacks.length < feedbacks.length && (
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              Filters active
            </span>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs anim-same">
        {paginatedFeedbacks.length === 0 ? (
          <EmptyState
            title="No matching feedback records"
            description="Adjust your search keywords or reset filter conditions to inspect data."
            onAction={resetFilter}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-3.5 font-mono">ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Submitter</th>
                  <th className="py-3 px-3">Dept & Service</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Sentiment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Response</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedFeedbacks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectFeedback(item)}
                  >
                    {/* ID */}
                    <td className="py-3 px-3.5 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Submitter */}
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium max-w-[140px] truncate">
                      {item.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 italic">
                          <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>Anonymous</span>
                        </span>
                      ) : (
                        item.userName
                      )}
                    </td>

                    {/* Dept & Service */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block truncate">
                        {item.department}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                        {item.eventService}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {item.category}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StarRating value={item.rating} readOnly size="sm" />
                    </td>

                    {/* Sentiment */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SentimentBadge sentiment={item.sentiment} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Admin Response */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {item.adminResponse ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Responded</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectFeedback(item);
                            setActiveTab('social');
                          }}
                          className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-md transition-colors"
                          title="Post to Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectFeedback(item)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(item.id, 'Resolved')}
                            className="px-2 py-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded hover:bg-emerald-100 transition-colors"
                            title="Mark as Resolved"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
