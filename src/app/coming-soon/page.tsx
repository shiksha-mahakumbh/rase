import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import ComingSoon from "../component/CommingSoon";

export default function ComingSoonPage() {
  return (
    <>
      <CompanyInfo />
      <NavBar />
      <div className="flex flex-col space-y-4 sm:flex-row">
        <div className="w-full sm:w-1/5 sm:flex-col" />
        <div className="w-full sm:w-3/5 sm:flex-col">
          <ComingSoon />
        </div>
        <div className="w-full sm:w-1/5 sm:flex-col" />
      </div>
      <Footer />
    </>
  );
}
