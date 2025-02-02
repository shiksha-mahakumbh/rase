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
    {
      path: "/registration/Single_Registration",
      title: "Registration",
    },
    {
      path: "/",
      title: "About Us",
      subMenu: [
        { path: "/introduction", title: "Introduction" },
        { path: "/shikshakumbh", title: "Shiksha Kumbh" },
        { path: "/shikshamahakumbh", title: "Shiksha MahaKumbh" },
        { path: "/abhiyanphotoframe.pdf", title: "Abhiyan in Photo Frames" },
        { path: "/2024M/Shiksha Maha Khumbh Final.pdf", title: "Shiksha Mahakumbh 3.0 in Photo Frame" },
        
        { path: "/VibhagRoute/AcademicCouncil24", title: " शैक्षिक विभाग - Shaikshik Vibha" },
        { path: "/VibhagRoute/Vitt24", title: "वित्त विभाग - Vitt Vibhag" },
        { path: "/VibhagRoute/Prachar24", title: "प्रचार विभाग - Prachar Vibhag" },
        { path: "/VibhagRoute/Sampark24", title: "संपर्क विभाग - Sampark Vibhag" },
        { path: "/VibhagRoute/Prabandhan24", title: "प्रबंधन विभाग - Prabandhan Vibhag" },
        
      ],
    },
    {
      path: "https://pub.dhe.org.in",
      title: "Publication"
    },
    {
      path: "/",
      title: "Events",
      subMenu: [
        
        { path: "/pastevent", title: "Past Events" },
        { path: "/upcomingevent", title: "Upcoming Events" },
      ],
    },
    {
      path: "/",
      title: "Gallery",
      subMenu: [
        { path: "/gallery", title: "Photos" },
        { path: "/videos", title: "Videos" },
      ],
    },
    { path: "/media", title: "Media" },
    { path: "/committeepage", title: "Committee" },
    {
      path: "/",
      title: "Brochure",
      subMenu: [
        { path: "/2024K/SM24 Brochure.pdf", title: "Conference" },
      
            {
              path: "https://www.rase.co.in/donation",
              title: "Sponsor",
            }
        
      ],
    },
    { path: "/merchandise", title: "Merchandise" },
    { path: "/Press_Release", title: "Press Release" },
    { path: "/paper", title: "Paper Submission" },
    { path: "/ContactUs", title: "Contact Us"},
    
    // { path: "/2024M/Abstract Booklet.pdf", title: "Proceeding" },
      
     
    { path: "/Best_Wishes", title: "Wishes Received" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Toggle the submenu visibility when clicking the "Sponsor" menu
  const handleSubMenuToggle = (index: number) => {
    if (openSubMenuIndex === index) {
      setOpenSubMenuIndex(null); // Close the submenu if it's already open
    } else {
      setOpenSubMenuIndex(index); // Open the clicked submenu
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenSubMenuIndex(null); // Close the submenu if clicked outside
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
            <div className={`md:hidden order-1`}>
              <button
                className="text-black outline-none p-2 rounded-md"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
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
            <div
              className={`flex-1 justify-self-center pb-3 mt-1 md:block md:pb-0 md:mt-0 ${
                isMenuOpen ? "block" : "hidden"
              }`}
            >
              <ul className={`flex flex-col md:flex-row md:space-x-0.5`}>
                {menus.map((item, idx) => (
                  <li
                    key={idx}
                    className={`py-2 px-2 md:text-white cursor-pointer md:w-1/6 text-black md:bg-primary hover:text-primary md:hover:bg-white flex-1 flex items-center justify-center relative`}
                    onClick={() => item.subMenu && handleSubMenuToggle(idx)}
                  >
                    {item.subMenu ? (
                      <div className="relative">
                        <Link href={item.path}>
                          <span className="text-l">{item.title}</span>
                        </Link>
                        {/* Display dropdown when sponsor is clicked */}
                        <ul
                          className={`absolute top-full left-1/2 transform -translate-x-1/2 px-10 md:px-5 mt-2 h-30 space-y-2 text-base font-bold text-black bg-red-50 z-10 w-auto md:w-80 md:max-w-xs ${
                            openSubMenuIndex === idx ? "block" : "hidden"
                          }`}
                          style={{ minHeight: "3rem", padding: "0.5rem 0" }}
                        >
                          {item.subMenu.map((subItem, subIdx) => (
                            <li key={subIdx} className="py-1 flex justify-center">
                              <Link href={subItem.path}>
                                <span
                                  className="block px-4 py-2 text-m transition-all hover:text-primary hover:underline md:text-center"
                                  style={{
                                    display: "block",
                                    whiteSpace: "nowrap",
                                  }}
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
