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
      <Tree
        lineWidth={"2px"}
        lineColor={"#000000bf"}
        lineBorderRadius={"15px"}
        label={
          <div className="text-center p-2 ">
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
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                Shiksha
                <br />
                Kumbh
              </button>
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
          ></TreeNode>
        </TreeNode>

        <TreeNode
          label={
            <div className="text-center p-2">
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                Shiksha
                <br />
                MahaKumbh
              </button>
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
          ></TreeNode>
        </TreeNode>
      </Tree>
    </Suspense>
  );
};

export default TreeComponent;
