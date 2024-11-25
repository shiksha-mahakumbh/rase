import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";

import WishesReceived from "../component/wishes_received";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      <CompanyInfo />
      <NavBar />
      <div className="p-4">
      <WishesReceived />
      </div>
      <Footer />
    </div>
    
  );
};

export default page;
