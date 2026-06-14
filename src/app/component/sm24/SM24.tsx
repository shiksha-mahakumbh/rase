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
            href="https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Visit Gallery
          </a>
        </div>
        {/* wishes recived*/}

        <div className="text-center mb-6">
        <Link
             href="/wishes-received"
             className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Wishes Received
        </Link>
        </div>
        
      </div>
    </div>
  );
};

export default EventPage;
