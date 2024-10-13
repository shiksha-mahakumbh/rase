import React from "react";

const EventPage: React.FC = () => {
  // Sample event data
  const eventDetails = {
    title: "Shiksha MahaKumbh 2024",
    introduction:
      "Shiksha MahaKumbh 2024 is a gathering of thought leaders, educators, and policy makers, focused on the evolution of education in India. This year, we will be exploring innovative strategies for inclusive education and the role of technology in learning.",
    venue: {
      name: "Kumbh Mela Grounds",
      address: "Prayagraj, Uttar Pradesh, India",
      date: "15th - 20th February 2024",
    },
    importantDetails: [
      {
        label: "Keynote Speakers",
        value: "Dr. A.P.J. Abdul Kalam, Prof. Sugata Mitra, Dr. Vandana Shiva",
      },
      {
        label: "Workshops",
        value: "Technology in Education, Holistic Learning, Digital Tools",
      },
      {
        label: "Registration Deadline",
        value: "31st December 2023",
      },
      {
        label: "Contact",
        value: "Email: info@shikshamahakumbh2024.org | Phone: +91 9876543210",
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Event Title */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
          {eventDetails.title}
        </h1>

        {/* Event Introduction */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">{eventDetails.introduction}</p>
        </div>

        {/* Event Venue */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">Venue Details</h2>
          <p className="text-gray-700">
            <strong>Venue:</strong> {eventDetails.venue.name}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {eventDetails.venue.address}
          </p>
          <p className="text-gray-700">
            <strong>Date:</strong> {eventDetails.venue.date}
          </p>
        </div>

        {/* Important Details */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">Important Details</h2>
          <ul className="list-disc pl-5">
            {eventDetails.importantDetails.map((detail, index) => (
              <li key={index} className="text-gray-700 mb-2">
                <strong>{detail.label}:</strong> {detail.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Registration CTA */}
        <div className="text-center">
          <a
            href="#"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
