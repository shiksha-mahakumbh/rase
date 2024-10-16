import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Shiksha MahaKumbh 2024",
  introduction: `"Role of Academic driven Startups in Economy" is to explore and discuss the crucial role that academic-driven startups play in contributing to the economy. This includes examining how educational institutions, particularly technical and technology-focused institutions, can foster a culture of entrepreneurship and innovation, helping students and society benefit from startup ventures.

    The main objectives of the conference include:
    1. Highlighting the Importance of Academic-driven Startups: Showcasing the impact that startups originating from academic institutions can have on the economy, job creation, and innovation.
    2. Fostering Collaboration: Encouraging collaboration between educational institutions, government bodies, and industry to create a conducive ecosystem for startups.
    3. Promoting Skill Development: Discussing the relevance of skill education tailored to meet the demands of the modern economy and how academic-driven startups can facilitate this.
    4. Exploring Incubation Support: Evaluating the role of incubation centers in nurturing and shaping academic-driven startups.
    5. Expanding the Reach: Investigating how various educational institutions, including ITIs, schools, NITs, and others, can work together to support and nurture startups.
    6. Rural Development: Exploring the potential for tech institutions to adopt villages and create a startup-friendly atmosphere in rural areas.
    7. Cultivating a Startup Culture: Delving into introducing startup culture at the school level to encourage entrepreneurship from an early age.
    8. Infrastructure Utilization: Discussing how socially grown startups can leverage the infrastructure and resources of educational institutions.`,
  venue: {
    name: "NIT Srinagar",
    address: "Srinagar, India",
    date: "30th June 2024",
    description:
      "The National Institute of Technology, Srinagar, is a prestigious educational institution located in the northern region of India. Established in 1960, it was one of the eighteen Regional Engineering Colleges sponsored by the Government of India during the 2nd Five-Year Plan. In August 2003, the institute gained the status of a National Institute of Technology with deemed-to-be University status and achieved full academic autonomy.",
  },
  images: [
    "/2024K/k1.jpeg", // Ensure these images exist in the public folder
    "/2024K/k2.jpeg",
    "/2024K/k3.jpg",
    "/2024K/k4.jpg", // Ensure these images exist in the public folder
    "/2024K/k6.jpg",
    "/2024K/k7.png",
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
