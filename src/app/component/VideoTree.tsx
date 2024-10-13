import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import of the Tree and TreeNode components
const Tree = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.Tree),
  { ssr: false }
);
const TreeNode = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.TreeNode),
  { ssr: false }
);

const TreeComponent: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4">
        {/* Heading at the top */}
        <div className="text-center mb-8 bg-primary p-4 rounded-lg">
          <h1 className="text-4xl font-bold text-white">RASE Conferences</h1>
        </div>

        {/* Grid layout for Shiksha Kumbh and Shiksha MahaKumbh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shiksha Kumbh Box */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
              Shiksha Kumbh
            </h2>
            <Tree
              lineWidth={"2px"}
              lineColor={"#000000bf"}
              lineBorderRadius={"15px"}
              label={
                <div className="text-center p-2">
                  <Link href="https://www.youtube.com/@ShikshaMahakumbh" passHref>
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      RASE
                      <br />
                      CONFERENCES
                      <br />
                      DOCUMENTARIES
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="https://youtu.be/9c9RHrsVU5A" passHref>
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        2023
                      </button>
                    </Link>
                  </div>
                }
              />
            </Tree>
          </div>

          {/* Shiksha MahaKumbh Box */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
              Shiksha MahaKumbh
            </h2>
            <Tree
              lineWidth={"2px"}
              lineColor={"#000000bf"}
              lineBorderRadius={"15px"}
              label={
                <div className="text-center p-2">
                  <Link href="https://www.youtube.com/@ShikshaMahakumbh" passHref>
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      RASE
                      <br />
                      CONFERENCES
                      <br />
                      DOCUMENTARIES
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="https://youtu.be/uzQgxD5Bojk" passHref>
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        2023
                      </button>
                    </Link>
                  </div>
                }
              />
            </Tree>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default TreeComponent;
