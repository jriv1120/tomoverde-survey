import { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export interface RateLimitOptions {
  endpoint: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function checkRateLimit(
  req: NextRequest,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const key = `${opts.endpoint}:${ip}`;

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: opts.limit,
      p_window_seconds: opts.windowSeconds,
    });

    if (error) {
      // Migration may not be applied yet, or transient DB issue.
      // Fail open (allow) to avoid breaking the site, but log for visibility.
      console.warn("[rate-limit] check failed, allowing:", error.message);
      return { allowed: true };
    }

    return {
      allowed: data === true,
      retryAfterSeconds: data === false ? opts.windowSeconds : undefined,
    };
  } catch (e) {
    console.warn("[rate-limit] handler error, allowing:", e);
    return { allowed: true };
  }
}
