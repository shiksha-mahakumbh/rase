import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_DATA_ROUTE_PREFIXES } from "@/constants/routes";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** Only non-default locales use the [locale] segment (see src/app/[locale]/*). */
const NON_DEFAULT_LOCALE_PREFIX = /^\/(hi|fr|es|ar)(\/|$)/;

function shouldRunIntlMiddleware(pathname: string): boolean {
  return NON_DEFAULT_LOCALE_PREFIX.test(pathname);
}

const NOINDEX_PATH_PREFIXES = [
  "/admin",
  "/AllData",
  "/noticeboarddata",
  ...PROTECTED_DATA_ROUTE_PREFIXES.filter((p) => p !== "/admin"),
];

function isProtectedDataPath(pathname: string): boolean {
  return PROTECTED_DATA_ROUTE_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`) ||
      pathname.startsWith(prefix)
  );
}

function shouldNoIndex(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedDataPath(pathname)) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const response = NextResponse.next();
      if (shouldNoIndex(pathname)) {
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
      }
      return response;
    }

    const hasSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "1";

    if (!hasSession) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (!shouldRunIntlMiddleware(pathname)) {
    const response = NextResponse.next();
    if (shouldNoIndex(pathname)) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  }

  const intlResponse = intlMiddleware(request);

  if (shouldNoIndex(pathname)) {
    intlResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/AllData",
    "/participantregistrationdatadekh/:path*",
    "/volunteerdatadekh/:path*",
    "/volunteerregistrationdatadekh/:path*",
    "/ngoregistrationdatadekh/:path*",
    "/abstractdatadekh/:path*",
    "/fulllengthdatadekh/:path*",
    "/fulllengthpaperdatadekh/:path*",
    "/organiserdatadekh/:path*",
    "/schooldata/:path*",
    "/Talentdata/:path*",
    "/Conclavedata/:path*",
    "/Bestpracticedata/:path*",
    "/accomodationdata/:path*",
    "/DelegateForm/:path*",
    "/heiprojectregistrationdata/:path*",
  ],
};
