"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Menu = {
  path: string;
  title: string;
  subMenu?: Menu[];
};

const NavBar: React.FC = () => {
  const menus: Menu[] = [
    { path: "/", title: "Home" },
    { path: "/registration/Single_Registration", title: "Registration",
      // subMenu: [
      //   { path: "/registration/Single_Registration", title: "Registration" },
      //   { path: "/registration/organization", title: "Organization" },
      //   { path: "https://ac.shikshamahakumbh.com/", title: "Accomodation" },
      // ],
     },
    {
      path: "/",
      title: "About Us",
      subMenu: [
        { path: "/introduction", title: "Introduction" },
        { path: "/shikshakumbh", title: "Shiksha Kumbh" },
        { path: "/shikshamahakumbh", title: "Shiksha MahaKumbh" },
        { path: "/abhiyanphotoframe.pdf", title: "Abhiyan in Photo Frames" },
        { path: "/commingsoon", title: "Governing Council" },
        { path: "/commingsoon", title: " शैक्षिक विभाग - Shaikshik Vibha" },
        { path: "/commingsoon", title: "वित्त विभाग - Vitt Vibhag" },
        { path: "/commingsoon", title: "प्रचार विभाग - Prachar Vibhag" },
        { path: "/commingsoon", title: "संपर्क विभाग - Sampark Vibhag" },

      ],
    },
    { path: "https://pub.dhe.org.in", title: "Publication",
      subMenu: [
        { path: "/journals", title: "Journals" },
        { path: "/pub.dhe.org.in", title: "Books" },
        { path: "/proceedings", title: "Proceedings" },
        
      ],
     },
    {
      path: "/",
      title: "Events",
      subMenu: [
        { path: "/pastevent", title: "Past Events" },
        { path: "/upcomingevent", title: "UpComing Events" }
      ],
    },
    { path: "/", title: "Gallery",
      subMenu: [
        { path: "/gallery", title: "Photos" },
        { path: "/videos", title: "Videos" }
      ],
     },

    { path: "/media", title: "Media" },
    { path: "/committeepage", title: "Committee" },
    // { path: "/2024K/SM24Brochure.pdf", title: "Brochure" },
    { path: "/", title: "Brochure",
      subMenu: [
            { path: "/2024K/SM24 Brochure.pdf", title: "Conference" },
            { path: "/2024K/Shiksha Mahakumbh-sponsorship.pdf", title: "Sponsor" }
      ],
  },
    { path: "/merchandise", title: "Merchandise" },
    { path: "/ContactUs", title: "Contact Us" },
    { path: "/feedback", title: "Feedback" },
  ];

  const [state, setState] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleSubMenuHover = (index: number) => {
    setOpenSubMenuIndex(index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenSubMenuIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="pt-1 w-full" ref={menuRef}>
      <div className="w-full mx-auto flex flex-col lg:flex lg:flex-row items-center justify-between">
        <nav className="w-full text-white text-center text-base font-semibold">
          <div className="items-center px-4 md:flex md:px-0">
            <div className="flex items-center justify-between py-0 md:block">
              <div className={`md:hidden order-1`}>
                <button
                  className="text-black outline-none p-2 rounded-md"
                  onClick={() => setState(!state)}
                >
                  {state ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <Link href="/"></Link>
            </div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-1 md:block md:pb-0 md:mt-0 ${
                state ? "block" : "hidden"
              }`}
            >
              <ul className={`flex flex-col md:flex-row md:space-x-0.5`}>
                {menus.map((item, idx) => (
                  <li
                    key={idx}
                    className={`py-2 px-2 md:text-white cursor-pointer md:w-1/6 text-black md:bg-primary hover:text-primary md:hover:bg-white flex-1 flex items-center justify-center relative`}
                    onMouseEnter={() => handleSubMenuHover(idx)}
                  >
                    {item.subMenu ? (
                      <div className="relative">
                        <Link href={item.path}>
                          <span className="text-l">{item.title}</span>
                        </Link>
                        <ul
                          className={`absolute top-full left-1/2 transform -translate-x-1/2 px-10 md:px-5 mt-2 h-30 space-y-2 text-base font-bold text-black bg-red-50 z-10 w-auto md:w-80 md:max-w-xs ${
                            openSubMenuIndex === idx ? "block" : "hidden"
                          }`}
                          style={{ minHeight: "3rem", padding: "0.5rem 0" }}
                          onMouseLeave={() => setOpenSubMenuIndex(null)}
                        >
                          {item.subMenu.map((subItem, subIdx) => (
                            <li
                              key={subIdx}
                              className="py-1 flex justify-center"
                            >
                              <Link href={subItem.path}>
                                <span
                                  className="block px-4 py-2 text-m transition-all hover:text-primary hover:underline md:text-center"
                                  style={{
                                    display: "block",
                                    whiteSpace: "nowrap",
                                  }}
                                  onClick={() => setOpenSubMenuIndex(null)}
                                >
                                  {subItem.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link href={item.path}>
                        <span className="text-l block w-full h-full">
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
