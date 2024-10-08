import React from "react";

interface AdvisoryMember {
  name: string;
  affiliation: string;
  contact: string;
  sNo: string;
}

interface AdvisoryCouncilProps {
  title: string;
  members: AdvisoryMember[];
}

const AcademicCouncil: React.FC<AdvisoryCouncilProps> = ({ title, members }) => {
  return (
    <div className="flex flex-col items-center bg-white p-2">
      <h2 className="text-xl font-semibold mb-4 mt-4 text-primary">{title}</h2>
      <table className="table-fixed max-width my-5 border-">
        <thead>
          <tr className="bg-primary">
          <th className=" p-2 border text-left text-white">S.No</th>
            <th className=" p-2 border text-left text-white">Name</th>
            <th className=" p-2 border text-left text-white">Affiliation</th>
            <th className=" p-2 border text-left text-white">Contact</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
                     <td className="p-2 border text-left text-black">{member.sNo}</td>
              <td className="p-2 border text-left text-black">{member.name}</td>
              <td className="p-2 border text-left text-black">{member.affiliation}</td>
              <td className="p-2 border text-left text-black">{member.contact}</td>
         
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicCouncil;
