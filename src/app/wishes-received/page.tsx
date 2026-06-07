import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import WishesReceived from "@/app/component/wishes_received";

export default function WishesReceivedPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <WishesReceived />
      <Footer />
    </div>
  );
}
