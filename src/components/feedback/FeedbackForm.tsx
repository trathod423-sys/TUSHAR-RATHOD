import React, { useState, useMemo } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Department, EventService, Category, FeedbackItem } from '../../types';
import { StarRating } from '../common/StarRating';
import { SubmissionSuccess } from './SubmissionSuccess';
import {
  Send,
  Shield,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Loader2,
  CheckCircle,
  Tag,
  Eye,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Info,
} from 'lucide-react';

interface FeedbackFormProps {
  onTrackFeedback?: (id: string) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onTrackFeedback }) => {
  const { submitFeedback, isSubmitting } = useFeedback();

  // Form Fields
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [department, setDepartment] = useState<Department | ''>('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [eventService, setEventService] = useState<EventService | ''>('');
  const [customEventService, setCustomEventService] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState('');

  // UI modes
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackItem | null>(null);

  const departments: Department[] = [
    'Computer Science',
    'Information Technology',
    'Commerce',
    'Management',
    'Engineering',
    'Arts',
    'Science',
    'Other',
  ];

  const eventServices: EventService[] = [
    'College Event',
    'Workshop',
    'Seminar',
    'Faculty',
    'Infrastructure',
    'Library',
    'Canteen',
    'Transport',
    'Hostel',
    'Placement',
    'Examination',
    'Student Support',
    'Other',
  ];

  const categories: Category[] = [
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

  // Quick Topic Starter suggestions for students
  const quickTopicStarters = [
    { label: '📶 Lab Wi-Fi Stability', text: 'The campus Wi-Fi keeps disconnecting during lab sessions in ' },
    { label: '🍽️ Canteen Rush & POS', text: 'Canteen queues during lunch rush exceeded 30 mins and payment scanners failed.' },
    { label: '📚 Library Exam Hours', text: 'Please consider extending the library reading room hours till 11 PM during exam weeks.' },
    { label: '⭐ Inspiring Faculty', text: 'The lectures and practical guidance provided by the faculty were exceptionally clear and engaging!' },
    { label: '📅 Exam Schedule Buffer', text: 'The exam schedule clustered difficult numerical papers on consecutive days without revision gaps.' },
    { label: '🖥️ Workstation Software', text: 'Workstation computers need disk space cleanup and updated software packages for coursework.' },
  ];

  // Real-time sentiment tone indicator
  const liveTone = useMemo(() => {
    if (!message || message.length < 5) return null;
    const lower = message.toLowerCase();
    const negWords = ['bad', 'poor', 'slow', 'fail', 'broken', 'issue', 'disconnect', 'terrible', 'wait', 'worst', 'delay', 'noise'];
    const posWords = ['great', 'excellent', 'inspiring', 'love', 'helpful', 'clean', 'good', 'best', 'flawless', 'praise', 'thanks'];

    let negCount = 0;
    let posCount = 0;
    negWords.forEach((w) => { if (lower.includes(w)) negCount++; });
    posWords.forEach((w) => { if (lower.includes(w)) posCount++; });

    if (negCount > posCount || (rating > 0 && rating <= 2)) {
      return {
        label: 'Friction / Pain Point Detected',
        sub: 'Our AI flags this for administrative action & review.',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-500',
        icon: <ThumbsDown className="w-3 h-3" />,
      };
    }
    if (posCount > negCount || (rating >= 4)) {
      return {
        label: 'Positive & Constructive Tone',
        sub: 'Great praise and appreciation detected.',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500',
        icon: <ThumbsUp className="w-3 h-3" />,
      };
    }
    return {
      label: 'Balanced Feedback Observation',
      sub: 'Neutral context with constructive points.',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      icon: <Sparkles className="w-3 h-3" />,
    };
  }, [message, rating]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isAnonymous) {
      if (!userName.trim()) {
        newErrors.userName = 'Please enter your full name.';
      }
      if (!userEmail.trim()) {
        newErrors.userEmail = 'Please enter your email address.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
        newErrors.userEmail = 'Please enter a valid email address (e.g. name@campus.edu).';
      }
    }

    if (!department) {
      newErrors.department = 'Please select your department.';
    } else if (department === 'Other' && !customDepartment.trim()) {
      newErrors.customDepartment = 'Please specify your department.';
    }

    if (!eventService) {
      newErrors.eventService = 'Please select the relevant service or event.';
    } else if (eventService === 'Other' && !customEventService.trim()) {
      newErrors.customEventService = 'Please specify the event or service.';
    }

    if (!category) {
      newErrors.category = 'Please select a feedback category.';
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select an experience rating from 1 to 5 stars.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please provide your detailed feedback message.';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters so reviewers understand the context.';
    } else if (message.trim().length > 1000) {
      newErrors.message = 'Feedback cannot exceed 1000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const created = await submitFeedback({
        userName: isAnonymous ? '' : userName.trim(),
        userEmail: isAnonymous ? '' : userEmail.trim(),
        isAnonymous,
        department: department as Department,
        customDepartment: department === 'Other' ? customDepartment.trim() : undefined,
        eventService: eventService as EventService,
        customEventService: eventService === 'Other' ? customEventService.trim() : undefined,
        category: category as Category,
        rating,
        message: message.trim(),
      });

      setSubmittedFeedback(created);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleReset = () => {
    setSubmittedFeedback(null);
    setUserName('');
    setUserEmail('');
    setIsAnonymous(false);
    setDepartment('');
    setCustomDepartment('');
    setEventService('');
    setCustomEventService('');
    setCategory('');
    setRating(0);
    setMessage('');
    setErrors({});
    setIsPreviewMode(false);
  };

  if (submittedFeedback) {
    return (
      <SubmissionSuccess
        feedback={submittedFeedback}
        onReset={handleReset}
        onTrack={(id) => onTrackFeedback && onTrackFeedback(id)}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm anim-same">
      {/* Form Header */}
      <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Student & Stakeholder Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
            Share Your Campus Feedback
          </h2>
          <p className="text-xs sm:text-sm text-black dark:text-slate-300 font-medium mt-0.5">
            Real-time AI evaluates sentiment, routes urgent issues, and tracks resolution progress.
          </p>
        </div>

        {/* Preview Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border self-start sm:self-center ${
            isPreviewMode
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
          }`}
        >
          {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreviewMode ? 'Back to Edit' : 'Preview Card'}</span>
        </button>
      </div>

      {isPreviewMode ? (
        // PREVIEW MODE
        <div className="space-y-6 anim-same">
          <div className="p-5 rounded-2xl border-2 border-indigo-500/40 bg-white dark:bg-slate-900 space-y-4 shadow-sm anim-same">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  PREVIEW: NEW SUBMISSION
                </span>
              </div>
              <span className="text-xs font-bold text-black dark:text-slate-300">
                {isAnonymous ? '🛡️ Anonymous' : userName || 'Student'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StarRating value={rating} readOnly size="md" />
              <span className="text-xs font-bold text-black dark:text-slate-200">
                {rating > 0 ? `${rating} / 5 Stars` : 'No rating chosen'}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-black dark:text-white font-semibold italic leading-relaxed shadow-xs anim-same">
              "{message || 'No feedback text entered yet...'}"
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-black dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <strong className="text-black dark:text-white font-bold">Department:</strong>{' '}
                <span className="text-black dark:text-slate-200 font-semibold">{department || 'Not selected'}</span>
              </div>
              <div>
                <strong className="text-black dark:text-white font-bold">Event/Service:</strong>{' '}
                <span className="text-black dark:text-slate-200 font-semibold">{eventService || 'Not selected'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Continue Editing
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      ) : (
        // EDIT FORM
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Anonymous Mode Switch */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850/80 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4 anim-same">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                {isAnonymous ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Shield className="w-4 h-4" />}
              </div>
              <div>
                <label
                  htmlFor="anonymous-toggle"
                  className="text-xs font-bold text-black dark:text-white cursor-pointer select-none"
                >
                  Submit Anonymously
                </label>
                <p className="text-[11px] text-black dark:text-slate-300 font-medium mt-0.5 leading-relaxed">
                  {isAnonymous
                    ? 'Your identity will NOT be displayed or stored with this feedback entry.'
                    : 'Turn this on to hide your name and email completely.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="anonymous-toggle"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => {
                setIsAnonymous(!isAnonymous);
                if (!isAnonymous) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.userName;
                    delete copy.userEmail;
                    return copy;
                  });
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isAnonymous ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Personal Information (if not anonymous) */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors((prev) => ({ ...prev, userName: '' }));
                  }}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.userName
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
                  }`}
                  aria-invalid={Boolean(errors.userName)}
                />
                {errors.userName && (
                  <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.userName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    if (errors.userEmail) setErrors((prev) => ({ ...prev, userEmail: '' }));
                  }}
                  placeholder="e.g. aarav.sharma@campus.edu"
                  className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.userEmail
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
                  }`}
                  aria-invalid={Boolean(errors.userEmail)}
                />
                {errors.userEmail && (
                  <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.userEmail}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Department & Event/Service Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value as Department);
                  if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.department
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
                }`}
              >
                <option value="" className="text-black bg-white dark:text-white dark:bg-slate-800">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d} value={d} className="text-black bg-white dark:text-white dark:bg-slate-800 font-medium">
                    {d}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.department}</span>
                </p>
              )}

              {department === 'Other' && (
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => {
                    setCustomDepartment(e.target.value);
                    if (errors.customDepartment) setErrors((prev) => ({ ...prev, customDepartment: '' }));
                  }}
                  placeholder="Specify department name..."
                  className="mt-2 w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                Event or Service Area <span className="text-rose-500">*</span>
              </label>
              <select
                value={eventService}
                onChange={(e) => {
                  setEventService(e.target.value as EventService);
                  if (errors.eventService) setErrors((prev) => ({ ...prev, eventService: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.eventService
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
                }`}
              >
                <option value="" className="text-black bg-white dark:text-white dark:bg-slate-800">-- Select Service / Event --</option>
                {eventServices.map((es) => (
                  <option key={es} value={es} className="text-black bg-white dark:text-white dark:bg-slate-800 font-medium">
                    {es}
                  </option>
                ))}
              </select>
              {errors.eventService && (
                <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.eventService}</span>
                </p>
              )}

              {eventService === 'Other' && (
                <input
                  type="text"
                  value={customEventService}
                  onChange={(e) => {
                    setCustomEventService(e.target.value);
                    if (errors.customEventService) setErrors((prev) => ({ ...prev, customEventService: '' }));
                  }}
                  placeholder="Specify event or service name..."
                  className="mt-2 w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              )}
            </div>
          </div>

          {/* Rating & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-850/60 rounded-xl border-2 border-slate-200 dark:border-slate-800 anim-same">
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-2">
                Overall Experience Rating <span className="text-rose-500">*</span>
              </label>
              <StarRating
                value={rating}
                onChange={(newRating) => {
                  setRating(newRating);
                  if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                }}
                size="md"
                showLabel
              />
              {errors.rating && (
                <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.rating}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Category);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.category
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
                }`}
              >
                <option value="" className="text-black bg-white dark:text-white dark:bg-slate-800">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="text-black bg-white dark:text-white dark:bg-slate-800 font-medium">
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Topic Starters (Click to prefill) */}
          <div className="anim-same">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quick Topics (Click to add):</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTopicStarters.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMessage((prev) => (prev ? `${prev} ${t.text}` : t.text));
                    if (errors.message) setErrors((p) => ({ ...p, message: '' }));
                  }}
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 rounded-lg text-black dark:text-white border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition-all font-semibold shadow-2xs cursor-pointer active:scale-95 anim-same"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Message Input with Live Character and Tone Counter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-black dark:text-white">
                Detailed Feedback Message <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  message.length < 10
                    ? 'text-slate-400 font-medium'
                    : message.length > 1000
                    ? 'text-rose-600 font-bold'
                    : 'text-black dark:text-white font-bold'
                }`}
              >
                {message.length} / 1000 characters (min 10)
              </span>
            </div>

            <textarea
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
              }}
              placeholder="Tell us what worked well or what can be improved. Mention specific details (room number, speaker, facility issue, timing) so our team can act effectively..."
              className={`w-full px-4 py-3 text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 rounded-xl text-black dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-y leading-relaxed font-sans ${
                errors.message
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-500/20'
              }`}
              aria-invalid={Boolean(errors.message)}
            />

            {/* Live Real-Time Tone Indicator Bar */}
            {liveTone && (
              <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-slate-850 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs animate-in fade-in shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${liveTone.bg}`} />
                  <span className={`font-bold ${liveTone.color} flex items-center gap-1`}>
                    {liveTone.icon}
                    <span>{liveTone.label}</span>
                  </span>
                </div>
                <span className="text-[11px] font-medium text-black dark:text-slate-300">
                  {liveTone.sub}
                </span>
              </div>
            )}

            {errors.message && (
              <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 rounded-xl shadow-sm shadow-indigo-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Sentiment & Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
