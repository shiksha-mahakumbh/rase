import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';

const ShikshaMahaKumbh2024 = () => {
  const data = {
    LocalAdvisoryCommittee: [
      { id: 1, name: "Mr. Vijay Nadda", designation: "Org. Secretary, Vidya Bharti (NZ)" },
      { id: 2, name: "Mr. Balkishan", designation: "Jt. Org. Secretary, Vidya Bharti (NZ)" },
      { id: 2, name: "Dr. Sanjeev Sharma", designation: "Registrar, Kurukshetra University" },
      { id: 3, name: "Prof.Deepti Dharmani", designation: "VC,CBLU, Bhiwani" },
      { id: 4, name: "Dr. Ashok Pal", designation: "President, Vidya Bharti (NZ)" },
      { id: 5, name: "Mr. Surendar Attri", designation: "Vice President, VidyaBharti(NZ)" },
      { id: 6, name: "Mr. Praveen Saini", designation: "Vice President, VidyaBharti(NZ)" },
      { id: 7, name: "Mr. Desh Raj ", designation: "Gen. Secretary, Vidya Bharti (NZ)" },
      { id: 8, name: "Dr. Devprasad Bhardwaj ", designation: "President, Vidya BhartiHaryana" },
      { id: 9, name: "Dr. Rishiraj Vashishtha", designation: "President, H.S.S. Haryana" },
      { id: 10, name: "Dr. Avadesh Pandey", designation: " Gen. Secretary, H.S.S.Haryana" },
      { id: 11, name: "Mrs. Pratibha Gupta", designation: " President, DHE" },
      { id: 12, name: "Mr. Chandra Has Gupta", designation: "Treasurer, DHE" },
      { id: 13, name: "Prof. Sathans", designation: "NIT Kurukshetra" },
      { id: 13, name: "Prof. Dinesh Kumar", designation: "CBLU Bhiwani" },
      { id: 13, name: "Prof. Y.K. Vijay", designation: "IIS University , Jaipur" },
      { id: 14, name: "Dr. Manoj Kumar Teotia", designation: "CRRID, Chandigarh" },
      { id: 15, name: "Dr. Pooja D.", designation: "CSIR-CSIO, Chandigarh" },
      { id: 16, name: "Dr. Praveen Kumar", designation: "IACS, Kolkata" },
      { id: 17, name: "Dr. Jitesh Kumar Pandey", designation: " PMIDC, DLG, Punjab" },
      { id: 18, name: "Mr. Pankaj Kumar", designation: " HCS, CEO, KBD Kurukshetra " },
      { id: 19, name: "Prof. Kartar Singh Dhiman ", designation: "VC, SKAU Kurukshetra" },
      { id: 20, name: "Mr. Sanjay Chowdhary", designation: "Vidya Bharti Hayana" },
      { id: 21, name: "Prof. Anish Sachdeva", designation: " NIT Jalandhar" }
    ],
    
    OrganizingCommittee: [
      { id: 1, name: "Dr. Pankaj Kumar", designation: "CU, Himachal Pradesh" },
      { id: 2, name: "Prof. Srikanta Patnaik ", designation: "Director, IIMT,Bhubaneswar" },
      { id: 3, name: "Prof. Bala Lakhendra", designation: " BHU, Varanasi, UP" },
      { id: 4, name: "Prof. A. C. Jha", designation: "Bihar" },
      { id: 5, name: "Dr. Ramakant Sharma", designation: " Bihar" },
      { id: 6, name: "Dr. Soumendra Pattnaik", designation: "SOA , Bhubaneswar" },
      { id: 7, name: "Dr. Sachin Sharma", designation: "Meerut, UP" },
      { id: 8, name: "Dr. Mohit Tyagi", designation: "Academic Advisor, DHE" },
      { id: 9, name: "Dr. Nitya Sharma", designation: "IKGPTU, Jalandhar" },
      { id: 10, name: "Dr. Neelam", designation: "LPU, Jalandhar" },
      { id: 11, name: "Dr. Saurabh Sharma", designation: "IKGPTU, Jalandhar" },
      { id: 12, name: "Dr. Gaurav Saini", designation: " NIT Kurukshetra" },
      { id: 13, name: "Dr. Praveen Sharma", designation: "CU Jammu" },
      { id: 14, name: "Dr. Ankit Goel", designation: "LLRUVAS, Hisar, Haryana" },
      { id: 15, name: "Dr. Y. Dwivedi", designation: "NIT Kurukshetra" },
      { id: 16, name: "Dr. Vijay Kumar Sharma ", designation: " NIT Srinagar" },
      { id: 17, name: "Dr. Vikash Garg", designation: "S.L.I.E.T. Longowal" },
      { id: 18, name: "Dr. Gaurav Sharma", designation: "IIT Delhi" },
      { id: 19, name: "Dr. Ashwini Rana", designation: "NIT Hamirpur" },
      { id: 20, name: "Dr. Surjeet Chandel", designation: "Bilaspur Himachal" },
      { id: 21, name: "Dr. Pooja Mahajan", designation: "Arya Mahila College Dinanagar" },
      { id: 22, name: "Dr. Atrayee Saha", designation: " JNU, Delhi" },
      { id: 23, name: "Dr. Ankit Tyagi", designation: "IIT Jammu" },
      { id: 24, name: "Dr. Kuldeep", designation: " NIT Kurukshetra" },
      { id: 25, name: "Dr. Saurabh Sharma", designation: "IKGPTU, Jalandhar" },
      { id: 26, name: "Dr. Gaurav Saini", designation: " NIT Kurukshetra" },
      { id: 27, name: "Dr. Shiksha Sharma", designation: " Academic Advisor, DHE" },
      { id: 28, name: "Dr. Vikram Chopra", designation: " DSEU Delhi" },
      { id: 29, name: "Dr. Surjeet Chandel", designation: "Himachal Pradesh" },
      { id: 30, name: "Dr. Vikram Singh", designation: "NIT Kurukshetra" },
    ],
    
  
    ConferenceDirector: [
      { id: 1, name: "Dr. Thakur SKR", designation: "Sci/Engr-SF, ISRO and Director, DHE & VBITR" },
    ],
  
    ConferenceSecretaries: [
      { id: 1, name: "Prof. Sunil Dhingra", designation: " Director, UIET, KU" },
      { id: 2, name: "Dr. Jatinder Garg", designation: " BHSBIET, Lehragaga" },
      { id: 3, name: "Dr. Ravi Prakash", designation: "CBLU, Bhiwani" },
    ],
    ConferenceJointSecretaries: [
      { id: 1, name: "Mr. Mandeep Tiwari", designation: "Business Advisior, DHE" },
      { id: 2, name: "Dr. Krishna Pandey", designation: "UIET Kurukshetra" },
    ],
  
    ConferencePatron: [
      { id: 1, name: "Prof. Som Nath Sachdeva", designation: "VC, Kurukshetra University" },
  
    ],
  
    ConferenceConveners: [
      { id: 1, name: "Dr. Shamsher Singh", designation: "AB Collage Pathankot" },
      { id: 2, name: "Dr. Vipin Kumar Jain", designation: "CBLU, Bhiwini" },
    ],
 
    // Add more members...
}
      // Add more members...
  
  
    
  const renderTable = (title: string, members: { id: number; name: string; designation: string }[]) => (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2> {/* This centers the title */}
      <table className="table-auto w-full max-w-4xl mx-auto border border-gray-300">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-2 border border-gray-300 text-center">Name</th>
            <th className="p-2 border border-gray-300 text-center">Designation</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr
              key={member.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
            >
              <td className="p-2 border border-gray-300 text-center">{member.name}</td>
              <td className="p-2 border border-gray-300 text-center">{member.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <>
      <CompanyInfo />
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Shiksha Maha Kumbh 2024</h1>
        {renderTable("Conference Patron", data.ConferencePatron)}
        {renderTable("Conference Director", data.ConferenceDirector)}
        {renderTable("Conference Secretaries", data.ConferenceSecretaries)}
        {renderTable("Conference Joint Secretaries", data.ConferenceJointSecretaries)}
        {renderTable("Conference Conveners", data.ConferenceConveners)}
        {renderTable("Advisory Committee", data.LocalAdvisoryCommittee)}
        {renderTable("Organizing Committee", data.OrganizingCommittee)}
      </div>
      <Footer />
    </>
  );
};

export default ShikshaMahaKumbh2024;