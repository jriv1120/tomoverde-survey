"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COOKIE_NAME = "tv_age_verified";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AgeGate() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [declined, setDeclined] = useState(false);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setVisible(getCookie(COOKIE_NAME) !== "true");
  }, []);

  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  useEffect(() => {
    if (visible && !declined) {
      primaryBtnRef.current?.focus();
    }
  }, [visible, declined]);

  function handleYes() {
    setCookie(COOKIE_NAME, "true", COOKIE_DAYS);
    setVisible(false);
  }

  function handleNo() {
    setDeclined(true);
  }

  if (visible === null || visible === false) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[9999] bg-ink/70 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-cream border border-sage/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-ink/40 animate-settle">
        <div className="mx-auto mb-2 w-[150px]">
          <Image
            src="/logo.png"
            alt="Tomoverde — Discover Green Together"
            width={864}
            height={735}
            priority
            className="w-full h-auto"
          />
        </div>

        {!declined ? (
          <>
            <h1
              id="age-gate-title"
              className="mt-7 font-serif text-3xl sm:text-4xl font-light leading-[1.15] tracking-tight text-ink"
            >
              Are you 21 or older?
            </h1>
            <p className="mt-4 text-base text-ink-muted leading-relaxed">
              Tomoverde is a cannabis community. You must be 21+ to continue.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                ref={primaryBtnRef}
                type="button"
                onClick={handleYes}
                className="w-full rounded-full bg-forest hover:bg-ink transition-colors duration-500 ease-out px-6 py-4 text-cream font-medium shadow-lg shadow-forest/25"
              >
                Yes, I&rsquo;m 21 or older
              </button>
              <button
                type="button"
                onClick={handleNo}
                className="w-full rounded-full border border-sage/60 hover:border-forest hover:text-ink text-ink-muted transition-colors duration-500 px-6 py-3.5 text-sm"
              >
                I&rsquo;m under 21
              </button>
            </div>

            <p className="mt-7 text-xs text-ink-muted leading-relaxed">
              By entering, you confirm you&rsquo;re of legal age in your state.
            </p>
            <p className="mt-4 text-[11px] text-ink-muted/80 leading-relaxed">
              Cannabis has not been evaluated by the FDA. Keep out of reach of
              children and pets. Do not operate vehicles or machinery under the
              influence. For use only by adults 21 and older.
            </p>
          </>
        ) : (
          <>
            <h1
              id="age-gate-title"
              className="mt-7 font-serif text-3xl font-light leading-[1.2] tracking-tight text-ink"
            >
              Come back in a few years.
            </h1>
            <p className="mt-4 text-base text-ink-muted leading-relaxed">
              Tomoverde is a 21+ community. We&rsquo;ll be here when you&rsquo;re ready.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
