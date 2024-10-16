"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/sk24/SK24";
import Organizer from "../../component/sk24/organizer"
export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <EventPage />
      <Organizer/>
      <Footer />
    </div>
  );
}
