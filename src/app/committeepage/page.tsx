"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";

const CommitteeTree = React.lazy(() => import("../component/CommitteeTree"));

const gallery = () => (
  <div className="bg-white">
    <div>
      <CompanyInfo />
      <NavBar />
    </div>
    
    <React.Suspense fallback={<div>Loading...</div>}>
    
      <div className="flex flex-col items-center justify-center bg-custom-bg p-2"> 
      
        <CommitteeTree onSelect={function (committee: string): void {
          throw new Error("Function not implemented.");
        } }/>
      </div>
    </React.Suspense>
    
    <div>
      <Footer />
    </div>
  </div>
);

export default gallery;
