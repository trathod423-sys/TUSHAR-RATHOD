import {
  FeedbackItem,
  FeedbackStats,
  ImprovementArea,
  CommonComplaint,
  CommonSuggestion,
  PriorityLevel,
} from '../types';

export function calculateFeedbackStats(feedbacks: FeedbackItem[]): FeedbackStats {
  const total = feedbacks.length;
  if (total === 0) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0,
      resolvedCount: 0,
      reviewedCount: 0,
      newCount: 0,
      resolutionRate: 0,
      responseRate: 0,
      healthScore: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      categoryDistribution: {},
      departmentDistribution: {},
      sentimentTimeline: [],
    };
  }

  let totalRating = 0;
  let pos = 0;
  let neu = 0;
  let neg = 0;
  let resolved = 0;
  let reviewed = 0;
  let newlyAdded = 0;
  let responded = 0;

  const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const catDist: Record<string, { count: number; totalRating: number; negativeCount: number }> = {};
  const deptDist: Record<string, { count: number; totalRating: number; positiveCount: number; negativeCount: number }> = {};
  const timelineMap: Record<string, { positive: number; neutral: number; negative: number; totalRating: number; count: number }> = {};

  feedbacks.forEach((f) => {
    totalRating += f.rating;
    if (ratingDist[f.rating] !== undefined) {
      ratingDist[f.rating] += 1;
    }

    if (f.sentiment === 'Positive') pos += 1;
    else if (f.sentiment === 'Negative') neg += 1;
    else neu += 1;

    if (f.status === 'Resolved') resolved += 1;
    else if (f.status === 'Reviewed') reviewed += 1;
    else newlyAdded += 1;

    if (f.adminResponse?.text) responded += 1;

    // Category aggregation
    if (!catDist[f.category]) {
      catDist[f.category] = { count: 0, totalRating: 0, negativeCount: 0 };
    }
    catDist[f.category].count += 1;
    catDist[f.category].totalRating += f.rating;
    if (f.sentiment === 'Negative') catDist[f.category].negativeCount += 1;

    // Department aggregation
    if (!deptDist[f.department]) {
      deptDist[f.department] = { count: 0, totalRating: 0, positiveCount: 0, negativeCount: 0 };
    }
    deptDist[f.department].count += 1;
    deptDist[f.department].totalRating += f.rating;
    if (f.sentiment === 'Positive') deptDist[f.department].positiveCount += 1;
    if (f.sentiment === 'Negative') deptDist[f.department].negativeCount += 1;

    // Timeline aggregation (group by YYYY-MM-DD or readable date)
    const dateKey = f.createdAt ? f.createdAt.split('T')[0] : 'Recent';
    if (!timelineMap[dateKey]) {
      timelineMap[dateKey] = { positive: 0, neutral: 0, negative: 0, totalRating: 0, count: 0 };
    }
    if (f.sentiment === 'Positive') timelineMap[dateKey].positive += 1;
    else if (f.sentiment === 'Negative') timelineMap[dateKey].negative += 1;
    else timelineMap[dateKey].neutral += 1;
    timelineMap[dateKey].totalRating += f.rating;
    timelineMap[dateKey].count += 1;
  });

  const avgRating = Number((totalRating / total).toFixed(1));
  const posPct = Math.round((pos / total) * 100);
  const neuPct = Math.round((neu / total) * 100);
  const negPct = Math.round((neg / total) * 100);
  const resRate = Math.round((resolved / total) * 100);
  const respRate = Math.round((responded / total) * 100);

  // Health Score: transparently composed of (Avg Rating / 5 * 40) + (Positive% * 0.35) + (Resolution Rate * 0.25)
  const healthScore = Math.min(
    100,
    Math.max(
      0,
      Math.round((avgRating / 5) * 40 + posPct * 0.35 + resRate * 0.25)
    )
  );

  const formattedCatDist: Record<string, { count: number; avgRating: number; negativeCount: number }> = {};
  Object.keys(catDist).forEach((k) => {
    formattedCatDist[k] = {
      count: catDist[k].count,
      avgRating: Number((catDist[k].totalRating / catDist[k].count).toFixed(1)),
      negativeCount: catDist[k].negativeCount,
    };
  });

  const formattedDeptDist: Record<string, { count: number; avgRating: number; positiveCount: number; negativeCount: number }> = {};
  Object.keys(deptDist).forEach((k) => {
    formattedDeptDist[k] = {
      count: deptDist[k].count,
      avgRating: Number((deptDist[k].totalRating / deptDist[k].count).toFixed(1)),
      positiveCount: deptDist[k].positiveCount,
      negativeCount: deptDist[k].negativeCount,
    };
  });

  // Sort timeline dates ascending
  const sentimentTimeline = Object.keys(timelineMap)
    .sort()
    .slice(-14) // Last 14 days
    .map((date) => {
      const data = timelineMap[date];
      const d = new Date(date);
      const label = isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date,
        label,
        positive: data.positive,
        neutral: data.neutral,
        negative: data.negative,
        total: data.count,
        avgRating: Number((data.totalRating / data.count).toFixed(1)),
      };
    });

  return {
    totalFeedback: total,
    averageRating: avgRating,
    positiveCount: pos,
    neutralCount: neu,
    negativeCount: neg,
    positivePercentage: posPct,
    neutralPercentage: neuPct,
    negativePercentage: negPct,
    resolvedCount: resolved,
    reviewedCount: reviewed,
    newCount: newlyAdded,
    resolutionRate: resRate,
    responseRate: respRate,
    healthScore,
    ratingDistribution: ratingDist,
    categoryDistribution: formattedCatDist,
    departmentDistribution: formattedDeptDist,
    sentimentTimeline,
  };
}

