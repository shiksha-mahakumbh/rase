import React from "react";
import LazySlickSlider from "@/components/carousel/LazySlickSlider";
import WorkshopSlideImage from "@/components/media/WorkshopSlideImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const eventDetails = {
  title: "Innovation and Entrepreneurship for School Students, Teachers, and Atal Tinkering Labs Coordinators",
  introduction: `This workshop aims to foster innovation and entrepreneurship skills among school students, teachers, and coordinators of Atal Tinkering Labs in the tri-city area of Chandigarh, Mohali, and Panchkula. Through insightful sessions, interactive discussions, and hands-on experiences, participants will gain valuable knowledge and inspiration to explore the world of innovation and entrepreneurship from scientists of CSIO, ISRO, DRDO, Industry Experts, Subject Experts, etc.`,
  venue: {
    name: "CSIO Chandigarh",
    address: "CSIO Chandigarh, India",
    date: "10th May 2024",
    description:
      `This workshop aims to foster innovation and entrepreneurship skills among school students, teachers, and coordinators of Atal Tinkering Labs in the tri-city area of Chandigarh, Mohali, and Panchkula. Through insightful sessions, interactive discussions, and hands-on experiences, participants will gain valuable knowledge and inspiration to explore the world of innovation and entrepreneurship from scientists of CSIO, ISRO, DRDO, Industry Experts, Subject Experts, etc.
      **Target Participants**
      - Students (Grades 9-12)
      - ATL Labs Coordinators
      - Science Teachers (TGT & PGT) from Tricity Schools
      
      **Tentative Schedule of Workshop**
      - Session 1: Inaugural Address by Director, CSIO
      - Session 2: Insights into Cutting-Edge Research at CSIO Chandigarh and Opportunities for School Students and Teachers
      - Session 3: Introduction to Innovation and Entrepreneurship
      - Session 4: Interaction Session with Women Entrepreneurs
      - Session 5: Insights into Cutting-Edge Research at DHE Mohali and Opportunities for School Students and Teachers
      - Session 6: Visit of Mechatronics/Electronics Labs at CSIO Chandigarh
      - Session 7: Q&A and Networking`,
  },
  images: [
    "/2023K/b1.webp",
    "/2023K/bandaru_dattareya.webp",
    "/2023K/k1.jpg",
    "/2023K/k2.webp",
    "/2023K/Shri Aswini Updhaya.webp",
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

const EventPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
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
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-700">
          {eventDetails.venue.description}
        </p>
        <p className="mt-3 text-slate-700">
          <strong className="text-brand-navy">Address:</strong> {eventDetails.venue.address}
        </p>
        <p className="text-slate-700">
          <strong className="text-brand-navy">Date:</strong> {eventDetails.venue.date}
        </p>
      </section>

      <section className="rounded-2xl border border-brand-saffron/15 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">Workshop Objective</h2>
        <p className="mt-3 leading-relaxed text-slate-700">{eventDetails.introduction}</p>
      </section>
    </div>
  );
};

export default EventPage;
