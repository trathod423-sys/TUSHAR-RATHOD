import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { askFeedbackAI } from '../../services/aiService';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  Loader2,
  HelpCircle,
  CornerDownLeft,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AskFeedbackAI: React.FC = () => {
  const { feedbacks, stats } = useFeedback();

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Administrator! I am FeedbackIQ's AI Analyst. I have full real-time visibility into all ${stats.totalFeedback} feedback submissions across departments. Ask me anything about sentiment trends, student complaints, or where to direct improvements.`,
      timestamp: 'Just now',
    },
  ]);

  const quickQuestions = [
    'What are students most unhappy about?',
    'Which department received the lowest ratings?',
    'What are the top recurring suggestions?',
    'Summarize recent negative feedback regarding infrastructure.',
    'What should administration improve first for quick wins?',
  ];

  const handleSendQuestion = async (queryText?: string) => {
    const q = (queryText || inputQuestion).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const datasetSummary = {
        totalFeedback: stats.totalFeedback,
        averageRating: stats.averageRating,
        positivePct: stats.positivePercentage,
        negativePct: stats.negativePercentage,
        ratingDist: stats.ratingDistribution,
        categoryDist: stats.categoryDistribution,
        departmentDist: stats.departmentDistribution,
        recentNegativeSample: feedbacks
          .filter((f) => f.sentiment === 'Negative')
          .slice(0, 15)
          .map((f) => ({
            dept: f.department,
            cat: f.category,
            rating: f.rating,
            msg: f.message,
          })),
      };

      const aiAnswer = await askFeedbackAI(q, datasetSummary);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AskFeedbackAI error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[75vh] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Ask Feedback AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Ground Truth Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Query the feedback dataset in natural language with verified data references
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-850/30 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
            Suggested Queries:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(q)}
              className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 max-w-2xl ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <span
                className={`text-[9px] block mt-1 font-mono ${
                  m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Consulting feedback records and analyzing dataset patterns...</span>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about student feedback, complaints, or improvement actions..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="p-2.5 text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
