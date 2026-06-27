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

function documentLangForPath(pathname: string): string {
  if (pathname === "/hi" || pathname.startsWith("/hi/")) return "hi-IN";
  const match = pathname.match(/^\/(fr|es|ar)(\/|$)/);
  if (match) return `${match[1]}-IN`;
  return "en-IN";
}

function withDocumentLang(response: NextResponse, pathname: string): NextResponse {
  response.headers.set("x-document-lang", documentLangForPath(pathname));
  return response;
}

function shouldRunIntlMiddleware(pathname: string): boolean {
  // Static app/hi/* routes (incl. /hi homepage) — skip intl rewrite.
  if (pathname === "/hi" || pathname.startsWith("/hi/")) {
    return false;
  }
  if (/^\/(fr|es|ar)\/contact-us(\/|$)/.test(pathname)) {
    return false;
  }
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
  if (cookie === "1") return false;
  const session = await verifyAdminSessionTokenEdge(cookie, secret);
  return Boolean(session);
}

function withNoIndex(response: NextResponse, pathname: string): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return withDocumentLang(response, pathname);
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
        return withNoIndex(NextResponse.redirect(url), pathname);
      }
    }
    return withNoIndex(NextResponse.next(), pathname);
  }

  if (isRedirectShellPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return withDocumentLang(response, pathname);
  }

  if (!shouldRunIntlMiddleware(pathname)) {
    return withDocumentLang(NextResponse.next(), pathname);
  }

  return withDocumentLang(intlMiddleware(request), pathname);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
