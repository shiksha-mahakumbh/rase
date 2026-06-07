"use client";

import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import CompanyInfo from "@/app/component/CompanyInfo";
import AccomodationForm from "@/app/component/Registration/AccomodationReg";

/** Legacy registration path — preserved for bookmarks */
export default function RegistrationAccommodationPage() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <AccomodationForm />
      </main>
      <Footer />
    </div>
  );
}
