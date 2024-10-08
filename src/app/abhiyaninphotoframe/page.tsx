import React from 'react';

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-primary mb-4">Abhiyan in Photo Frames</h1>

      {/* PDF viewer */}
      <div className="w-full max-w-screen min-h-screen p-4 bg-white shadow-md rounded-md">
        <iframe
          src="/abhiyanphotoframe.pdf"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        >
          This browser does not support PDFs. Please download the PDF to view it: <a href="/abhiyanphotoframe.pdf">Download PDF</a>.
        </iframe>
      </div>
    </div>
  );
};

export default Page;
