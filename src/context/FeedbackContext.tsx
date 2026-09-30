import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  FeedbackItem,
  FeedbackFilter,
  FeedbackStats,
  SortField,
  SortOrder,
  AuditLogEntry,
  Department,
  EventService,
  Category,
  FeedbackStatus,
} from '../types';
import { getFullDemoFeedbacks } from '../data/mockData';
import { calculateFeedbackStats } from '../utils/analytics';
import { analyzeSentimentAPI } from '../services/aiService';
import { AppTheme, THEME_CONFIGS } from '../utils/themeConfig';

interface FeedbackContextType {
  feedbacks: FeedbackItem[];
  filteredFeedbacks: FeedbackItem[];
  stats: FeedbackStats;
  filter: FeedbackFilter;
  sort: { field: SortField; order: SortOrder };
  activeTab: string;
  currentView: 'student' | 'admin';
  theme: 'light' | 'dark';
  appTheme: AppTheme;
  setAppTheme: (newTheme: AppTheme) => void;
  cycleTheme: () => void;
  auditLogs: AuditLogEntry[];
  selectedFeedback: FeedbackItem | null;
  unreadAlertCount: number;
  urgentFeedbacks: FeedbackItem[];
  isSubmitting: boolean;

  // Actions
  submitFeedback: (payload: {
    userName: string;
    userEmail: string;
    isAnonymous: boolean;
    department: Department;
    customDepartment?: string;
    eventService: EventService;
    customEventService?: string;
    category: Category;
    rating: number;
    message: string;
  }) => Promise<FeedbackItem>;
  updateStatus: (id: string, newStatus: FeedbackStatus) => void;
  respondToFeedback: (id: string, responseText: string, responderName?: string) => void;
  deleteFeedback: (id: string) => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
  setFilter: React.Dispatch<React.SetStateAction<FeedbackFilter>>;
  resetFilter: () => void;
  setSort: (field: SortField, order: SortOrder) => void;
  setActiveTab: (tab: string) => void;
  setCurrentView: (view: 'student' | 'admin') => void;
  toggleTheme: () => void;
  setSelectedFeedback: (feedback: FeedbackItem | null) => void;
}

