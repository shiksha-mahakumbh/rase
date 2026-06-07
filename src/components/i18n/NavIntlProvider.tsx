"use client";

import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/i18n/messages/en.json";

/** Scoped intl provider for NavBar language switcher on non-[locale] routes. */
export default function NavIntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
