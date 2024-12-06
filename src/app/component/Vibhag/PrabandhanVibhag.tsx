import React from "react";

interface Member {
  name: string;
  position?: string;
  contact: string;
}

const PrabandhanVibhag: React.FC = () => {
  const members = [
    {
      category: "Anchoring",
      members: [
        { name: "Smt. Neha Sachdeva", position: "Gita Niketan Awasiya Vidyalay", contact: "7015300835" }
      ]
    },
    {
      category: "Hall Management",
      members: [
        { name: "Dr. Vikas Garg", position: "Assistant Professor, SLIET", contact: "9988610629" },
        { name: "Dr. Mohit Tyagi", position: "Associate Professor, PEC", contact: "8826841129" }
      ]
    },
    {
      category: "Registration",
      members: [
        { name: "Dr. Pooja Mahajan", position: "DHE", contact: "9465262383" }
      ]
    },
    {
      category: "Transport",
      members: [
        { name: "Dr. Jitesh Pandey", position: "DHE", contact: "8360990494" }
      ]
    },
    {
      category: "Accommodation",
      members: [
        { name: "Dr. Parveen Sharma", position: "Associate Professor, CU Jammu", contact: "9988625485" },
        { name: "Dr. Shiksha Sharma", position: "DHE", contact: "9878890303" },
        { name: "Shri Aman Kumar", position: "DHE", contact: "79054 16059"}
      ]
    },
    {
      category: "Food",
      members: [
        { name: "Shri Sanjay Chaudhary", position: "DHE", contact: "9812154381" }
      ]
    },
    {
      category: "Medical Services",
      members: [
        { name: "Dr. Ankit Goel", position: "DHE", contact: "9466747047" }
      ]
    },
    {
      category: "Photography",
      members: [
        { name: "Shri Praveen Chandel", position: "DHE", contact: "8725050733" }
      ]
    },
    {
      category: "Exhibition",
      members: [
        { name: "Shri Aman Shrivastav", position: "DHE", contact: "7905416059" },
        { name: "Shri Sanjay Soni", position: "DHE", contact: "9355542751" },
        { name: "Shri Vinay Kumar", position: "DHE", contact: "82904 63378" }
      ]
    },
    {
      category: "War Room",
      members: [
        { name: "Shri Chander Has Gupta", position: "DHE", contact: "9417050631" },
        { name: "Smt. Pratibha Gupta", position: "DHE", contact: "9814738016" },
        { name: "Shri Ramendra Singh", position: "DHE", contact: "7903431900" },
        { name: "Shushri Sonal Kandari", position: "DHE", contact: "9816941951" },
        { name: "Shri Deepak Kumar", position: "DHE", contact: "70183 18078" },
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8">Shiksha Mahakumbh Abhiyan</h1>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Department of Holistic Education <br />
        Vidya Bharti Institute of Training and Research Chandigarh
      </h2>

      <h3 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Prabandhan Vibhag</h3>

      {members.map((category, index) => (
        <div key={index} className="mb-8">
          <h4 className="text-2xl font-semibold text-center text-blue-600 mb-4">{category.category}</h4>
          <table className="table-auto border-collapse w-full bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Position</th>
                <th className="border px-4 py-2 text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              {category.members.map((member, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2">{member.position || "N/A"}</td>
                  <td className="border px-4 py-2">{member.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PrabandhanVibhag;
