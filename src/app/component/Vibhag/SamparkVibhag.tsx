import React from "react";

interface Member {
  name: string;
  position?: string;
  contact: string;
}

const SamparkVibhag: React.FC = () => {
  const members: Member[] = [
    { name: "Dr. Manjo Teotia", position: "Assistant Professor, ICSSR-CRRID Chandigarh", contact: "8283825534" },
    { name: "Dr. Nitya Sharma", position: "PTU Jalandhar", contact: "9814733309" },
    { name: "Dr. Neelam Sharma", position: "LPU Jalandhar", contact: "6239612140" },
    { name: "Dr. Gaurav Kumar", position: "IIT Delhi", contact: "9023925400" },
    { name: "Dr. Rajneesh Talwar", position: "Chitkara University, DHE", contact: "9815779477" },
  ];

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8">Shiksha Mahakumbh Abhiyan</h1>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Department of Holistic Education <br />
        Vidya Bharti Institute of Training and Research Chandigarh
      </h2>
      
      <h3 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Sampark Vibhag</h3>
      <table className="table-auto border-collapse w-full bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Position</th>
            <th className="border px-4 py-2 text-left">Contact</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{member.name}</td>
              <td className="border px-4 py-2">{member.position || "N/A"}</td>
              <td className="border px-4 py-2">{member.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SamparkVibhag;
