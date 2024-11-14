import React from 'react';
import Footer from '../../component/Footer';
import CompanyInfo from '../../component/CompanyInfo';
import NavBar from '../../component/NavBar';

const ShikshaMahaKumbh2024 = () => {
  const data = {
    NationalAdvisoryCommittee: [
      { id: 1, name: "Mr. S. Somanath", designation: "Chairman, ISRO" },
      { id: 2, name: "Mr. A. Rajarajan", designation: "Director, SDSC" },
      { id: 3, name: "Dr. Samir V. Kamat", designation: "Chairman, DRDO" },
      { id: 4, name: "Dr. Ajit Kumar Mohanty", designation: "Chairman, DAE" },
      { id: 5, name: "Prof. Dinesh Prasad Saklani", designation: "Chairman, NCERT" },
      { id: 6, name: "Mrs. Nidhi Chhibber", designation: "Chairperson, CBSE" },
      { id: 7, name: "Prof. Yogesh Singh", designation: "Chairperson, NCTE" },
      { id: 8, name: "Dr. Nirmaljeet Singh Kalsi", designation: "Chairperson, NCVET" },
      { id: 9, name: "Mr. Mamidala Jagadesh Kumar", designation: "Chairperson, UGC" },
      { id: 10, name: "Prof. Rajive Kumar", designation: "Member Secretary, AICTE" },
      { id: 11, name: "Mr. Govindan Rangarajan", designation: "Director, IISc" },
      { id: 12, name: "Prof. Anantha Ramakrishnan", designation: "Director, CSIO" },
      { id: 13, name: "Prof. Adarsh Pal Vij", designation: "Chairman, PPCB" },
      { id: 14, name: "Dr. Jaideep Arya", designation: "Chairman, Yog Aayog, Haryana" },
      { id: 15, name: "Mr. Prateek Kishore", designation: "Director, TBRL/DRDO" },
      { id: 16, name: "Mr. Kashmiri Lal", designation: "Org. Secretary, SJM" },
      { id: 17, name: "Mr. Raghunandan", designation: "Org. Secretary, VB - USS" },
      { id: 18, name: "Mr. Satish Kumar", designation: "Joint Org. Secretary, SJM" },
      { id: 19, name: "Prof. Pawan Kumar Singh", designation: "Director, IIM Trichy" },
      { id: 20, name: "Prof. Laxmidhar Behera", designation: "Director, IIT Mandi" },
      { id: 21, name: "Prof. Manoj Singh Gaur", designation: "Director, IIT Jammu" },
      { id: 22, name: "Prof. Shreepad Karmakar", designation: "Director, IIT Bhubaneswar" },
      { id: 23, name: "Prof. V. R. Desai", designation: "Director, IIT Dharwad" },
      { id: 24, name: "Prof. Binod Kumar Kanaujia", designation: "Director, NIT Jalandhar" },
      { id: 25, name: "Prof. B.V. Ramana Reddy", designation: "Director, NIT Kurukshetra" },
      { id: 26, name: "Prof. O. R. Jaiswal", designation: "Director, NIT Goa" },
      { id: 27, name: "Prof. Anupam Shukla", designation: "Director, NIT Surat" },
      { id: 28, name: "Prof. Lalit Kumar Avasthi", designation: "Director, NIT Uttarakhand" },
      { id: 29, name: "Prof. M. C. Govil", designation: "Director, NIT Sikkim" },
      { id: 30, name: "Prof. Gautam Sutradhar", designation: "Director, NIT Jamshedpur" },
      { id: 31, name: "Prof. Ajay Sharma", designation: "Director, NIT Delhi" },
      { id: 32, name: "Prof. Venu Gopal", designation: "Director, NIT Nagaland" },
      { id: 33, name: "Prof. Ramana Rao", designation: "Director, NIT Raipur" },
      { id: 34, name: "Prof. Prasad Krishna", designation: "Director, NIT Calicut" },
      { id: 35, name: "Prof. K. K. Shukla", designation: "Director, MANIT Bhopal" },
      { id: 36, name: "Prof. N. P. Padhy", designation: "Director, MNIT Jaipur" },
      { id: 37, name: "Prof. Usha", designation: "Director, NITTTR Chennai" },
    ],

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
      { id: 16, name: "Dr. Praveen Sharma", designation: "Banasthali University" },
    ]
  };

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
              <li key={member.id} className="flex justify-between p-1">
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
