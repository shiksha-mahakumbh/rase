"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/Spoken_English_Workshop/Spoken_English_Workshop";

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
