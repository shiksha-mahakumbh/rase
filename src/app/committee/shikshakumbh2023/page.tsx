import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';
const ShikshaKumbh2023 = () => {
  const data = {
   
        LocalAdvisoryCommittee: [
          { id: 1, name: "Mr. Vijay Nadda", designation: "Org. Secretary, Vidya Bharti (NZ)" },
          { id: 2, name: "Mr. Balkishan", designation: "Jt. Org. Secretary, Vidya Bharti (NZ)" },
          { id: 3, name: "Mr. Desh Raj", designation: "Gen. Secretary, Vidya Bharti (NZ)" },
          { id: 4, name: "Mr. Praveen Saini", designation: "Vice President, Vidya Bharti (NZ)" },
          { id: 5, name: "Dr. Devprasad Bhardwaj", designation: "President, Vidya Bharti, Haryana" },
          { id: 6, name: "Mr. Manoj Singhal", designation: "Scientific Advisor, DHE" },
          { id: 7, name: "Dr. Amit Kansal", designation: "Independent Director, NHPC" },
          { id: 8, name: "Dr. Avadhesh Pandey", designation: "Gen. Secretary, Hindu Shiksha Samiti, Haryana" },
          { id: 9, name: "Dr. Rishiraj Vashishtha", designation: "President, Hindu Shiksha Samiti, Haryana" }
        ],
        
        OrganizingCommittee: [
          { id: 1, name: "Dr. Pankaj Kumar", designation: "CU, Himachal Pradesh" },
          { id: 2, name: "Mr. Saurabh Sharma", designation: "Dy. Registrar, IK GPTU, Kapurthala" },
          { id: 3, name: "Adv. Poonam Thakur", designation: "Legal Advisor, DHE" },
          { id: 4, name: "Dr. Pratibha Gupta", designation: "President, DHE" },
          { id: 5, name: "Dr. Kuldeep Kumar", designation: "NIT Kurukshetra" },
          { id: 6, name: "Dr. Yogesh Aggarwal", designation: "NIT Kurukshetra" },
          { id: 7, name: "Dr. Tejinder Sharma", designation: "Kurukshetra University" },
          { id: 8, name: "Dr. Avnish Verma", designation: "GJU, Hisar" },
          { id: 9, name: "Dr. Vikas Garg", designation: "Central University Haryana" },
          { id: 10, name: "Dr. Anju Garg", designation: "JC Bose University of Science and Technology" },
          { id: 11, name: "Dr. R. S. Rathore", designation: "Skill University, Gurugram" },
          { id: 12, name: "Dr. Surender Dahiya", designation: "DCRUST, Murthal, Sonepat" },
          { id: 13, name: "Dr. Pankaj Sharma", designation: "Convenor, Alumni Council, Vidya Bharati" },
          { id: 14, name: "Col. K. K. Kakkar", designation: "Retd. Indian Army Officer" }
        ],
        
        ConferenceSecretaries: [
          { id: 1, name: "Prof. Sathans", designation: "NIT Kurukshetra" },
          { id: 2, name: "Mr. Chandra Has Gupta", designation: "Manager, DHE" }
        ],
        
        ConferenceJointSecretaries: [
          { id: 1, name: "Mr. Sanjay Choudhary", designation: "Prachar Pramukh, VBUK" },
          { id: 2, name: "Dr. Gaurav Saini", designation: "NIT Kurukshetra" },
          { id: 3, name: "Dr. Y. Dwivedi", designation: "NIT Kurukshetra" },
          { id: 4, name: "Dr. Neeru", designation: "Joint Director, Skill Development Department, Haryana" }
        ],
        
        ConferenceConveners: [
          { id: 1, name: "Dr. MPR Prasad", designation: "NIT Kurukshetra" },
          { id: 2, name: "Dr. VG Durgarao Rayudu", designation: "NIT Kurukshetra" },
          { id: 3, name: "Dr. Vikram Singh", designation: "NIT Kurukshetra" },
          { id: 4, name: "Mr. Mandeep Tiwari", designation: "Business Advisor, DHE" }
        ],
        
        NationalAdvisoryCommittee: [
          { id: 1, name: "Mr. A Rajarajan", designation: "Director, Satish Dhawan Space Centre" },
          { id: 2, name: "Prof. Anantha Ramakrishnan", designation: "Director, CSIO" },
          { id: 3, name: "Prof. Rajeev Ahuja", designation: "Director, IIT Ropar" },
          { id: 4, name: "Prof. Bhola Ram Gurjar", designation: "Director, NITTR Chandigarh" },
          { id: 5, name: "Prof. R. P. Tiwari", designation: "Vice-Chancellor, CU Punjab" },
          { id: 6, name: "Dr. Kumar Gaurav", designation: "Dy. Director, PGI" },
          { id: 7, name: "Prof. Arvind", designation: "Vice-Chancellor, Punjabi University" },
          { id: 8, name: "Prof. Adarsh Pal Vij", designation: "Chairman, Punjab Pollution Control Board" },
          { id: 9, name: "Prof. Harinder Kumar Chaudhary", designation: "Vice-Chancellor, HAU" },
          { id: 10, name: "Prof. S. K. Mehta", designation: "Vice-Chancellor, UOL" },
          { id: 11, name: "Prof. C. C. Tripathi", designation: "Director, NITTTER Bhopal" },
          { id: 12, name: "Prof. Anupam Shukla", designation: "Director, NIT Surat" },
          { id: 13, name: "Prof. N. N. Pandey", designation: "Vice-Chancellor, MGP Rohilkhand University" },
          { id: 14, name: "Prof. Lalit Kumar Avasthi", designation: "Director, NIT Uttarakhand" },
          { id: 15, name: "Prof. Pawan Kumar Singh", designation: "Director, IIM Trichy" },
          { id: 16, name: "Prof. Rama Shanker Verma", designation: "Director, MNNIT Allahabad" },
          { id: 17, name: "Prof. M. S. Padvi", designation: "Vice-Chancellor, Birsa Munda Tribal University" },
          { id: 18, name: "Prof. K.N. Natwarsinh Chawda", designation: "Vice-Chancellor, VNSGU" },
          { id: 19, name: "Prof. Raj Nath Yadava", designation: "Vice-Chancellor, Purnea University" },
          { id: 20, name: "Prof. Amar P. Garg", designation: "Vice-Chancellor, Shobhit University" },
          { id: 21, name: "Dr. G.C. Bhimani", designation: "Vice-Chancellor, Saurashtra University, Rajkot" },
          { id: 22, name: "Dr. Rajnish Arora", designation: "Ex-VC, I.K. Gujral Punjab Technical University" },
          { id: 23, name: "Prof. Binod Kumar Kanaujia", designation: "Director, NIT Jalandhar" },
          { id: 24, name: "Mr. Kashmiri Lal", designation: "Org. Secretary, Swadeshi Jagran Manch" },
          { id: 25, name: "Mr. Raghunandan", designation: "Org. Secretary, VB- Ucch Shiksha Sansthan" },
          { id: 26, name: "Mr. Satish Kumar", designation: "Joint Org. Secretary, Swadeshi Jagran Manch" },
          { id: 27, name: "Dr. Jaideep Arya", designation: "Chairman, Yog Aayog, Haryana" },
          { id: 28, name: "Mr. Prateek Kishore", designation: "Director, TBRL/DRDO" },
          { id: 29, name: "Prof. Vidyadhar Subudhi", designation: "Director, NIT Warangal" },
          { id: 30, name: "Prof. H. M. Suryawanshi", designation: "Director, NIT Hamirpur" },
          { id: 31, name: "Prof. O. R. Jaiswal", designation: "Director, NIT Goa" },
          { id: 32, name: "Prof. K K Shukla", designation: "Director, IIT Bhilai" }
        ]}
      
    

  const renderCommittee = (committee: Array<{ id: number, name: string, designation: string }>, title: string) => (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul>
        {committee.map((member) => (
          <li key={member.id} className="mb-2">
            <strong>{member.name}</strong> - {member.designation}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
    <CompanyInfo />
      <NavBar />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl text-center font-bold mb-8">Shiksha Maha Kumbh 2024</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">National Advisory Committee</h2>
          <ul>
            {data.NationalAdvisoryCommittee.map((member) => (
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



export default ShikshaKumbh2023;
