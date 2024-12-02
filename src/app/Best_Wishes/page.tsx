import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";

import Best_Wishes from "../component/Best_Wishes";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      <CompanyInfo />
      <NavBar />
      <div className="p-4">
      <Best_Wishes/>
      </div>
      <Footer />
    </div>
    
  );
};

export default page;
