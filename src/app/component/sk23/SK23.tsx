import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Shiksha Kumbh 2023",
  introduction: `The Department of Holistic Education, Vidya Bharti, stands at the forefront of a noble mission to promote education rooted in Bhartiya values and culture on a global scale. With unwavering dedication spanning several decades, we have been committed to ensuring the welfare of all through holistic education. This journey has seen the successful launch of the "Shiksha Mahakumbh" initiative, which made its historic debut in June 2023, with the inaugural session held at NIT Jalandhar, marking a momentous stride in our quest to reimagine education.

Owing to the overwhelming demand from educational institutions to host future editions of Shiksha Mahakumbh, we are thrilled to announce that the quota for this groundbreaking initiative has been booked until 2025. However, we recognize the pressing need to reach every corner of our educational ecosystem and maintain the momentum of Shiksha Mahakumbh's transformative impact.

To this end, we introduce "Shiksha Kumbh," a groundbreaking concept designed to complement Shiksha Mahakumbh and ensure that the light of education reaches every institution. The first edition of Shiksha Kumbh is scheduled to take place at NIT Kurukshetra in December 2023. This event represents a focused and area-specific effort, allowing us to concentrate on select groups and address unique challenges while upholding our commitment to holistic and culturally rooted education.

Shiksha Kumbh promises to be a beacon of educational innovation, collaboration, and empowerment, reinforcing our mission to revitalize education and ensure its alignment with India's timeless cultural and philosophical values. We invite you to join us on this incredible journey as we work together to redefine education and ensure the welfare of all.`,

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
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        {/* Event Title */}
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
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
                  className="w-full h-80 object-contain rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

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
