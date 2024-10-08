import React from 'react';

// Define the types
interface Paper {
  id: string;
  title: string;
  authors: string[]; // Always an array of authors
  contact: string | string[];
  abstract: string;
  keywords: string[];
}

interface Section {
  title: string;
  content?: string[];
  sessionChairs?: string[];
  papers?: Paper[];
}

interface Data {
  chapter: string;
  title: string;
  pageStart: number;
  sections: Section[];
}

// Define the Proceeding3 component
const Proceeding1: React.FC<{ data: Data }> = ({ data }) => {
  if (!data) {
    return <div>Error: No data available</div>;
  }

  return (
    <div className="proceeding-container p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Proceeding 2</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">{data.title}</h2>
      <h3 className="text-2xl font-medium text-gray-700 mb-2">Chapter: {data.chapter}</h3>
      <h4 className="text-xl text-gray-600 mb-6">Page Start: {data.pageStart}</h4>

      {data.sections.map((section, index) => (
        <div key={index} className="section mb-12 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">{section.title}</h3>

          {section.content && section.content.length > 0 && (
            <div className="content mb-4">
              <h4 className="text-xl font-semibold text-gray-700">Content:</h4>
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
                {section.papers.map((paper) => (
                  <li key={paper.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h5 className="text-lg font-bold text-purple-600">Paper ID: {paper.id}</h5>
                    <h6 className="text-lg font-semibold text-gray-800 mt-2">Title: {paper.title}</h6>
                    <p className="text-gray-700 mt-1">Authors: {paper.authors ? paper.authors.join(', ') : 'No authors listed'}</p>
                    <p className="text-gray-700 mt-1">Contact: {typeof paper.contact === 'string' ? paper.contact : (paper.contact ? paper.contact.join(', ') : 'No contact listed')}</p>
                    <p className="text-gray-700 mt-1">Abstract: {paper.abstract}</p>
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

export default Proceeding1;
