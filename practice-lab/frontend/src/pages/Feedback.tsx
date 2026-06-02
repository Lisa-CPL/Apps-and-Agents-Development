import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { FeedbackPayload } from '../api';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, AlertCircle, XCircle, Sparkles, RotateCcw } from 'lucide-react';

const VERDICT_SCORE: Record<string, number> = {
  strong: 100,
  partial: 60,
  'needs work': 20,
};

function computeScore(feedback: FeedbackPayload): number {
  if (feedback.criteria.length === 0) return 0;
  const total = feedback.criteria.reduce(
    (sum, c) => sum + (VERDICT_SCORE[c.verdict] ?? 60), 0
  );
  return Math.round(total / feedback.criteria.length);
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent work! Your response showed strong conversational skill.';
  if (score >= 60) return 'Good effort. A few areas to refine for next time.';
  return 'Keep practicing — every attempt builds your skill.';
}

const VerdictIcon: React.FC<{ verdict: string }> = ({ verdict }) => {
  if (verdict === 'strong') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (verdict === 'partial') return <AlertCircle className="w-4 h-4 text-amber-500" />;
  return <XCircle className="w-4 h-4 text-cpl-red" />;
};

const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  const styles: Record<string, string> = {
    strong: 'bg-green-50 text-green-600',
    partial: 'bg-amber-50 text-amber-600',
    'needs work': 'bg-red-50 text-cpl-red',
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${styles[verdict] ?? styles.partial}`}>
      {verdict}
    </span>
  );
};

export const Feedback: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { feedback?: FeedbackPayload; scenario?: string } | null;
  const feedback = state?.feedback ?? null;
  const scenario = state?.scenario ?? null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  };

  if (!feedback) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <TopBar title="Feedback" showBack onBack={() => navigate(`/practice/${appId}/scenario`)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <AlertCircle className="w-8 h-8 text-cpl-red" />
          <p className="text-sm text-gray-500">Feedback data is missing. Please submit a response first.</p>
          <button
            onClick={() => navigate(`/practice/${appId}/scenario`)}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-cpl-blue rounded-lg hover:bg-cpl-blue/90 transition-colors"
          >
            Back to Scenario
          </button>
        </div>
      </div>
    );
  }

  const score = computeScore(feedback);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar
        title="Feedback"
        showBack
        onBack={() => navigate(`/practice/${appId}/response`, { state: { scenario } })}
      />

      <main className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 pb-8"
        >
          {/* Score header */}
          <motion.div variants={itemVariants} className="bg-cpl-blue p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Impact Score</span>
              </div>
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="font-serif text-6xl font-black mb-4"
              >
                {score}
              </motion.h2>
              <p className="text-sm opacity-80 max-w-[220px]">{scoreLabel(score)}</p>
            </div>
            <div className="absolute right-[-20%] bottom-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Per-criterion insights */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-cpl-border shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Insights</h3>
            <div className="space-y-5">
              {feedback.criteria.map((c, i) => (
                <React.Fragment key={c.name}>
                  {i > 0 && <div className="h-px bg-gray-50" />}
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-0.5">
                      <VerdictIcon verdict={c.verdict} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-cpl-dark capitalize">
                          {c.name.replace(/_/g, ' ')}
                        </p>
                        <VerdictBadge verdict={c.verdict} />
                      </div>
                      {c.what_worked && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-1">{c.what_worked}</p>
                      )}
                      {c.what_to_improve && (
                        <p className="text-xs text-amber-700 leading-relaxed">{c.what_to_improve}</p>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Suggestion */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-cpl-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-cpl-amber" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Tip</h3>
            </div>
            <p className="text-xs font-medium text-gray-600 leading-relaxed">{feedback.suggestion}</p>
          </motion.div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border flex gap-4 transition-all duration-300">
        <button
          onClick={() => navigate(`/practice/${appId}/response`, { state: { scenario } })}
          className="flex-1 border border-cpl-border font-bold py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
          Retry
        </button>
        <button
          onClick={() => navigate(`/practice/${appId}/next`)}
          className="flex-[2] bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
        >
          See Next Step
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
