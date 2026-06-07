import dynamic from "next/dynamic";
import NavBar from "@/app/component/NavBar";
import ContactUs from "@/app/component/ContactUs";

const Footer = dynamic(() => import("@/app/component/Footer"));

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ContactUs />
      <Footer />
    </div>
  );
}
