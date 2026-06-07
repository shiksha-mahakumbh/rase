"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { DHE_ORGANIZATION } from "@/config/organization";
import { normalizeStaticImageSrc } from "./home/normalizeImageSrc";
import {
  footerLogos,
  quickLinks,
  programLinks,
  legalLinks,
  socialLinks,
} from "./footer-content";
import FooterContactForm from "@/components/footer/FooterContactForm";
import FooterNewsletterSlot from "@/components/footer/FooterNewsletterSlot";
import ScrollToTopButton from "@/components/footer/ScrollToTopButton";

const FooterVisitorCounter = dynamic(
  () => import("@/components/footer/FooterVisitorCounter"),
  { ssr: false, loading: () => null }
);

const socialIconMap = {
  youtube: faYoutube,
  facebook: faFacebook,
  linkedin: faLinkedin,
  instagram: faInstagram,
  x: faXTwitter,
} as const;

const Footer: React.FC = () => {
  const { address, emails, phones, websites, intro, mission, name, abhiyan } =
    DHE_ORGANIZATION;

  return (
    <>
      <footer className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#0f2847] to-brand-navy text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-brand-saffron/8 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl"
        />

        {/* Partner logos */}
        <div className="relative z-10 border-b border-white/10 px-4 py-8 md:px-8">
          <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            Institutional Ecosystem
          </p>
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 md:gap-4">
            {footerLogos.map((logo, i) => (
              <motion.a
                key={i}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-colors hover:border-brand-saffron/40 hover:bg-white/10"
              >
                <Image
                  src={normalizeStaticImageSrc(logo.src)}
                  alt={logo.alt}
                  width={48}
                  height={48}
                  className="h-9 w-auto md:h-11"
                />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Five-column main footer */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {/* Column 1 — About */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Department of Holistic Education logo"
                  width={48}
                  height={48}
                  className="h-11 w-11 rounded-lg bg-white/10 p-1"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-saffron/90">
                    {abhiyan}
                  </p>
                  <h2 className="text-base font-bold leading-tight">{name}</h2>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-300">{intro}</p>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="font-semibold text-brand-saffron/90">Mission: </span>
                {mission}
              </p>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Programs */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron">
                Programs &amp; Activities
              </h3>
              <ul className="space-y-2">
                {programLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contact */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron">
                Contact Information
              </h3>
              <address className="space-y-3 not-italic text-sm leading-relaxed text-gray-300">
                <p>
                  <span className="mb-1 block font-semibold text-white">{name}</span>
                  {address.line1}
                  <br />
                  {address.line2},
                  <br />
                  {address.line3},
                  <br />
                  {address.state} {address.pincode}
                </p>
                <div>
                  <span className="font-semibold text-white/80">Email</span>
                  <ul className="mt-1 space-y-0.5">
                    {emails.slice(0, 2).map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="text-brand-saffron/90 hover:text-brand-saffron hover:underline"
                        >
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-white/80">Phone</span>
                  <ul className="mt-1 space-y-0.5">
                    {phones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="text-brand-saffron/90 hover:text-brand-saffron hover:underline"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-white/80">Website</span>
                  <ul className="mt-1 space-y-0.5">
                    {websites.map((site) => (
                      <li key={site.href}>
                        <a
                          href={site.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-saffron/90 hover:text-brand-saffron hover:underline"
                        >
                          {site.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            </div>

            {/* Column 5 — Social + quick message */}
            <div className="space-y-5">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-saffron">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg transition-all hover:border-brand-saffron/50 hover:bg-brand-saffron/15 hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                    >
                      <FontAwesomeIcon icon={socialIconMap[social.id]} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <h3 className="mb-3 text-sm font-bold text-white">Quick Message</h3>
                <FooterContactForm />
              </div>
            </div>
          </div>

          {/* Newsletter strip */}
          <div className="mt-10">
            <FooterNewsletterSlot />
          </div>
        </div>

        {/* Copyright & legal */}
        <div className="relative z-10 border-t border-white/10 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            <nav
              className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
              aria-label="Legal and policy links"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 transition-colors hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <p className="text-center text-sm text-gray-400">
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
            <p className="mx-auto mt-3 max-w-4xl text-center text-xs leading-relaxed text-gray-500">
              The Microsoft CMT service was used for managing the peer-reviewing
              process for this conference. This service was provided for free by
              Microsoft, and they bore all related expenses, including costs for
              Azure cloud services as well as software development and support.
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
