"use client"
import React  from 'react';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import Conclave  from '../../component/Registration/ConclaveForm'
const ImageUploader: React.FC = () => {
  
  return (
    <div className="bg-white h-screen ">
    <CompanyInfo />
    <NavBar />
    <Conclave/>
    <Footer />
 
    </div>
  );
};

export default ImageUploader;