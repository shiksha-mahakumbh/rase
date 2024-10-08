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
            <Link href="/messages" passHref>
              <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                RASE
                <br />
                CONFERENCES
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
                <Link href="https://sk23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2023
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="/RASE_2023_2nd_EDITION_Campaign.pdf"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Campaign
                      <br />
                      Detailed View
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link
                      href="https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY"
                      passHref
                    >
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        Campaign
                        <br />
                        Photos
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>

            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Day 1
                      <br />
                      Photos
                    </button>
                  </Link>
                </div>
              }
            />
          </TreeNode>

          {/* Add more TreeNodes as needed */}
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sk24.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2024
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="/RASE_2024_3rd_EDITION_Campaign.pdf"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Campaign
                      <br />
                      Detailed View
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link
                      href="https://drive.google.com/drive/folders/1UiWjSkkxt8Gwdyq8ej_NGHq06eTZjTYb?usp=drive_link"
                      passHref
                    >
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        Campaign
                        <br />
                        Photos
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="https://drive.google.com/drive/folders/1PpyJY91vF-ldoS9d2sdPWcBVvscXRq_0"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Day 1
                      <br />
                      Photos
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link
                      href="https://drive.google.com/drive/folders/11aQtrvATw-m4GqJqhEcLvk2Z6iBNNhQi"
                      passHref
                    >
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        Day 2
                      <br />
                      Photos
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
          </TreeNode> 
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
                <Link href="https://sm23.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2023
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="/RASE_2023_1ST_EDITION_Campaign.pdf"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Campaign
                      <br />
                      Detailed View
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link
                      href=" https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16?usp=sharing"
                      passHref
                    >
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        Campaign
                        <br />
                        Photos
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Day 1
                      <br />
                      Photos
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      <a href="https://drive.google.com/drive/folders/1mZvD5JeHguqJJMHyV9WJmCuVh8ckXLaq">
                        Day 2
                      <br />
                      Photos
                      </a>
                    </button>
                  </div>
                }
              >
                <TreeNode
                  label={
                    <div className="text-center p-2">
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        <a href="https://drive.google.com/drive/folders/1qCkcmYuwvS59POxSJadfRdaG8l2kVuch">
                          Day 3
                      <br />
                      Photos
                        </a>
                      </button>
                    </div>
                  }
                />
              </TreeNode>
            </TreeNode>
          </TreeNode>

          {/* Add more TreeNodes as needed */}
          <TreeNode
            label={
              <div className="text-center p-2">
                <Link href="https://sm24.rase.co.in" passHref>
                  <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                    2024
                  </button>
                </Link>
              </div>
            }
          >
            <TreeNode
              label={
                <div className="text-center p-2">
                  <Link
                    href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
                    passHref
                  >
                    <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                      Campaign
                      <br />
                      Detailed View
                    </button>
                  </Link>
                </div>
              }
            >
              <TreeNode
                label={
                  <div className="text-center p-2">
                    <Link
                      href="https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"
                      passHref
                    >
                      <button className="bg-primary p-2 rounded-lg tracking-widest hover:bg-white hover:text-primary">
                        Campaign
                        <br />
                        Photos
                      </button>
                    </Link>
                  </div>
                }
              />
            </TreeNode>
          </TreeNode>
        </TreeNode>
      </Tree>
    </Suspense>
  );
};

export default TreeComponent;
