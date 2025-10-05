"use client";
import { useEffect } from "react";

const PaperSubmission = () => {
  useEffect(() => {
    window.location.href = "https://www.rase.co.in/VibhagRoute/AcademicCouncil24";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black text-lg">
      Redirecting to the Paper Submission Portal...
    </div>
  );
};

export default PaperSubmission;
