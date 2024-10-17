import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample event data
const eventDetails = {
  title: "Teacher Development Program in Collaboration with NITTTER",
  introduction: `A dynamic and progressive institution committed to empowering educators, fostering pedagogical innovation, and preparing teachers for excellence in their educational endeavors. VB Institute of Training and Research is conceptualised by Dr Thakur SKR - A Visionary ISRO Scientist and Prominent Social Worker under the guidance of Mr. Vijay Nadda - A Forward Thinking RSS Pracharak and Educationist to develop School Teachers to meet the Challenging Needs of the time. It serves as a guiding light for educators, offering a comprehensive platform that blends advanced teaching methodologies with robust research practices. We are dedicated to shaping teachers who not only impart knowledge effectively but also inspire and guide students towards academic success and holistic development.`,
  venue: {
    name: "National Institute of Technical Teachers Training & Research",
    address: "Chandigarh, India",
    date: "March 12-17, 2024",
    description:
      `In realization of the need for training better quality technicians to meet the large scale industrialization of the country, the ministry of Human Resource Development (the then Ministry of Education), Government of India established four Regional Technical Teachers' Training Institutes (now National Institute of Technical Teachers Training & Research, NITTTR at Bhopal, Chandigarh, Chennai and Kolkata in 1967. The Institute at Chandigarh is one of these four NITTTRs, started in collaboration with Royal Netherlands Government (upto 1974). It was designed to meet the requirements of developing polytechnic education in the northern region covering the states of Jammu and Kashmir, Himachal Pradesh, Punjab, Haryana, Rajasthan, Uttar Pradesh, Uttarakhand, Delhi and Union Territory of Chandigarh. The Institute is registered under the Societies Registration Act, 1860 and is managed by a Board of Governors.

The institute started with long term teachers' training programmes for polytechnic teachers in 1967 and was also entrusted with the responsibility of promoting curriculum development work for the states in the region. To improve the competence of teachers for implementing new curricula designed by this institute, short term courses have been offered since 1967. The institute established a Media Centre in 1981 for preparing print & non-print instructional materials.

The institute also set up the department of Rural Development and the department of Entrepreneurship Development to assist polytechnics in directing their efforts towards training manpower and disseminating information in these areas. The Educational Television and Computer Science departments were established in the year 1981and 1982 respectively. Since 1983, the institute has been guiding and assisting the states in the areas of Educational Planning and Management. Since 1992, the institute started offering Regular Master of Engineering Programmes in (i) Engineering Education and (ii) Manufacturing Technology. In the year 1994, two more courses namely Master of Engineering in Construction Technology and Management and Computer Science and Engineering were added. In the year 1998, two more Master of Engineering Programmes in Instrumentation and Control and Electronics and Communication Engineering were added, and, since 2005, the institute started offering Modular Master of Engineering Programmes in all the above disciplines. All these programmes, being offered for teachers of technical institutions and their administrators, professionals from industry and general candidates, are duly approved by AICTE and affiliated to Panjab University, Chandigarh.

Since June 2001, this institute has been conducting short term courses in various subjects for faculty of Engineering Colleges in addition to organizing AICTE sponsored Induction Training Programmes.

PROGRAMMES AND ACTIVITIES
To achieve its stated objectives, the institute undertakes the following spectrum of activities:

Education and Training Programmes, Curriculum Development, Instructional Material Development, Research and Development, Extension Services, Consultancy in Technical Education and Technology areas

The institute has been recognized as a 'Research Centre' by Panjab University, Chandigarh (in 2006) as well as by Punjab Technical University, Jalandhar (Punjab) (in 2005) for pursuing research work leading to the degree of Doctor of Philosophy i.e. Ph.D.`,
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
