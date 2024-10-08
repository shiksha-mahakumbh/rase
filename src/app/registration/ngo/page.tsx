
import React  from 'react';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import NGOReg  from '../../component/NGOReg'
const ImageUploader: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <CompanyInfo />
    <NavBar />
    <NGOReg/>
    <Footer />
 
    </div>
  );
};

export default ImageUploader;