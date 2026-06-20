"use client";

import Image from "next/image";
import { CtaButton } from "@/components/ui";
import type { CmsArticleCard } from "@/lib/cms/types";
import proceeding1 from "/public/2024M/press2.jpg";
import proceeding2 from "/public/2024M/press1.jpg";
import proceeding3 from "/public/2024M/res/res9.jpg";
import proceeding4 from "/public/2024M/press4.jpg";
import proceeding5 from "/public/2024M/press5.jpg";
import proceeding6 from "/public/2024M/Press7.jpg";

const cardData = [
  {
    title: "Shiksha Mahakumbh 2024 begins at Kurukshetra University",
    description:
      "Human behaviour has indispensable role in Indian education. Entrepreneurship cells must be established in Higher Education.",
    image: proceeding6,
    readLink: "/press/education-summit-coverage",
  },
  {
    title: "राष्ट्रीय शिक्षा नीति से राष्ट्रीय भावना को मिला सम्मानः प्रोफेसर सोमनाथ सचदेवा",
    description:
      "कुवि में डिपार्टमेंट ऑफ होलिस्टिक एजुकेशन तथा केयू के संयुक्त तत्वावधान में दो दिवसीय शिक्षा महाकुंभ का सफल समारोप।",
    image: proceeding5,
    readLink: "/press/national-coverage",
  },
  {
    title: '"हवन रश्म" के साथ शिक्षा महाकुंभ 2.0 का शुरू हुआ काउंटडाउन',
    description:
      'शिक्षा महाकुंभ 2.0 की तैयारियों के अंतर्गत UIET, कुरुक्षेत्र विश्वविद्यालय में "हवन रश्म" का आयोजन।',
    image: proceeding4,
    readLink: "/press/residential-camp-hindi",
  },
  {
    title: "शिक्षा महाकुंभ-2024 (द्वितीय संस्करण)",
    description: "आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम",
    image: proceeding3,
    readLink: "/press/residential-camp-success",
  },
  {
    title: "कुरुक्षेत्र हरियाणा में आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024।",
    description:
      "आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन।",
    image: proceeding1,
    readLink: "/press/shiksha-mahakumbh-4-0",
  },
  {
    title: "Baton Ceremony",
    description:
      "A Grand Start to Shiksha Mahakumbh 2.0: Baton Ceremony Successfully Concluded Kurukshetra, November 20, 2024",
    image: proceeding2,
    readLink: "/press/baton-ceremony-smk-4",
  },
];

export default function PressHub({ articles = [] }: { articles?: CmsArticleCard[] }) {
  const cards =
    articles.length > 0
      ? articles.map((article) => ({
          title: article.title,
          description: article.excerpt ?? "",
          image: article.heroImage ?? "/2024M/Press7.jpg",
          readLink: article.href,
        }))
      : cardData.map((data) => ({
          title: data.title,
          description: data.description,
          image: data.image,
          readLink: data.readLink,
        }));

  return (
    <div>
      <h2 className="home-section-title mb-8 text-center">Latest Press Notes</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((data) => (
          <article
            key={data.readLink}
            className="home-card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                alt={data.title}
                src={data.image}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold text-brand-navy line-clamp-3">
                {data.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
                {data.description}
              </p>
              <div className="mt-4">
                <CtaButton href={data.readLink} variant="secondary" className="w-full">
                  Read Release
                </CtaButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
