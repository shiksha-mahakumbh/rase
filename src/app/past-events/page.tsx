import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import PastEditionsShowcase from "@/components/past-editions/PastEditionsShowcase";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";

export default function PastEventsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <main id="main-content">
        <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Shiksha Mahakumbh", href: "/shikshamahakumbh" },
              { label: "Past Events" },
            ]}
            className="mb-2"
          />
        </div>
        <PastEditionsShowcase />
      </main>
      <Footer />
    </div>
  );
}
