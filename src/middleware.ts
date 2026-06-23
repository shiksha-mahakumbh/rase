import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isOpsPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (isRedirectShellPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (!shouldRunIntlMiddleware(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
