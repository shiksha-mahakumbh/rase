"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import SM25 from "../../component/sm25/SM25";

export default function Sm25PastEventPage() {
  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      <SM25 />
      <Footer />
    </div>
  );
}
