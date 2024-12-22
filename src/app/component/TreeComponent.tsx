import React, { Suspense, useState } from "react";
import Link from "next/link";

const GridComponent: React.FC = () => {
  const [showArchiveKumbh, setShowArchiveKumbh] = useState(false);
  const [showArchiveMahaKumbh, setShowArchiveMahaKumbh] = useState(false);

  const toggleArchiveKumbh = () => {
    setShowArchiveKumbh((prev) => !prev);
  };

  const toggleArchiveMahaKumbh = () => {
    setShowArchiveMahaKumbh((prev) => !prev);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4">
        {/* Heading at the top with background color */}
        <div className="text-center mb-8 bg-primary p-4 rounded-lg">
          <h1 className="text-4xl font-bold text-white">Shiksha MahaKumbh Abhiyan</h1>
        </div>

        {/* Grid layout for Shiksha Kumbh and Shiksha MahaKumbh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shiksha Kumbh Box */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
              Shiksha Kumbh
            </h2>
            <div className="space-y-4">
              {/* Most recent event with campaign and day photos */}
              <div className="text-center bg-primary rounded-lg">
                <Link href="https://sk24.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2024
                  </button>
                </Link>
                <div className="mt-2">
                  
                  <div className="text-center">
                    <p className="font-semibold">Day 1 Photos:</p>
                    <Link href="https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Day 2 Photos:</p>
                    <Link href="https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Archive Button */}
              <div className="text-center ">
                <button
                  className="bg-primary text-white p-2 rounded-lg mt-4" // Darker brown color for visibility
                  onClick={toggleArchiveKumbh}
                >
                  {showArchiveKumbh ? "Hide Archive" : "Show Archive"}
                </button>
              </div>

              {/* Archive Events */}
              {showArchiveKumbh && (
                <div className="mt-2 space-y-2 p-4 bg-primary rounded-lg"> {/* Darker background color for visibility */}
                  <div className="text-center">
                    <Link href="https://sk23.rase.co.in" passHref>
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        2023
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Campaign Detailed View:</p>
                    <Link href="/RASE_2023_2nd_EDITION_Campaign.pdf" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Details
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Shiksha Mahakumbh Photos</p>
                    <Link href="https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Day 1 Photos:</p>
                    <Link href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shiksha MahaKumbh Box */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
              Shiksha Mahakumbh
            </h2>
            <div className="space-y-4 ">
              {/* Most recent event with campaign and day photos */}
              <div className="text-center bg-primary rounded-lg">
                <Link href="https://rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2024
                  </button>
                </Link>
                <div className="mt-2">
                
                  <div className="text-center">
                    <p className="font-semibold">Shiksha Mahakumbh Photos:</p>
                    <Link href="https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Baton Ceremony Photos:</p>
                    <Link href="/BatonCeremony" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Residential Camp Photos:</p>
                    <Link href="ResidentialCamp" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Archive Button */}
              <div className="text-center ">
                <button
                  className="bg-primary text-white p-2 rounded-lg mt-4" // Darker brown color for visibility
                  onClick={toggleArchiveMahaKumbh}
                >
                  {showArchiveMahaKumbh ? "Hide Archive" : "Show Archive"}
                </button>
              </div>

              {/* Archive Events */}
              {showArchiveMahaKumbh && (
                <div className="mt-2 space-y-2 p-4 bg-primary rounded-lg"> {/* Darker background color for visibility */}
                  <div className="text-center">
                    <Link href="https://sm23.rase.co.in" passHref>
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        2023
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Campaign Detailed View:</p>
                    <Link href="/RASE_2023_1ST_EDITION_Campaign.pdf" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Details
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Shiksha Mahakumbh Photos</p>
                    <Link href="https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16?usp=sharing" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Day 1 Photos:</p>
                    <Link href="https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq" passHref>
                      <button className="bg-primary p-1 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        View Photos
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default GridComponent;
