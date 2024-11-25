import React from "react";

interface AdvisoryMember {
  name: string;
  designation: string;
  
}

interface AdvisoryCouncilProps {
  title: string;
  members: AdvisoryMember[];
}

const Commites: React.FC<AdvisoryCouncilProps> = ({ title, members }) => {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 mt-4 text-primary">{title}</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary text-white">
           
            <th className="p-3 border border-gray-300 text-left">Name</th>
            <th className="p-3 border border-gray-300 text-left">Designation</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              } hover:bg-gray-200`}
            >
           
              <td className="p-3 border border-gray-300 text-black">{member.name}</td>
              <td className="p-3 border border-gray-300 text-black">{member.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Commites;
