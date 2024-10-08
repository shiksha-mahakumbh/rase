import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import MahaKumbh from '../component/MahaKumbh';
import NavBar from '../component/NavBar';
import SlideShow from '../component/SlideShow';



export default function Home() {
  const slides2 = [
    {
      src: '/2024M/11.jpg',
      alt: 'Image 1',
      legend: '',
    },
    {
        src: '/2024M/1.jpg',
        alt: 'Image 2',
        legend: '',
      },
       {
        src: '/2024M/2.jpg',
        alt: 'Image 3',
        legend: '',
      }
      , {
        src: '/2024M/3.jpg',
        alt: 'Image 4',
        legend: '',
      },
  ];

  return (
    <div className='bg-white'>
    <CompanyInfo/>
    <NavBar />
    <div className="flex flex-col sm:flex-row space-y-4">
    
      <div className="w-full sm:w-1/5 sm:flex-col">
      </div>
  
      
      <div className="w-full sm:w-3/5 sm:flex-col">
    <SlideShow slides={slides2} />
     
    <MahaKumbh />
      </div>
  
    
      <div className="w-full sm:w-1/5 sm:flex-col">
        </div>
    </div>
    <Footer/>
  </div>
  
  )
}