import CompanyInfo from '@/app/component/CompanyInfo';
import Footer from '@/app/component/Footer';
import Info from '@/app/component/Info';
import NavBar from '@/app/component/NavBar';
import SlideShow from '@/app/component/SlideShow';
import ContactUs from '@/app/component/ContactUs';
import TalkShow from '@/app/component/TalkShow';




export default function Home() {
 
  return (
    <div className='bg-white'>
    <CompanyInfo/>
    <NavBar />
    
    <div className="flex flex-col sm:flex-row space-y-4">
    
      <div className="w-full sm:w-1/5 sm:flex-col">
       </div>
  
      
      <div className="w-full sm:w-3/5 sm:flex-col">
      <TalkShow/>
      </div>
  
    
      <div className="w-full sm:w-1/5 sm:flex-col">
        </div>
    </div>
    <Footer/>
  </div>
  
  )
}