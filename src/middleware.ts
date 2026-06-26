import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { routing } from "@/i18n/routing";
import { verifyAdminSessionTokenEdge } from "@/lib/security/admin-session-edge";
import { isRedirectShellPath } from "@/lib/knowledge-graph/site-cleanup";

const intlMiddleware = createIntlMiddleware(routing);

/** Only non-default locales use the [locale] segment (see src/app/[locale]/*). */
const NON_DEFAULT_LOCALE_PREFIX = /^\/(hi|fr|es|ar)(\/|$)/;

function shouldRunIntlMiddleware(pathname: string): boolean {
  return NON_DEFAULT_LOCALE_PREFIX.test(pathname);
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isOpsPath(pathname: string): boolean {
  return (
    isAdminPath(pathname) ||
    pathname === "/event/checkin" ||
    pathname.startsWith("/event/checkin/")
  );
}

function isAdminLoginLanding(pathname: string): boolean {
  return pathname === "/admin" || pathname === "/admin/";
}

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookie || !secret) return false;
  const session = await verifyAdminSessionTokenEdge(cookie, secret);
  return Boolean(session);
}

function withNoIndex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isOpsPath(pathname)) {
    if (!isAdminLoginLanding(pathname) && !pathname.startsWith("/api/")) {
      const authed = await hasValidAdminSession(request);
      if (!authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.searchParams.set("next", pathname);
        return withNoIndex(NextResponse.redirect(url));
      }
    }
    return withNoIndex(NextResponse.next());
  }

  if (isRedirectShellPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (pathname === "/hi/contact-us" || pathname.startsWith("/hi/contact-us/")) {
    return NextResponse.redirect(new URL("/contact-us", request.url), 308);
  }

  if (!shouldRunIntlMiddleware(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
