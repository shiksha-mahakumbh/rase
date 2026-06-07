import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import AcademicCouncil from "@/app/component/Vibhag/AcademicCouncil24";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

export default function AcademicCouncilPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug="AcademicCouncil24" showRelatedNav={false}>
        <AcademicCouncil />
      </VibhagPageShell>
      <RelatedContentSection
        path="/VibhagRoute/AcademicCouncil24"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
