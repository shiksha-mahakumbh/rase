"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DHE_ORGANIZATION } from "@/config/organization";
import { impactStatistics } from "@/data/authority";
import {
  CORE_FOOTER_LOGOS,
  departmentLinks,
  educationLinks,
  legalLinks,
  programLinks,
  resolveCopyrightLine,
  resolveFooterOrgName,
  resolveFooterQuickLinks,
  resolveFooterSocialLinks,
  resolveFooterTagline,
  resolveSafeLogoHref,
  safeWebsiteLinks,
  type FooterLink,
} from "@/data/default-footer";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";
import { resolveNavHref } from "@/lib/security/safe-nav-url";
import { useCms } from "@/lib/cms/context";
import type { CmsMenu, CmsSiteSettings } from "@/lib/cms/types";

const FooterContactForm = dynamic(
  () => import("@/components/footer/FooterContactForm"),
  { ssr: false, loading: () => <p className="text-sm text-slate-400">Loading form…</p> }
);
import FooterNewsletterSlot from "@/components/footer/FooterNewsletterSlot";

const ScrollToTopButton = dynamic(
  () => import("@/components/footer/ScrollToTopButton"),
  { ssr: false }
);

const FooterVisitorCounter = dynamic(
  () => import("@/components/footer/FooterVisitorCounter"),
  { ssr: false, loading: () => null }
);

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => {
          const nav = resolveNavHref(link.href);
          const className =
            "text-sm text-slate-600 transition-colors hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron";

          return (
            <li key={`${title}-${link.href}`}>
              {nav.external ? (
                <a
                  href={nav.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.name}
                </a>
              ) : (
                <Link href={nav.href} className={className}>
                  {link.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const Footer: React.FC = () => {
  const cms = useCms();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const [fetched, setFetched] = useState<{
    settings: CmsSiteSettings | null;
    footerMenu: CmsMenu | null;
  } | null>(null);

  useEffect(() => {
    if (cms?.settings && cms?.footerMenu) return;
    const localeQuery = `locale=${locale}`;
    Promise.all([
      fetch(`/api/v2/settings?${localeQuery}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/v2/menus?type=footer&${localeQuery}`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([settingsRes, menuRes]) => {
        setFetched({
          settings: settingsRes?.settings ?? cms?.settings ?? null,
          footerMenu: menuRes?.menu ?? cms?.footerMenu ?? null,
        });
      })
      .catch(() => null);
  }, [cms?.settings, cms?.footerMenu, locale]);

  const settings = cms?.settings ?? fetched?.settings ?? null;
  const footerMenu = cms?.footerMenu ?? fetched?.footerMenu ?? null;
  const { address, emails, phones, websites, mission, abhiyan, unitOf } = DHE_ORGANIZATION;

  const orgName = resolveFooterOrgName(settings);
  const tagline = resolveFooterTagline(settings) ?? unitOf;
  const copyrightLine = resolveCopyrightLine(settings, new Date().getFullYear());

  const cmsPhones = Array.isArray(settings?.phoneNumbers)
    ? (settings.phoneNumbers as string[])
    : null;
  const cmsEmails = settings?.contactEmail
    ? ([settings.contactEmail, settings.supportEmail].filter(Boolean) as string[])
    : null;
  const displayPhones = cmsPhones?.length ? cmsPhones : phones;
  const displayEmails = cmsEmails?.length ? cmsEmails : emails;
  const displayWebsites = safeWebsiteLinks([...websites]);

  const mergedSocial = resolveFooterSocialLinks(settings?.socialLinks);
  const footerQuickLinks = resolveFooterQuickLinks(footerMenu);
  const footerStats = impactStatistics.slice(0, 4);

  return (
    <>
      <footer className="relative overflow-hidden border-t border-brand-saffron/20">
        <div className="relative bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-6 md:px-8 md:py-8">
          <div className="brand-grid-pattern pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {footerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-brand-saffron/20 bg-white px-3 py-2.5 text-center shadow-sm md:px-4 md:py-3"
              >
                <p className="text-xl font-extrabold text-brand-saffron md:text-3xl">
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-slate-100 bg-white px-4 py-5 md:px-8 md:py-6">
          <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">
            Institutional Ecosystem
          </p>
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 md:gap-3">
            {CORE_FOOTER_LOGOS.map((logo) => {
              const safeHref = resolveSafeLogoHref(logo.href);
              const image = (
                <Image
                  src={normalizeStaticImageSrc(logo.src)}
                  alt={logo.alt}
                  width={48}
                  height={48}
                  className="h-8 w-auto md:h-10"
                />
              );

              if (!safeHref) {
                return (
                  <div
                    key={`${logo.href}-${logo.src}`}
                    className="rounded-lg border border-slate-200 bg-brand-surface-warm p-2"
                  >
                    {image}
                  </div>
                );
              }

              return (
                <a
                  key={`${logo.href}-${logo.src}`}
                  href={safeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 bg-brand-surface-warm p-2 transition-all hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md"
                >
                  {image}
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            <Link href="/#conference-support" className="font-semibold text-brand-navy hover:text-brand-saffron">
              View all academic, media &amp; sponsor affiliations
            </Link>
          </p>
        </div>

        <div className="bg-brand-surface-warm px-4 py-10 md:px-8 md:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-8">
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
              <div className="mb-4 flex items-start gap-3">
                <Image
                  src="/logo.png"
                  alt="Department of Holistic Education"
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-xl border border-brand-saffron/30 bg-white object-contain p-1 shadow-sm"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-saffron-dark">
                    {abhiyan}
                  </p>
                  <p className="text-base font-bold leading-tight text-brand-navy">{orgName}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{tagline}</p>
                </div>
              </div>
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
                    aria-label={social.shortLabel}
                    title={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-saffron/30 bg-white text-brand-navy transition-all hover:border-brand-saffron hover:bg-brand-saffron/10 hover:text-brand-saffron-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                  >
                    <span className="text-xs font-bold">
                      {social.shortLabel}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <FooterLinkList title="Quick Links" links={footerQuickLinks} />
            <FooterLinkList title="Departments" links={departmentLinks} />
            <FooterLinkList title="Education & Research" links={educationLinks} />
            <FooterLinkList title="Programs" links={programLinks} />
          </div>

          <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-8">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
              Contact
            </h3>
            <address className="not-italic">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-sm leading-relaxed text-slate-600">
                  <span className="mb-1 block font-semibold text-brand-navy">Address</span>
                  {address.line1}
                  <br />
                  {address.line2}, {address.line3}
                  <br />
                  {address.state} {address.pincode}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-brand-navy">Email</span>
                  <ul className="mt-1 space-y-0.5">
                    {displayEmails.slice(0, 2).map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="inline-flex min-h-11 items-center break-all py-1 text-brand-blue hover:underline"
                        >
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-brand-navy">Phone</span>
                  <ul className="mt-1 space-y-0.5">
                    {displayPhones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="inline-flex min-h-11 items-center py-1 text-brand-blue hover:underline"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {displayWebsites.length > 0 && (
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-brand-navy">Websites</span>
                    <ul className="mt-1 space-y-0.5">
                      {displayWebsites.map((site) => (
                        <li key={site.href}>
                          <a
                            href={site.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center py-1 text-brand-blue hover:underline"
                          >
                            {site.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </address>
          </div>

          <div className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-brand-navy">Quick Message</h3>
              <FooterContactForm variant="light" />
            </div>
            <FooterNewsletterSlot />
          </div>
        </div>

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
            <p className="text-center text-sm text-white/80">{copyrightLine}</p>
            <p className="mx-auto mt-3 max-w-4xl text-center text-xs leading-relaxed text-white/70">
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
