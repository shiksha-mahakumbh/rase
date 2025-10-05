"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
        // { path: "/shikshakumbh", title: "Shiksha Kumbh" },
        // { path: "/shikshamahakumbh", title: "Shiksha MahaKumbh" },
        { path: "/abhiyanphotoframe.pdf", title: "Abhiyan in Photo Frames" },
        { path: "/2024M/Shiksha Maha Khumbh Final.pdf", title: "Shiksha Mahakumbh 5.0 in Photo Frame" },
        { path: "/VibhagRoute/AcademicCouncil24", title: "शैक्षिक विभाग" },
        { path: "/VibhagRoute/Vitt24", title: "वित्त विभाग" },
        { path: "/VibhagRoute/Prachar24", title: "प्रचार विभाग" },
        { path: "/VibhagRoute/Sampark24", title: "संपर्क विभाग" },
        { path: "/VibhagRoute/Prabandhan24", title: "प्रबंधन विभाग" },
      ],
    },
    { path: "https://pub.dhe.org.in", title: "Publication" },
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
        { path: "https://www.rase.co.in/donation", title: "Sponsor" },
      ],
    },
    { path: "/merchandise", title: "Merchandise" },
    { path: "/Press_Release", title: "Press Release" },
    { path: "/paper", title: "Paper Submission" },
    { path: "/ContactUs", title: "Contact Us" },
    { path: "/Best_Wishes", title: "Wishes Received" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleSubMenuToggle = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 shadow-md" ref={menuRef}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-extrabold text-primary hover:text-red-600 transition">
          Shiksha Mahakumbh
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <nav className={`hidden md:flex space-x-6 font-semibold`}>
          {menus.map((item, idx) => (
            <div key={idx} className="relative group">
              {item.subMenu ? (
                <>
                  <span
                    className="cursor-pointer hover:text-primary transition duration-200"
                    onClick={() => handleSubMenuToggle(idx)}
                  >
                    {item.title}
                  </span>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {openSubMenuIndex === idx && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg w-56 py-2 z-20"
                      >
                        {item.subMenu.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={subItem.path}
                              className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition"
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href={item.path} className="hover:text-primary transition duration-200">
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <ul className="flex flex-col p-4 space-y-3 font-medium">
              {menus.map((item, idx) => (
                <li key={idx}>
                  {item.subMenu ? (
                    <details>
                      <summary className="cursor-pointer text-primary">{item.title}</summary>
                      <ul className="pl-4 mt-2 space-y-2">
                        {item.subMenu.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link href={subItem.path} className="block hover:underline">
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={item.path} className="hover:text-primary transition">
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
