import { FeedbackItem } from '../types';

export function exportFeedbacksToCSV(feedbacks: FeedbackItem[], filename?: string): void {
  const headers = [
    'Feedback ID',
    'Date',
    'Student/User',
    'Email',
    'Department',
    'Event/Service',
    'Category',
    'Rating',
    'Feedback Message',
    'Sentiment',
    'Priority',
    'Status',
    'Admin Response',
    'Admin Responded At',
    'Is Anonymous',
  ];

  const escapeCSV = (val: string | number | boolean | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = feedbacks.map((f) => [
    escapeCSV(f.id),
    escapeCSV(new Date(f.createdAt).toLocaleString()),
    escapeCSV(f.isAnonymous ? 'Anonymous' : f.userName),
    escapeCSV(f.isAnonymous ? 'N/A' : f.userEmail),
    escapeCSV(f.department),
    escapeCSV(f.eventService + (f.customEventService ? ` (${f.customEventService})` : '')),
    escapeCSV(f.category),
    escapeCSV(f.rating),
    escapeCSV(f.message),
    escapeCSV(f.sentiment),
    escapeCSV(f.priority),
    escapeCSV(f.status),
    escapeCSV(f.adminResponse?.text || 'No response yet'),
    escapeCSV(f.adminResponse?.respondedAt ? new Date(f.adminResponse.respondedAt).toLocaleString() : 'N/A'),
    escapeCSV(f.isAnonymous ? 'Yes' : 'No'),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const defaultName = `feedback-report-${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute('download', filename || defaultName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
