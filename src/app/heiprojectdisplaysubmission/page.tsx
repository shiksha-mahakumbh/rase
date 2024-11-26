import React from "react";
import TopInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import HeiProjectForm from "../component/Registration/HeiProjectForm";
import Marquees from "../component/Marquees";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      <TopInfo />
      <NavBar />
      <Marquees/>
      <HeiProjectForm />
      <Footer />
    </div>
    
  );
};

export default page;
