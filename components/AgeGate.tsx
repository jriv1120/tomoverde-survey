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
  // `null` = haven't checked yet (no flash of modal for verified users)
  const [visible, setVisible] = useState<boolean | null>(null);
  const [declined, setDeclined] = useState(false);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setVisible(getCookie(COOKIE_NAME) !== "true");
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  // Focus primary button when gate opens
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
      className="fixed inset-0 z-[9999] bg-forest-deep/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-card border border-fern/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-black/60 animate-settle">
        <div className="mx-auto mb-5 w-[82px]">
          <Image
            src="/logo-mark-cream.png"
            alt=""
            width={760}
            height={580}
            priority
            className="w-full h-auto opacity-95"
          />
        </div>
        <p className="text-[11px] tracking-[0.22em] uppercase text-glow font-medium">
          Tomoverde
        </p>
        <p className="mt-1 text-xs text-text-muted italic">Where connection grows.</p>

        {!declined ? (
          <>
            <h1
              id="age-gate-title"
              className="mt-7 font-serif text-3xl sm:text-4xl font-light leading-[1.15] tracking-tight text-cream"
            >
              Are you 21 or older?
            </h1>
            <p className="mt-4 text-base text-text-muted leading-relaxed">
              Tomoverde is a cannabis community. You must be 21+ to continue.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                ref={primaryBtnRef}
                type="button"
                onClick={handleYes}
                className="w-full rounded-full bg-moss hover:bg-fern transition-colors duration-500 ease-out px-6 py-4 text-cream font-medium shadow-lg shadow-black/30"
              >
                Yes, I&rsquo;m 21 or older
              </button>
              <button
                type="button"
                onClick={handleNo}
                className="w-full rounded-full border border-fern/40 hover:border-glow/60 hover:text-cream text-text-muted transition-colors duration-500 px-6 py-3.5 text-sm"
              >
                I&rsquo;m under 21
              </button>
            </div>

            <p className="mt-7 text-xs text-text-muted/60 leading-relaxed">
              By entering, you confirm you&rsquo;re of legal age in your state.
            </p>
          </>
        ) : (
          <>
            <h1
              id="age-gate-title"
              className="mt-7 font-serif text-3xl font-light leading-[1.2] tracking-tight text-cream"
            >
              Come back in a few years.
            </h1>
            <p className="mt-4 text-base text-text-muted leading-relaxed">
              Tomoverde is a 21+ community. We&rsquo;ll be here when you&rsquo;re ready.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
