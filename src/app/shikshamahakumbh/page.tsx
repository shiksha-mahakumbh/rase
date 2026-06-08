import PublicPageShell from "@/components/layouts/PublicPageShell";
import MahaKumbh from "../component/MahaKumbh";
import SlideShow from "../component/SlideShow";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function ShikshaMahakumbhPage() {
  const slides = [
    { src: "/2024M/11.jpg", alt: "Shiksha Mahakumbh highlight 1", legend: "" },
    { src: "/2024M/1.jpg", alt: "Shiksha Mahakumbh highlight 2", legend: "" },
    { src: "/2024M/2.jpg", alt: "Shiksha Mahakumbh highlight 3", legend: "" },
    { src: "/2024M/3.jpg", alt: "Shiksha Mahakumbh highlight 4", legend: "" },
  ];

  return (
    <PublicPageShell hero={PAGE_HEROES.shikshaMahakumbh}>
      <SlideShow slides={slides} />
      <MahaKumbh />
    </PublicPageShell>
  );
}
