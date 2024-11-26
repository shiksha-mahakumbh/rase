"use client";
import React from "react";
import Link from "next/link";

const ProjectDisplaySubmission = () => {
  return (
    <div className="bg-white p-6">  
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white p-6 border rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-semibold text-primary mb-4">HEI</h2>
          <p className="text-gray-700 mb-4">
          Project Display Registration for Shiksha Mahakumbh 2024 as HEI students
          </p>
          <Link
            className="text-primary hover:underline"
            href="/heiprojectdisplaysubmission"
          >
            Click here to Register
          </Link>
        </div>

        <div className="bg-white p-6 border rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-semibold text-primary mb-4">School</h2>
          <p className="text-gray-700 mb-4">
          Project Display Registration for Shiksha Mahakumbh 2024 as School students
          </p>
          <Link
            className="text-primary hover:underline"
            href="/schoolprojectdisplaysubmission"
          >
            Click here to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDisplaySubmission;
