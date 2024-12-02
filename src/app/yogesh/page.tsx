
import React  from 'react';

import TopInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
const page: React.FC = () => {
  
  return (
    <div className="bg-white min-h-screen ">
    <TopInfo />
    <NavBar/>
    <div className="flex flex-col min-h-screen">
    <a href="/addkeynotespeaker" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg mb-4  '>Add Keynote Speaker</button></a>
    <a href="/addvcdirector" className='items-center justify-center mr-auto ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg mb-4  '>Add VC Director</button></a>
    <a href="/addwishesreceived" className='items-center justify-center mr-auto ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg mb-4  '>Add Wishes Received</button></a>
    <a href="/abstractdatadekh" className='items-center justify-center mr-auto ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'>Abstract Data</button></a>
    <a href="/fulllengthpaperdatadekh" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'>Full Length Paper Data</button></a>
    <a href="/volunteerdatadekh" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'> Volunteer Registration Data</button></a>
    <a href="/ngoregistrationdatadekh" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'> NGO Registration Data</button></a>
    <a href="/participantregistrationdatadekh" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'>Participants Registration Data</button></a>
    <a href="/heiprojectregistrationdata" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'>HEI Project Registration Data</button></a>
    <a href="/organiserdatadekh" className='items-center justify-center mr-auto mt-4 ml-auto'><button className='p-4 bg-primary text-white text-lg rounded-lg'>Organiser Registration Data</button></a>
    </div>
    <Footer/>
 
    </div>
  );
};

export default page;
