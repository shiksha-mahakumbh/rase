import React  from 'react';
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import Accomodation  from '../../component/Registration/AccomodationReg'
const ImageUploader: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <CompanyInfo />
    <NavBar />
    <Accomodation/>
    <Footer />
 
    </div>
  );
};

export default ImageUploader;