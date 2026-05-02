"use client";

import React, { useState } from "react";

function ConclavePage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Conclaves – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          High-impact dialogue platforms bringing together academia, governance, industry and society to drive actionable outcomes aligned with Viksit Bharat 2047.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {conclaves.map((c, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Theme: {c.theme}</p>
            <p className="text-sm mt-2"><strong>Focus:</strong> {c.focus}</p>
            <p className="text-sm mt-1"><strong>Outcome:</strong> {c.output}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Leadership & Coordination</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="border p-3 rounded">
            <p className="text-gray-500">Chair</p>
            <p className="font-medium">Dr. Praveen Kumar Sharma</p>
          </div>
          <div className="border p-3 rounded">
            <p className="text-gray-500">Co-Chairs</p>
            <p>Dr. Sujeet Thakur, Prof. Y. D. Sharma, Dr. Rajeshwar Banshtu</p>
          </div>
          <div className="border p-3 rounded">
            <p className="text-gray-500">Conveners</p>
            <p>Dr. Vipin Jain & Institutional Registrars</p>
          </div>
        </div>
      </div>
    </>
  );
}

