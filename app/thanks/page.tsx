"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function Thanks() {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/`);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* noop */
    }
  };

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

      <div className="flex-1 flex items-center justify-center px-6 sm:px-10">
        <div className="max-w-xl w-full text-center animate-settle">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-ink">
            Your voice is the first seed planted in this garden.
          </h1>
          <p className="mt-8 text-lg text-ink-muted leading-relaxed max-w-md mx-auto">
            Thank you. We read every response. What you just shared is already shaping what we
            build next.
          </p>

          <div className="mt-12 space-y-5">
            <p className="text-xs text-ink-muted uppercase tracking-[0.25em]">Pass it on</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.instagram.com/tomoverde.co"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-sage/60 hover:border-forest hover:bg-cream-warm/60 transition-all duration-500 px-5 py-2.5 text-sm text-ink"
              >
                @tomoverde.co on IG
              </a>
              <a
                href="https://www.tiktok.com/@tomoverde"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-sage/60 hover:border-forest hover:bg-cream-warm/60 transition-all duration-500 px-5 py-2.5 text-sm text-ink"
              >
                TikTok
              </a>
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-sage/60 hover:border-forest hover:bg-cream-warm/60 transition-all duration-500 px-5 py-2.5 text-sm text-ink"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="https://www.instagram.com/tomoverde.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-forest hover:text-ink transition-colors underline underline-offset-4 decoration-forest/40"
            >
              Follow our journey →
            </Link>
          </div>
        </div>
      </div>

      <DisclosureFooter />
    </main>
  );
}
