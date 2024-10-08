import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import Link from "next/link";
import dynamic from "next/dynamic";

const VideoTree = dynamic(() => import("./VideoTree"), {
  ssr: false,
});

const VideoPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="flex justify-center p-4">
        <div className="text-white font-semibold text-sm overflow-x-auto">
          <VideoTree />
        </div>
      </div>
    )
  );
};

export default VideoPage;
