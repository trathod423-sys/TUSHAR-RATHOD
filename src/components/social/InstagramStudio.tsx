import React, { useState, useRef, useEffect } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackItem } from '../../types';
import { Card3D } from '../common/Card3D';
import {
  Instagram,
  Download,
  Copy,
  Check,
  Sparkles,
  Share2,
  Sliders,
  Smartphone,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Star,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  RefreshCw,
  Layers,
  Palette,
  Layout,
  ExternalLink,
} from 'lucide-react';

export type PostFormat =
  | 'square' // 1:1 Instagram Post
  | 'story' // 9:16 Instagram Story / Reel
  | 'you-spoke' // Before & After "You Spoke, We Listened"
  | 'infographic' // Weekly Sentiment Pulse
  | 'spotlight'; // Faculty / Student Kudos Card

export type PostTheme =
  | 'cyber'
  | 'royal'
  | 'emerald'
  | 'sunset'
  | 'glass'
  | 'ivory';

export const InstagramStudio: React.FC<{ initialFeedbackId?: string }> = ({
  initialFeedbackId,
}) => {
  const { feedbacks, stats } = useFeedback();

  // Selected feedback item
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialFeedbackId) return initialFeedbackId;
    const resolvedWithResponse = feedbacks.find(
      (f) => f.adminResponse && f.status === 'Resolved'
    );
    return resolvedWithResponse ? resolvedWithResponse.id : feedbacks[0]?.id || '';
  });

  const activeFeedback = feedbacks.find((f) => f.id === selectedId) || feedbacks[0];

  // Post Tools & Customization States
  const [postFormat, setPostFormat] = useState<PostFormat>('square');
  const [postTheme, setPostTheme] = useState<PostTheme>('cyber');
  const [includeCrest, setIncludeCrest] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [customQuote, setCustomQuote] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [likesCount, setLikesCount] = useState(482);
  const [isLiked, setIsLiked] = useState(false);

  // Sync custom inputs when active feedback changes
  useEffect(() => {
    if (activeFeedback) {
      setCustomTitle(
        postFormat === 'you-spoke'
          ? 'YOU SPOKE. WE LISTENED.'
          : postFormat === 'spotlight'
          ? 'FACULTY & MENTOR EXCELLENCE'
          : `${activeFeedback.department} · ${activeFeedback.eventService}`
      );
      setCustomQuote(activeFeedback.message);
      setCustomResponse(
        activeFeedback.adminResponse?.text ||
          'Action Taken: Infrastructure team deployed redundant Wi-Fi 6 access points and optimized network bandwidth.'
      );
    }
  }, [activeFeedback, postFormat]);

  // Captions AI Generator presets
  const generateCaption = () => {
    if (!activeFeedback) return '';
    if (postFormat === 'you-spoke') {
      return `📢 YOU SPOKE, WE LISTENED!\n\nWhen our students reported: "${customQuote.slice(0, 100)}..." our campus facilities and administration took immediate action.\n\n✅ RESOLUTION:\n${customResponse}\n\nYour voice drives continuous improvement across every department. Submit your feedback through FeedbackIQ today!\n\n#FeedbackIQ #YouSpokeWeListened #CampusImprovement #StudentVoice #StudentExperience #HigherEdQuality #TransparencyInAction`;
    }
    if (postFormat === 'spotlight') {
      return `⭐ CELEBRATING ACADEMIC EXCELLENCE!\n\n" ${customQuote} "\n\nHeartfelt student praise for our dedicated faculty in ${activeFeedback.department}! Thank you for creating inspiring classroom experiences every single day.\n\nShare your own student appreciation on the FeedbackIQ portal!\n\n#FacultyAppreciation #TeacherOfTheWeek #CampusPride #FeedbackIQ #StudentVoice #ExcellenceInEducation`;
    }
    if (postFormat === 'infographic') {
      return `📊 CAMPUS PULSE UPDATE: ${stats.totalFeedback} Voices Heard!\n\n✨ Average Rating: ${stats.averageRating} / 5.0 ⭐\n✨ Positive Sentiment: ${stats.positivePercentage}%\n✨ Resolution Rate: ${stats.resolutionRate}%\n\nFrom academic workshops to campus facilities, every review counts. Keep sharing your feedback on FeedbackIQ!\n\n#CampusPulse #FeedbackIQ #DataDrivenCampus #StudentVoice #ContinuousImprovement #CollegeLife`;
    }
    return `💬 STUDENT VOICE MATTERS.\n\n"${customQuote}"\n\nRating: ${'⭐'.repeat(activeFeedback.rating)} (${activeFeedback.rating}/5)\nDepartment: ${activeFeedback.department}\nStatus: ${activeFeedback.status} ✅\n\nFeedbackIQ turns feedback into intelligent action across our institution.\n\n#FeedbackIQ #StudentVoice #CampusFeedback #StudentLife #HigherEducation #VoiceYourOpinion`;
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generateCaption());
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // High-Resolution 1080p HTML5 Canvas Image Generator & Downloader
  const handleDownloadPNG = () => {
    setIsExporting(true);

    const isStory = postFormat === 'story';
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = isStory ? 1920 : 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Draw Background
    let grad: CanvasGradient;
    if (postTheme === 'cyber') {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E1B4B');
      grad.addColorStop(1, '#020617');
    } else if (postTheme === 'royal') {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#312E81');
      grad.addColorStop(0.6, '#1E1B4B');
      grad.addColorStop(1, '#0F172A');
    } else if (postTheme === 'emerald') {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#064E3B');
      grad.addColorStop(0.6, '#022C22');
      grad.addColorStop(1, '#0F172A');
    } else if (postTheme === 'sunset') {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#881337');
      grad.addColorStop(0.6, '#4C0519');
      grad.addColorStop(1, '#0F172A');
    } else if (postTheme === 'glass') {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#1E293B');
      grad.addColorStop(0.5, '#0F172A');
      grad.addColorStop(1, '#020617');
    } else {
      grad = ctx.createLinearGradient(0, 0, 1080, canvas.height);
      grad.addColorStop(0, '#F8FAFC');
      grad.addColorStop(1, '#E2E8F0');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, canvas.height);

    // Decorative Ambient Circles
    ctx.fillStyle = postTheme === 'ivory' ? 'rgba(79, 70, 229, 0.08)' : 'rgba(99, 102, 241, 0.15)';
    ctx.beginPath();
    ctx.arc(950, 150, 400, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = postTheme === 'ivory' ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.12)';
    ctx.beginPath();
    ctx.arc(100, canvas.height - 200, 350, 0, Math.PI * 2);
    ctx.fill();

    // 2. Inner Card Box (Glassmorphic 3D styling)
    const cardMarginX = 80;
    const cardMarginY = isStory ? 240 : 100;
    const cardW = 1080 - cardMarginX * 2;
    const cardH = canvas.height - cardMarginY * 2;

    ctx.save();
    ctx.fillStyle = postTheme === 'ivory' ? '#FFFFFF' : 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = postTheme === 'ivory' ? 'rgba(203, 213, 225, 0.8)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardMarginY, cardW, cardH, 36);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. Header Branding in Card
    const textColor = postTheme === 'ivory' ? '#0F172A' : '#FFFFFF';
    const subTextColor = postTheme === 'ivory' ? '#64748B' : '#94A3B8';
    const accentColor = '#6366F1';

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FEEDBACKIQ', cardMarginX + 60, cardMarginY + 90);

    ctx.fillStyle = subTextColor;
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Institutional Intelligence Platform', cardMarginX + 60, cardMarginY + 125);

    // Verified badge
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VERIFIED POST ✓', cardMarginX + cardW - 240, cardMarginY + 105);

    // Separator line
    ctx.strokeStyle = postTheme === 'ivory' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(cardMarginX + 60, cardMarginY + 160);
    ctx.lineTo(cardMarginX + cardW - 60, cardMarginY + 160);
    ctx.stroke();

    // 4. Format-Specific Content Rendering
    if (postFormat === 'you-spoke') {
      // Problem section
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('YOU SPOKE (STUDENT FEEDBACK):', cardMarginX + 60, cardMarginY + 230);

      ctx.fillStyle = textColor;
      ctx.font = 'italic 34px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, `"${customQuote}"`, cardMarginX + 60, cardMarginY + 285, cardW - 120, 48);

      // Resolution section
      const resY = isStory ? cardMarginY + 700 : cardMarginY + 480;
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('WE LISTENED & ACTED (RESOLUTION):', cardMarginX + 60, resY);

      ctx.fillStyle = textColor;
      ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, customResponse, cardMarginX + 60, resY + 55, cardW - 120, 46);

      // Status pill
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(cardMarginX + 60, cardMarginY + cardH - 120, 240, 50, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('STATUS: RESOLVED', cardMarginX + 85, cardMarginY + cardH - 87);
    } else if (postFormat === 'infographic') {
      ctx.fillStyle = textColor;
      ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CAMPUS PULSE REPORT', cardMarginX + 60, cardMarginY + 240);

      ctx.fillStyle = subTextColor;
      ctx.font = '24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Aggregated over ${stats.totalFeedback} Verified Student Reviews`, cardMarginX + 60, cardMarginY + 285);

      // Stat boxes
      const boxW = (cardW - 120 - 40) / 2;
      const boxH = isStory ? 200 : 150;
      const boxY = cardMarginY + 340;

      // Box 1
      drawCanvasBox(ctx, cardMarginX + 60, boxY, boxW, boxH, postTheme);
      ctx.fillStyle = '#F59E0B';
      ctx.font = '800 56px "JetBrains Mono", monospace';
      ctx.fillText(`${stats.averageRating} ⭐`, cardMarginX + 90, boxY + 75);
      ctx.fillStyle = subTextColor;
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Average Satisfaction Rating', cardMarginX + 90, boxY + 115);

      // Box 2
      drawCanvasBox(ctx, cardMarginX + 60 + boxW + 40, boxY, boxW, boxH, postTheme);
      ctx.fillStyle = '#10B981';
      ctx.font = '800 56px "JetBrains Mono", monospace';
      ctx.fillText(`${stats.positivePercentage}%`, cardMarginX + 60 + boxW + 70, boxY + 75);
      ctx.fillStyle = subTextColor;
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Positive Sentiment Ratio', cardMarginX + 60 + boxW + 70, boxY + 115);

      // Quote highlight at bottom
      const quoteY = isStory ? boxY + boxH + 80 : boxY + boxH + 40;
      ctx.fillStyle = textColor;
      ctx.font = 'italic 30px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, `"${customQuote.slice(0, 160)}..."`, cardMarginX + 60, quoteY, cardW - 120, 44);
    } else {
      // Standard Square / Spotlight Quote
      ctx.fillStyle = '#F59E0B';
      ctx.font = '40px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('★ ★ ★ ★ ★'.slice(0, activeFeedback.rating * 2 - 1), cardMarginX + 60, cardMarginY + 240);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${activeFeedback.department.toUpperCase()} · ${activeFeedback.category.toUpperCase()}`,
        cardMarginX + 60,
        cardMarginY + 295
      );

      ctx.fillStyle = textColor;
      ctx.font = 'italic 42px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, `"${customQuote}"`, cardMarginX + 60, cardMarginY + 380, cardW - 120, 60);

      // Author footer
      const authorName = activeFeedback.isAnonymous ? 'Verified Anonymous Student' : activeFeedback.userName;
      ctx.fillStyle = textColor;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(authorName, cardMarginX + 60, cardMarginY + cardH - 120);

      ctx.fillStyle = subTextColor;
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Recorded via FeedbackIQ · ${new Date(activeFeedback.createdAt).toLocaleDateString()}`, cardMarginX + 60, cardMarginY + cardH - 85);
    }

    // 5. Download PNG file
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram-post-${activeFeedback.id.toLowerCase()}-${postFormat}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsExporting(false);
    });
  };

  const handleCopyImageToClipboard = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = postFormat === 'story' ? 1920 : 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Quick canvas fill
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`FEEDBACKIQ - ${activeFeedback.id}`, 80, 140);
        ctx.font = 'italic 32px sans-serif';
        wrapText(ctx, `"${customQuote}"`, 80, 240, canvas.width - 160, 48);

        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
          }
        });
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function for wrapping text on Canvas
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  function drawCanvasBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    theme: PostTheme
  ) {
    ctx.fillStyle = theme === 'ivory' ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = theme === 'ivory' ? '#CBD5E1' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20);
    ctx.fill();
    ctx.stroke();
  }

  // Theme styling definitions
  const themeClasses: Record<PostTheme, string> = {
    cyber:
      'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-indigo-500/30',
    royal:
      'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-amber-500/30',
    emerald:
      'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border-emerald-500/30',
    sunset:
      'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 text-white border-rose-500/30',
    glass:
      'bg-slate-900/85 backdrop-blur-xl text-white border-white/20 shadow-2xl',
    ivory:
      'bg-white text-black border-2 border-slate-300 shadow-md theme-ivory-card',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Instagram className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Instagram & Social Studio</span>
              <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                5+ Post Tools
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transform raw feedback, resolutions, and campus metrics into viral Instagram posts, stories, and infographics.
          </p>
        </div>

        {/* Quick export actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCaption}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption & Hashtags'}</span>
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPNG}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating 1080p...' : 'Download Post PNG'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls on Left, 3D Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tool 1: Post Format Selector (5 Tools) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center justify-between">
              <span>1. Post Template & Format Tool</span>
              <span className="text-[10px] text-indigo-500 font-mono font-bold">5 Styles</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'square', label: '1:1 Square Feed', icon: '🖼️' },
                { id: 'story', label: '9:16 Story / Reel', icon: '📱' },
                { id: 'you-spoke', label: 'You Spoke, We Acted', icon: '⚡' },
                { id: 'infographic', label: 'Pulse Infographic', icon: '📊' },
                { id: 'spotlight', label: 'Kudos & Spotlight', icon: '🏆' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setPostFormat(fmt.id as PostFormat)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer anim-same ${
                    postFormat === fmt.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-800 dark:text-indigo-300 font-bold shadow-2xs'
                      : 'border-slate-300 dark:border-slate-700 text-black dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <span className="text-base block mb-0.5">{fmt.icon}</span>
                  <span className="text-[11px] block leading-tight font-semibold">{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tool 2: Select Feedback Data Source */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white block">
              2. Source Feedback Record
            </label>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg text-black dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {feedbacks.map((f) => (
                <option key={f.id} value={f.id} className="text-black bg-white dark:text-white dark:bg-slate-800 font-semibold">
                  {f.id} — {f.rating}⭐ [{f.department}] "{f.message.slice(0, 45)}..."
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-black dark:text-white block mb-1">
                  Card Headline Text
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-black dark:text-white block mb-1">
                  Feedback Quote Display
                </label>
                <textarea
                  rows={3}
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md text-black dark:text-white font-semibold focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {postFormat === 'you-spoke' && (
                <div>
                  <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Corrective Action / Resolution Statement
                  </label>
                  <textarea
                    rows={2}
                    value={customResponse}
                    onChange={(e) => setCustomResponse(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border-2 border-emerald-400 dark:border-emerald-800 rounded-md text-black dark:text-white font-semibold focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tool 3: Theme & Visual Style Customizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center justify-between">
              <span>3. 3D Visual Theme & Atmosphere</span>
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyber', label: 'Cyber Dark', preview: 'from-slate-950 to-indigo-950' },
                { id: 'royal', label: 'Campus Royal', preview: 'from-indigo-900 to-slate-900' },
                { id: 'emerald', label: 'Emerald Mint', preview: 'from-emerald-950 to-teal-900' },
                { id: 'sunset', label: 'Sunset Ruby', preview: 'from-rose-950 to-amber-950' },
                { id: 'glass', label: 'Frosted Glass', preview: 'from-slate-800 to-slate-900' },
                { id: 'ivory', label: 'Clean Ivory', preview: 'from-slate-100 to-white' },
              ].map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => setPostTheme(thm.id as PostTheme)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer anim-same ${
                    postTheme === thm.id
                      ? 'ring-2 ring-indigo-500 border-transparent shadow-xs font-bold'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 font-medium'
                  }`}
                >
                  <div
                    className={`h-5 w-full rounded bg-gradient-to-r ${thm.preview} mb-1.5 border border-white/20`}
                  />
                  <span className="text-[10px] font-semibold text-black dark:text-slate-300 block truncate">
                    {thm.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tool 4: AI Instagram Caption & Hashtag Assistant */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 anim-same">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>4. AI Instagram Caption Generator</span>
              </label>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 bg-white dark:bg-slate-850 rounded-lg border-2 border-slate-300 dark:border-slate-800 text-[11px] text-black dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto font-semibold">
              {generateCaption()}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Mockup & Live Post Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Mockup Frame Header */}
          <div className="flex items-center justify-between w-full max-w-md mb-2 px-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>Interactive 3D Preview (Move mouse to tilt)</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
              {postFormat === 'story' ? '9:16 Vertical Story' : '1:1 Square Feed'}
            </span>
          </div>

          {/* 3D Smartphone / Feed Preview Card with Interactive Tilt */}
          <Card3D
            maxTilt={10}
            scale={1.01}
            className={`w-full ${
              postFormat === 'story' ? 'max-w-xs' : 'max-w-md'
            } transition-all duration-300`}
          >
            {/* Phone Bezel */}
            <div className="bg-slate-900 dark:bg-black rounded-3xl p-3 border-4 border-slate-800 dark:border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Phone Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>

              {/* Instagram Feed Header Bar */}
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 text-slate-300 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      IQ
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-[11px] text-white block leading-tight">
                      campus.feedbackiq
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">
                      Campus Intelligence · Official
                    </span>
                  </div>
                </div>
                <span className="text-slate-500 text-sm">•••</span>
              </div>

              {/* The Actual Visual Post Card */}
              <div
                className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between ${
                  themeClasses[postTheme]
                } ${
                  postFormat === 'story' ? 'min-h-[460px]' : 'min-h-[360px]'
                }`}
              >
                {/* Floating ambient light flare */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Brand */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                      IQ
                    </div>
                    <div>
                      <span className="text-xs font-extrabold tracking-tight block leading-none">
                        FEEDBACKIQ
                      </span>
                      <span className="text-[9px] opacity-70 block font-medium mt-0.5">
                        {customTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Card Body Based on Format */}
                <div className="relative z-10 flex-1 flex flex-col justify-center my-3 space-y-3">
                  {postFormat === 'you-spoke' ? (
                    <div className="space-y-2.5">
                      <div className={`p-2.5 rounded-xl border ${postTheme === 'ivory' ? 'bg-rose-50 border-rose-300 text-black' : 'bg-red-500/10 border-red-500/30'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1 ${postTheme === 'ivory' ? 'text-rose-700 font-extrabold' : 'text-rose-400'}`}>
                          <Flame className="w-3 h-3" /> YOU SPOKE (STUDENT ISSUE):
                        </span>
                        <p className={`text-xs italic leading-snug ${postTheme === 'ivory' ? 'text-black font-semibold' : ''}`}>
                          "{customQuote}"
                        </p>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${postTheme === 'ivory' ? 'bg-emerald-50 border-emerald-300 text-black' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1 ${postTheme === 'ivory' ? 'text-emerald-800 font-extrabold' : 'text-emerald-400'}`}>
                          <CheckCircle2 className="w-3 h-3" /> WE LISTENED & ACTED:
                        </span>
                        <p className={`text-xs font-medium leading-snug ${postTheme === 'ivory' ? 'text-black font-semibold' : ''}`}>
                          {customResponse}
                        </p>
                      </div>
                    </div>
                  ) : postFormat === 'infographic' ? (
                    <div className="space-y-3">
                      <h4 className={`text-sm font-extrabold tracking-tight uppercase ${postTheme === 'ivory' ? 'text-black' : ''}`}>
                        Campus Feedback Pulse
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2.5 rounded-xl border text-center ${postTheme === 'ivory' ? 'bg-slate-100 border-slate-300 text-black' : 'bg-white/5 border-white/10'}`}>
                          <span className={`text-lg font-bold font-mono block ${postTheme === 'ivory' ? 'text-amber-600' : 'text-amber-400'}`}>
                            {stats.averageRating} ⭐
                          </span>
                          <span className={`text-[9px] uppercase font-bold ${postTheme === 'ivory' ? 'text-black' : 'opacity-70'}`}>
                            Avg Rating
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-xl border text-center ${postTheme === 'ivory' ? 'bg-slate-100 border-slate-300 text-black' : 'bg-white/5 border-white/10'}`}>
                          <span className={`text-lg font-bold font-mono block ${postTheme === 'ivory' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                            {stats.positivePercentage}%
                          </span>
                          <span className={`text-[9px] uppercase font-bold ${postTheme === 'ivory' ? 'text-black' : 'opacity-70'}`}>
                            Positive Ratio
                          </span>
                        </div>
                      </div>
                      <p className={`text-[11px] italic line-clamp-2 ${postTheme === 'ivory' ? 'text-black font-semibold' : 'opacity-80'}`}>
                        "{customQuote}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(activeFeedback.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className={`text-xs sm:text-sm italic font-medium leading-relaxed ${postTheme === 'ivory' ? 'text-black font-bold' : ''}`}>
                        "{customQuote}"
                      </p>
                      <span className={`text-[10px] font-mono block ${postTheme === 'ivory' ? 'text-black font-semibold' : 'opacity-70'}`}>
                        Category: {activeFeedback.category} · {activeFeedback.department}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] opacity-75">
                  <span>
                    {activeFeedback.isAnonymous ? 'Anonymous Student' : activeFeedback.userName}
                  </span>
                  <span className="font-mono">
                    Ref: {activeFeedback.id}
                  </span>
                </div>
              </div>

              {/* Instagram Interactive Action Buttons */}
              <div className="pt-3 px-2 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLiked(!isLiked);
                      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
                    }}
                    className="focus:outline-none cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform active:scale-125 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>
                  <MessageCircle className="w-5 h-5 text-white cursor-pointer" />
                  <Send className="w-5 h-5 text-white cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 text-white cursor-pointer" />
              </div>

              {/* Likes & Caption Preview in Phone */}
              <div className="px-2 pt-2 pb-1 text-left text-xs text-white">
                <p className="font-semibold text-[11px] mb-0.5 font-mono">
                  {likesCount.toLocaleString()} likes
                </p>
                <p className="text-[10px] text-slate-300 line-clamp-2">
                  <strong className="text-white">campus.feedbackiq</strong>{' '}
                  {generateCaption().split('\n')[0]}
                </p>
              </div>
            </div>
          </Card3D>

          {/* Quick tool buttons below preview */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPNG}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 1080p Image</span>
            </button>
            <button
              type="button"
              onClick={handleCopyCaption}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Caption & Tags</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
