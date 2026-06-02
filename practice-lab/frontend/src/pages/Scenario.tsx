import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { CriterionSpec, fetchMiniAppDetail, generateScenario } from '../api';
import { motion } from 'motion/react';
import { MessageSquare, ChevronRight, Loader2, AlertCircle, Target, RefreshCw } from 'lucide-react';

export const Scenario: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const existingScenario = (location.state as { scenario?: string } | null)?.scenario ?? null;

  const [scenario, setScenario] = useState<string | null>(existingScenario);
  const [criteria, setCriteria] = useState<CriterionSpec[]>([]);
  const [loading, setLoading] = useState(existingScenario === null);
  const [error, setError] = useState<string | null>(null);

  const load = (forceNew = false) => {
    if (!appId) return;
    setLoading(true);
    setError(null);

    const scenarioPromise = forceNew || existingScenario === null
      ? generateScenario(appId)
      : Promise.resolve(existingScenario);

    Promise.all([scenarioPromise, fetchMiniAppDetail(appId)])
      .then(([scenarioText, detail]) => {
        setScenario(scenarioText);
        setCriteria(detail.criteria);
      })
      .catch((err) => setError(err.message || 'Failed to load scenario.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (existingScenario) {
      // Criteria still need to be fetched even when scenario is reused
      fetchMiniAppDetail(appId!).then((d) => setCriteria(d.criteria));
    } else {
      load();
    }
  }, [appId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <TopBar title="The Scenario" showBack onBack={() => navigate(`/practice/${appId}`)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cpl-blue animate-spin" />
          <p className="text-sm text-gray-400">Generating your scenario…</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <TopBar title="The Scenario" showBack onBack={() => navigate(`/practice/${appId}`)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <AlertCircle className="w-8 h-8 text-cpl-red" />
          <p className="text-sm text-gray-500">{error ?? 'Something went wrong.'}</p>
          <button
            onClick={() => load(true)}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-cpl-blue rounded-lg hover:bg-cpl-blue/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar title="The Scenario" showBack onBack={() => navigate(`/practice/${appId}`)} />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-6 pt-10 pb-24 overflow-y-auto"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cpl-red overflow-hidden flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="text-xs font-bold text-gray-500">Alex • Counter-perspective</span>
          </div>
          <button
            onClick={() => load(true)}
            className="bg-white px-2 py-1 rounded-md border border-cpl-border flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            title="Generate a new scenario"
          >
            <RefreshCw className="w-3 h-3 text-gray-400" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-gray-400">NEW</span>
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-8 shadow-xl border border-cpl-border relative mb-10"
        >
          <div className="absolute -top-6 -left-2 w-12 h-12 bg-red-100 rounded-2xl rounded-tr-none flex items-center justify-center text-cpl-red opacity-80 rotate-[-12deg]">
            <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
          </div>

          <p className="font-lora text-xl italic leading-relaxed text-cpl-dark">
            "{scenario}"
          </p>
        </motion.div>

        {criteria.length > 0 && (
          <div className="space-y-4">
            <motion.h3 variants={itemVariants} className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Your Objective
            </motion.h3>
            {criteria.map((c, i) => (
              <motion.div
                key={c.name}
                variants={itemVariants}
                className="bg-white/50 border border-cpl-border rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="bg-cpl-blue/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-3 h-3 text-cpl-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-cpl-blue uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-sm font-medium text-gray-600">{c.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border transition-all duration-300">
        <button
          onClick={() => navigate(`/practice/${appId}/response`, { state: { scenario } })}
          className="w-full bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
        >
          Continue to Response
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
