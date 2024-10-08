"use client"
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";

const MediaPage = React.lazy(() => import("../component/MediaPage"));

const gallery = () => (
  <div className="bg-white">
  <div>
  <CompanyInfo/>
  <NavBar />
  </div>
    <div>
    <React.Suspense fallback={<div>Loading...</div>}>
    
      <MediaPage />
    </React.Suspense>
    </div>
    <div>
      < Footer />
    </div>

  </div>
);

export default gallery;