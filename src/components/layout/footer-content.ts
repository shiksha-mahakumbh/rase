export interface FooterLogo {
  href: string;
  src: string;
  alt: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

/** Core organizing logos — full partner lists live on homepage partners section. */
export const footerLogos: FooterLogo[] = [
  { href: "https://www.dhe.org.in/", src: "/logo.png", alt: "Department of Holistic Education" },
  { href: "https://www.vidyabharati.org/", src: "/vidyabharti.png", alt: "Vidya Bharati" },
  { href: "https://www.shikshamahakumbh.com/", src: "/shiksha.png", alt: "Shiksha Mahakumbh" },
  { href: "https://www.rase.co.in/", src: "/sLogo.png", alt: "RASE" },
];

export const quickLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Notice Board", href: "/noticeboard" },
  { name: "Past Editions", href: "/past-events" },
  { name: "Introduction", href: "/introduction" },
  { name: "Committees", href: "/committees" },
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
  { name: "My Registration", href: "/dashboard" },
  { name: "Shiksha Mahakumbh 6.0", href: "/upcoming-events" },
  { name: "Downloads", href: "/downloads" },
  { name: "Media Centre", href: "/media-center" },
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
