import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import SamparkVibhag from "@/app/component/Vibhag/SamparkVibhag";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

export default function SamparkPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug="Sampark24">
        <SamparkVibhag />
      </VibhagPageShell>
      <RelatedContentSection
        path="/VibhagRoute/Sampark24"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
