import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import VittVibhag from "@/app/component/Vibhag/VittVibhag";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

export default function VittPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug="Vitt24">
        <VittVibhag />
      </VibhagPageShell>
      <RelatedContentSection
        path="/VibhagRoute/Vitt24"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
