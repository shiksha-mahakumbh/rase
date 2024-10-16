"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/Innovation_and_Entrepreneurship_Dhe_Workshop/Innovation_and_Entrepreneurship_Dhe_Workshop";


export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <EventPage />
      <Footer />
    </div>
  );
}
