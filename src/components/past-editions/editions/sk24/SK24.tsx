import React from "react";
import EventImageSlider from "@/components/media/LazyEventImageSlider";

const eventDetails = {
  title: "Shiksha Mahakumbh 3.0",
  introduction: `"Role of Academic driven Startups in Economy" is to explore and discuss the crucial role that academic-driven startups play in contributing to the economy. This includes examining how educational institutions, particularly technical and technology-focused institutions, can foster a culture of entrepreneurship and innovation, helping students and society benefit from startup ventures.`,
  objectives: [
    "Highlighting the Importance of Academic-driven Startups: Showcasing the impact that startups originating from academic institutions can have on the economy, job creation, and innovation.",
    "Fostering Collaboration: Encouraging collaboration between educational institutions, government bodies, and industry to create a conducive ecosystem for startups.",
    "Promoting Skill Development: Discussing the relevance of skill education tailored to meet the demands of the modern economy and how academic-driven startups can facilitate this.",
    "Exploring Incubation Support: Evaluating the role of incubation centers in nurturing and shaping academic-driven startups.",
    "Expanding the Reach: Investigating how various educational institutions, including ITIs, schools, NITs, and others, can work together to support and nurture startups.",
    "Rural Development: Exploring the potential for tech institutions to adopt villages and create a startup-friendly atmosphere in rural areas.",
    "Cultivating a Startup Culture: Delving into introducing startup culture at the school level to encourage entrepreneurship from an early age.",
    "Infrastructure Utilization: Discussing how socially grown startups can leverage the infrastructure and resources of educational institutions.",
  ],
  venue: {
    name: "NIT Srinagar",
    address: "Srinagar, India",
    date: "30th June 2024",
    description:
      "The National Institute of Technology, Srinagar, is a prestigious educational institution located in the northern region of India. Established in 1960, it was one of the eighteen Regional Engineering Colleges sponsored by the Government of India during the 2nd Five-Year Plan. In August 2003, the institute gained the status of a National Institute of Technology with deemed-to-be University status and achieved full academic autonomy.",
  },
  images: [
    "/2024K/k1.jpeg",
    "/2024K/k2.jpeg",
    "/2024K/k3.jpg",
    "/2024K/k4.jpg",
    "/2024K/k6.jpg",
    "/2024K/k7.png",
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
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          {eventDetails.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ol>
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
