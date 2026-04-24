import { NextRequest } from "next/server";

const ALLOWED_ORIGINS = new Set<string>([
  "https://tomoverde.com",
  "https://www.tomoverde.com",
]);

export function isAllowedOrigin(req: NextRequest): boolean {
  // Allow same-origin requests (no Origin header) — GET navigations, curl, etc.
  // For POSTs from browsers, Origin is always set by the browser.
  const origin = req.headers.get("origin");
  if (!origin) {
    // No Origin header: check Referer as a fallback. If both are absent,
    // it's a non-browser client — allow (our real protections are honeypot,
    // time-gate, and rate-limit).
    const referer = req.headers.get("referer");
    if (!referer) return true;
    try {
      const u = new URL(referer);
      return ALLOWED_ORIGINS.has(u.origin);
    } catch {
      return false;
    }
  }

  // In local dev, next runs on localhost — allow that too.
  if (process.env.NODE_ENV !== "production") {
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      return true;
    }
  }

  return ALLOWED_ORIGINS.has(origin);
}
