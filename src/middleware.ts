import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { routing } from "@/i18n/routing";
import { verifyAdminSessionTokenEdge } from "@/lib/security/admin-session-edge";
import { isManageOnlyPath } from "@/components/admin/cms/admin-nav";
import {
  canAccessManagePath,
  canPerformCheckIn,
} from "@/lib/admin-role-capabilities";
import type { AdminRole } from "@/types/registration";
import { isRedirectShellPath } from "@/lib/knowledge-graph/site-cleanup";
import { legacyCaseAliasDestination } from "@/config/legacy-case-aliases";

const intlMiddleware = createIntlMiddleware(routing);
const NEXT_INTL_LOCALE_HEADER = "x-next-intl-locale";

/** Retired accidental duplicate-folder URLs (Windows copy paths). */
const GONE_COPY_PATH =
  /\/(participantregistrationdatadekh|ngoregistrationdatadekh)(%20|\s)copy\/?$/i;

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
  response.headers.set("x-pathname", pathname);
  return response;
}

function withHiIntlLocale(request: NextRequest, pathname: string): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NEXT_INTL_LOCALE_HEADER, "hi");
  return withDocumentLang(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
    pathname
  );
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

async function getAdminSession(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookie || !secret) return null;
  if (cookie === "1") return null;
  return verifyAdminSessionTokenEdge(cookie, secret);
}

function withNoIndex(response: NextResponse, pathname: string): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return withDocumentLang(response, pathname);
}

function isMaintenanceExempt(pathname: string): boolean {
  if (pathname === "/maintenance" || pathname.startsWith("/maintenance/")) return true;
  if (isOpsPath(pathname)) return true;
  return false;
}

async function isMaintenanceMode(request: NextRequest): Promise<boolean> {
  try {
    const url = new URL("/api/v2/settings/maintenance", request.nextUrl.origin);
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return false;
    const data = (await res.json()) as { maintenanceMode?: boolean };
    return Boolean(data.maintenanceMode);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (GONE_COPY_PATH.test(pathname)) {
    return new NextResponse("This URL has been permanently removed.", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const caseAlias = legacyCaseAliasDestination(pathname);
  if (caseAlias) {
    const url = request.nextUrl.clone();
    url.pathname = caseAlias;
    return withDocumentLang(NextResponse.redirect(url, 308), pathname);
  }

  if (!isMaintenanceExempt(pathname) && (await isMaintenanceMode(request))) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    url.search = "";
    return withDocumentLang(NextResponse.redirect(url), pathname);
  }

  if (isOpsPath(pathname)) {
    if (!isAdminLoginLanding(pathname) && !pathname.startsWith("/api/")) {
      const session = await getAdminSession(request);
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.searchParams.set("next", pathname);
        return withNoIndex(NextResponse.redirect(url), pathname);
      }

      const role = session.role as AdminRole;
      const isCheckInPath =
        pathname === "/event/checkin" || pathname.startsWith("/event/checkin/");
      if (isCheckInPath && !canPerformCheckIn(role)) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/cms";
        return withNoIndex(NextResponse.redirect(url), pathname);
      }

      if (isManageOnlyPath(pathname) && !canAccessManagePath(role)) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/cms";
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
    if (pathname === "/hi" || pathname.startsWith("/hi/")) {
      return withHiIntlLocale(request, pathname);
    }
    return withDocumentLang(NextResponse.next(), pathname);
  }

  return withDocumentLang(intlMiddleware(request), pathname);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
