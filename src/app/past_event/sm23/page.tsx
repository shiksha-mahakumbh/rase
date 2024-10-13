"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import SM23 from "../../component/SM23";


export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <SM23 />
      <Footer />
    </div>
  );
}
