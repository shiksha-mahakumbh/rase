import React from "react";
import EventImageSlider from "@/components/media/LazyEventImageSlider";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sm23")!;

const eventDetails = {
  title: edition.title,
  introduction: `The primary objective of the conference is to create an atmosphere for the implementation of NEP 2020. Further, the conference aims to bring together leading academic scientists, researchers, research scholars, and industry to exchange and share their experiences and research results about all aspects of School Education. It also provides the premier interdisciplinary forum for researchers, practitioners, educators, and industry to present and discuss the most recent innovations, trends, concerns, practical challenges encountered, and the solutions adopted in the field of Global School Education for the sustainable growth of society.`,
  venue: {
    name: "NIT Jalandhar",
    address: "Jalandhar, India",
    date: "9-11th June 2023",
    description:
      "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar (erstwhile REC Jalandhar), was established in the year 1987 and attained the status of National Institute of Technology on October 17, 2002. As a National Institute of Technology, the Institute has a responsibility of providing high-quality technical education in Engineering and Technology to produce competent technical manpower for the country. The Institute offers BTech programs in twelve disciplines of Engineering and Technology along with research programs leading to MSc, MTech, and PhD degrees. The Institute has signed Memorandum of Understanding (MoU) with many prestigious institutes such as Sarvhitkari Educational Society and Ecole Centrale de Lille, France, University of Johannesburg, South Africa along with other Universities abroad including UK, USA, and Canada for the mutual academic exchange program and further strengthening of the academics and research.",
  },
  images: [
    "/2023M/k1.jpeg",
    "/2023M/k1.png",
    "/2023M/k3.jpeg",
    "/2023M/k4.jpeg",
    "/2023M/k6.jpeg",
    "/2023M/k7.jpeg",
    "/2023M/k8.jpeg",
    "/2023M/k9.jpeg",
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
          href="https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq"
          className={galleryBtn}
        >
          Visit Gallery
        </a>
      </div>
    </div>
  );
};

export default EventPage;
