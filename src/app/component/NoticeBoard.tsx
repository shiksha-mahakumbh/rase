"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./home/GlassCard";
import { ConferenceIcon } from "./home/icons";

interface NoticeEvent {
  id: string;
  title: string;
  // imageUrl: string;
}

export default function NoticeBoard() {
  const [events] = useState<NoticeEvent[]>([
    {
      id: "1",
      title: "Registration Open for Shiksha Mahakumbh 6.0",
      // imageUrl: "/notices/notice1.jpg",
    },
    {
      id: "2",
      title: "Workshops & Volunteer Orientation – Starting Soon",
      // imageUrl: "/notices/notice2.jpg",
    },
    {
      id: "3",
      title: "Sponsorship Window Now Open",
      // imageUrl: "/notices/notice3.jpg",
    },
    {
      id: "4",
      title: "Project Display Registration Begins",
      // imageUrl: "/notices/notice4.jpg",
    },
    {
      id: "5",
      title: "Accommodation Details Will Be Released Soon",
      // imageUrl: "/notices/notice5.jpg",
    },
  ]);

  return (
    <div className="px-3 py-6 md:px-6 md:py-8">
      <div className="mb-6 text-center md:mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
          Stay Updated
        </p>
        <h2 className="home-section-title text-2xl md:text-3xl">
          Latest Notices
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
          >
            <GlassCard className="home-card-hover group cursor-pointer border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ConferenceIcon className="h-5 w-5" />
                </div>

                {/* Left Image */}
                {/* <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div> */}

                {/* Title */}
                <div className="flex-grow">
                  <h3 className="text-base font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary md:text-lg">
                    {event.title}
                  </h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
