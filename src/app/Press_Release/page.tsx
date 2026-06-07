import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Press from "../component/Press";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

const page = () => {
  return (
    <div className="bg-white h-screen">
      <CompanyInfo />
      <NavBar />
      <Press/>
      <RelatedContentSection path="/Press_Release" title="Related programmes & resources" />
      <Footer />
    </div>
    
  );
};

export default page;
