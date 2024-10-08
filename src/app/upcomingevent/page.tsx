"use client";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import PastEvent from "../component/PastEvent";
import UpcomingEvent from "../component/UpcomingEvent";


export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <UpcomingEvent />
      <Footer />
    </div>
  );
}
