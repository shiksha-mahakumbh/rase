import React from "react";

const AcademicCouncil: React.FC = () => {
  const data = [
    {
      heading: "ACADEMIC COUNCIL",
      members: [
        { title: "Patron", names: [ "Dr. Ashok Pal"],address: "President, Vidya Bharti - North Zone"  },
        { title: "Patron", names: [  "Mr. Vijay Kumar Nadda"] ,address:"Organising Secratery, Vidya Bharti - North Zone"},
      ],
    },
    {
      heading: "ADVISORY COMMITTEE",
      members: [
        { title:"",names: "Prof. Somnath Sachdeva", address: "Vice Chancellor, Kurukshetra University, Haryana" },
        { title:"",names:  "Prof. Binod Kumar Kanaujia", address: "Director, NIT Jalandhar, Punjab" },
        { title: "",names: "Prof. B. V. Reddy", address: "Director, NIT Kurukshetra, Haryana" },
        { title:"",names:  "Prof. Deepti Dharmani", address: "Vice Chancellor, Chaudhary Bansi Lal University, Haryana" },
        { title:"",names:  "Prof. Amar Pal Singh", address: "Vice Chancellor, Dr. R. M.L. National Law University, UP" },
        { title: "",names: "Prof. R. P. Tiwari", address: "Vice Chancellor, Central University of Punjab, Punjab" },
        { title: "",names: "Prof. Tankeshwar Kumar", address: "Vice Chancellor, Central University of Haryana, Haryana" },
        { title: "",names: "Prof. S. P. Bansal", address: "Vice Chancellor, Central University of Himachal Pradesh, H.P." },
        { title: "",names: "Prof. M. C. Govil", address: "Director, NIT Sikkim, Sikkim" },
        { title: "",names: "Prof. Dinesh Kumar", address: "Vice Chancellor, Gurugram University, Haryana" },
        { title: "",names: "Prof. B. R. Kamboj", address: "Vice Chancellor, Haryana Agriculture University, Haryana" },
        { title: "",names: "Prof. Kartar Singh Dhiman", address: "SKA University, Haryana" },
        { title: "",names: "Dr. Thakur Sudesh Kumar Raunija", address: "Sci/Engr-SF, ISRO, and Director, DHE & VBITR" },
      ],
    },
    {
      heading: "ACADEMIC COMMITTEE",
      members: [
        { title: "Chairperson", names: "Dr. Ravi Prakash", address: "Chaudhary Bansi Lal University, Haryana" },
        { title: "Vice-Chairperson", names: "Prof. Brahmjit Singh", address: "NIT Kurukshetra, Haryana" },
        { title: "Members", names: "Prof. Bala Lakhendra", address: "BHU Varanasi, U.P." },
        { title: "Members", names:  "Prof. Sathans", address: " NIT Kurukshetra, Haryana" },
        { title: "Members", names:  "Prof. Anish Sachdeva",address: "NIT Jalandhar, Punjab" },
        { title: "Members", names:  "Prof. Anish Sachdeva",address: "NIT Jalandhar, Punjab" },
        { title: "Members", names:  "Dr. Rajeev Arya, Assistant Professor",address: "NIT Patna, Bihar" },
      ],
    },
    {
      heading: "SECTIONS",
      sections: [
        {
          title: "Engineering Section",
          president: "Prof. Brahmjit Singh, NIT Kurukshetra, Haryana",
          members: [
            "Dr. Vipin Sharma, Technical Consultant, HCL Technologies, Noida",
            "Dr. Mukesh Khandelwal,  Delhi University",
            "Dr. Sonu Bala Garg, IKG Punjab Technical University, Jalandhar",
            "Dr. Vikash Kumar Garg, SLIET, Longowal",
            
            "Dr. Gaurav Sharma, IIT Delhi"
          ],
        },
        {
          title: "Management & International Relations",
          president: "Dr. Samriti Mahajan, Lingaya’s Vidyapeeth, Faridabad, Haryana",
          members: [],
        },
        {
          title: "Social Sciences",
          president: "Prof. S. P. Kaushik, Kurukshetra University, Haryana",
          members: [
            "Dr. Atryee Saha, JNU, Delhi",
           
          ],
        },
        {
          title: "Humanities",
          president: "Dr. Kuldeep Mehandiratta, Kurukshetra University, Haryana",
          members: [],
        },
        {
          title: "Business, Startup & Entrepreneurship",
          president: "Dr. Raghvendra Singh Yadav, Mangalmay Institute of Management, UP",
          members: [],
        },
        {
          title: "Ed Tech and Technology",
          president: "Dr. Sachin Sharma, Shri Madhav College of Education and Technology, Hapur, UP",
          members: ["Dr. Manish Kumar, Zakir Hussain College, Delhi University"],
        },
        {
          title: "Gurukul Education",
          president: "Prof. Shubha Sharma, Vedanta PG Girls College, Ringus, Sikar, Rajasthan",
          members: [],
        },
        {
          title: "Sports and Physical Education",
          president: "Dr. Jasbir Singh, DAV University Jalandhar, Punjab",
          members: [],
        },
        {
          title: "Medicine",
          president: "Dr. Naresh Bhargava, BPS Women University, Sonepat",
          members: [],
        },
        {
          title: "Fundamental Sciences",
          president: "Prof. Anand, Kurukshetra University, Haryana",
          members: ["Dr. Rajesh Agnihotri, UIET Kurukshetra University, Haryana",
                    "Dr. Vipin Jain, CLBU, Bhiwani",
                     "Dr. Pankaj, Centeral University of Himachal Pradesh.",
                     "Dr. Kapil Sood, GDC Dhaliara, HP",
          ],
        },
        {
          title: "Environment and Water Conservation",
          president: "Dr. Vivek Kumar, Prof & Head, Centre for Rural Development and Technology, Indian Institute of Technology Delhi",
          members: ["Dr. Updesh Verma, Manyavar Kanshiram Government Degree College, Ghaziabad, UP"],
        },
        {
          title: "Culture",
          president: "Prof. Sanjay Jha, LNMU, Darbhanga, Bihar",
          members: [],
        },
        {
          title: "Languages",
          president: "Dr. Virender Pal, IIHS Kurukshetra University",
          members: ["Dr. Ram Chandra, Kurukshetra University", "Dr. Sunaina Saini, Zakir Hussain College, Delhi University"],
        },
        {
          title: "Agriculture and Veterinary Sciences",
          president: "Prof. Neelesh Sharma, SKUAST Jammu, J&K",
          members: [],
        },
        {
          title: "School Education",
          president: "Dr. Digvijay Singh, ITTR, Kurukshetra University",
          members: ["Dr. Sandeep, SIATE, Palwal, Haryana", "Dr. Sumant Goyal, SIATE, Palwal, Haryana"],
        },
        {
          title: "Education for Disabled",
          president: "Dr. Jyoti Tiwari, Army Institute of Education, Greater NOIDA, U.P.",
          members: [],
        },
      ],
    },
  ];

  
  return (
    <div className="container mx-auto px-4 py-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Shiksha Mahakumbh Abhiyan</h1>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Department of Holistic Education <br />
        Vidya Bharti Institute of Training and Research Chandigarh
      </h2>

      {data.map((section, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-3xl font-semibold mb-4 text-blue-700">{section.heading}</h3>

          {section.members && (
            <table className="table-auto border-collapse w-full bg-white shadow-md rounded-md mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Title/Role</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Affiliation</th>
                </tr>
              </thead>
              <tbody>
                {section.members.map((member, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{member.title || "Member"}</td>
                    <td className="border px-4 py-2">
                      {Array.isArray(member.names) ? member.names.join(", ") : member.names}
                    </td>
                    <td className="border px-4 py-2">{'address' in member ? member.address : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {section.sections && (
            <div className="mt-6">
              {section.sections.map((subSection, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="text-2xl font-semibold mb-2 text-green-700">{subSection.title}</h4>
                  <table className="table-auto border-collapse w-full bg-white shadow-md rounded-md">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border px-4 py-2 text-left">Role</th>
                        <th className="border px-4 py-2 text-left">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">President</td>
                        <td className="border px-4 py-2">{subSection.president}</td>
                      </tr>
                      {subSection.members.length > 0 &&
                        subSection.members.map((member, memberIdx) => (
                          <tr key={memberIdx}>
                            <td className="border px-4 py-2">Member</td>
                            <td className="border px-4 py-2">{member}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AcademicCouncil;