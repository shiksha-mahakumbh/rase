import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import Info from '../component/Info';
import NavBar from '../component/NavBar';
import SlideShow from '../component/SlideShow';
import AcademicCouncil from '../component/Academic_Council';




export default function Home() {
 
  return (
    <div className='bg-white'>
    <CompanyInfo/>
    <NavBar />
    
    
      <AcademicCouncil />
      
    <Footer/>
  </div>
  
  )
}