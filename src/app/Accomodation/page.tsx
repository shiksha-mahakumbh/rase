import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Accomodation from "../component/Registration/AccomodationReg";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <Accomodation/>
      <Footer />
    </div>
    
  );
};

export default page;
