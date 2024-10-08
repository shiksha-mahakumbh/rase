import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import AbstractSubmission from "../component/AbstractSubmission";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <AbstractSubmission/>
      <Footer />
    </div>
    
  );
};

export default page;
