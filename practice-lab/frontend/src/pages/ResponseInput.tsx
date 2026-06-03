import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { submitResponse } from '../api';
import { motion } from 'motion/react';
import { Send, Loader2, AlertCircle } from 'lucide-react';

export const ResponseInput: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = (location.state as { scenario?: string } | null)?.scenario ?? null;

  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!response.trim() || !appId || !scenario || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const feedback = await submitResponse(appId, scenario, response.trim());
      navigate(`/practice/${appId}/feedback`, {
        state: { feedback, scenario, userResponse: response.trim() },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit response. Please try again.');
      setSubmitting(false);
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <TopBar title="Your Response" showBack onBack={() => navigate(`/practice/${appId}/scenario`)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <AlertCircle className="w-8 h-8 text-cpl-red" />
          <p className="text-sm text-gray-500">Scenario data is missing. Please go back and start again.</p>
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

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar
        title="Your Response"
        showBack
        onBack={() => navigate(`/practice/${appId}/scenario`, { state: { scenario } })}
      />

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <div className="bg-white rounded-2xl p-4 border border-cpl-border mb-6 border-l-4 border-l-cpl-red/50 shadow-sm opacity-60">
          <p className="text-xs italic text-gray-500 font-lora">"{scenario}"</p>
        </div>

        <div className="mb-6 flex items-center px-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type your response</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={submitting}
            className="w-full h-48 bg-white border border-cpl-border rounded-3xl p-6 text-sm font-medium shadow-sm focus:ring-4 focus:ring-cpl-blue/5 focus:border-cpl-blue outline-none transition-all resize-none leading-relaxed disabled:opacity-60"
            placeholder="How would you respond to Alex?"
          />
          <div className="absolute top-[-10px] right-6 bg-white px-3 py-1 rounded-full border border-cpl-border shadow-sm flex items-center gap-2">
            <motion.div
              animate={{
                scale: response.length > 0 ? [1, 1.2, 1] : 1,
                backgroundColor: response.length > 0 ? '#1E4FA3' : '#9CA3AF',
              }}
              transition={{ repeat: response.length > 0 ? Infinity : 0, duration: 1.5 }}
              className="w-2 h-2 rounded-full"
            />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              {response.length > 0 ? 'Analyzing Drift' : 'Ready for input'}
            </span>
          </div>
          <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-300">
            {response.length} characters
          </div>
        </motion.div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-cpl-red shrink-0" />
            <p className="text-xs text-cpl-red font-medium">{error}</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border transition-all duration-300">
        <button
          disabled={!response.trim() || submitting}
          onClick={handleSubmit}
          className={`w-full font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${
            response.trim() && !submitting
              ? 'bg-cpl-blue text-white active:scale-[0.98]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating…
            </>
          ) : (
            <>
              Submit Response
              <Send className={`w-4 h-4 ${response.trim() ? 'fill-current' : ''}`} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
