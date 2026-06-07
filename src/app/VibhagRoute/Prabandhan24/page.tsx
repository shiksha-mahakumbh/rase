import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import PrabandhanVibhag from "@/app/component/Vibhag/PrabandhanVibhag";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";

export default function PrabandhanPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug="Prabandhan24">
        <PrabandhanVibhag />
      </VibhagPageShell>
      <RelatedContentSection
        path="/VibhagRoute/Prabandhan24"
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
