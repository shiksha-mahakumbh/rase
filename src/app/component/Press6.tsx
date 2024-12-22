import React from 'react';
import Image from 'next/image';

type Paper = {
  title: string;
  contact: string | string[];
  keywords: string[];
};

type Section = {
  title: string;
  content?: (string | React.JSX.Element)[]; // Allow both string and JSX elements
  sessionChairs?: string[];
  papers?: Paper[];
};

type Data = {
  title: string;
  image: string;
  sections: Section[];
};

// Define the Press4 component
const Press5: React.FC<{ data: Data }> = ({ data }) => {
  if (!data) {
    return <div>Error: No data available</div>;
  }

  return (
    <div className="proceeding-container p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Shiksha Mahakumbh 2024 begins at Kurukshetra University</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">{data.title}</h2>
      <div className="image-container mb-8 flex justify-center">
        <Image
          src={data.image}
          alt="Press Event"
          width={400} // Set the desired width
          height={200} // Set the desired height
          className="rounded-lg shadow-md"
        />
      </div>
      {data.sections.map((section, index) => (
        <div key={index} className="section mb-12 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">{section.title}</h3>

          {section.content && section.content.length > 0 && (
            <div className="content mb-4">
              <ul className="list-disc ml-5 text-gray-600">
                {section.content.map((item, idx) => (
                  <li key={idx} className="mb-2">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {section.sessionChairs && section.sessionChairs.length > 0 && (
            <div className="session-chairs mb-4">
              <h4 className="text-xl font-semibold text-gray-700">Session Chairs:</h4>
              <ul className="list-disc ml-5 text-gray-600">
                {section.sessionChairs.map((chair, idx) => (
                  <li key={idx} className="mb-2">{chair}</li>
                ))}
              </ul>
            </div>
          )}

          {section.papers && section.papers.length > 0 && (
            <div className="papers mt-6">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">Papers:</h4>
              <ul className="space-y-6">
                {section.papers.map((paper, idx) => (
                  <li key={idx} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h6 className="text-lg font-semibold text-gray-800 mt-2">Title: {paper.title}</h6>
                    <p className="text-gray-700 mt-1">Keywords: {paper.keywords ? paper.keywords.join(', ') : 'No keywords listed'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Press5;
