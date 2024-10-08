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

const MediaTree: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tree
        lineWidth={"2px"}
        lineColor={"black"}
        lineBorderRadius={"10px"}
        label={
          <div className="text-center p-2 ">
            <Link href="" passHref>
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                RASE
                <br />
                CONFERENCES
                <br />
                MEDIA
              </button>
            </Link>
          </div>
        }
      >
        <TreeNode
          label={
            <div className="text-center p-2">
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
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
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    2023
                  </button>
                </Link>
              </div>
            }
          >
           <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/shikshakumbh2023digitalmedia" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/printmediashikshakumbh2023" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode> 
          </TreeNode>

          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk24.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    2024
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/shikshakumbh2024digitalmedia" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/printmediashikshakumbh2024" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode>
          </TreeNode>
          {/* <TreeNode
            label={
              <div className="text-center p-2">
                <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                  <a href="/commingsoon">2025</a>
                </button>
              </div>
            }
          >
            <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode>
          </TreeNode> */}

          {/* Add more TreeNodes as needed */}
        </TreeNode>

        <TreeNode
          label={
            <div className="text-center p-2">
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
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
                <Link href="https://sm23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    2023
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/shikshamahakumbh2023digitalmedia" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/printmediashikshamahakumbh2023" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode>
          </TreeNode>

          {/* Add more TreeNodes as needed */}
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sm24.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    2024
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/commingsoon" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="/printmediashikshamahakumbh2024" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode>
          </TreeNode>
          {/* <TreeNode
            label={
              <div className="text-center p-2">
                <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                  <a href="/commingsoon">2025</a>
                </button>
              </div>
            }
          >
            <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Digital<br /> Media
                  </button>
                </Link>
              </div>
            }
          >
          </TreeNode>
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-gray-200 hover:text-primary hover:border-primary hover:border-2">
                    Print<br /> Media
                  </button>
                </Link>
              </div>
            }
          ></TreeNode>
          </TreeNode> */}

          {/* Add more TreeNodes as needed */}
        </TreeNode>
      </Tree>
    </Suspense>
  );
};

export default MediaTree;
