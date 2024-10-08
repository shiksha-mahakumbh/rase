import CompanyInfo from "@/app/component/CompanyInfo";
import Footer from "@/app/component/Footer";
import Kumbh from "@/app/component/Kumbh";
import NavBar from "@/app/component/NavBar";
import SlideShow from "@/app/component/SlideShow";

export default function Home() {
  const slides2 = [
    {
      src: "/2024K/k1.jpeg",
      alt: "Image 1",
      legend: "",
    },
    {
      src: "/2024K/k2.jpeg",
      alt: "Image 1",
      legend: "",
    },
    {
      src: "/2024K/k3.jpg",
      alt: "Image 1",
      legend: "",
    },
    {
      src: "/2024K/k4.jpg",
      alt: "Image 1",
      legend: "",
    },
  ];

  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />

      <div className="flex flex-col items-center justify-center sm:flex-row space-y-4">
        
        <div className="w-full sm:w-3/5 sm:flex-col">
          <SlideShow slides={slides2} />

          <Kumbh />
        </div>
        
      </div>
      <Footer />
    </div>
  );
}
