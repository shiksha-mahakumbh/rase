import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import ContactUs from "@/app/component/ContactUs";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ContactUs />
      <Footer />
    </div>
  );
}
