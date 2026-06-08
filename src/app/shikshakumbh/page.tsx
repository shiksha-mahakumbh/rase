import PublicPageShell from "@/components/layouts/PublicPageShell";
import Kumbh from "@/app/component/Kumbh";
import SlideShow from "@/app/component/SlideShow";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function ShikshaKumbhPage() {
  const slides = [
    { src: "/2024K/k1.jpeg", alt: "Shiksha Kumbh highlight 1", legend: "" },
    { src: "/2024K/k2.jpeg", alt: "Shiksha Kumbh highlight 2", legend: "" },
    { src: "/2024K/k3.jpg", alt: "Shiksha Kumbh highlight 3", legend: "" },
    { src: "/2024K/k4.jpg", alt: "Shiksha Kumbh highlight 4", legend: "" },
  ];

  return (
    <PublicPageShell hero={PAGE_HEROES.shikshaKumbh}>
      <SlideShow slides={slides} />
      <Kumbh />
    </PublicPageShell>
  );
}
