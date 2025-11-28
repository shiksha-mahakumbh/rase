"use client";

import { useState } from "react";

interface NoticeEvent {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

export default function NoticeBoard() {
  const [events] = useState<NoticeEvent[]>([
    {
      id: "1",
      title: "Registration Open for Shiksha Mahakumbh 2025",
      date: "2025-01-20",
      imageUrl: "/notices/notice1.jpg",
    },
    {
      id: "2",
      title: "Workshops & Volunteer Orientation – Starting Soon",
      date: "2025-01-15",
      imageUrl: "/notices/notice2.jpg",
    },
    {
      id: "3",
      title: "Sponsorship Window Now Open",
      date: "2025-01-12",
      imageUrl: "/notices/notice3.jpg",
    },
    {
      id: "4",
      title: "Project Display Registration Begins",
      date: "2025-01-10",
      imageUrl: "/notices/notice4.jpg",
    },
    {
      id: "5",
      title: "Accommodation Details Will Be Released Soon",
      date: "2025-01-08",
      imageUrl: "/notices/notice5.jpg",
    },
  ]);

  return (
    <div className="px-4 py-10 md:px-20">
      <h2 className="text-2xl font-bold text-center mb-8 text-primary">
        Latest Notices
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md p-4 transition transform hover:scale-105 hover:shadow-lg"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="rounded-md w-full h-40 object-cover"
            />

            <h3 className="mt-4 font-semibold text-gray-800">{event.title}</h3>
            <p className="text-sm text-gray-500">📅 {event.date}</p>
          </div>
        ))}
      </div>

      {/* Registration Section */}
      <div
        className={`transition-all duration-500 mt-10 w-full max-w-3xl mx-auto 
        animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Register to Participate in Shiksha Mahakumbh 2025
        </h2>
        <button
          className="px-6 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
          onClick={() =>
            (window.location.href = "/registration/Single_Registration")
          }
        >
          Click Here
        </button>
      </div>
    </div>
  );
}
