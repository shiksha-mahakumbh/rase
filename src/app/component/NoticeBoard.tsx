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
      <h2 className="text-3xl font-bold text-center mb-10 text-primary tracking-wide">
        Latest Notices
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            {/* Image Section */}
            <div className="w-full h-48 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-gray-500 mb-1">
                📅 {event.date}
              </p>

              <h3 className="font-semibold text-lg text-gray-800 leading-snug group-hover:text-primary transition-colors">
                {event.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
