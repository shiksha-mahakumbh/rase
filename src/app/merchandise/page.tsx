import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import Merchandise from "@/app/component/Merchandise";

export default function MerchandisePage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <Merchandise />
      <Footer />
    </div>
  );
}
