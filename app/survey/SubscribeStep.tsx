"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

type Props = {
  surveyResponseId?: string | null;
  onDone: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeStep({ surveyResponseId, onDone }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef(Date.now());

  async function handleSubmit() {
    setError(null);
    if (!email || !EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          survey_response_id: surveyResponseId,
          honeypot: honeypotRef.current?.value ?? "",
          started_at: startedAtRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 pt-10 sm:px-10 sm:pt-12">
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
      </header>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
        <div className="max-w-xl w-full animate-settle">
          {done ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-forest">Welcome home</p>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-light leading-[1.1] tracking-tight text-ink">
                You&rsquo;re in. 🌱
              </h1>
              <p className="mt-6 text-lg text-ink-muted leading-relaxed">
                Check your inbox — a welcome note is on its way.
              </p>
              <button
                type="button"
                onClick={onDone}
                className="mt-10 rounded-full bg-forest hover:bg-ink transition-colors duration-500 ease-out px-9 py-4 text-cream font-medium shadow-lg shadow-forest/20"
              >
                Finish
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">
                Thanks for sharing
              </p>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] tracking-tight text-ink">
                Want to be the first to know when we launch?
              </h1>
              <p className="mt-5 text-base text-ink-muted leading-relaxed">
                Leave your email and we&rsquo;ll send one note a month &mdash; events near you,
                venues worth knowing, and how cannabis is moving forward in New Jersey. No spam.
                Unsubscribe anytime.
              </p>

              <div className="mt-10 space-y-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm text-ink-muted mb-2"
                  >
                    First name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                    autoComplete="given-name"
                    placeholder="Jorge"
                    className="w-full rounded-2xl border border-sage/40 bg-cream-warm/70 px-5 py-4 text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none transition-colors duration-500 text-base"
                  />
                </div>
                <div>
                  <label htmlFor="subscribe_email" className="block text-sm text-ink-muted mb-2">
                    Email
                  </label>
                  <input
                    id="subscribe_email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    required
                    placeholder="you@gmail.com"
                    className="w-full rounded-2xl border border-sage/40 bg-cream-warm/70 px-5 py-4 text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none transition-colors duration-500 text-base"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-tobacco" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onDone}
                  disabled={loading}
                  className="text-sm text-ink-muted hover:text-ink transition-colors disabled:opacity-40"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !email}
                  className="rounded-full bg-forest hover:bg-ink transition-colors duration-500 px-7 py-3 text-cream font-medium disabled:opacity-40 disabled:pointer-events-none"
                >
                  {loading ? "Signing you up…" : "Count me in"}
                </button>
              </div>

              <input
                ref={honeypotRef}
                type="text"
                name="subscribe_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] w-px h-px opacity-0"
              />
            </>
          )}
        </div>
      </div>

      <DisclosureFooter />
    </main>
  );
}
