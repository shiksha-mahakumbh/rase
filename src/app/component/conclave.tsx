import React from "react";

const Conclaves: React.FC = () => {
  const conclaves = [
    {
      date: "December 16, 2024",
      time: "14:30",
      events: [
        "VC/Directors' Conclave",
        "Principals' Conclave",
        "Entrepreneurs/Bureaucrats' Conclave",
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
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Conclaves for Leadership and Vision
      </h1>
      {conclaves.map((conclave, index) => (
        <div
          key={index}
          className="w-full max-w-3xl mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {conclave.date}
            </h2>
            <span className="text-sm font-medium text-gray-600">
              Time: {conclave.time}
            </span>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {conclave.events.map((event, idx) => (
              <li
                key={idx}
                className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md mb-2 hover:bg-gray-100"
              >
                {event}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Conclaves;
