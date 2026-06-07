"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/Teacher_Development_Program/Teacher_Development_Program";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";


export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <EventPage />
      <RelatedContentSectionClient
        path="/past_event/Teacher_Development_Program"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
