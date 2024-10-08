import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import Link from "next/link";
import dynamic from "next/dynamic";

const MediaTree = dynamic(() => import("./MediaTree"), {
  ssr: false,
});

const MediaPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="flex bg-[url('/bg.png')] bg-repeat justify-center p-4">
        <div className="text-white font-semibold text-sm overflow-x-auto">
          <MediaTree />
        </div>
      </div>
    )
  );
};

export default MediaPage;
