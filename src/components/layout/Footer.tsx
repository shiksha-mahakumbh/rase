"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DHE_ORGANIZATION } from "@/config/organization";
import { impactStatistics } from "@/data/authority";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";
import {
  footerLogos,
  quickLinks,
  departmentLinks,
  educationLinks,
  programLinks,
  legalLinks,
  socialLinks,
} from "@/components/layout/footer-content";
import { useCms } from "@/lib/cms/context";
import type { CmsMenu, CmsSiteSettings } from "@/lib/cms/types";

const FooterContactForm = dynamic(
  () => import("@/components/footer/FooterContactForm"),
  { ssr: false, loading: () => <p className="text-sm text-gray-400">Loading form…</p> }
);
import FooterNewsletterSlot from "@/components/footer/FooterNewsletterSlot";
import ScrollToTopButton from "@/components/footer/ScrollToTopButton";
import RecaptchaScript from "@/components/security/RecaptchaProvider";

const FooterVisitorCounter = dynamic(
  () => import("@/components/footer/FooterVisitorCounter"),
  { ssr: false, loading: () => null }
);

const socialLabels: Record<string, string> = {
  youtube: "YT",
  facebook: "f",
  linkedin: "in",
  instagram: "IG",
  x: "X",
};

function FooterLinkList({
  title,
  links,
  light = true,
}: {
  title: string;
  links: { name: string; href: string }[];
  light?: boolean;
}) {
  return (
    <div>
      <h3
        className={`mb-4 text-sm font-bold uppercase tracking-wider ${
          light ? "text-brand-saffron-dark" : "text-brand-saffron"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={
                light
                  ? "text-sm text-slate-600 transition-colors hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                  : "text-sm text-gray-300 transition-colors hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
              }
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer: React.FC = () => {
  const cms = useCms();
  const [fetched, setFetched] = useState<{
    settings: CmsSiteSettings | null;
    footerMenu: CmsMenu | null;
  } | null>(null);

  useEffect(() => {
    if (cms?.settings || cms?.footerMenu) return;
    Promise.all([
      fetch("/api/v2/settings").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/v2/menus?type=footer").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([settingsRes, menuRes]) => {
        setFetched({
          settings: settingsRes?.settings ?? null,
          footerMenu: menuRes?.menu ?? null,
        });
      })
      .catch(() => null);
  }, [cms]);

  const settings = cms?.settings ?? fetched?.settings ?? null;
  const footerMenu = cms?.footerMenu ?? fetched?.footerMenu ?? null;
  const { address, emails, phones, websites, intro, mission, name, abhiyan } =
    DHE_ORGANIZATION;

  const cmsPhones = Array.isArray(settings?.phoneNumbers)
    ? (settings.phoneNumbers as string[])
    : null;
  const cmsEmails = settings?.contactEmail
    ? [settings.contactEmail, settings.supportEmail].filter(Boolean) as string[]
    : null;
  const displayPhones = cmsPhones?.length ? cmsPhones : phones;
  const displayEmails = cmsEmails?.length ? cmsEmails : emails;

  const cmsSocial = settings?.socialLinks ?? {};
  const mergedSocial: Array<{ id: string; href: string; label: string }> =
    Object.keys(cmsSocial).length
      ? Object.entries(cmsSocial).map(([key, url]) => ({
          id: key,
          href: url,
          label: socialLabels[key] ?? key,
        }))
      : [...socialLinks];

  const footerQuickLinks = footerMenu?.items?.length
    ? footerMenu.items.map((i) => ({ name: i.label, href: i.url }))
    : quickLinks;

  const footerStats = impactStatistics.slice(0, 4);

  return (
    <>
      <RecaptchaScript />
      <footer className="relative overflow-hidden border-t border-brand-saffron/20">
        {/* Impact statistics — warm strip */}
        <div className="relative bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-8 md:px-8">
          <div className="brand-grid-pattern pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
            {footerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-brand-saffron/20 bg-white px-4 py-3 text-center shadow-sm"
              >
                <p className="text-2xl font-extrabold text-brand-saffron md:text-3xl">
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner logos */}
        <div className="border-b border-slate-100 bg-white px-4 py-8 md:px-8">
          <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">
            Institutional Ecosystem
          </p>
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 md:gap-4">
            {footerLogos.map((logo, i) => (
              <a
                key={i}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-200 bg-brand-surface-warm p-2 transition-all hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md"
              >
                <Image
                  src={normalizeStaticImageSrc(logo.src)}
                  alt={logo.alt}
                  width={48}
                  height={48}
                  className="h-9 w-auto md:h-11"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Main footer grid — light */}
        <div className="bg-brand-surface-warm px-4 py-12 md:px-8 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-8">
            <div className="sm:col-span-2 xl:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="/branding/shiksha-mahakumbh-brand-hero.png"
                  alt="Shiksha Mahakumbh Abhiyan"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl border border-brand-saffron/30 object-cover object-left-top shadow-sm"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-saffron-dark">
                    {abhiyan}
                  </p>
                  <h2 className="text-base font-bold leading-tight text-brand-navy">{name}</h2>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">{intro}</p>
              <p className="text-sm leading-relaxed text-slate-500">
                <span className="font-semibold text-brand-blue">Mission: </span>
                {mission}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {mergedSocial.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-saffron/30 bg-white text-brand-navy transition-all hover:border-brand-saffron hover:bg-brand-saffron/10 hover:text-brand-saffron-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                  >
                    <span className="text-xs font-bold" aria-hidden>
                      {socialLabels[social.id] ?? social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <FooterLinkList title="Quick Links" links={footerQuickLinks} />
            <FooterLinkList title="Departments" links={departmentLinks} />
            <FooterLinkList title="Education & Research" links={educationLinks} />
            <FooterLinkList title="Programs" links={programLinks} />

            <div className="sm:col-span-2 xl:col-span-1">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
                Contact
              </h3>
              <address className="space-y-3 not-italic text-sm leading-relaxed text-slate-600">
                <p>
                  <span className="mb-1 block font-semibold text-brand-navy">{name}</span>
                  {address.line1}
                  <br />
                  {address.line2},
                  <br />
                  {address.line3},
                  <br />
                  {address.state} {address.pincode}
                </p>
                <div>
                  <span className="font-semibold text-brand-navy">Email</span>
                  <ul className="mt-1 space-y-0.5">
                    {displayEmails.slice(0, 2).map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="break-all text-brand-blue hover:underline"
                        >
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-brand-navy">Phone</span>
                  <ul className="mt-1 space-y-0.5">
                    {displayPhones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="text-brand-blue hover:underline"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-brand-navy">Websites</span>
                  <ul className="mt-1 space-y-0.5">
                    {websites.map((site) => (
                      <li key={site.href}>
                        <a
                          href={site.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          {site.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-brand-navy">Quick Message</h3>
              <FooterContactForm />
            </div>
            <FooterNewsletterSlot />
          </div>
        </div>

        {/* Copyright — compact navy bar */}
        <div className="bg-brand-navy px-4 py-6 text-white md:px-8">
          <div className="mx-auto max-w-7xl">
            <nav
              className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
              aria-label="Legal and policy links"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 transition-colors hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <p className="text-center text-sm text-white/80">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.dhe.org.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-saffron hover:text-white"
              >
                Shiksha Mahakumbh Abhiyan
              </a>
              . All Rights Reserved.
            </p>
            <p className="mx-auto mt-3 max-w-4xl text-center text-xs leading-relaxed text-white/50">
              The Microsoft CMT service was used for managing the peer-reviewing process for this
              conference. This service was provided for free by Microsoft, and they bore all related
              expenses, including costs for Azure cloud services as well as software development and
              support.
            </p>
            <div className="mt-4 flex justify-center">
              <FooterVisitorCounter />
            </div>
          </div>
        </div>
      </footer>
      <ScrollToTopButton />
    </>
  );
};

export default Footer;
