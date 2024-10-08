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
        lineColor={"green"}
        lineBorderRadius={"10px"}
        label={
          <div className="text-center p-2 ">
            <Link href="" passHref>
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                Shiksha
                <br />
                Kumbh
              </button>
            </Link>
          </div>
        }
      >
        <TreeNode
          label={
            <div className="text-center p-2">
             <a href="https://sk23.rase.co.in">
                <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                  2023
                </button>
              </a>
            </div>
          }
        ></TreeNode>

        <TreeNode
          label={
            <div className="text-center p-2">
             <a href="https://sk24.rase.co.in">
                <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                  2024
                </button>
              </a>
            </div>
          }
        ></TreeNode>
        <TreeNode
          label={
            <div className="text-center p-2">
              <a href="/commingsoon">
                <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                  2025
                </button>
              </a>
            </div>
          }
        ></TreeNode>
      </Tree>
    </Suspense>
  );
};

export default TreeComponent;
