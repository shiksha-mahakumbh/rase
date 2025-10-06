import React from "react";

interface AdvisoryMember {
  name: string;
  designation: string;
  photo?: string; // Optional: profile photo URL
}

interface AdvisoryCouncilProps {
  title: string;
  members: AdvisoryMember[];
}

const Committees: React.FC<AdvisoryCouncilProps> = ({ title, members }) => {
  return (
    <div className="flex flex-col items-center p-6">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {title}
      </h2>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-semibold tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-lg font-semibold tracking-wider">Designation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr
                  key={index}
                  className={`transition duration-300 hover:bg-blue-50 ${
                    index % 2 === 0 ? "" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    {member.photo && (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover shadow-md"
                      />
                    )}
                    <span className="font-medium text-gray-800">{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{member.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional SEO-friendly description */}
      <p className="mt-6 text-center text-gray-600 max-w-3xl text-sm sm:text-base">
        These are the dedicated members of the {title} for the Shiksha Mahakumbh Abhiyan, guiding and managing initiatives to promote quality education and holistic development across India.
      </p>
    </div>
  );
};

export default Committees;
