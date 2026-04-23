import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { feedbackSchema, defaultValues } from '../../lib/schema.js';
import { api } from '../../lib/api.js';
import ProgressBar from './ProgressBar.jsx';
import { ALL_SECTIONS, HeaderFields, STEP_FIELDS } from './sections.jsx';

const STORAGE_KEY = 'aibh_feedback_draft';

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function FeedbackForm() {
  const draft = loadDraft();
  const [step, setStep] = useState(draft?.step ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { ...defaultValues, ...(draft?.values || {}) },
    mode: 'onChange',
  });

  const {
    handleSubmit, trigger, formState: { errors }, watch,
  } = form;

  // Auto-save draft
  useEffect(() => {
    const sub = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, values }));
    });
    return () => sub.unsubscribe();
  }, [watch, step]);

  useEffect(() => {
    const values = watch();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, values }));
  }, [step]); // eslint-disable-line

  const total = ALL_SECTIONS.length;
  const Current = ALL_SECTIONS[step];

  const headerFields = ['companyName'];

  async function onNext() {
    // validate header always
    const hdr = await trigger(headerFields);
    const stepOk = await trigger(STEP_FIELDS[step]);
    if (hdr && stepOk) setStep((s) => Math.min(s + 1, total - 1));
  }

  function onPrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values) {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.submitFeedback({
        ...values,
        satisfactionScore: Number(values.satisfactionScore),
      });
      setSubmitted(res);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      setSubmitError(e.message || 'Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <ThankYou result={submitted} />;
  }

  const isLast = step === total - 1;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <HeaderFields form={form} errors={errors} />

      <div className="card">
        <ProgressBar step={step} total={total} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Current form={form} />
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button type="button" className="btn-ghost" onClick={onPrev} disabled={step === 0}>
          <ArrowLeft size={18} /> Previous
        </button>
        <div className="text-xs opacity-60">
          Draft auto-saved to this device.
        </div>
        {isLast ? (
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Submit Feedback
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={onNext}>
            Next <ArrowRight size={18} />
          </button>
        )}
      </div>
    </form>
  );
}

function ThankYou({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center py-14 px-8 max-w-2xl mx-auto"
    >
      <div className="h-16 w-16 mx-auto rounded-full bg-gold-500/15 flex items-center justify-center text-gold-500">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="mt-5 text-2xl font-bold">Thank you for your feedback!</h2>
      <p className="mt-2 opacity-70">
        Together, we create a better workspace.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-50 dark:bg-navy-500 px-4 py-2 text-sm font-mono">
        <span className="opacity-60">Submission ID:</span>
        <span className="font-semibold text-gold-500">{result.submissionId}</span>
      </div>
      <p className="mt-6 text-xs opacity-50">
        A confirmation will be sent to your email (if configured). You can close this page.
      </p>
    </motion.div>
  );
}
