import React from "react";
import EventImageSlider from "@/components/media/LazyEventImageSlider";

const eventDetails = {
  title: "Shiksha Mahakumbh 2.0",
  introduction: `Edition 2.0 of the Shiksha Mahakumbh Abhiyan was held at NIT Kurukshetra on 20 December 2023, themed "Role of Academic-driven Startups in Economy." This edition extended the national education movement's reach — connecting academia, entrepreneurship, and economic development through holistic, culturally rooted education.`,

  venue: {
    name: "NIT Kurukshetra",
    address: "Kurukshetra, India",
    date: "20th December 2023",
    description:
      "NIT Kurukshetra is one of the premier technical institutes in the country. Founded in 1963 as Regional Engineering College Kurukshetra, the institute was rechristened as the National Institute of Technology Kurukshetra on June 26, 2002. The institute offers 4-year BTech degree courses in seven engineering streams, 2-year MTech degree courses in 22 areas of specialization of science & technology, and postgraduate courses leading to the degree in MBA and MCA. The infrastructure is geared to enable the institute to run out of technical personnel of high quality. In addition to providing knowledge in various disciplines of engineering and technology at the undergraduate and post-graduate levels, the institute is actively engaged in research activities in emerging areas including Nanotechnology, Ergonomics, Robotics, CAD/CAM, Energy and Environment. The placement record of the institute has been commendable and consistent due to strong vigor and commitment to generating talent.",
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

      <div className="text-center">
        <a
          href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
          className={galleryBtn}
        >
          Visit Gallery
        </a>
      </div>
    </div>
  );
};

export default EventPage;
