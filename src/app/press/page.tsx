import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Press from "../component/Press";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PressHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <NavBar />
      <Press />
      <RelatedContentSection
        path={CANONICAL_ROUTES.press}
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
