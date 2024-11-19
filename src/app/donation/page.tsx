import React  from 'react';
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Donate from "../component/donate";
import Footer from "../component/Footer";



const donate: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <CompanyInfo />
    <NavBar />
    <Donate />    
    <Footer />
 
    </div>
  );
};

