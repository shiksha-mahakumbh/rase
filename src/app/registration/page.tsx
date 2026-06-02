import CompanyInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import RegistrationHub from "./RegistrationHub";

export const metadata = {
  title: "Registration | Shiksha Mahakumbh 6.0",
  description:
    "Register for Shiksha Mahakumbh 6.0 — Delegate, Conclave, Olympiad, Awards, Best Practices and more.",
};

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <NavBar />
      <RegistrationHub />
      <Footer />
    </div>
  );
}
