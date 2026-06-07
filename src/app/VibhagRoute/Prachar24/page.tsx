import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import PracharVibhag from "@/app/component/Vibhag/PracharVibhag";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

export default function PracharPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug="Prachar24">
        <PracharVibhag />
      </VibhagPageShell>
      <RelatedContentSection
        path="/VibhagRoute/Prachar24"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
