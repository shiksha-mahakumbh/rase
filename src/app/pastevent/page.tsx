"use client";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import PastEvent from "../component/PastEvent";


export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <PastEvent />
      <Footer />
    </div>
  );
}
