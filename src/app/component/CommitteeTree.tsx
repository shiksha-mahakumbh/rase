"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import of the Tree and TreeNode components
const Tree = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.Tree),
  { ssr: false }
);
const TreeNode = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.TreeNode),
  { ssr: false }
);

// Define the props interface to accept onSelect
interface CommitteeTreeProps {
  onSelect: (committee: string) => void;
}

const CommitteeTree: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  return (
    <div style={{ overflow: "auto", maxHeight: "80vh", padding: "10px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Tree
          lineWidth={"2px"}
          lineColor={"black"}
          lineBorderRadius={"10px"}
          label={
            <div className="text-center p-2">
              <Link href="">
                <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base">
                  RASE
                  <br />
                  CONFERENCES
                  <br />
                  COMMITTEES
                </button>
              </Link>
            </div>
          }
        >
          <TreeNode
            label={
              <div className="text-center p-2">
                <button
                  className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base"
                  onClick={() => onSelect("Shiksha Kumbh")}
                >
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
                  <Link href="https://sk23.rase.co.in">
                    <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base">
                      2023
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="/committee/shikshakumbh2023">
                      <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover-border-2 text-xs sm:text-sm md:text-base">
                        Committee
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>

            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link href="https://sk24.rase.co.in">
                    <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base">
                      2024
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="/committee/shikshakumbh2024">
                      <button
                        className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base"
                        onClick={() => onSelect("Shiksha Kumbh 2024 Committee")}
                      >
                        Committee
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
          </TreeNode>

          <TreeNode
            label={
              <div className="text-center p-2">
                <button
                  className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2 text-xs sm:text-sm md:text-base"
                  onClick={() => onSelect("Shiksha MahaKumbh")}
                >
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
                  <Link href="https://sm23.rase.co.in">
                    <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover-border-2 text-xs sm:text-sm md:text-base">
                      2023
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="/committee/shikshamahakumbh2023">
                      <button
                        className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover-border-2 text-xs sm:text-sm md:text-base"
                        onClick={() => onSelect("Shiksha MahaKumbh 2023 Committee")}
                      >
                        Committee
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>

            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link href="https://sm24.rase.co.in">
                    <button className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover-border-primary hover-border-2 text-xs sm:text-sm md:text-base">
                      2024
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link href="/committee/shikshamahakumbh2024">
                      <button
                        className="bg-primary text-white p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover-border-primary hover-border-2 text-xs sm:text-sm md:text-base"
                        onClick={() => onSelect("Shiksha MahaKumbh 2024 Committee")}
                      >
                        Committee
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
          </TreeNode>
        </Tree>
      </Suspense>
    </div>
  );
};

export default CommitteeTree;
