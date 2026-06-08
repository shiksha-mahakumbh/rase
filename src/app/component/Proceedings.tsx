"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import proceeding1 from "/public/proceeding1.jpg";
import proceeding2 from "/public/proceeding2.jpg";
import proceeding3 from "/public/proceeding3.jpg";

const cardData = [
  {
    title: "RASE 2023 1st Edition",
    description: "Click on the buttons below to preview, download, or read the proceedings.",
    image: proceeding2,
    previewLink: "/Proceeding2.pdf",
    downloadLink: "/Proceeding2.pdf",
    readLink: "/proceeding2",
  },
  {
    title: "RASE 2023 2nd Edition",
    description: "Click on the buttons below to preview, download, or read the proceedings.",
    image: proceeding1,
    previewLink: "/Proceeding1.pdf",
    downloadLink: "/Proceeding1.pdf",
    readLink: "/proceeding1",
  },
  {
    title: "RASE 2024 3rd Edition",
    description: "Click on the buttons below to preview, download, or read the proceedings.",
    image: proceeding3,
    previewLink: "/Proceeding3.pdf",
    downloadLink: "/Proceeding3.pdf",
    readLink: "/proceeding3",
  },
];

const Proceedings: React.FC = () => {
  const downloadProceedings = (downloadLink: string) => {
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = downloadLink.substring(downloadLink.lastIndexOf("/") + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-bold text-brand-navy md:text-3xl">
        Proceedings Volumes
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cardData.map((data, index) => (
          <article
            key={index}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="relative aspect-video w-full">
              <Image
                alt={data.title}
                src={data.image}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-bold text-brand-navy">{data.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">{data.description}</p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={data.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                >
                  Preview
                </a>
                <button
                  type="button"
                  onClick={() => downloadProceedings(data.downloadLink)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                >
                  Download
                </button>
                <Link
                  href={data.readLink}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-navy/20 px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                >
                  Read Online
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default Proceedings;
