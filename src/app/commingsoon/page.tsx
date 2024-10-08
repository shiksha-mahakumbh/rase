import Image from 'next/image'
import CompanyInfo from '../component/CompanyInfo'
import NavBar from '../component/NavBar'
import SlideShow from '../component/SlideShow'
import Info from '../component/Info'
import Footer from '../component/Footer'
import ComingSoon from '../component/CommingSoon'


const years = ["2023", "2024", "2025"];
const headingOne = "Shiksha MahaKumbh";
const headingTwo = "Shiksha Kumbh";

export default function Home() {
  const slides1 = [
    {
      src: '/conference/0K1A9725.JPG',
      alt: 'Image 1',
      legend: 'Image 1',
    },
    {
      src: '/conference/day3-1.jpg',
      alt: 'Image 2',
      legend: 'Image 2',
    },
    {
      src: '/conference/day3-2.jpg',
      alt: 'Image 3',
      legend: 'Image 3',
    },
    {
      src: '/conference/day3-3.jpg',
      alt: 'Image 4',
      legend: 'Image 4',
    },
  ];

  return (
    <>
    <CompanyInfo />
    <NavBar />
    <div className="flex flex-col sm:flex-row space-y-4">
     
      <div className="w-full sm:w-1/5 sm:flex-col">
  
      </div>
    <div className="w-full sm:w-3/5 sm:flex-col">
    <ComingSoon/>
      </div>
      <div className="w-full sm:w-1/5 sm:flex-col">
      </div>
    </div>
    <Footer/>
  </>
  
  )
}