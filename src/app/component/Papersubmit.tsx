"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaperSubmission() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user to the external GitHub file
    window.location.href =
      "https://github.com/shiksha-mahakumbh/rase/blob/aad7a242bcc4076ae6c8f2ec574c6a1d7fa4caea/src/app/component/Vibhag/AcademicCouncil24.tsx";
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-white text-black">
      <p>Redirecting to GitHub repository...</p>
    </div>
  );
}
