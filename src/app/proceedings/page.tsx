import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import Info from '../component/Info';
import NavBar from '../component/NavBar';
import Introduction from '../component/Introduction';
import Books from '../component/Books';
import Proceedings from '../component/Proceedings';




export default function Home() {
 
  return (
    <div className='bg-white'>
    <CompanyInfo/>
    <NavBar />
    
    <div className="flex flex-col sm:flex-row space-y-4">
    
      <div className="w-full sm:w-1/5 sm:flex-col">
       </div>
  
      
      <div className="w-full sm:w-3/5 sm:flex-col">
     
  <Proceedings />
      </div>
  
    
      <div className="w-full sm:w-1/5 sm:flex-col">
        </div>
    </div>
    <Footer/>
  </div>
  
  )
}