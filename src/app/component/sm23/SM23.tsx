import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Shiksha MahaKumbh 2023",
  introduction: `The primary objective of the conference is to create an atmosphere for the implementation of NEP 2020. Further, the conference aims to bring together leading academic scientists, researchers, research scholars and industry to exchange and share their experiences and research results about all aspects of School Education. It also provides the premier interdisciplinary forum for researchers, practitioners, educators and industry to present and discuss the most recent innovations, trends, concerns, practical challenges encountered and the solutions adopted in the field of Global School Education for the sustainable growth of the society..`,
  venue: {
    name: "NIT Jalandhar",
    address: "Jalandhar, India",
    date: "9-11th June 2023",
    description:
      "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar (erstwhile REC Jalandhar), was established in the year 1987 and attained the status of National Institute of Technology on October 17, 2002. As National Institute of Technology, the Institute has a responsibility of providing high quality technical education in Engineering and Technology to produce competent technical manpower for the country. The Institute offers BTech programmes in twelve disciplines of Engineering and Technology along with the research programmes leading to MSc, MTech and PhD degrees. The Institute has signed Memorandum of Understanding (MoU) with many prestigious institutes such as Sarvhitkari Educational Society and Ecole Centrale de Lille, France, University of Johannesburg, South Africa along with other Universities abroad including UK, USA and Canada for the mutual academic exchange program and further strengthening of the academics and research.",
  },
  images: [
    "/2023M/k1.jpeg", // Ensure these images exist in the public folder
    "/2023M/k1.png",
    "/2023M/k3.jpeg",
    "/2023M/k4.jpeg", // Ensure these images exist in the public folder
    "/2023M/k6.jpeg",
    "/2023M/k7.jpeg",
    "/2023M/k8.jpeg",
    "/2023M/k9.jpeg",
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
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">

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
          <p className="text-gray-700 leading-relaxed mb-4 text-center text-lg"> {/* Changed to text-lg */}
            {eventDetails.venue.description}
          </p>
          <p className="text-gray-700 text-center text-lg"> {/* Changed to text-lg */}
            <strong>Address:</strong> {eventDetails.venue.address}
          </p>
          <p className="text-gray-700 text-center text-lg"> {/* Changed to text-lg */}
            <strong>Date:</strong> {eventDetails.venue.date}
          </p>
        </div>

        {/* Conference Objective */}
        <div className="bg-white p-6 mb-6">
          <h2 className="text-2xl text-center font-semibold mb-2 text-blue-600">Conference Objective</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"> {/* Keep text-lg */}
            {eventDetails.introduction}
          </p>
        </div>

        {/* Visit Gallery CTA */}
        <div className="text-center mb-6">
          <a
            href="https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq"
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
