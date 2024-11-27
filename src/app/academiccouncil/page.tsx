import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import Info from '../component/Info';
import NavBar from '../component/NavBar';
import SlideShow from '../component/SlideShow';
import ContactUs from '../component/ContactUs';
import Commites from "../component/AcademicCouncil"

const LocalAdvisoryCommitee = [
    {
      "name": "Prof. Praveen Kumar",
      "affiliation": "IACS, Kolkata",
      "contact": "6290260756",
      "sNo": "1"
    },
    {
      "name": "Dr. Pooja D.",
      "affiliation": "CSIR-CSIO, Chandigarh",
      "contact": "7837907516",
      "sNo": "2"
    },
    {
      "name": "Ms. Shiksha Sharma",
      "affiliation": "Vidya Bharti",
      "contact": "98788 90303",
      "sNo": "3"
    },
    {
      "name": "Dr. Praveen Sharma",
      "affiliation": "Central University Jammu",
      "contact": "9988625485",
      "sNo": "4"
    },
    {
      "name": "Dr. Vijay Sharma",
      "affiliation": "NIT Srinagar",
      "contact": "6005495506",
      "sNo": "5"
    },
    {
      "name": "Dr. Neelesh Kumar",
      "affiliation": "CSIR-CSIO, Chandigarh",
      "contact": "9478515278",
      "sNo": "6"
    },
    {
      "name": "Dr. Krishna Pandey",
      "affiliation": "UIET",
      "contact": "74190 89987",
      "sNo": "7"
    },
    {
      "name": "Dr. Samayveer Singh",
      "affiliation": "NIT Jalandhar",
      "contact": "99537 41966",
      "sNo": "8"
    },
    {
      "name": "Dr. Karan Veer",
      "affiliation": "NIT Jalandhar",
      "contact": "94180 03227",
      "sNo": "9"
    },
    {
      "name": "Dr. Kiran",
      "affiliation": "NIT Jalandhar",
      "contact": "93403 94248",
      "sNo": "10"
    },
    {
      "name": "Dr. Neeraj Gupta",
      "affiliation": "NIT Srinagar",
      "contact": "89580 54648",
      "sNo": "11"
    },
    {
      "name": "Dr. Jitender Gujar",
      "affiliation": "NIT Srinagar",
      "contact": "89897 16185",
      "sNo": "12"
    },
    {
      "name": "Dr. Ankit Tyagi",
      "affiliation": "LLRUVAS",
      "contact": "9466747047",
      "sNo": "13"
    },
    {
      "name": "Prof. Kaushal",
      "affiliation": "JNU",
      "contact": "7903431900",
      "sNo": "14"
    },
    {
      "name": "Dr. Manoj Kumar Teotia",
      "affiliation": "CRRID Chandigarh",
      "contact": "82838 25534",
      "sNo": "15"
    },
    {
      "name": "Dr. Jitesh Pandey",
      "affiliation": "Punjab Local Bodies",
      "contact": "8360990494",
      "sNo": "16"
    },
    {
      "name": "Dr. Vipin Jain",
      "affiliation": "CBLU, Bhiwani",
      "contact": "9828117678",
      "sNo": "17"
    }
  ];
  



export default function Home() {
 
  return (
    <div className='bg-white'>
    <CompanyInfo/>
    <NavBar />
    
    <div className="flex flex-col sm:flex-row space-y-4">
    
      <div className="w-full sm:w-1/5 sm:flex-col">
       </div>
  
      
      <div className="w-full sm:w-3/5 sm:flex-col">
     
      <Commites title="Academic Council " members={LocalAdvisoryCommitee} />
      </div>
  
    
      <div className="w-full sm:w-1/5 sm:flex-col">
        </div>
    </div>
    <Footer/>
  </div>
  
  )
}