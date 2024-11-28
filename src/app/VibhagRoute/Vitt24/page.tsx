import React from "react";
import CompanyInfo from "../../component/CompanyInfo";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import PracharVibhag from "../../component/Vibhag/VittVibhag";


const Home: React.FC = () => {
  return (
    <>
      <CompanyInfo />
      <NavBar />
      <div className="flex flex-col sm:flex-row space-y-4">
        <div className="w-full sm:w-1/5 sm:flex-col"></div>
        <div className="w-full sm:w-3/5 sm:flex-col">
          <PracharVibhag />
        </div>
        <div className="w-full sm:w-1/5 sm:flex-col"></div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
