import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Spoken English Workshop",
  introduction: `A dynamic and progressive institution committed to empowering educators, fostering pedagogical innovation, and preparing teachers for excellence in their educational endeavors. VB Institute of Training and Research is conceptualised by Dr Thakur SKR - A Visionary ISRO Scientist and Prominent Social Worker under the guidance of Mr. Vijay Nadda - A Forward Thinking RSS Pracharak and Educationist to develop School Teachers to meet the Challenging Needs of the time. It serves as a guiding light for educators, offering a comprehensive platform that blends advanced teaching methodologies with robust research practices. We are dedicated to shaping teachers who not only impart knowledge effectively but also inspire and guide students towards academic success and holistic development.`,
  venue: {
    name: "	Gita Niketan, Kurukshetra",
    address: "Kurukshetra, India",
    date: "January 25-31, 2024",
    description:
      `Foundation & Aim : Founded on 21st Jan. 1973 by reverend Madhav Sadashiv Rao Golvalkar and run by Vidya Bharti, an all India educational organisation which runs more than 24,000 schools, Gita Niketan Awasiya Vidyalaya aims at providing quality education based on Indian moral values to the students. Besides having made manifold progress since its inception, the school enjoys the reputation of being a prestigious institution in North India.`,
  },
  images: [
    "/english_event/k1.jpeg", // Ensure these images exist in the public folder
    "/english_event/k2.jpeg",
    "/english_event/k3.jpeg",
    "/english_event/k4.jpeg", // Ensure these images exist in the public folder
    "/english_event/k6.jpeg",
    
  ],
};

const EventPage: React.FC = () => {
  // Slider settings
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

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl"> {/* Set a max width for centering content */}
        {/* Event Title Above the Slider */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4 p-4 border-b-2 border-blue-300">
          {eventDetails.title}
        </h1>

        {/* Slider with Images */}
        <div className="mb-6">
          <Slider {...sliderSettings} className="w-full">
            {eventDetails.images.map((image, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={image}
                  alt={`Event Slide ${index + 1}`}
                  className="w-full h-80 object-contain rounded-lg" // Use object-contain for optimal fitting
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Event Venue */}
        <div className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-center text-blue-600">{eventDetails.venue.name}</h2>
          <div className="overflow-auto max-h-60"> {/* Added overflow-auto for scrolling */}
            <p className="text-gray-700 leading-relaxed mb-4 text-center text-lg"> {/* Increased font size to text-lg */}
              {eventDetails.venue.description}
            </p>
          </div>
          <p className="text-gray-700 text-center text-lg"> {/* Increased font size to text-lg */}
            <strong>Address:</strong> {eventDetails.venue.address}
          </p>
          <p className="text-gray-700 text-center text-lg"> {/* Increased font size to text-lg */}
            <strong>Date:</strong> {eventDetails.venue.date}
          </p>
        </div>

        {/* Conference Objective */}
        <div className="bg-white p-6 mb-6">
          <h2 className="text-2xl text-center font-semibold mb-2 text-blue-600">VB INSTITUTE OF TRAINING & RESEARCH</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"> {/* Increased font size to text-lg */}
            {eventDetails.introduction}
          </p>
        </div>

        {/* Visit Gallery CTA */}
        <div className="text-center mb-6">
          <a
            href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Visit Gallery
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
