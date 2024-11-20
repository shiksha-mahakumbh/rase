import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Donation from "../component/donate";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <Donation />
      <Footer />
    </div>
    
  );
};

export default page;
