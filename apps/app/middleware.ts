import { type NextRequest, NextResponse } from "next/server";

// This injects the tenant slug into every request without the user ever seeing it.
// This ensures all routes now receive ?tenant=abc-corp silently.
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const domainParts = host.split(".");

  const subdomain = domainParts[0];

  const isTenant = subdomain && subdomain !== "www" && subdomain !== "lmgcore";

  if (isTenant) {
    url.searchParams.set("tenant", subdomain);
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
