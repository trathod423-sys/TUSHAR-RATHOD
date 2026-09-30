import React, { useState, useEffect } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem } from '../../types';
import { Card3D } from '../common/Card3D';
import {
  Instagram,
  Linkedin,
  Github,
  Twitter,
  MessageSquare,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Send,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Terminal,
  Code2,
  Layers,
  ThumbsUp,
  FileText,
} from 'lucide-react';

export type PlatformTarget = 'instagram' | 'linkedin' | 'github' | 'twitter' | 'slack';

export const SocialAndDevStudio: React.FC<{ initialFeedbackId?: string }> = ({
  initialFeedbackId,
}) => {
  const { feedbacks, stats } = useFeedback();

  // Selected feedback item
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialFeedbackId) return initialFeedbackId;
    const resolved = feedbacks.find((f) => f.adminResponse && f.status === 'Resolved');
    return resolved ? resolved.id : feedbacks[0]?.id || '';
  });

  const activeFeedback = feedbacks.find((f) => f.id === selectedId) || feedbacks[0];

  // Active Platform
  const [activePlatform, setActivePlatform] = useState<PlatformTarget>('instagram');

  // Instagram specific tools
  const [igFormat, setIgFormat] = useState<'square' | 'story' | 'you-spoke' | 'infographic'>('you-spoke');
  const [igTheme, setIgTheme] = useState<'cyber' | 'royal' | 'emerald' | 'sunset' | 'ivory'>('cyber');

  // Custom text overrides
  const [customTitle, setCustomTitle] = useState('');
  const [customQuote, setCustomQuote] = useState('');
  const [customResponse, setCustomResponse] = useState('');

  // Copy states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Social interactions mock
  const [likesCount, setLikesCount] = useState(524);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (activeFeedback) {
      setCustomTitle(
        activePlatform === 'github'
          ? `[Student Report] ${activeFeedback.category}: ${activeFeedback.eventService} issue (${activeFeedback.id})`
          : activePlatform === 'linkedin'
          ? `Continuous Improvement: How We Resolved Student Concerns in ${activeFeedback.department}`
          : igFormat === 'you-spoke'
          ? 'YOU SPOKE. WE LISTENED.'
          : `${activeFeedback.department} · ${activeFeedback.eventService}`
      );
      setCustomQuote(activeFeedback.message);
      setCustomResponse(
        activeFeedback.adminResponse?.text ||
          'Action Taken: Campus Operations dispatched technicians, resolved the root cause, and verified equipment operation.'
      );
    }
  }, [activeFeedback, activePlatform, igFormat]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // --- PLATFORM CAPTION GENERATORS ---

  // 1. Instagram Caption
  const getInstagramCaption = () => {
    if (!activeFeedback) return '';
    if (igFormat === 'you-spoke') {
      return `📢 YOU SPOKE, WE LISTENED!\n\nWhen our students reported: "${customQuote.slice(0, 100)}..." our administration took swift corrective action.\n\n✅ RESOLUTION:\n${customResponse}\n\nYour voice shapes our campus experience. Share your reviews anonymously or verified through FeedbackIQ!\n\n#FeedbackIQ #YouSpokeWeListened #CampusImprovement #StudentVoice #HigherEducation #CollegeCampus`;
    }
    return `💬 STUDENT VOICE IN ACTION.\n\n"${customQuote}"\n\nRating: ${'⭐'.repeat(activeFeedback.rating)} (${activeFeedback.rating}/5)\nDepartment: ${activeFeedback.department}\nStatus: ${activeFeedback.status} ✅\n\nSubmitted via FeedbackIQ Intelligence Platform.\n\n#FeedbackIQ #StudentVoice #CampusFeedback #HigherEd`;
  };

  // 2. LinkedIn Post
  const getLinkedInText = () => {
    if (!activeFeedback) return '';
    return `🚀 Driving Institutional Excellence Through Student Feedback.\n\nAt our institution, listening to student voices is not just a policy—it is our primary mechanism for operational agility. Here is a recent real-world example tracked through FeedbackIQ:\n\n📌 The Challenge (${activeFeedback.department} · ${activeFeedback.category}):\n"${customQuote}"\n\n🛠️ Action Taken by Administration:\n${customResponse}\n\n📊 Institutional Impact:\n• Satisfaction Rating: ${activeFeedback.rating}/5.0\n• Department: ${activeFeedback.department}\n• Resolution Status: Resolved & Verified\n\nBy turning feedback into actionable workflows, we bridge the gap between student expectations and campus delivery.\n\nHow does your organization handle continuous stakeholder feedback? Let's discuss in the comments.\n\n#HigherEducation #StudentExperience #InstitutionalQuality #OperationalExcellence #FeedbackIQ #LeadershipInEducation #ContinuousImprovement`;
  };

  // 3. GitHub Issue Markdown
  const getGitHubIssueMarkdown = () => {
    if (!activeFeedback) return '';
    const isCritical = activeFeedback.rating <= 2;
    return `### 📋 FeedbackIQ Automated Issue Tracker

**Reference ID:** \`${activeFeedback.id}\`  
**Department:** ${activeFeedback.department}  
**Service/Event:** ${activeFeedback.eventService}  
**Category:** ${activeFeedback.category}  
**Reported Rating:** ${'⭐'.repeat(activeFeedback.rating)} (${activeFeedback.rating}/5)  
**Priority:** \`${activeFeedback.priority}\` (Score: ${activeFeedback.priorityScore}/100)  
**Sentiment:** \`${activeFeedback.sentiment}\`  

---

### 📝 Student Description
> "${customQuote}"

---

### 🛠️ Remediation Directive / Current Action
${customResponse}

---

### ✅ Tasks & Acceptance Criteria
- [x] Triage reported issue with Department Coordinator
- [ ] Inspect physical or digital infrastructure on campus site
- [ ] Implement resolution and verify student accessibility
- [ ] Push resolution status update back to FeedbackIQ portal

---
*Reported via FeedbackIQ System Intelligence | Submitter: ${activeFeedback.isAnonymous ? 'Anonymous Student' : activeFeedback.userName}*`;
  };

  // 4. Twitter / X Text (Max 280 chars)
  const getTwitterText = () => {
    if (!activeFeedback) return '';
    const text = `📢 "You Spoke, We Listened!"\n\nStudent report: "${customQuote.slice(0, 75)}..."\n\n✅ Fix: ${customResponse.slice(0, 90)}...\n\nTracked live on #FeedbackIQ #CampusImprovement`;
    return text.slice(0, 280);
  };

  // 5. Slack / Discord Webhook JSON
  const getSlackWebhookJSON = () => {
    if (!activeFeedback) return '';
    return JSON.stringify(
      {
        text: `🚨 FeedbackIQ Alert: New ${activeFeedback.priority} feedback reported in ${activeFeedback.department}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `FeedbackIQ Alert: ${activeFeedback.id}`,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Department:*\n${activeFeedback.department}` },
              { type: 'mrkdwn', text: `*Category:*\n${activeFeedback.category}` },
              { type: 'mrkdwn', text: `*Rating:*\n${'⭐'.repeat(activeFeedback.rating)}` },
              { type: 'mrkdwn', text: `*Priority:*\n${activeFeedback.priority}` },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `> "${customQuote}"`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Action Taken / Plan:*\n${customResponse}`,
            },
          },
        ],
      },
      null,
      2
    );
  };

  // External Intent Launchers
  const openExternalLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.origin
    )}&summary=${encodeURIComponent(getLinkedInText())}`;
    window.open(url, '_blank');
  };

  const openExternalTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getTwitterText())}`;
    window.open(url, '_blank');
  };

  const openExternalGitHub = () => {
    const title = encodeURIComponent(`[Feedback ${activeFeedback.id}] ${activeFeedback.category}: ${activeFeedback.eventService}`);
    const body = encodeURIComponent(getGitHubIssueMarkdown());
    window.open(`https://github.com/new?title=${title}&body=${body}`, '_blank');
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FeedbackIQ - ${activeFeedback.id}`,
          text: getInstagramCaption(),
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share aborted:', err);
      }
    } else {
      copyToClipboard(getInstagramCaption(), 'native-share');
    }
  };

  // Theme styling definitions
  const themeClasses = {
    cyber: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-indigo-500/30',
    royal: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-amber-500/30',
    emerald: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border-emerald-500/30',
    sunset: 'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 text-white border-rose-500/30',
    ivory: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 border-slate-300 shadow-md',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Multi-Platform Social & Developer Hub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Instagram · LinkedIn · GitHub · X · Slack
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase student resolutions on Instagram & LinkedIn, or convert infrastructure complaints directly into GitHub Issues and Slack alerts.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Native Share</span>
          </button>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'instagram', label: 'Instagram Studio', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
          { id: 'linkedin', label: 'LinkedIn Post', icon: <Linkedin className="w-4 h-4 text-blue-500" /> },
          { id: 'github', label: 'GitHub Issue Tracker', icon: <Github className="w-4 h-4 text-slate-800 dark:text-white" /> },
          { id: 'twitter', label: 'Twitter / X Thread', icon: <Twitter className="w-4 h-4 text-sky-400" /> },
          { id: 'slack', label: 'Slack / Discord Webhook', icon: <Terminal className="w-4 h-4 text-emerald-500" /> },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePlatform(p.id as PlatformTarget)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === p.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {p.icon}
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Controls & Source on Left (5 cols) | Native 3D Mockup on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Data Customization */}
        <div className="lg:col-span-5 space-y-4">
          {/* Record Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white block">
              Source Feedback Record
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {feedbacks.map((f) => (
                <option key={f.id} value={f.id} className="text-black bg-white dark:text-white dark:bg-slate-800 font-semibold">
                  {f.id} — {f.rating}⭐ [{f.department}] "{f.message.slice(0, 40)}..."
                </option>
              ))}
            </select>

            {/* Custom text adjustments */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div>
                <label className="text-[11px] font-bold text-black dark:text-white block mb-1">
                  Title / Headline
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-black dark:text-white block mb-1">
                  Student Feedback Message
                </label>
                <textarea
                  rows={3}
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  Resolution / Administrative Action
                </label>
                <textarea
                  rows={2}
                  value={customResponse}
                  onChange={(e) => setCustomResponse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-emerald-400 dark:border-emerald-800 rounded-lg text-black dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Platform Specific Settings */}
          {activePlatform === 'instagram' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
              <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white block">
                Instagram Format & Theme
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'you-spoke', label: 'You Spoke, We Acted' },
                  { id: 'square', label: '1:1 Square Feed' },
                  { id: 'story', label: '9:16 Story / Reel' },
                  { id: 'infographic', label: 'Pulse Infographic' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setIgFormat(fmt.id as any)}
                    className={`p-2 rounded-lg border text-left cursor-pointer anim-same ${
                      igFormat === fmt.id
                        ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 font-bold'
                        : 'border-slate-300 dark:border-slate-700 text-black dark:text-slate-300 font-semibold'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-2">
                {(['cyber', 'royal', 'emerald', 'sunset', 'ivory'] as const).map((thm) => (
                  <button
                    key={thm}
                    type="button"
                    onClick={() => setIgTheme(thm)}
                    className={`h-7 rounded-md border capitalize text-[10px] cursor-pointer anim-same ${
                      igTheme === thm
                        ? 'ring-2 ring-indigo-500 font-bold text-black dark:text-white'
                        : 'border-slate-300 dark:border-slate-700 text-black dark:text-slate-400 font-medium'
                    }`}
                  >
                    {thm}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Copy / Export Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                Ready-to-Post Output
              </label>
              <button
                type="button"
                onClick={() => {
                  const textToCopy =
                    activePlatform === 'github'
                      ? getGitHubIssueMarkdown()
                      : activePlatform === 'linkedin'
                      ? getLinkedInText()
                      : activePlatform === 'twitter'
                      ? getTwitterText()
                      : activePlatform === 'slack'
                      ? getSlackWebhookJSON()
                      : getInstagramCaption();
                  copyToClipboard(textToCopy, 'platform-text');
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'platform-text' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'platform-text' ? 'Copied!' : 'Copy Formatted Text'}</span>
              </button>
            </div>

            <pre className="p-3 bg-white dark:bg-slate-850 rounded-lg border-2 border-slate-300 dark:border-slate-800 text-[11px] text-black dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-semibold">
              {activePlatform === 'github'
                ? getGitHubIssueMarkdown()
                : activePlatform === 'linkedin'
                ? getLinkedInText()
                : activePlatform === 'twitter'
                ? getTwitterText()
                : activePlatform === 'slack'
                ? getSlackWebhookJSON()
                : getInstagramCaption()}
            </pre>

            {/* Direct launch action */}
            {activePlatform === 'linkedin' && (
              <button
                type="button"
                onClick={openExternalLinkedIn}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>Launch & Share on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {activePlatform === 'twitter' && (
              <button
                type="button"
                onClick={openExternalTwitter}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Publish to X (Twitter)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {activePlatform === 'github' && (
              <button
                type="button"
                onClick={openExternalGitHub}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Create GitHub Issue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Native Interactive 3D Platform Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-md mb-2 px-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span>Native 3D Device Preview</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 capitalize">
              {activePlatform} preview
            </span>
          </div>

          {/* 1. INSTAGRAM MOCKUP */}
          {activePlatform === 'instagram' && (
            <Card3D maxTilt={9} scale={1.01} className="w-full max-w-md">
              <div className="bg-slate-900 dark:bg-black rounded-3xl p-3 border-4 border-slate-800 shadow-2xl">
                {/* Phone Notch */}
                <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>

                {/* IG Bar */}
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 text-slate-300 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                        IQ
                      </div>
                    </div>
                    <span className="font-semibold text-[11px] text-white">campus.feedbackiq</span>
                  </div>
                  <span className="text-slate-500 text-xs">•••</span>
                </div>

                {/* Post Body */}
                <div className={`rounded-2xl p-5 border min-h-[340px] flex flex-col justify-between ${themeClasses[igTheme]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold tracking-tight">FEEDBACKIQ</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      VERIFIED POST
                    </span>
                  </div>

                  <div className="my-3 space-y-2.5">
                    {igFormat === 'you-spoke' ? (
                      <>
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
                          <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
                            YOU SPOKE (STUDENT FEEDBACK):
                          </span>
                          <p className="text-xs italic leading-relaxed">"{customQuote}"</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                          <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                            WE LISTENED & ACTED:
                          </span>
                          <p className="text-xs font-medium leading-relaxed">{customResponse}</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex text-amber-400 text-xs">
                          {'★'.repeat(activeFeedback.rating)}
                        </div>
                        <p className="text-xs italic leading-relaxed">"{customQuote}"</p>
                        <span className="text-[10px] opacity-75 font-mono block">
                          {activeFeedback.department} · {activeFeedback.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-75">
                    <span>{activeFeedback.isAnonymous ? 'Anonymous Student' : activeFeedback.userName}</span>
                    <span className="font-mono">Ref: {activeFeedback.id}</span>
                  </div>
                </div>

                {/* IG Interactive icons */}
                <div className="pt-3 px-2 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <Heart
                      onClick={() => {
                        setIsLiked(!isLiked);
                        setLikesCount((c) => (isLiked ? c - 1 : c + 1));
                      }}
                      className={`w-5 h-5 cursor-pointer ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <MessageCircle className="w-5 h-5 cursor-pointer" />
                    <Send className="w-5 h-5 cursor-pointer" />
                  </div>
                  <Bookmark className="w-5 h-5 cursor-pointer" />
                </div>
                <div className="px-2 pt-2 text-[10px] text-white">
                  <span className="font-bold">{likesCount} likes</span>
                  <p className="text-slate-300 line-clamp-2 mt-0.5">
                    <strong>campus.feedbackiq</strong> {getInstagramCaption().slice(0, 100)}...
                  </p>
                </div>
              </div>
            </Card3D>
          )}

          {/* 2. LINKEDIN MOCKUP */}
          {activePlatform === 'linkedin' && (
            <Card3D maxTilt={8} scale={1.01} className="w-full max-w-md anim-same">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xl text-left space-y-3">
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    FIQ
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black dark:text-white flex items-center gap-1">
                      <span>FeedbackIQ Higher-Ed Portal</span>
                      <span className="text-[10px] text-blue-600 font-bold">· 1st</span>
                    </h4>
                    <p className="text-[10px] text-black dark:text-slate-300 font-semibold">
                      Institutional Quality & Stakeholder Analytics · 12,400 followers
                    </p>
                    <span className="text-[9px] text-black dark:text-slate-400 font-medium">Just now · 🌐</span>
                  </div>
                </div>

                {/* Post prose */}
                <p className="text-xs text-black dark:text-slate-200 leading-relaxed font-sans font-medium">
                  Continuous stakeholder listening drives measurable institutional results. Here is how our team solved an issue reported in <strong className="text-black dark:text-white">{activeFeedback.department}</strong>:
                </p>

                {/* Embedded Card */}
                <div className="p-3.5 bg-white dark:bg-slate-850 rounded-xl border-2 border-slate-300 dark:border-slate-700 space-y-2 anim-same">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-black dark:text-slate-200">
                      Student Issue Report:
                    </span>
                    <span className="text-amber-600 font-bold">{activeFeedback.rating} ⭐</span>
                  </div>
                  <p className="text-xs italic text-black dark:text-slate-200 font-semibold">
                    "{customQuote}"
                  </p>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-950 dark:text-emerald-300 font-bold">
                    ✅ Action Taken: {customResponse}
                  </div>
                </div>

                {/* LinkedIn Action Bar */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-black dark:text-slate-300 font-semibold">
                  <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> Like
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> Comment
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <Repeat2 className="w-3.5 h-3.5" /> Repost
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <Send className="w-3.5 h-3.5" /> Send
                  </span>
                </div>
              </div>
            </Card3D>
          )}

          {/* 3. GITHUB ISSUE MOCKUP */}
          {activePlatform === 'github' && (
            <Card3D maxTilt={8} scale={1.01} className="w-full max-w-lg">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl text-left font-sans">
                {/* GitHub Terminal Header */}
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" />
                    <span className="text-xs font-mono font-bold text-slate-300">
                      campus-infrastructure / issues
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Open Issue
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      {customTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                        bug
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                        {activeFeedback.category.toLowerCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        student-reported
                      </span>
                      <span className="text-slate-400">
                        opened by FeedbackIQ Bot
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-3 font-mono">
                    <p className="text-slate-200">
                      <strong>Student Message:</strong> "{customQuote}"
                    </p>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
                      <strong>Target Fix:</strong> {customResponse}
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div>[x] Triage reported issue with Department Coordinator</div>
                      <div>[ ] Verify physical or digital infrastructure on site</div>
                      <div>[ ] Close issue and push resolution event to portal</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card3D>
          )}

          {/* 4. TWITTER / X MOCKUP */}
          {activePlatform === 'twitter' && (
            <Card3D maxTilt={8} scale={1.01} className="w-full max-w-md">
              <div className="bg-black border border-slate-800 rounded-2xl p-5 shadow-xl text-left text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                      IQ
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight">
                        Campus Feedback Intelligence
                      </span>
                      <span className="text-[10px] text-slate-500 block">@FeedbackIQ · 2m</span>
                    </div>
                  </div>
                  <Twitter className="w-4 h-4 text-sky-400" />
                </div>

                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {getTwitterText()}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> 18
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                    <Repeat2 className="w-3.5 h-3.5" /> 42
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> 184
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Card3D>
          )}

          {/* 5. SLACK / DISCORD MOCKUP */}
          {activePlatform === 'slack' && (
            <Card3D maxTilt={8} scale={1.01} className="w-full max-w-md">
              <div className="bg-[#1A1D21] border border-slate-700 rounded-2xl p-5 shadow-xl text-left text-white space-y-3 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-xs font-bold">
                    APP
                  </div>
                  <div>
                    <span className="font-bold text-xs">FeedbackIQ Bot</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-mono">APP 12:45 PM</span>
                  </div>
                </div>

                <div className="p-3 bg-[#222529] border-l-4 border-rose-500 rounded-r-lg space-y-2 text-xs">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Urgent {activeFeedback.department} Feedback</span>
                  </div>
                  <p className="text-slate-300 italic">
                    "{customQuote}"
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 font-mono">
                    <div>Category: {activeFeedback.category}</div>
                    <div>Rating: {activeFeedback.rating} ⭐</div>
                    <div>Priority: {activeFeedback.priority}</div>
                    <div>Ref: {activeFeedback.id}</div>
                  </div>
                </div>
              </div>
            </Card3D>
          )}
        </div>
      </div>
    </div>
  );
};
