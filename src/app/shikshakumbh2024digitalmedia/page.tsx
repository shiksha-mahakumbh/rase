"use client"
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";



const ShikshaKumbh2024DigitalMedia = React.lazy(() => import("../component/ShikshaKumbh2024DigitalMedia"));

const page = () => (
  <div className="bg-white">
  <div>
  <CompanyInfo/>
  <NavBar />
  </div>
    <div>
    <React.Suspense fallback={<div>Loading...</div>}>
    
      <ShikshaKumbh2024DigitalMedia />
    </React.Suspense>
    </div>
    <div>
      < Footer />
    </div>

  </div>
);

export default page;