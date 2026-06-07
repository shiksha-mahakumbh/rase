import React from "react";
import Footer from "../../component/Footer";
import NavBar from "../../component/NavBar";
import CommitteeDetailShell from "@/components/committee/CommitteeDetailShell";
import CommitteeMemberSection from "@/components/committee/CommitteeMemberSection";

const ShikshaMahaKumbh2025 = () => {
  const data = {
    Patron: [
      { id: 1, name: "Prof. Dulal Panda", designation: "Director, NIPER SAS Nagar" },
    ],
    Director: [
      {
        id: 1,
        name: "Dr. Thakur SKR",
        designation:
          "Scientist/Engineer-SF, ISRO; Director, Department of Holistic Education (DHE)",
      },
    ],
    Secretaries: [
      { id: 1, name: "Prof. Kulbhushan Tikoo", designation: "NIPER SAS Nagar" },
      { id: 2, name: "Prof. Tarun Sharma", designation: "NIPER SAS Nagar" },
      {
        id: 3,
        name: "Dr. Jatinder Garg",
        designation: "Controller of Examinations, Central University of HP, Dharamshala (HP)",
      },
      { id: 4, name: "Sh. Pankaj Kumar", designation: "CEO, KBD, Kurukshetra" },
    ],
    JointSecretaries: [
      { id: 1, name: "Prof. Krishan Gopal", designation: "NIPER SAS Nagar" },
      { id: 2, name: "Dr. Neeraj Mittal", designation: "Secretary, DHE" },
      { id: 3, name: "Dr. Krishna Pandey", designation: "UIET, Kurukshetra" },
    ],
    Conveners: [
      { id: 1, name: "Sh. Saurab Choudhary", designation: "President, DHE" },
      { id: 2, name: "Dr. Vikram Singh", designation: "NIPER SAS Nagar" },
      { id: 3, name: "Dr. Shamsher Singh", designation: "AB College, Pathankot" },
      { id: 4, name: "Dr. Vipin Kumar Jain", designation: "Dean, CBLU, Bhiwani" },
    ],
    AdvisoryCommittee: [
      { id: 1, name: "Sh. Vijay Nadda", designation: "Organizing Secretary, Vidya Bharti North Zone" },
      { id: 2, name: "Sh. Bal Kishan", designation: "Joint Organizing Secretary, Vidya Bharti North Zone" },
      { id: 3, name: "Sh. Sukhraj Sethia", designation: "President, Vidya Bharti North Zone" },
      { id: 4, name: "Smt. Deepti Dharmani", designation: "Vice President, Vidya Bharti North Zone" },
      { id: 5, name: "Sh. Dilaram Chauhan", designation: "General Secretary, Vidya Bharti North Zone" },
      { id: 6, name: "Sh. Chander Has Gupta", designation: "Secretary, Vidya Bharti North Zone" },
      { id: 7, name: "Prof. Som Nath", designation: "VC, Kurukshetra University" },
      { id: 8, name: "Lt.(Dr.) Virender Pal", designation: "Registrar, Kurukshetra University" },
    ],
    OrganizingCommittee: [
      { id: 1, name: "Dr. Deepika Singh", designation: "NIPER SAS Nagar" },
      { id: 2, name: "Dr. B. B. Mishra", designation: "NIPER SAS Nagar" },
      { id: 3, name: "Dr. U. R. Lal", designation: "NIPER SAS Nagar" },
      { id: 4, name: "Dr. Amit Kansal", designation: "Ex-Director NHPC" },
      { id: 5, name: "Dr. Vijay Kumar Sharma", designation: "NIT Srinagar" },
      { id: 6, name: "Sh. Sanyog Dutt", designation: "Director, Swarup Consultancy" },
      { id: 7, name: "Dr. Jitesh Kumar Pandey", designation: "HR Manager, Government of Punjab" },
      { id: 8, name: "Sh. Sanjay Soni", designation: "Director, CSR, Vidya Bharti Haryana" },
      { id: 9, name: "Sh. Sanjay Chaudhary", designation: "Founder, HUM Foundation" },
      { id: 10, name: "Adv. Prashant Tripathi", designation: "Lawyer, Supreme Court of India" },
      { id: 11, name: "Sh. Bhupendra Dharmani", designation: "Ex-Information Commissioner, Haryana" },
      { id: 12, name: "Dr. Shiksha Sharma", designation: "Academic Advisor, DHE" },
      { id: 13, name: "Dr. Ashwini Rana", designation: "NIT Hamirpur" },
      { id: 14, name: "Dr. Ravi Kant", designation: "IIT Ropar" },
      { id: 15, name: "Dr. Praveen Kumar", designation: "IACS, Kolkata" },
      { id: 16, name: "Prof. Sathans", designation: "NIT Kurukshetra" },
      { id: 17, name: "Dr. Pooja Mahajan", designation: "Member DHE" },
      { id: 18, name: "Dr. Rajneesh Talwar", designation: "Chitkara University" },
      { id: 19, name: "Dr. Tarun Changotra", designation: "GNDU Campus Pathankot" },
      { id: 20, name: "Dr. Lakshmi Dhingra", designation: "AB College Pathankot" },
      { id: 21, name: "Sh. Satish Saini", designation: "Treasurer, DHE" },
      { id: 22, name: "Prof. (Dr.) Ravishankar", designation: "IIFT Delhi" },
      { id: 23, name: "Prof. (Dr.) Sudhir Aggarwal", designation: "Sr. Scientist, USA" },
      { id: 24, name: "Prof. Dr. R.K. Mishra", designation: "SLIET, Longowal" },
      { id: 25, name: "Prof. Vivek Kumar", designation: "IIT Delhi" },
      { id: 26, name: "Dr. Gaurav Sharma", designation: "Principal Scientist, IIT Delhi" },
      { id: 27, name: "Dr. Ramotar Meena", designation: "JNU" },
      { id: 28, name: "Dr. Sachin Kumar Gupta", designation: "MIT, Meerut" },
    ],
  };

  return (
    <>
      <NavBar />
      <CommitteeDetailShell editionTitle="Shiksha Maha Kumbh 5.0 — NIPER Mohali (2025)">
        <CommitteeMemberSection title="Conference Patron" members={data.Patron} badge="Leadership" />
        <CommitteeMemberSection title="Conference Director" members={data.Director} />
        <CommitteeMemberSection title="Conference Secretaries" members={data.Secretaries} />
        <CommitteeMemberSection title="Conference Joint Secretaries" members={data.JointSecretaries} />
        <CommitteeMemberSection title="Conference Conveners" members={data.Conveners} />
        <CommitteeMemberSection title="Advisory Committee" members={data.AdvisoryCommittee} badge="Advisory" />
        <CommitteeMemberSection title="Organizing Committee" members={data.OrganizingCommittee} badge="Organising" />
      </CommitteeDetailShell>
      <Footer />
    </>
  );
};

export default ShikshaMahaKumbh2025;
