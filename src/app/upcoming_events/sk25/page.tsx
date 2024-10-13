"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/SK25";

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
