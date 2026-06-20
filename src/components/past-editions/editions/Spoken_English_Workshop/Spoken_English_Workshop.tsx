import React from "react";
import LazySlickSlider from "@/components/carousel/LazySlickSlider";
import WorkshopSlideImage from "@/components/media/WorkshopSlideImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const eventDetails = {
  title: "Spoken English Workshop",
  introduction: `A dynamic and progressive institution committed to empowering educators, fostering pedagogical innovation, and preparing teachers for excellence in their educational endeavors. VB Institute of Training and Research is conceptualised by Dr Thakur SKR - A Visionary ISRO Scientist and Prominent Social Worker under the guidance of Mr. Vijay Nadda - A Forward Thinking RSS Pracharak and Educationist to develop School Teachers to meet the Challenging Needs of the time. It serves as a guiding light for educators, offering a comprehensive platform that blends advanced teaching methodologies with robust research practices. We are dedicated to shaping teachers who not only impart knowledge effectively but also inspire and guide students towards academic success and holistic development.`,
  venue: {
    name: "Gita Niketan, Kurukshetra",
    address: "Kurukshetra, India",
    date: "January 25-31, 2024",
    description:
      `Foundation & Aim : Founded on 21st Jan. 1973 by reverend Madhav Sadashiv Rao Golvalkar and run by Vidya Bharti, an all India educational organisation which runs more than 24,000 schools, Gita Niketan Awasiya Vidyalaya aims at providing quality education based on Indian moral values to the students. Besides having made manifold progress since its inception, the school enjoys the reputation of being a prestigious institution in North India.`,
  },
  images: [
    "/english_event/k1.jpeg",
    "/english_event/k2.jpeg",
    "/english_event/k3.jpeg",
    "/english_event/k4.jpeg",
    "/english_event/k6.jpeg",
  ],
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

const galleryBtn =
  "inline-block rounded-xl bg-brand-saffron px-6 py-3 font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white";

const EventPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <LazySlickSlider settings={sliderSettings} className="w-full">
          {eventDetails.images.map((image, index) => (
            <div key={index} className="flex justify-center">
              <WorkshopSlideImage src={image} alt={`Event Slide ${index + 1}`} />
            </div>
          ))}
        </LazySlickSlider>
      </div>

      <section className="rounded-2xl border border-brand-blue/15 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">{eventDetails.venue.name}</h2>
        <div className="mt-3 max-h-60 overflow-auto">
          <p className="leading-relaxed text-slate-700">{eventDetails.venue.description}</p>
        </div>
        <p className="mt-3 text-slate-700">
          <strong className="text-brand-navy">Address:</strong> {eventDetails.venue.address}
        </p>
        <p className="text-slate-700">
          <strong className="text-brand-navy">Date:</strong> {eventDetails.venue.date}
        </p>
      </section>

      <section className="rounded-2xl border border-brand-saffron/15 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">VB Institute of Training &amp; Research</h2>
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
