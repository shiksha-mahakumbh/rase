import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** Only non-default locales use the [locale] segment (see src/app/[locale]/*). */
const NON_DEFAULT_LOCALE_PREFIX = /^\/(hi|fr|es|ar)(\/|$)/;

function shouldRunIntlMiddleware(pathname: string): boolean {
  return NON_DEFAULT_LOCALE_PREFIX.test(pathname);
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
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
