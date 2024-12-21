import React from "react";
import Link from "next/link";

// Define the type for event data
interface Event {
  title: string;
  date: string;
  venue: string;
  link: string;
}

// JSON data
const events: Event[] = [
  {
    title: "Shiksha Mahakumbh 2025",
    date: "Will be updated soon",
    venue: "Jawaharlal Nehru University",
    link: "/registration/Single_Registration"
  },
  {
    title: "Shiksha Kumbh 2025",
    date: "Will be updated soon",
    venue: "Indian Institute of Technology Jammu",
    link: "/registration/Single_Registration"
  },
  
];

// Define the type for props
interface UpcomingEventProps {
  events: Event[];
}

// Component definition
const UpcomingEvent: React.FC<UpcomingEventProps> = ({ events }) => {
  return (
    <div className="p-2 mt-4 h-auto min-h-[70vh]">
      <h2 className="text-2xl text-center font-bold mb-4 text-primary">Our Upcoming Events</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-auto table-auto py-2 border-s-violet-300">
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
            {events.map((event, index) => (
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
                  <Link href={event.link} className="text-primary font-bold hover:text-blue-950">
                    Click here to register
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



// Main component for rendering
const MyPage: React.FC = () => {
  return (
    <UpcomingEvent events={events} />
  );
};

export default MyPage;
