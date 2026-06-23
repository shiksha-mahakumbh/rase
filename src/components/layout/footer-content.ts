export interface FooterLogo {
  href: string;
  src: string;
  alt: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

/** Core organizing + ecosystem logos (compact footer strip). */
export const footerLogos: FooterLogo[] = [
  { href: "https://www.dhe.org.in/", src: "/logo.png", alt: "Department of Holistic Education" },
  { href: "https://www.shikshamahakumbh.com/", src: "/shiksha.png", alt: "Shiksha Mahakumbh" },
  { href: "https://www.vidyabharati.org/", src: "/vidyabharti.png", alt: "Vidya Bharati" },
  { href: "https://www.rase.co.in/", src: "/sLogo.png", alt: "RASE" },
  { href: "https://www.sarvatr.co.in/", src: "/sarvatra.png", alt: "Sarvatr" },
  { href: "https://www.swadeshibazaar.co.in/", src: "/sb.png", alt: "Swadeshi Bazaar" },
];

export const quickLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Registration", href: "/registration" },
  { name: "Shiksha Mahakumbh 6.0", href: "/upcoming-events" },
  { name: "Notice Board", href: "/noticeboard" },
  { name: "Downloads", href: "/downloads" },
  { name: "Past Editions", href: "/past-events" },
  { name: "Introduction", href: "/introduction" },
  { name: "Committees", href: "/committees" },
  { name: "Speakers", href: "/speakers/directory" },
  { name: "Media Centre", href: "/media-center" },
  { name: "Press Releases", href: "/press" },
  { name: "Merchandise", href: "/merchandise" },
  { name: "Contact Us", href: "/contact-us" },
];

export const departmentLinks: FooterLink[] = [
  { name: "Academic Council", href: "/departments/academic-council" },
  { name: "प्रबंधन (Prabandhan)", href: "/departments/prabandhan" },
  { name: "प्रचार (Prachar)", href: "/departments/prachar" },
  { name: "संपर्क (Sampark)", href: "/departments/sampark" },
  { name: "वित्त (Vitt)", href: "/departments/vitt" },
];

export const educationLinks: FooterLink[] = [
  { name: "Publications", href: "/publications" },
  { name: "Proceedings", href: "/proceedings" },
  { name: "Books", href: "/books" },
  { name: "Journals", href: "https://pub.dhe.org.in/" },
  { name: "Speakers Directory", href: "/speakers/directory" },
];

export const programLinks: FooterLink[] = [
  { name: "Register for SMK 6.0", href: "/registration" },
  { name: "Upcoming Events", href: "/upcoming-events" },
  { name: "Conclaves", href: "/conclave" },
  { name: "Workshops", href: "/workshops" },
  { name: "Gallery", href: "/gallery" },
  { name: "Best Wishes", href: "/best-wishes" },
];

export const legalLinks: FooterLink[] = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Sitemap", href: "/sitemap.xml" },
];

export const socialLinks = [
  {
    id: "youtube",
    href: "https://www.youtube.com/@ShikshaMahakumbh",
    label: "YouTube",
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/shikshamahakumbh?mibextid=ZbWKwL",
    label: "Facebook",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283",
    label: "LinkedIn",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/shikshamahakumbh/profilecard",
    label: "Instagram",
  },
  {
    id: "x",
    href: "https://x.com/shikshamahakumb",
    label: "X (Twitter)",
  },
] as const;
