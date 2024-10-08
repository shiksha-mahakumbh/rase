import React from "react";
import Link from "next/link";

// Define the table data as an array of objects
const pastEvents = [
  {
    title: "Role of Academic-driven Startups in Developing Economy of J&K",
    date: "June 29-30, 2024",
    venue: "National Institute of Technology Srinagar",
    link: "https://sk24.rase.co.in",
  },
  {
    title:
      "Innovation and Entrepreneurship for School Students, Teachers and Atal Tinkering Labs Co-ordinators",
    date: "May 10, 2024",
    venue: "CSIO Chandigarh",
    link: "https://www.dhe.org.in/workshop",
  },
  {
    title: "Teacher Development Program in Collaboration with NITTTER",
    date: "March 12-17, 2024",
    venue: "NITTTER Chandigarh",
    link: "https://www.itrchandigarh.org/",
  },
  {
    title: "Spoken English Workshop",
    date: "January 25-31, 2024",
    venue: "Gita Niketan, Kurukshetra",
    link: "https://www.itrchandigarh.org/",
  },
  {
    title: "Role of Academic-driven Startups in Economy",
    date: "December 20, 2023",
    venue: "National Institute of Technology Kurukshetra",
    link: "https://sk23.rase.co.in",
  },
  {
    title: "Recent Advances in School Education",
    date: "June 09-11, 2023",
    venue: "National Institute of Technology Jalandhar",
    link: "https://sm23.rase.co.in",
  },
];

const PastEvent: React.FC = () => {
  return (
    <div className="p-2 mt-4 h-auto min-h-[70vh]">
      <h2 className="text-2xl text-center font-bold mb-4 text-primary">
        Our Past Events
      </h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-auto table-auto py-2">
          <thead>
            <tr className="bg-primary">
              <th className="w-1/2 sm:w-1/5 px-1 py-2 border text-left text-white">
                Title
              </th>
              <th className="w-1/2 sm:w-1/5 px-1 py-2 border text-left text-white">
                Date
              </th>
              <th className="w-1/2 sm:w-1/5 px-1 py-2 border text-left text-white">
                Venue
              </th>
              <th className="w-1/2 sm:w-1/5 px-1 py-2 border text-left text-white">
                More Information
              </th>
            </tr>
          </thead>
          <tbody>
            {pastEvents.map((event, index) => (
              <tr key={index}>
                <td className="w-full sm:w-1/5 px-1 py-2 border text-left text-black">
                  {event.title}
                </td>
                <td className="w-full sm:w-1/5 px-1 py-2 border text-left text-black">
                  {event.date}
                </td>
                <td className="w-full sm:w-1/5 px-1 py-2 border text-left text-black">
                  {event.venue}
                </td>
                <td className="w-full sm:w-1/5 px-1 py-2 border text-left text-black">
                  <Link
                    href={event.link}
                    className="text-primary font-bold hover:text-blue-950"
                  >
                    Click here
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastEvent;
