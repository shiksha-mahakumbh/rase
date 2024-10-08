import React from 'react';
import { committeeData } from '../../component/committeeData';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";

const CommitteePage = ({ params }: { params: { id: string } }) => {
  const committeeId = params.id;

  // Use type assertion to bypass TypeScript's restriction
  const committeeMembers = committeeData.ShikshaKumbh2023[0]?.[committeeId as keyof typeof committeeData.ShikshaKumbh2023[0]];

  console.log('Committee ID:', committeeId); // For debugging

  return (
      <>
          <CompanyInfo />
          <NavBar />
          <div className="flex flex-col items-center justify-center min-h-screen bg-custom-bg p-4">
              <h1 className="text-black text-3xl font-bold mb-8">{committeeId} Committee Members</h1>
              {committeeMembers && committeeMembers.length > 0 ? (
                  <ul className="space-y-4">
                      {committeeMembers.map((member, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-4 transition hover:bg-gray-200">
                              <div className="text-left">
                                  <h2 className="text-lg font-semibold">{member.name}</h2>
                                  <p className="text-gray-600">{member.designation}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-black">No members found for this committee.</p>
              )}
          </div>
          <Footer />
      </>
  );
};

export default CommitteePage;