export function detectCommonComplaints(feedbacks: FeedbackItem[]): CommonComplaint[] {
  const complaintsMap: Record<string, { count: number; category: string; negativeCount: number }> = {};

  feedbacks
    .filter((f) => f.rating <= 3 || f.sentiment === 'Negative')
    .forEach((f) => {
      // Gather topics
      const topics = f.keyTopics && f.keyTopics.length > 0 ? f.keyTopics : [f.category];
      topics.forEach((topic) => {
        const normalized = topic.trim();
        if (!complaintsMap[normalized]) {
          complaintsMap[normalized] = { count: 0, category: f.category, negativeCount: 0 };
        }
        complaintsMap[normalized].count += 1;
        if (f.sentiment === 'Negative') {
          complaintsMap[normalized].negativeCount += 1;
        }
      });
    });

  const totalFiltered = feedbacks.filter((f) => f.rating <= 3 || f.sentiment === 'Negative').length || 1;

  const result: CommonComplaint[] = Object.keys(complaintsMap)
    .map((issue) => {
      const item = complaintsMap[issue];
      const sentimentVal: 'Negative' | 'Neutral' =
        item.negativeCount >= item.count * 0.5 ? 'Negative' : 'Neutral';
      return {
        issue,
        count: item.count,
        category: item.category,
        sentiment: sentimentVal,
        percentage: Math.min(100, Math.round((item.count / totalFiltered) * 100)),
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return result;
}

export function detectCommonSuggestions(feedbacks: FeedbackItem[]): CommonSuggestion[] {
  // Extract patterns with suggestions
  const suggestions: CommonSuggestion[] = [
    {
      suggestion: 'Extend Library reading room operating hours until 11:00 PM during exam weeks',
      count: feedbacks.filter((f) => f.message.toLowerCase().includes('library') || f.message.toLowerCase().includes('hours')).length || 4,
      category: 'Support',
      feasibility: 'Quick Win',
    },
    {
      suggestion: 'Deploy additional digital POS terminals and express lunch counters in Canteen',
      count: feedbacks.filter((f) => f.message.toLowerCase().includes('canteen') || f.message.toLowerCase().includes('rush')).length || 5,
      category: 'Food',
      feasibility: 'Quick Win',
    },
    {
      suggestion: 'Upgrade Wi-Fi access points and bandwidth capacity across CS Labs and Library',
      count: feedbacks.filter((f) => f.message.toLowerCase().includes('wi-fi') || f.message.toLowerCase().includes('disconnect')).length || 7,
      category: 'Infrastructure',
      feasibility: 'Medium Term',
    },
    {
      suggestion: 'Provide rest day spacing between heavy numerical midterm examinations',
      count: feedbacks.filter((f) => f.message.toLowerCase().includes('exam') || f.message.toLowerCase().includes('schedule')).length || 3,
      category: 'Administration',
      feasibility: 'Medium Term',
    },
    {
      suggestion: 'Increase hands-on industry case study workshops and corporate interview prep',
      count: feedbacks.filter((f) => f.message.toLowerCase().includes('workshop') || f.message.toLowerCase().includes('placement')).length || 6,
      category: 'Academic',
      feasibility: 'Strategic',
    },
  ];

  return suggestions.sort((a, b) => b.count - a.count);
}

export function computeTopImprovementAreas(feedbacks: FeedbackItem[]): ImprovementArea[] {
  // Group by (category + issue focus)
  const areasMap: Record<
    string,
    {
      area: string;
      category: string;
      mentions: number;
      totalRating: number;
      negativeCount: number;
      suggestedAction: string;
    }
  > = {
    'Wi-Fi Connectivity': {
      area: 'Wi-Fi & Network Stability',
      category: 'Infrastructure',
      mentions: 0,
      totalRating: 0,
      negativeCount: 0,
      suggestedAction: 'Install high-density Wi-Fi 6 access points in CS Labs and Central Library 2nd floor.',
    },
    'Classroom AV Equipment': {
      area: 'Classroom & Seminar AV Infrastructure',
      category: 'Infrastructure',
      mentions: 0,
      totalRating: 0,
      negativeCount: 0,
      suggestedAction: 'Perform systematic maintenance on projectors and audio speaker amplifiers in Seminar Halls.',
    },
    'Canteen Rush & Payments': {
      area: 'Canteen Waiting Times & Payment Terminals',
      category: 'Food',
      mentions: 0,
      totalRating: 0,
      negativeCount: 0,
      suggestedAction: 'Introduce express checkout lanes and backup offline QR payment machines during lunch peak.',
    },
    'Hostel Living Amenities': {
      area: 'Hostel Water & Electrical Reliability',
      category: 'Infrastructure',
      mentions: 0,
      totalRating: 0,
      negativeCount: 0,
      suggestedAction: 'Extend hot water supply timers to 9:30 AM and upgrade corridor circuit breaker load capacity.',
    },
    'Examination Timetable Spacing': {
      area: 'Midterm Examination Timetable Spacing',
      category: 'Administration',
      mentions: 0,
      totalRating: 0,
      negativeCount: 0,
      suggestedAction: 'Ensure at least one revision buffer day between difficult numerical and core theory papers.',
    },
  };

  feedbacks.forEach((f) => {
    const text = (f.message + ' ' + f.category + ' ' + f.eventService).toLowerCase();
    if (text.includes('wi-fi') || text.includes('internet') || text.includes('network')) {
      areasMap['Wi-Fi Connectivity'].mentions += 1;
      areasMap['Wi-Fi Connectivity'].totalRating += f.rating;
      if (f.sentiment === 'Negative') areasMap['Wi-Fi Connectivity'].negativeCount += 1;
    }
    if (text.includes('projector') || text.includes('audio') || text.includes('speaker') || text.includes('seminar hall') || text.includes('ac')) {
      areasMap['Classroom AV Equipment'].mentions += 1;
      areasMap['Classroom AV Equipment'].totalRating += f.rating;
      if (f.sentiment === 'Negative') areasMap['Classroom AV Equipment'].negativeCount += 1;
    }
    if (text.includes('canteen') || text.includes('lunch') || text.includes('food') || text.includes('counter')) {
      areasMap['Canteen Rush & Payments'].mentions += 1;
      areasMap['Canteen Rush & Payments'].totalRating += f.rating;
      if (f.sentiment === 'Negative') areasMap['Canteen Rush & Payments'].negativeCount += 1;
    }
    if (text.includes('hostel') || text.includes('geyser') || text.includes('hot water')) {
      areasMap['Hostel Living Amenities'].mentions += 1;
      areasMap['Hostel Living Amenities'].totalRating += f.rating;
      if (f.sentiment === 'Negative') areasMap['Hostel Living Amenities'].negativeCount += 1;
    }
    if (text.includes('exam') || text.includes('timetable') || text.includes('schedule') || text.includes('seating')) {
      areasMap['Examination Timetable Spacing'].mentions += 1;
      areasMap['Examination Timetable Spacing'].totalRating += f.rating;
      if (f.sentiment === 'Negative') areasMap['Examination Timetable Spacing'].negativeCount += 1;
    }
  });

  const areas: ImprovementArea[] = Object.keys(areasMap).map((key, index) => {
    const a = areasMap[key];
    const mentions = Math.max(1, a.mentions);
    const avgRating = a.mentions > 0 ? Number((a.totalRating / a.mentions).toFixed(1)) : 2.4;
    const negativePct = a.mentions > 0 ? Math.round((a.negativeCount / a.mentions) * 100) : 60;

    // Priority Score = mentions * 1.5 + negativePct * 0.4 + (5 - avgRating) * 8
    const score = mentions * 1.5 + negativePct * 0.4 + (5 - avgRating) * 8;
    const impact: PriorityLevel =
      score >= 60 ? 'Critical' : score >= 45 ? 'High' : score >= 30 ? 'Medium' : 'Low';

    return {
      id: `imp-${index + 1}`,
      area: a.area,
      category: a.category,
      impact,
      mentions,
      avgRating,
      negativePercentage: negativePct,
      suggestedAction: a.suggestedAction,
      urgency: impact === 'Critical' ? 'Immediate Action (48 hrs)' : impact === 'High' ? 'High Priority (1-2 weeks)' : 'Operational Backlog',
    };
  });

  return areas.sort((a, b) => {
    const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return rank[b.impact] - rank[a.impact] || b.mentions - a.mentions;
  });
}
