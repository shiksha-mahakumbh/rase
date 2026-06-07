import CompanyInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";

export default function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <CompanyInfo />
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="home-section-title mb-8 text-3xl text-primary">{title}</h1>
        <article className="prose prose-slate max-w-none prose-headings:text-primary prose-a:text-primary">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
