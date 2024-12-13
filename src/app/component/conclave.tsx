"use client"
import React from "react";

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
    <div className="flex flex-col items-center bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
        Conclaves for Leadership and Vision
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {conclaves.map((conclave, index) => (
          <div
            key={index}
            className="w-full max-w-md sm:max-w-lg bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {conclave.date}
              </h2>
              <span className="text-sm font-medium text-gray-600">
                Time: {conclave.time}
              </span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {conclave.events.map((event, idx) => (
                <li
                  key={idx}
                  className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Redirect Link */}
      <a
        href="/registration/Single_Registration" // Replace with your actual URL
        className="mt-8 text-lg font-semibold text-primary hover:text-primary-dark underline"
      >
        Click here to register for the conclave
      </a>
    </div>
  );
};

export default Conclaves;
