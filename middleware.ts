import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "tv_age_verified";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsGate = pathname.startsWith("/survey") || pathname.startsWith("/thanks");
  if (!needsGate) return NextResponse.next();

  const verified = req.cookies.get(COOKIE_NAME)?.value === "true";
  if (verified) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("gate", "1");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/survey/:path*", "/thanks/:path*"],
};
