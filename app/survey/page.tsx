"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import SubscribeStep from "./SubscribeStep";

type Answers = Record<string, string | string[]>;
type Draft = { answers: Answers; currentIndex: number; updatedAt: number };

const DRAFT_KEY = "tomoverde_survey_draft_v1";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export default function Survey() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [startedAt] = useState(() => Date.now());
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [postSubmit, setPostSubmit] = useState<{
    id: string | null;
    email: string;
  } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const stashedDraftRef = useRef<Draft | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        if (
          parsed.updatedAt &&
          Date.now() - parsed.updatedAt < DRAFT_TTL_MS &&
          parsed.answers &&
          Object.keys(parsed.answers).length > 0
        ) {
          stashedDraftRef.current = parsed;
          setShowResumePrompt(true);
        }
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || showResumePrompt) return;
    if (Object.keys(answers).length === 0 && currentIndex === 0) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ answers, currentIndex, updatedAt: Date.now() }),
        );
      } catch {
        /* noop */
      }
    }, 200);
    return () => window.clearTimeout(t);
  }, [answers, currentIndex, hydrated, showResumePrompt]);

  const clearTimer = () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const resumeDraft = () => {
    const stashed = stashedDraftRef.current;
    if (stashed) {
      setAnswers(stashed.answers);
      setCurrentIndex(Math.min(Math.max(stashed.currentIndex, 0), TOTAL_QUESTIONS - 1));
    }
    setShowResumePrompt(false);
  };

  const startFresh = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* noop */
    }
    setShowResumePrompt(false);
  };

  const submit = useCallback(
    async (finalAnswers: Answers) => {
      setSubmitting(true);
      setSubmitError(null);
      const honeypot = honeypotRef.current?.value ?? "";
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ...finalAnswers,
            website: honeypot,
            _startedAt: startedAt,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          id?: string | null;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error ?? "Submission failed");
        }
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* noop */
        }
        const givenEmail =
          typeof finalAnswers.email === "string" ? finalAnswers.email.trim() : "";
        setPostSubmit({ id: data.id ?? null, email: givenEmail });
      } catch (e) {
        setSubmitError(
          e instanceof Error ? e.message : "Something went wrong. Try again.",
        );
        setSubmitting(false);
      }
    },
    [startedAt],
  );

  const goNext = useCallback(() => {
    clearTimer();
    if (currentIndex >= TOTAL_QUESTIONS - 1) {
      void submit(answers);
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, TOTAL_QUESTIONS - 1));
  }, [currentIndex, answers, submit]);

  const goBack = () => {
    clearTimer();
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const q = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;
  const answer = answers[q.column];

  const setAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [q.column]: value }));
  };

  const toggleMulti = (opt: string) => {
    const current = (answer as string[] | undefined) ?? [];
    const next = current.includes(opt) ? current.filter((x) => x !== opt) : [...current, opt];
    setAnswer(next);
  };

  const pickSingle = (opt: string) => {
    setAnswer(opt);
    clearTimer();
    advanceTimerRef.current = window.setTimeout(() => goNext(), 400);
  };

  const canContinue = useCallback(() => {
    if (q.type === "optional-text") return true;
    if (q.type === "text") return typeof answer === "string" && answer.trim().length > 0;
    if (q.type === "multi") return Array.isArray(answer) && answer.length > 0;
    if (q.type === "single") return typeof answer === "string" && answer.length > 0;
    return false;
  }, [q, answer]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showResumePrompt || submitting) return;
      if (e.key === "ArrowLeft" && currentIndex > 0) goBack();
      if (e.key === "Enter" && q.type !== "text" && canContinue()) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, canContinue, goNext, q.type, showResumePrompt, submitting]);

  const skip = () => goNext();

  if (postSubmit) {
    return (
      <SubscribeStep
        surveyResponseId={postSubmit.id}
        initialEmail={postSubmit.email}
        onDone={() => router.push("/thanks")}
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="fixed top-0 inset-x-0 z-20 h-[3px] bg-sage/20">
        <div
          className="h-full bg-forest transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_QUESTIONS}
          aria-label={`Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`}
        />
      </div>

      <header className="px-6 pt-10 sm:px-10 sm:pt-12 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/logo-mark-dark.png"
            alt=""
            width={760}
            height={580}
            className="w-7 h-auto"
          />
          <span className="font-serif text-xl tracking-tight text-forest">Tomoverde</span>
        </Link>
        <span className="text-sm text-ink-muted tabular-nums">
          {currentIndex + 1} / {TOTAL_QUESTIONS}
        </span>
      </header>

      {showResumePrompt && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-ink/60 backdrop-blur-sm px-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-sm w-full rounded-2xl bg-cream border border-sage/40 p-8 animate-settle shadow-2xl shadow-ink/30">
            <h2 className="font-serif text-2xl text-ink font-light">
              Pick up where you left off?
            </h2>
            <p className="mt-3 text-sm text-ink-muted">We saved your progress on this device.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={resumeDraft}
                className="flex-1 rounded-full bg-forest hover:bg-ink transition-colors duration-500 px-5 py-3 text-cream font-medium"
              >
                Yes, continue
              </button>
              <button
                onClick={startFresh}
                className="flex-1 rounded-full border border-sage/60 hover:border-forest px-5 py-3 text-ink transition-colors duration-500"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
        <div key={currentIndex} className="max-w-2xl w-full animate-settle">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">
            Question {q.number}
            {q.optional && <span className="ml-2 text-tobacco">· optional</span>}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] tracking-tight text-ink">
            {q.prompt}
          </h1>
          {q.subtitle && <p className="mt-3 text-base text-ink-muted">{q.subtitle}</p>}

          <div className="mt-10">
            {q.type === "single" && (
              <div className="flex flex-col gap-3" role="radiogroup" aria-label={q.prompt}>
                {q.options?.map((opt) => {
                  const selected = answer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickSingle(opt)}
                      className={`text-left rounded-2xl border px-6 py-4 transition-all duration-500 ease-out ${
                        selected
                          ? "border-forest bg-forest text-cream shadow-lg shadow-forest/20"
                          : "border-sage/40 hover:border-forest/60 bg-cream-warm hover:bg-cream-warm/70 text-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "multi" && (
              <div className="flex flex-wrap gap-2.5" role="group" aria-label={q.prompt}>
                {q.options?.map((opt) => {
                  const current = (answer as string[] | undefined) ?? [];
                  const selected = current.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMulti(opt)}
                      className={`rounded-full border px-5 py-3 text-sm transition-all duration-500 ease-out ${
                        selected
                          ? "border-forest bg-forest text-cream shadow-md shadow-forest/20"
                          : "border-sage/40 hover:border-forest/60 bg-cream-warm/60 hover:bg-cream-warm text-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "text" && (
              <textarea
                value={(answer as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={2000}
                rows={6}
                placeholder={q.placeholder}
                aria-label={q.prompt}
                className="w-full rounded-2xl border border-sage/40 bg-cream-warm/70 p-5 text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none transition-colors duration-500 resize-none text-base leading-relaxed"
              />
            )}

            {q.type === "optional-text" && (
              <input
                type={q.column === "email" ? "email" : "text"}
                inputMode={q.column === "zip_code" ? "numeric" : undefined}
                value={(answer as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={q.column === "email" ? 320 : 20}
                placeholder={q.placeholder}
                aria-label={q.prompt}
                className="w-full rounded-2xl border border-sage/40 bg-cream-warm/70 px-5 py-4 text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none transition-colors duration-500 text-base"
              />
            )}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentIndex === 0 || submitting}
              className="text-sm text-ink-muted hover:text-ink transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              ← Back
            </button>

            <div className="flex items-center gap-4">
              {q.type === "optional-text" && (
                <button
                  type="button"
                  onClick={skip}
                  className="text-sm text-ink-muted hover:text-ink transition-colors"
                  disabled={submitting}
                >
                  Skip
                </button>
              )}
              {q.type !== "single" && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue() || submitting}
                  className="rounded-full bg-forest hover:bg-ink transition-colors duration-500 px-7 py-3 text-cream font-medium disabled:opacity-40 disabled:pointer-events-none"
                >
                  {currentIndex === TOTAL_QUESTIONS - 1
                    ? submitting
                      ? "Sending…"
                      : "Finish"
                    : "Continue"}
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <p className="mt-4 text-sm text-tobacco" role="alert">
              {submitError}
            </p>
          )}
        </div>
      </div>

      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0"
      />
    </main>
  );
}
