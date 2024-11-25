import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';
const ShikshaMahaKumbh2023 = () => {
  const data = {
    
        LocalAdvisoryCommittee: [
          { id: 1, name: "Mr. Vijay Kumar Nadda", designation: "Organisational Secretary, Vidya Bharti (North Region)" },
          { id: 2, name: "Mr. Balkishan", designation: "Jt. Organisational Secretary, Vidya Bharti (North Region)" },
          { id: 3, name: "Mr. Rajendra Kumar", designation: "Organisational Secretary, Vidya Bharti (Punjab)" },
          { id: 4, name: "Dr. S. K. Mishra", designation: "Registrar, I.K. Gujral PTU, Kapurthala" },
          { id: 5, name: "Mr. Praveen Saini", designation: "IAS (Retd.), Vice President, Vidya Bharti (North Region)" },
          { id: 6, name: "Major General Suresh Khajuria (Retd.)", designation: "President, Sarvhitkari Educational Society" },
          { id: 7, name: "Mr. Subhas Mahajan", designation: "Vice President, Sarvhitkari Educational Society" },
          { id: 8, name: "Prof. Navdeep Shekhar", designation: "General Secretary, Sarvhitkari Educational Society" },
          { id: 9, name: "Mr. Manoj Singhal", designation: "Scientific Advisor, Department of Holistic Education" },
        ],
      
        OrganizingCommittee: [
          { id: 1, name: "Mr. P.S. Khimita", designation: "SVM Malerkotla" },
          { id: 2, name: "Dr. Gagandeep Parashar", designation: "SVM Bhikhi" },
          { id: 3, name: "Dr. Jagdeep Patial", designation: "SVM Mansa" },
          { id: 4, name: "Mrs. Jyoti Sharma", designation: "SVM" },
          { id: 5, name: "Dr. Akhileshwar", designation: "SVM Jalandhar" },
          { id: 6, name: "Mr. Vikram Sanyal", designation: "SVM" },
          { id: 7, name: "Dr. Shashikant Yadav", designation: "NIT Jalandhar" },
          { id: 8, name: "Dr. Pankaj Kumar", designation: "CU, Himachal Pradesh" },
          { id: 9, name: "Mr. Saurabh Sharma", designation: "Dy. Registrar, IK Gujral PTU, Kapurthala" },
          { id: 10, name: "Ms. Kavita Sharma", designation: "IT Advisor, Department of Holistic Education, SES" },
          { id: 11, name: "Mr. Rajeev Sharma", designation: "Founder Member, Health Quest Foundation" },
          { id: 12, name: "Adv. Poonam Thakur", designation: "Legal Advisor, Department of Holistic Education, SES" },
          { id: 13, name: "Dr. Ashok Bagga", designation: "NIT Jalandhar" },
          { id: 14, name: "Dr. Ghanshyam Neje", designation: "NIT Jalandhar" },
          { id: 15, name: "Dr. Pratibha Gupta", designation: "Academic Advisor, Department of Holistic Education, SES" },
        ],
      
        OrganizingSecretaries: [
          { id: 1, name: "Mr. Chandra Has Gupta", designation: "Secretary, SES" },
          { id: 2, name: "Prof. Anish Sachdeva", designation: "NIT Jalandhar" },
          { id: 3, name: "Dr. Shailendra Bajpai", designation: "NIT Jalandhar" },
        ],
      
        ConferenceJointSecretaries: [
          { id: 1, name: "Mr. Vijay Thakur", designation: "Finance Secretary, SES" },
          { id: 2, name: "Dr. Kapil Kumar Goyal", designation: "NIT Jalandhar" },
          { id: 3, name: "Dr. Karanveer", designation: "NIT Jalandhar" },
        ],
      
        ConferenceConveners: [
          { id: 1, name: "Dr. Mohit Tyagi", designation: "NIT Kurukshetra" },
          { id: 2, name: "Dr. Deepika Rani", designation: "NIT Jalandhar" },
          { id: 3, name: "Dr. Samayveer Singh", designation: "NIT Jalandhar" },
        ],
      
        ConferenceCoordinators: [
          { id: 1, name: "Shri Sanyog Dutt",designation:"" },
          { id: 2, name: "Dr. Neeraj Pant", designation: "Co-ordinator, Western Uttar Pradesh Zone" },
          { id: 3, name: "Smt Neetu Khurana", designation: "Co-ordinator, North Zone" },
          { id: 4, name: "Shri Dayanidhi", designation: "Co-ordinator, Central Zone" },
          { id: 5, name: "Dr. Hital Patel", designation: "Co-ordinator, West Zone" },
          { id: 6, name: "Dr. Amitesh Kumar", designation: "Co-ordinator, Bihar Zone" },
        ],
      
        NationalAdvisoryCommittee: [
          { id: 1, name: "Mr. A Rajarajan", designation: "Director, Satish Dhawan Space Centre" },
          { id: 2, name: "Prof. Anantha Ramakrishnan", designation: "Director, CSIO" },
          { id: 3, name: "Prof. Rajeev Ahuja", designation: "Director, IIT Ropar" },
          { id: 4, name: "Prof. Gowari Shankar", designation: "Director, IISER Mohali" },
          { id: 5, name: "Prof. Shyam Sundar Pattnaik", designation: "Director, NITTR Chandigarh" },
          { id: 6, name: "Prof. R. P. Tiwari", designation: "Vice-Chancellor, CU Punjab" },
          { id: 7, name: "Dr. Kumar Gaurav", designation: "Dy. Director, PGI" },
          { id: 8, name: "Dr. S. C. Ralhan", designation: "Chairman, BOG of NIT Jalandhar" },
          { id: 9, name: "Prof. Arvind", designation: "Vice-Chancellor, Punjabi University" },
          { id: 10, name: "Dr. Rajiv Prasad", designation: "Secretary, Higher Secondary Education, Haryana" },
          { id: 11, name: "Prof. Adarsh Pal Vij", designation: "Chairman, Punjab Pollution Control Board" },
          { id: 12, name: "Prof. Rajendrakumar Anayath", designation: "Vice Chancellor, DCR University of Science and Technology, Sonepat" },
          { id: 13, name: "Prof. Yogesh Singh", designation: "Vice Chancellor, DU" },
          { id: 14, name: "Prof. Harinder Kumar Chaudhary", designation: "Vice Chancellor, HAU" },
          { id: 15, name: "Prof. S. K. Mehta", designation: "Vice Chancellor, UOL" },
          { id: 16, name: "Prof. C. C. Tripathi", designation: "Director, NITTTER Bhopal" },
          { id: 17, name: "Prof. Anupam Shukla", designation: "Director, NIT Surat" },
          { id: 18, name: "Prof. N. N. Pandey", designation: "Vice Chancellor, MGP Rohilkhand University, Bareilly" },
          { id: 19, name: "Prof. B. V. R. Reddy", designation: "Director, NIT Kurukshetra" },
          { id: 20, name: "Mr. Vikash Trikha", designation: "Director, SCL" },
          { id: 21, name: "Secretary", designation: "Higher Secondary Education, Punjab" },
          { id: 22, name: "Secretary", designation: "Higher Secondary Education, Haryana" },
          { id: 23, name: "Secretary", designation: "Higher Secondary Education, Himachal" },
          { id: 24, name: "Secretary", designation: "Higher Secondary Education, Delhi" },
          { id: 25, name: "Secretary", designation: "Higher Secondary Education, Jammu and Kashmir" },
          { id: 26, name: "Director", designation: "IIT Delhi" },
          { id: 27, name: "Director", designation: "IIT Mandi" },
          { id: 28, name: "Director", designation: "NIT Hamirpur" },
          { id: 29, name: "Dr. Rakesh Sehgal", designation: "Director, NIT Srinagar" },
          { id: 30, name: "Director", designation: "NIT Kurukshetra" },
          { id: 31, name: "Director", designation: "IIIT Una" },
        ]
      };
    
  
      const renderTable = (title: string, members: { id: number; name: string; designation: string }[]) => (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>
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
            <h1 className="text-3xl font-bold text-center mb-8">Shiksha Maha Kumbh 2023</h1>
            {renderTable("National Advisory Committee", data.NationalAdvisoryCommittee)}
            {renderTable("Local Advisory Committee", data.LocalAdvisoryCommittee)}
            {renderTable("Organizing Committee", data.OrganizingCommittee)}
            {renderTable("Organizing Secretaries", data.OrganizingSecretaries)}
            {renderTable("Conference Joint Secretaries", data.ConferenceJointSecretaries)}
            {renderTable("Conference Conveners", data.ConferenceConveners)}
            {renderTable("Conference Coordinators", data.ConferenceCoordinators)}
          </div>
          <Footer />
        </>
      );
    };
    
    export default ShikshaMahaKumbh2023;