const DEFAULT_FILTER: FeedbackFilter = {
  searchQuery: '',
  department: 'all',
  eventService: 'all',
  category: 'all',
  rating: 'all',
  sentiment: 'all',
  status: 'all',
  priority: 'all',
  dateRange: 'all',
  isAnonymous: 'all',
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('feedbackiq_app_theme');
    if (saved && saved in THEME_CONFIGS && saved !== 'aurora') {
      return saved as AppTheme;
    }
    return 'cobalt';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('feedbackiq_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    const initialAppTheme = localStorage.getItem('feedbackiq_app_theme');
    if (initialAppTheme === 'ivory') return 'light';
    return 'dark';
  });

  const setAppTheme = (newTheme: AppTheme) => {
    setAppThemeState(newTheme);
    localStorage.setItem('feedbackiq_app_theme', newTheme);
    if (newTheme === 'ivory') {
      setTheme('light');
    } else if (newTheme === 'slate') {
      // keep current or default
    } else {
      setTheme('dark');
    }
  };

  const cycleTheme = () => {
    const keys: AppTheme[] = ['cobalt', 'amethyst', 'amber', 'cyan', 'ivory', 'slate'];
    const currentIndex = keys.indexOf(appTheme);
    const nextTheme = keys[(currentIndex + 1) % keys.length];
    setAppTheme(nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
    localStorage.setItem('feedbackiq_app_theme', appTheme);
    localStorage.setItem('feedbackiq_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme, theme]);

  const toggleTheme = () => {
    if (appTheme === 'ivory') {
      setAppTheme('cobalt');
    } else if (appTheme === 'slate') {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    } else {
      setAppTheme(theme === 'dark' ? 'ivory' : 'cobalt');
    }
  };

  // View state
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Feedbacks state
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    try {
      const stored = localStorage.getItem('feedbackiq_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage feedbacks:', e);
    }
    return getFullDemoFeedbacks();
  });

  // Save to localStorage when feedbacks change
  useEffect(() => {
    try {
      localStorage.setItem('feedbackiq_items', JSON.stringify(feedbacks));
    } catch (e) {
      console.warn('Failed to save feedbacks to localStorage:', e);
    }
  }, [feedbacks]);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem('feedbackiq_audit');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'aud-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        action: 'System Initialized',
        details: 'Loaded default feedback intelligence dataset with 50+ baseline entries.',
        actor: 'System Admin',
      },
    ];
  });

  const logAudit = (action: string, details: string, actor: string = 'Dinesh Rathod (Admin)') => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      actor,
    };
    setAuditLogs((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      try {
        localStorage.setItem('feedbackiq_audit', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Filter & Sort state
  const [filter, setFilter] = useState<FeedbackFilter>(DEFAULT_FILTER);
  const [sort, setSortState] = useState<{ field: SortField; order: SortOrder }>({
    field: 'createdAt',
    order: 'desc',
  });

  const setSort = (field: SortField, order: SortOrder) => {
    setSortState({ field, order });
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  // Live Statistics
  const stats = useMemo(() => calculateFeedbackStats(feedbacks), [feedbacks]);

  // Urgent feedback alerts (rating <= 2 or Critical/High priority that are not resolved)
  const urgentFeedbacks = useMemo(() => {
    return feedbacks.filter(
      (f) =>
        f.status !== 'Resolved' &&
        (f.rating <= 2 || f.sentiment === 'Negative' || f.priority === 'Critical')
    );
  }, [feedbacks]);

  const unreadAlertCount = urgentFeedbacks.length;

  // Filtered & Sorted Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter((item) => {
        // Search query: match ID, user name, email, message, department, eventService
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase();
          const matchId = item.id.toLowerCase().includes(q);
          const matchName = item.userName.toLowerCase().includes(q);
          const matchEmail = item.userEmail.toLowerCase().includes(q);
          const matchMsg = item.message.toLowerCase().includes(q);
          const matchDept = item.department.toLowerCase().includes(q);
          const matchEvent = item.eventService.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          if (
            !matchId &&
            !matchName &&
            !matchEmail &&
            !matchMsg &&
            !matchDept &&
            !matchEvent &&
            !matchCategory
          ) {
            return false;
          }
        }

        // Department filter
        if (filter.department !== 'all' && item.department !== filter.department) {
          return false;
        }

        // EventService filter
        if (filter.eventService !== 'all' && item.eventService !== filter.eventService) {
          return false;
        }

        // Category filter
        if (filter.category !== 'all' && item.category !== filter.category) {
          return false;
        }

        // Rating filter
        if (filter.rating !== 'all' && item.rating !== Number(filter.rating)) {
          return false;
        }

        // Sentiment filter
        if (filter.sentiment !== 'all' && item.sentiment !== filter.sentiment) {
          return false;
        }

        // Status filter
        if (filter.status !== 'all' && item.status !== filter.status) {
          return false;
        }

        // Priority filter
        if (filter.priority !== 'all' && item.priority !== filter.priority) {
          return false;
        }

        // Anonymous filter
        if (filter.isAnonymous === 'anonymous' && !item.isAnonymous) return false;
        if (filter.isAnonymous === 'identified' && item.isAnonymous) return false;

        // Date range filter
        if (filter.dateRange !== 'all') {
          const itemTime = new Date(item.createdAt).getTime();
          const now = Date.now();
          if (filter.dateRange === 'today' && now - itemTime > 1000 * 60 * 60 * 24) return false;
          if (filter.dateRange === 'week' && now - itemTime > 1000 * 60 * 60 * 24 * 7) return false;
          if (filter.dateRange === 'month' && now - itemTime > 1000 * 60 * 60 * 24 * 30) return false;
          if (filter.dateRange === 'year' && now - itemTime > 1000 * 60 * 60 * 24 * 365) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sort.field === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sort.field === 'rating') {
          comparison = a.rating - b.rating;
        } else if (sort.field === 'priorityScore') {
          comparison = (a.priorityScore || 0) - (b.priorityScore || 0);
        } else if (sort.field === 'id') {
          comparison = a.id.localeCompare(b.id);
        }
        return sort.order === 'asc' ? comparison : -comparison;
      });
  }, [feedbacks, filter, sort]);

  // Actions
  const submitFeedback = async (payload: {
    userName: string;
    userEmail: string;
    isAnonymous: boolean;
    department: Department;
    customDepartment?: string;
    eventService: EventService;
    customEventService?: string;
    category: Category;
    rating: number;
    message: string;
  }): Promise<FeedbackItem> => {
    setIsSubmitting(true);
    try {
      // 1. Generate unique sequential / timestamped feedback ID: FB-2026-00XXX
      const highestIdNum = feedbacks.reduce((acc, f) => {
        const match = f.id.match(/FB-2026-0*(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          return Math.max(acc, num);
        }
        return acc;
      }, 200);
      const nextId = `FB-2026-00${highestIdNum + 1}`;

      // 2. Perform AI Sentiment Analysis via Server
      const aiResult = await analyzeSentimentAPI({
        message: payload.message,
        rating: payload.rating,
        category: payload.category,
        eventService: payload.eventService,
      });

      const nowIso = new Date().toISOString();

      const newFeedback: FeedbackItem = {
        id: nextId,
        createdAt: nowIso,
        userName: payload.isAnonymous ? '' : payload.userName.trim(),
        userEmail: payload.isAnonymous ? '' : payload.userEmail.trim(),
        isAnonymous: payload.isAnonymous,
        department: payload.department,
        customDepartment: payload.customDepartment,
        eventService: payload.eventService,
        customEventService: payload.customEventService,
        category: payload.category,
        rating: payload.rating,
        message: payload.message.trim(),
        sentiment: aiResult.sentiment,
        sentimentScore: aiResult.sentimentScore,
        sentimentReason: aiResult.sentimentReason,
        keyTopics: aiResult.keyTopics,
        status: 'New',
        priority: aiResult.priority,
        priorityScore: aiResult.priorityScore,
        priorityReason: aiResult.priorityReason,
        timeline: [
          {
            id: `t-${nextId}-1`,
            type: 'submitted',
            title: payload.isAnonymous ? 'Anonymous Feedback Submitted' : 'Feedback Submitted',
            timestamp: nowIso,
            author: payload.isAnonymous ? 'Anonymous Student' : payload.userName,
          },
          {
            id: `t-${nextId}-2`,
            type: 'analyzed',
            title: 'AI Sentiment Evaluated',
            description: `Classified as ${aiResult.sentiment} (Priority: ${aiResult.priority}). Reason: ${aiResult.sentimentReason}`,
            timestamp: new Date().toISOString(),
          },
        ],
        isDemo: false,
      };

      setFeedbacks((prev) => [newFeedback, ...prev]);
      logAudit('New Feedback Submitted', `Generated ${nextId} (${newFeedback.sentiment})`, payload.isAnonymous ? 'Anonymous' : payload.userName);

      return newFeedback;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = (id: string, newStatus: FeedbackStatus) => {
    setFeedbacks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTimeline = [
            ...item.timeline,
            {
              id: `t-${id}-${Date.now()}`,
              type: newStatus === 'Resolved' ? 'resolved' : 'reviewed',
              title: newStatus === 'Resolved' ? 'Marked as Resolved' : 'Status Updated to Reviewed',
              timestamp: new Date().toISOString(),
              author: 'Dinesh Rathod (Admin)',
            } as const,
          ];
          return {
            ...item,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );
    logAudit('Status Changed', `Feedback ${id} marked as ${newStatus}`);
  };

  const respondToFeedback = (id: string, responseText: string, responderName: string = 'Dinesh Rathod (Admin)') => {
    const trimmed = responseText.trim();
    if (!trimmed) return;

    setFeedbacks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const now = new Date().toISOString();
          const updatedTimeline = [
            ...item.timeline,
            {
              id: `t-${id}-${Date.now()}`,
              type: 'responded',
              title: 'Admin Responded',
              description: trimmed,
              timestamp: now,
              author: responderName,
            } as const,
          ];
          return {
            ...item,
            status: item.status === 'New' ? 'Reviewed' : item.status,
            adminResponse: {
              text: trimmed,
              respondedAt: now,
              responderName,
            },
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );
    logAudit('Admin Response Added', `Responded to ${id}: "${trimmed.slice(0, 40)}..."`);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback(null);
    }
    logAudit('Feedback Deleted', `Removed record ${id}`);
  };

  const loadDemoData = () => {
    const demoItems = getFullDemoFeedbacks();
    // Preserve any real (non-demo) submissions
    const nonDemo = feedbacks.filter((f) => !f.isDemo);
    setFeedbacks([...nonDemo, ...demoItems]);
    logAudit('Loaded Demo Data', `Injected ${demoItems.length} comprehensive demo records.`);
  };

  const clearDemoData = () => {
    const realOnly = feedbacks.filter((f) => !f.isDemo);
    setFeedbacks(realOnly);
    logAudit('Cleared Demo Data', `Removed mock demo records; ${realOnly.length} real submissions preserved.`);
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        filteredFeedbacks,
        stats,
        filter,
        sort,
        activeTab,
        currentView,
        theme,
        appTheme,
        setAppTheme,
        cycleTheme,
        auditLogs,
        selectedFeedback,
        unreadAlertCount,
        urgentFeedbacks,
        isSubmitting,
        submitFeedback,
        updateStatus,
        respondToFeedback,
        deleteFeedback,
        loadDemoData,
        clearDemoData,
        setFilter,
        resetFilter,
        setSort,
        setActiveTab,
        setCurrentView,
        toggleTheme,
        setSelectedFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
