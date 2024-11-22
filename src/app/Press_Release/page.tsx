import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Press from "../component/Press";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <Press/>
      <Footer />
    </div>
    
  );
};

export default page;
