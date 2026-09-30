export type { AppTheme, ThemeConfig } from '../utils/themeConfig';

export type Department =
  | 'Computer Science'
  | 'Information Technology'
  | 'Commerce'
  | 'Management'
  | 'Engineering'
  | 'Arts'
  | 'Science'
  | 'Other';

export type EventService =
  | 'College Event'
  | 'Workshop'
  | 'Seminar'
  | 'Faculty'
  | 'Infrastructure'
  | 'Library'
  | 'Canteen'
  | 'Transport'
  | 'Hostel'
  | 'Placement'
  | 'Examination'
  | 'Student Support'
  | 'Other';

export type Category =
  | 'Academic'
  | 'Faculty'
  | 'Infrastructure'
  | 'Event'
  | 'Administration'
  | 'Food'
  | 'Technology'
  | 'Support'
  | 'Placement'
  | 'Other';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type FeedbackStatus = 'New' | 'Reviewed' | 'Resolved';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AdminResponse {
  text: string;
  respondedAt: string;
  responderName: string;
}

export interface TimelineEvent {
  id: string;
  type: 'submitted' | 'analyzed' | 'reviewed' | 'responded' | 'resolved';
  title: string;
  description?: string;
  timestamp: string;
  author?: string;
}

export interface FeedbackItem {
  id: string; // e.g. FB-2026-00104
  createdAt: string; // ISO date string
  userName: string;
  userEmail: string;
  isAnonymous: boolean;
  department: Department;
  customDepartment?: string;
  eventService: EventService;
  customEventService?: string;
  category: Category;
  rating: number; // 1 - 5
  message: string;
  sentiment: Sentiment;
  sentimentScore: number; // 0.0 - 1.0
  sentimentReason: string;
  keyTopics: string[];
  status: FeedbackStatus;
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100
  priorityReason: string;
  adminResponse?: AdminResponse;
  timeline: TimelineEvent[];
  isDemo?: boolean;
}

export interface FeedbackFilter {
  searchQuery: string;
  department: string;
  eventService: string;
  category: string;
  rating: number | 'all';
  sentiment: string;
  status: string;
  priority: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  isAnonymous: 'all' | 'anonymous' | 'identified';
}

export type SortField = 'createdAt' | 'rating' | 'priorityScore' | 'id';
export type SortOrder = 'asc' | 'desc';

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  resolvedCount: number;
  reviewedCount: number;
  newCount: number;
  resolutionRate: number; // 0 - 100
  responseRate: number; // 0 - 100
  healthScore: number; // 0 - 100
  ratingDistribution: Record<number, number>;
  categoryDistribution: Record<string, { count: number; avgRating: number; negativeCount: number }>;
  departmentDistribution: Record<string, { count: number; avgRating: number; positiveCount: number; negativeCount: number }>;
  sentimentTimeline: Array<{
    date: string;
    label: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
    avgRating: number;
  }>;
}

export interface ImprovementArea {
  id: string;
  area: string;
  category: string;
  impact: PriorityLevel;
  mentions: number;
  avgRating: number;
  negativePercentage: number;
  suggestedAction: string;
  urgency: string;
}

export interface CommonComplaint {
  issue: string;
  count: number;
  category: string;
  sentiment: 'Negative' | 'Neutral';
  percentage: number;
}

export interface CommonSuggestion {
  suggestion: string;
  count: number;
  category: string;
  feasibility: 'Quick Win' | 'Medium Term' | 'Strategic';
}

export interface AIInsightsData {
  executiveSummary: string;
  whatUsersLike: string[];
  whatUsersDislike: string[];
  emergingIssues: string[];
  recommendedActions?: string[];
  commonComplaints: CommonComplaint[];
  commonSuggestions: CommonSuggestion[];
  topImprovementAreas: ImprovementArea[];
  lastGeneratedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actor: string;
}
