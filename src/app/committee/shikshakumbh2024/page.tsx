import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';
const ShikshaKumbh2024 = () => {
  const data = {
      LocalAdvisoryCommittee: [
        { id: 1, name: "Mr. Vijay Nadda", designation: "Vidya Bharti (NZ)" },
        { id: 2, name: "Mr. Balkishan", designation: "Vidya Bharti (NZ)" },
        { id: 3, name: "Mr. Desh Raj", designation: "Vidya Bharti (NZ)" },
        { id: 4, name: "Mr. Parveen Saini, IAS (Retd.)", designation: "Vidya Bharti (NZ)" },
        { id: 5, name: "Mr. Manoj Singhal", designation: "DHE" },
        { id: 6, name: "Dr. Amit Kansal", designation: "NHPC" },
        { id: 7, name: "Er. Ved Bhushan Sharma", designation: "BSS, J&K" },
        { id: 8, name: "Er. Hari Bhushan", designation: "BSS, J&K" },
        { id: 9, name: "Dr. Manoj", designation: "BSS, J&K" },
        { id: 10, name: "Dr. Amit Kumar", designation: "SKUAST, Kashmir" },
        { id: 11, name: "Prof. M. K. Sharma", designation: "SKUAST, Kashmir" },
        { id: 12, name: "Prof. Aijaz Ahmad", designation: "University of Kashmir" },
        { id: 13, name: "Prof. Kartar Chand Sharma", designation: "Kashmir University" },
        { id: 14, name: "Dr. Omchand Sharma", designation: "CITH Srinagar" },
        { id: 15, name: "Dr. Yogesh Pandey", designation: "SKAUST Kashmir" },
        { id: 16, name: "Dr. Sunil Kumar", designation: "SKAUST Kashmir" },
        { id: 17, name: "Dr. Manoj Kumar", designation: "CITH Srinagar" },
        { id: 18, name: "Maj. Gen. Suresh Kumar Khajuria (Retd.)", designation: "SES, Punjab" }
      ],
      OrganizingCommittee: [
        { id: 1, name: "Dr. Yashwant Mehta", designation: "NIT Srinagar" },
        { id: 2, name: "Dr. H. S. Pali", designation: "NIT Srinagar" },
        { id: 3, name: "Dr. Jitendra Gurjar", designation: "NIT Srinagar" },
        { id: 4, name: "Dr. R. P. Shukla", designation: "NIT Srinagar" },
        { id: 5, name: "Dr. Pankaj Kumar", designation: "CU, Himachal Pradesh" },
        { id: 6, name: "Mr. Saurabh Sharma", designation: "IKGPTU, Kapurthala" },
        { id: 7, name: "Adv. Poonam Thakur", designation: "DHE, Mohali" },
        { id: 8, name: "Dr. Pratibha Gupta", designation: "DHE, Mohali" },
        { id: 9, name: "Col. K. K. Kakkar", designation: "DHE, Mohali" },
        { id: 10, name: "Dr. Gurmeet Singh", designation: "University of Kashmir" },
        { id: 11, name: "Dr. Praveen Sharma", designation: "University of Kashmir" },
        { id: 12, name: "Dr. Bhawani Singh", designation: "University of Jammu" },
        { id: 13, name: "Mr. Mandeep Tiwari", designation: "DHE, Mohali" },
        { id: 14, name: "Dr. Ramjit", designation: "CU, Kashmir" }
      ],
      ConferenceSecretaries: [
        { id: 1, name: "Prof. Manjit Bansal", designation: "MRS PTU" },
        { id: 2, name: "Prof. Yashwant Mehta", designation: "NIT Srinagar" },
        { id: 3, name: "Dr. Saad Parvez", designation: "IIEDC, NIT Srinagar" }
      ],
      ConferenceJointSecretaries: [
        { id: 1, name: "Dr. Praveen Kumar Sharma", designation: "CU, Jammu" },
        { id: 2, name: "Dr. Vijay Kumar", designation: "NIT Srinagar" },
        { id: 3, name: "Dr. Ranjeet Kumar Rout", designation: "NIT Srinagar" },
        { id: 4, name: "Dr. Naresh Kumar", designation: "CU, Jammu" }
      ],
      ConferenceConveners: [
        { id: 1, name: "Dr. Harveer Singh Pali", designation: "NIT Srinagar" },
        { id: 2, name: "Dr. Neeraj Gupta", designation: "NIT Srinagar" },
        { id: 3, name: "Mr. Shahid Abbas Mir", designation: "NIT Srinagar" }
      ],
      NationalAdvisoryCommittee: [
        { id: 1, name: "Prof. Nilofer Khan", designation: "Vice-Chancellor, University of Kashmir" },
        { id: 2, name: "Prof. Nazir Ah. Ganai", designation: "Vice-Chancellor, SKUAST Srinagar" },
        { id: 3, name: "Prof. A. Ravinder Nath", designation: "Vice Chancellor, Central University, Kashmir" },
        { id: 4, name: "Prof. Qayyum Hussain", designation: "Vice Chancellor, Cluster University Kashmir" },
        { id: 5, name: "Prof. Sanjeev Jain", designation: "Vice-Chancellor, Central University, Jammu" },
        { id: 6, name: "Prof. B.S. Sahay", designation: "Director, IIM Jammu" },
        { id: 7, name: "Dr. Manoj Singh Gaur", designation: "Director, IIT Jammu" },
        { id: 8, name: "Dr. Shakti Kumar Gupta", designation: "Director, AIIMS Jammu" },
        { id: 9, name: "Prof. Bechan Lal", designation: "Vice-Chancellor, Cluster University Jammu" },
        { id: 10, name: "Prof. Pragati Kumar", designation: "Vice-Chancellor, SMVDU" },
        { id: 11, name: "Prof. Akbar Masood", designation: "Vice-Chancellor, BGSBU" },
        { id: 12, name: "Dr. B.N. Tripathi", designation: "Vice-Chancellor, SKUAST, Jammu" },
        { id: 13, name: "Prof. Umesh Rai", designation: "Vice-Chancellor, University of Jammu" },
        { id: 14, name: "Lt. Gen. Dr. Anup Banerji", designation: "Director, AIIMS Kashmir" },
        { id: 15, name: "Prof. S. K. Mehta", designation: "Vice-Chancellor, University of Ladakh" },
        { id: 16, name: "Mr. A Rajarajan", designation: "Director, Satish Dhawan Space Centre" },
        { id: 17, name: "Prof. Shantanu Bhattacharya", designation: "Director, CSIO" },
        { id: 18, name: "Prof. Rajeev Ahuja", designation: "Director, IIT Ropar" },
        { id: 19, name: "Prof. Bhola Ram Gurjar", designation: "Director, NITTTR Chandigarh" },
        { id: 20, name: "Prof. R. P. Tiwari", designation: "Vice-Chancellor, CU Punjab" },
        { id: 21, name: "Dr. Kumar Gaurav", designation: "Dy. Director, PGI" },
        { id: 22, name: "Prof. Arvind", designation: "Vice-Chancellor, Punjabi University" },
        { id: 23, name: "Prof. Adarsh Pal Vij", designation: "Chairman, Punjab Pollution Control Board" },
        { id: 24, name: "Prof. B. R. Kamboj", designation: "Vice-Chancellor, HAU" },
        { id: 25, name: "Prof. S. K. Mehta", designation: "Vice-Chancellor, UOL" },
        { id: 26, name: "Prof. C. C. Tripathi", designation: "Director, NITTTR Bhopal" },
        { id: 27, name: "Prof. Anupam Shukla", designation: "Director, NIT Surat" },
        { id: 28, name: "Prof. K. P. Singh", designation: "Vice-Chancellor, MJP Rohilkhand University" },
        { id: 29, name: "Dr. Madhu Chitkara", designation: "Vice-Chancellor, Chitkara University" },
        { id: 30, name: "Mr. Ajay Gupta", designation: "CEO, SATYA Group" }
      ]
    }
  

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




export default ShikshaKumbh2024;
