"use client";
import React from "react";
import Link from "next/link";

const Conclaves: React.FC = () => {
  const conclaves = [
    {
      date: "December 16, 2024",
      time: "14:30",
      events: [
        "VC/Directors' Conclave",
        "Principals and Innovative Teachers' Conclave",
        "Entrepreneurs' Conclave",
        "Student Leaders' Conclave",
      ],
    },
    {
      date: "December 17, 2024",
      time: "10:00",
      events: [
        "Scientists' Conclave",
        "Social Media Influencers' Conclave",
        "Media Conclave",
        "Student Leaders' Conclave",
        "Principals and Innovative Teachers' Conclave",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {conclaves.map((conclave, index) => (
          <div
            key={index}
            className="flex flex-col space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-saffron/30 hover:shadow-md md:p-6"
          >
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-brand-navy sm:text-xl">{conclave.date}</h2>
              <span className="rounded-full bg-brand-saffron/15 px-3 py-1 text-sm font-semibold text-brand-saffron-dark">
                {conclave.time}
              </span>
            </div>
            <ul className="space-y-2">
              {conclave.events.map((event, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-brand-surface-warm px-3 py-2.5 text-sm text-slate-700 transition hover:border-brand-saffron/20"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-saffron/30 bg-gradient-to-r from-brand-surface-warm to-orange-50/60 p-6 text-center">
        <p className="mb-4 text-slate-600">
          Join leadership dialogues shaping the future of education in India.
        </p>
        <Link
          href="/registration"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-saffron px-6 py-3 font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
        >
          Register for a conclave
        </Link>
      </div>
    </div>
  );
};

export default Conclaves;
