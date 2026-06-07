import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import Best_Wishes from "@/app/component/Best_Wishes";

export default function BestWishesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <Best_Wishes />
      <Footer />
    </div>
  );
}
