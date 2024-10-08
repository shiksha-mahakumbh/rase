"use client"
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";


const PrintMediaShikshaKumbh2024 = React.lazy(() => import("../component/PrintMediaShikshaKumbh2024"));

const page = () => (
  <div className="bg-white">
  <div>
  <CompanyInfo/>
  <NavBar />
  </div>
    <div>
    <React.Suspense fallback={<div>Loading...</div>}>
    
  
      <PrintMediaShikshaKumbh2024 />
    </React.Suspense>
    </div>
    <div>
      < Footer />
    </div>

  </div>
);

export default page;