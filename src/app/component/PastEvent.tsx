import React from "react";
import Link from "next/link";

// Define the table data as an array of objects
const pastEvents = [
  {
    title: "International Conference on the Indian Education System for Global Development",
    date: "December 16 -17, 2024",
    venue: "Kurukshetra University",
    link: "past_event/sm24",
  },

  {
    title: "Role of Academic-driven Startups in Developing Economy of J&K",
    date: "June 29-30, 2024",
    venue: "National Institute of Technology Srinagar",
    link: "past_event/sk24",
  },
  // {
  //   title:
  //     "Innovation and Entrepreneurship for School Students, Teachers and Atal Tinkering Labs Co-ordinators",
  //   date: "May 10, 2024",
  //   venue: "CSIO Chandigarh",
  //   link: "past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
  // },
  // {
  //   title: "Teacher Development Program in Collaboration with NITTTER",
  //   date: "March 12-17, 2024",
  //   venue: "NITTTER Chandigarh",
  //   link: "past_event/Teacher_Development_Program",
  // },
  // {
  //   title: "Spoken English Workshop",
  //   date: "January 25-31, 2024",
  //   venue: "Gita Niketan, Kurukshetra",
  //   link: "past_event/Spoken_English_Workshop",
  // },
  {
    title: "Role of Academic-driven Startups in Economy",
    date: "December 20, 2023",
    venue: "National Institute of Technology Kurukshetra",
    link: "past_event/sk23",
  },
  {
    title: "Recent Advances in School Education",
    date: "June 09-11, 2023",
    venue: "National Institute of Technology Jalandhar",
    link: "past_event/sm23",
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
