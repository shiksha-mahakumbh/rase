import React from "react";
import Link from "next/link";
import EventImageSlider from "@/components/media/LazyEventImageSlider";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sm24")!;

const eventDetails = {
  title: edition.title,
  introduction: "International Conference on the Indian Education System for Global Development",

  venue: {
    name: " Kurukshetra University",
    address: "Kurukshetra, India",
    date: "16th -17th December 2024",
    description:
      "The Kurukshetra University (KUK) is a renowned educational institution located in Haryana, India. Established in 1956, it was founded by the Late Dr. Rajendra Prasad, the first President of India. Initially named Sanskrit University, it has evolved over the years and has been accredited with an 'A++' grade by the National Assessment and Accreditation Council (NAAC).",
  },
  images: [
    "/2023K/b1.JPG",
    "/2023K/bandaru_dattareya.JPG",
    "/2023K/k1.jpg",
    "/2023K/k2.JPG",
    "/2023K/Shri Aswini Updhaya.JPG",
  ],
};

const galleryBtn =
  "inline-block rounded-xl bg-brand-saffron px-6 py-3 font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white";

const secondaryBtn =
  "inline-block rounded-xl border border-brand-blue/25 bg-white px-6 py-3 font-bold text-brand-blue shadow-sm transition hover:bg-brand-blue/5";

const EventPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <EventImageSlider
          images={eventDetails.images}
          eventTitle={eventDetails.title}
        />
      </div>

      <section className="rounded-2xl border border-brand-blue/15 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">{eventDetails.venue.name}</h2>
        <p className="mt-3 leading-relaxed text-slate-700">{eventDetails.venue.description}</p>
        <p className="mt-3 text-slate-700">
          <strong className="text-brand-navy">Address:</strong> {eventDetails.venue.address}
        </p>
        <p className="text-slate-700">
          <strong className="text-brand-navy">Date:</strong> {eventDetails.venue.date}
        </p>
      </section>

      <section className="rounded-2xl border border-brand-saffron/15 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">Conference Objective</h2>
        <p className="mt-3 leading-relaxed text-slate-700">{eventDetails.introduction}</p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN"
          className={galleryBtn}
        >
          Visit Gallery
        </a>
        <Link href="/wishes-received" className={secondaryBtn}>
          Wishes Received
        </Link>
      </div>
    </div>
  );
};

export default EventPage;
