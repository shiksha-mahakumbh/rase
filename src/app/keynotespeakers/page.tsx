import React from "react";
import TopInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import GuestList from "../component/GuestList";
import KeynoteSpeakers from "../component/KeynoteSpeakers";
import Marquees from "../component/Marquees";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      <TopInfo />
      <NavBar />
      <Marquees />
      <div className="p-4">
      <KeynoteSpeakers />
      </div>
      <Footer />
    </div>
    
  );
};

export default page;
