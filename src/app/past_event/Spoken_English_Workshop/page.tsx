"use client";
import CompanyInfo from "../../component/CompanyInfo";
import Footer from "../../component/Footer";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";
import NavBar from "../../component/NavBar";
import EventPage from "../../component/Spoken_English_Workshop/Spoken_English_Workshop";

export default function Structure() {
  return (
    <div className="bg-white">
    <CompanyInfo />
    <NavBar />
      <EventPage />
      <RelatedContentSectionClient
        path="/past_event/Spoken_English_Workshop"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
