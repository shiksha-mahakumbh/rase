import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Fulllengthpaper from "../component/Fulllengthpaper";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <Fulllengthpaper/>
      <Footer />
    </div>
    
  );
};

export default page;
