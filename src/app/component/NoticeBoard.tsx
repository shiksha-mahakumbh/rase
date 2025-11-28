"use client";

import { useState } from "react";

interface NoticeEvent {
  id: string;
  title: string;
  imageUrl: string;
}

export default function NoticeBoard() {
  const [events] = useState<NoticeEvent[]>([
    {
      id: "1",
      title: "Registration Open for Shiksha Mahakumbh 2025",
      imageUrl: "/notices/notice1.jpg",
    },
    {
      id: "2",
      title: "Workshops & Volunteer Orientation – Starting Soon",
      imageUrl: "/notices/notice2.jpg",
    },
    {
      id: "3",
      title: "Sponsorship Window Now Open",
      imageUrl: "/notices/notice3.jpg",
    },
    {
      id: "4",
      title: "Project Display Registration Begins",
      imageUrl: "/notices/notice4.jpg",
    },
    {
      id: "5",
      title: "Accommodation Details Will Be Released Soon",
      imageUrl: "/notices/notice5.jpg",
    },
  ]);

  return (
    <div className="px-4 py-10 md:px-20">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary tracking-wide">
        Latest Notices
      </h2>

      <div className="flex flex-col gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 p-3 gap-4 hover:-translate-y-1 cursor-pointer"
          >
            {/* Left Image */}
            <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Title */}
            <div className="flex-grow">
              <h3 className="font-semibold text-lg text-gray-800 hover:text-primary transition-colors">
                {event.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
