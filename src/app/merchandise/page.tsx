"use client"
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";

const Merchandise = React.lazy(() => import("../component/Merchandise"));

const gallery = () => (
  <div className="bg-white">
  <div>
  <CompanyInfo/>
  <NavBar />
  </div>
    <div>
    <React.Suspense fallback={<div>Loading...</div>}>
    
      <Merchandise />
    </React.Suspense>
    </div>
    <div>
      < Footer />
    </div>

  </div>
);

export default gallery;