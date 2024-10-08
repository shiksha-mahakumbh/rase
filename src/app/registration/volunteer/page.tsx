import React  from 'react';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import VolReg  from '../../component/VolReg'
const ImageUploader: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <CompanyInfo />
    <NavBar />
    <VolReg/>
    <Footer />
 
    </div>
  );
};

export default ImageUploader;