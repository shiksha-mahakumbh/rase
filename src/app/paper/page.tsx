import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import PaperSubmission from "../component/Papersubmit";
import Footer from "../component/Footer";

const page = () => {
  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      <PaperSubmission />
      <Footer />
    </div>
  );
};

export default page;
