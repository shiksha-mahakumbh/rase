
import React  from 'react';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";


import Single_Registration  from '../../component/Registration/Single_Registration'
const ImageUploader: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <CompanyInfo />
    <NavBar />
    <Single_Registration/>
    <Footer />
 
    </div>
  );
};

export default ImageUploader;