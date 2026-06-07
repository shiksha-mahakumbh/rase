import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale, localePrefix } from "./config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix,
});

export type AppLocale = (typeof routing.locales)[number];
