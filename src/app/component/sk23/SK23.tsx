import React from "react";
import EventImageSlider from "@/components/media/LazyEventImageSlider";

// Sample event data
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

const EventPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        {/* Event Title */}
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          {eventDetails.title}
        </h1>

        {/* Slider with Images */}
        <EventImageSlider
          images={eventDetails.images}
          eventTitle={eventDetails.title}
        />

        {/* Event Venue */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center text-blue-600">
            {eventDetails.venue.name}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-center text-base text-justify">
            {eventDetails.venue.description}
          </p>
          <p className="text-gray-700 text-center text-base">
            <strong>Address:</strong> {eventDetails.venue.address}
          </p>
          <p className="text-gray-700 text-center text-base">
            <strong>Date:</strong> {eventDetails.venue.date}
          </p>
        </div>

        {/* Conference Objective */}
        <div className="mb-6">
          <h2 className="text-xl text-center font-semibold mb-4 text-blue-600">
            Conference Objective
          </h2>
          <p className="text-gray-700 text-base leading-relaxed text-justify whitespace-pre-wrap">
            {eventDetails.introduction}
          </p>
        </div>

        {/* Visit Gallery CTA */}
        <div className="text-center mb-6">
          <a
            href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Visit Gallery
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
