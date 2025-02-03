"use client";
import React, { useState } from "react";
import Link from "next/link";

const PaperSubmission = () => {
  interface DateInfo {
    label: string;
    date: string;
    late: string;
  }

  interface PaperInfo {
    chit: string;
    chat: JSX.Element;
    chat1: JSX.Element;
  }

  const papers: PaperInfo[] = [
    {
      chit: "Abstract",
      chat: (
        <Link
          className="mt-4 text-justify text-primary whitespace-pre-line underline"
          href="/abstract"
        >
          Click here to submit Abstract
        </Link>
      ),
      chat1: (
        <a
          className="mt-4 text-justify text-primary whitespace-pre-line underline"
          href="/abstract.docx"
        >
          Click here to view the Abstract Template
        </a>
      ),
    },
    {
      chit: "Full Length Paper",
      chat: (
        <Link
          className="mt-4 text-justify text-primary whitespace-pre-line underline"
          href="/fulllengthpaper"
        >
          Click here to submit full Length paper
        </Link>
      ),
      chat1: (
        <span className="mt-4 text-justify text-primary whitespace-pre-line cursor-pointer">
         
          <Link
          className="mt-4 text-justify text-primary whitespace-pre-line underline"
          href="/Guideline.docx"
        >
          Click here to view the full length paper guideline
        </Link>
        </span>
      ),
    },
  ];

  const segments = [
    "Engineering",
    "Management & International Relations",
    "Social Science",
    "Humanities",
    "Agriculture and Veterinary Sciences",
    "Business, Startup & Entrepreneurship",
    "EdTech and Technology ",
    "Medicine - Ayurved, Yunani, Siddha, Homeopathy, Naturopathy",
    "Fundamental Sciences",
    "⁠Environment and Water Conservation",
    "Culture",
    "Languages",
    "Gurukul Education",
    "Sports and Physical Education",
    "School Education",
    "Education for Disabled",
  ];

  const initialTopics = [
    "Globalizing Bhartiya Education: Strategies for Internationalization",
    "Technology Integration in Indian Classrooms: A Global Perspective",
    "Inclusive Education Practices for Diverse Global Communities",
    "Research and Development in Indian Education: A Global Outlook",
    "Policy Reforms for Global Competitiveness in Indian Education",
    "Ethical Education for Sustainable Global Citizenship ",
    "Entrepreneurial Education for Global Career Readiness",
  ];

  const [topics] = useState(initialTopics);
 const dates: DateInfo[] = [
  {
    label: "Students",
    date: "₹ 500",
    late: " ₹ 551",
  },
    {
      label: "Research Scholars and Students",
      date: "₹ 1100",
      late: " ₹ 1501",
    },
    {
      label: "Academics, R&D and Institutions",
      date: "₹ 2100",
      late: " ₹ 2501",
    },
    {
      label: "Industry",
      date: "₹ 3100",
      late: " ₹ 3501",
    },
    
  ];
  const about = `An effort will be made to publish the selected papers in Scopus Indexed/UGC  care listed journals after apeer review process by Conference Editorial Board and concerned Journal Editorial Board. The papers which are not selected in the Journals of above categories, will be considered for emerging ‘Viksit Bharat’ & ‘Viksit India’ journals or Book Chapter with ISBN number after a peer review process. All the accepted abstracts (Who paid registration fee) will be published in Conference Proceeding with ISBN number. 
    For more information about Viksit Bharat & Viksit India journals, visit <a href="https://pub.dhe.org.in/" target="_blank" rel="noopener noreferrer" class="font-bold text-primary hover:underline">pub.dhe.org.in</a> .
  `;

  return (
    <div className="bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-primary">
          Paper Guidelines
        </h2>
        <p className="text-black text-base mb-4">
          Click on the below button to view the <b>Paper Guidelines</b> <br />
          <a href="/Guideline.docx">
            <button className="border mt-2 border-primary hover:bg-primary hover:text-white p-2 rounded-md">
            Click Here
            </button>
          </a>
        </p>
      </div>

      <div>
        <p>
          <h2 className="text-xl font-semibold text-primary">
            Paper Template and Submission link
          </h2>
          <table className="table-fixed max-width my-5 m-auto">
            <thead>
              <tr className="bg-primary">
                <th className="w-1/3 p-2 border text-left text-white">
                  Papers
                </th>
                <th className="w-1/3 p-2 border text-left text-white">
                  Submission link
                </th>
                <th className="w-1/3 p-2 border text-left text-white">
                  Template
                </th>
              </tr>
            </thead>
            <tbody>
              {papers.map((member, index) => (
                <tr key={index}>
                  <td className="p-2 border text-left text-black">
                    {member.chit}
                  </td>
                  <td className="p-2 border text-left text-black">
                    {member.chat}
                  </td>
                  <td className="p-2 border text-left text-black">
                    {member.chat1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">Sections</h2>
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="p-4 border rounded-md bg-slate-100 text-center text-black"
            >
              {segment}
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Paper Topics
        </h2>
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="p-4 border rounded-md bg-slate-100 text-center text-black"
            >
              {topic}
            </div>
          ))}
          <Link href="/Topics">
            <div className="border mt-2 border-primary text-black text-center text-base font-semibold hover:bg-primary hover:text-white p-2 rounded-md">
              ...Read More
            </div>
          </Link>
        </div>
      </div> */}

      <div>
        <h2 className="text-xl font-semibold text-primary">
          Paper Registration
        </h2>
        <p className="mt-4 text-justify text-black whitespace-pre-line">
          <div dangerouslySetInnerHTML={{ __html: about || "" }} />
        </p>
        {/* <table className="table-fixed max-width my-5">
          <thead>
            <tr className="bg-primary">
              <th className="w-1/3 p-2 border text-left text-white">
                DELEGATES
              </th>
              <th className="w-1/3 p-2 border text-left text-white">REGULAR</th>
              <th className="w-1/3 p-2 border text-left text-white">LATE</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((member, index) => (
              <tr key={index}>
                <td className="p-2 border text-left text-black">
                  {member.label}
                </td>
                <td className="p-2 border text-left text-black">
                  {member.date}
                </td>
                <td className="p-2 border text-left text-black">
                  {member.late}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        {/* <p className="mt-4 text-justify text-black">
          The registration fee is to be paid online through RTGS/NEFT/IMPS/UPI/
          any other mode in favour of “Shiksha Mahakumbh”, <b>Account No. 42563560855 of State Bank of India, Chandigarh Branch
            (IFSC Code: SBIN0000628).
          </b>
          The filled-in registration form along with the payment receipt should
          be sent to Convener <b>शिक्षा महाकुंभ 2024,</b> Central Secretariat of
          शिक्षा महाकुंभ, Punjab-140001.
        </p> */}

        <div>
          <br></br>
          <br></br>

        <h1 className="text-xl font-semibold mb-3 text-primary">
          For Paper Submission
        </h1>
        <p className="text-black text-base mb-4">
          Click on the below button to <b>Submit Paper</b> <br />
          <a href="/registration/Single_Registration">
            <button className="border mt-2 border-primary hover:bg-primary hover:text-white p-2 rounded-md">
              Click here
            </button>
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default PaperSubmission;
