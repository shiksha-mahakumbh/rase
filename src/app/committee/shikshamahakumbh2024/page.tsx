import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';

const ShikshaMahaKumbh2024 = () => {
  const data = {
      LocalAdvisoryCommittee: [
        { id: 1, name: "Mr. Vijay Nadda", designation: "Org. Secretary, Vidya Bharti (NZ)" },
        { id: 2, name: "Mr. Balkishan", designation: "Jt. Org. Secretary, Vidya Bharti (NZ)" },
        { id: 3, name: "Dr. Ashok Pal", designation: "President, Vidya Bharti (NZ)" },
        { id: 4, name: "Mr. Surendar Attri", designation: "Vice President, Vidya Bharti (NZ)" },
        { id: 5, name: "Mr. Praveen Saini", designation: "Vice President, Vidya Bharti (NZ)" },
        { id: 6, name: "Mr. Desh Raj", designation: "Gen. Secretary, Vidya Bharti (NZ)" },
        { id: 7, name: "Dr. Manoj Kumar Teotia", designation: "CRRID, Chandigarh" },
        { id: 8, name: "Dr. Pooja D.", designation: "CSIR-CSIO, Chandigarh" },
        { id: 9, name: "Dr. Praveen Kumar", designation: "IACS, Kolkata" },
        { id: 10, name: "Dr. Jitesh Kumar Pandey", designation: "PMIDC, DLG, Punjab" },
        { id: 11, name: "Mr. Manoj Singhal", designation: "Scientific Advisor, DHE" },
      ],
    
      OrganizingCommittee: [
        { id: 1, name: "Dr. Pankaj Kumar", designation: "CU, Himachal Pradesh" },
        { id: 2, name: "Mr. Saurabh Sharma", designation: "Dy. Registrar, IKGPTU, Amritsar Campus" },
        { id: 3, name: "Dr. Pratibha Gupta", designation: "President, DHE" },
        { id: 4, name: "Dr. Amit Kansal", designation: "Independent Director, NHPC" },
        { id: 5, name: "Dr. Ravi Kant", designation: "IIT Ropar" },
        { id: 6, name: "Dr. Kishant Kumar", designation: "IIT Ropar" },
        { id: 7, name: "Dr. Tharamani C.N.", designation: "IIT Ropar" },
        { id: 8, name: "Prof. Sathans", designation: "NIT Kurukshetra" },
        { id: 9, name: "Dr. Vijay Kumar Sharma", designation: "NIT Srinagar" },
        { id: 10, name: "Dr. Vipan Pal Singh", designation: "CU, Punjab" },
        { id: 11, name: "Dr. Anshul", designation: "Delhi University" },
        { id: 12, name: "Dr. Nitya Sharma", designation: "IKGPTU" },
        { id: 13, name: "Dr. Neelum", designation: "LPU" },
        { id: 14, name: "Mr. Saurabh Sharma", designation: "IKGPTU" },
        { id: 15, name: "Prof. Anish Sachdeva", designation: "NIT Jalandhar" },
        { id: 16, name: "Dr. Praveen Sharma", designation: "CU, Jammu" },
        { id: 17, name: "Dr. Ravi Prakash", designation: "CBLU, Haryana" },
        { id: 18, name: "Dr. Shamsher Singh", designation: "AB College Pathankot" },
        { id: 19, name: "Dr. Ankit", designation: "LLRUVAS, Hisar, Haryana" },
      ],
    
      ConferenceDirector: [
        { id: 1, name: "Dr. Thakur SKR", designation: "Sci/Engr-SF, ISRO and Director, DHE & VBITR" },
      ],
    
      ConferenceSecretaries: [
        { id: 1, name: "Dr. Ravi Prakash", designation: "CBLU, Bhiwani" },
        { id: 2, name: "Dr. Jatinder Garg", designation: "BHSBIET, Lehragaga" },
      ],
    
      ConferenceConveners: [
        { id: 1, name: "Dr. Shamsher Singh", designation: "AB Collage Pathankot" },
        { id: 2, name: "Dr. Vipin Jain", designation: "CBLU, Bhiwini" },
      ],
    
      ConferenceJointSecretaries: [
        { id: 1, name: "Mr. Mandeep Tiwari, Business Advisior, DHE", designation: "Business Advisior, DHE" },
        { id: 2, name: "Dr. Krishna Pandey", designation: "UIET Kurukshetra" },
        
      ],
   
      // Add more members...
  }
  

  return (
    <>
    <CompanyInfo />
      <NavBar />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl text-center font-bold mb-8">Shiksha Maha Kumbh 2024</h1>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">National Advisory Committee</h2>
          <ul>
            {data. ConferenceDirector.map((member) => (
              <li key={member.id} className="flex justify-between p-1">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">National Advisory Committee</h2>
          <ul>
            {data. ConferenceSecretaries.map((member) => (
              <li key={member.id} className="flex justify-between p-1">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">National Advisory Committee</h2>
          <ul>
            {data. ConferenceJointSecretaries.map((member) => (
              <li key={member.id} className="flex justify-between p-1">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>

       
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">Organizing Committee</h2>
          <ul>
            {data.ConferenceConveners.map((member) => (
              <li key={member.id} className="flex justify-between p-2">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">Local Advisory Committee</h2>
          <ul>
            {data.LocalAdvisoryCommittee.map((member) => (
              <li key={member.id} className="flex justify-between p-2">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">Organizing Committee</h2>
          <ul>
            {data.OrganizingCommittee.map((member) => (
              <li key={member.id} className="flex justify-between p-2">
                <span>{member.name}</span>
                <span>{member.designation}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default ShikshaMahaKumbh2024;
