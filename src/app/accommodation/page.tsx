"use client";

import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import CompanyInfo from "@/app/component/CompanyInfo";
import AccomodationForm from "@/app/component/Registration/AccomodationReg";

export default function AccommodationPage() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <NavBar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-brand-navy md:text-3xl">
          Accommodation Booking — Shiksha Mahakumbh
        </h1>
        <AccomodationForm />
      </main>
      <Footer />
    </div>
  );
}
