export interface FooterLogo {
  href: string;
  src: string;
  alt: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export const footerLogos: FooterLogo[] = [
  { href: "https://www.dhe.org.in/", src: "/logo.png", alt: "DHE" },
  { href: "https://www.rase.co.in/", src: "/shiksha.png", alt: "RASE" },
  { href: "https://vidyabharti.net/", src: "/vidyabharti.png", alt: "Vidya Bharti" },
  { href: "https://www.sarvatr.co.in/", src: "/sarvatra.png", alt: "Sarvatr" },
  { href: "https://www.alltemples.org.in/", src: "/holistic.jpeg", alt: "Temple" },
  { href: "https://jobs360degree.com/", src: "/job360.png", alt: "Job360" },
  { href: "https://poojawala.in/", src: "/pooja.png", alt: "Pooja" },
  { href: "https://www.swadeshibazaar.co.in/", src: "/sb.png", alt: "Swadeshi Bazar" },
  { href: "https://tredul.in/", src: "/tre-dul.png", alt: "Tredul" },
  { href: "https://www.itrchandigarh.org/", src: "/logo 2.png", alt: "ITR" },
  { href: "https://vi.rase.co.in/", src: "/vi.png", alt: "Vikas India" },
  { href: "https://tudu.co.in//", src: "/tudu.png", alt: "Tudu" },
  { href: "https://punjabsuper100.com/", src: "/pb100.png", alt: "Punjab Super 100" },
];

export const quickLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Introduction", href: "/introduction" },
  { name: "Registration", href: "/registration" },
  { name: "Journals", href: "/journals" },
  { name: "Proceedings", href: "/proceedings" },
  { name: "Upcoming Events", href: "/upcomingevent" },
  { name: "Past Events", href: "/pastevent" },
  { name: "Media & Press", href: "/media" },
  { name: "Committee", href: "/committeepage" },
  { name: "Contact Us", href: "/ContactUs" },
];

export const programLinks: FooterLink[] = [
  { name: "Academic Council", href: "/VibhagRoute/AcademicCouncil24" },
  { name: "प्रबंधन विभाग (Prabandhan)", href: "/VibhagRoute/Prabandhan24" },
  { name: "प्रचार विभाग (Prachar)", href: "/VibhagRoute/Prachar24" },
  { name: "संपर्क विभाग (Sampark)", href: "/VibhagRoute/Sampark24" },
  { name: "वित्त विभाग (Vitt)", href: "/VibhagRoute/Vitt24" },
  { name: "Conclave", href: "/conclave" },
  { name: "Workshops", href: "/workshops" },
  { name: "Summits", href: "/summits" },
  { name: "Knowledge Hub", href: "/knowledge" },
  { name: "Gallery", href: "/gallery" },
];

export const legalLinks: FooterLink[] = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Sitemap", href: "/sitemap.xml" },
  { name: "Contact Us", href: "/ContactUs" },
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
