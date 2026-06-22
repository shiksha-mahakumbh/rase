import type { CommitteeEditionData } from "./types";
import { m } from "./types";
import { committeeModuleKeyForEdition, committeeSlugForEdition } from "@/lib/committee/edition-slugs";

/** Edition 5.0 — NIPER SAS Nagar (Oct–Nov 2025). Source: brochure page 12. */
export const COMMITTEE_EDITION_5_0: CommitteeEditionData = {
  edition: "5.0",
  slug: committeeSlugForEdition("5.0"),
  moduleKey: committeeModuleKeyForEdition("5.0"),
  breadcrumbLabel: "Shiksha Mahakumbh 5.0",
  pageTitle: "Shiksha Mahakumbh 5.0 — NIPER SAS Nagar (2025)",
  venue: "NIPER SAS Nagar",
  dates: "31 October – 2 November 2025",
  theme: "Classroom to Society: Building a Healthier World through Education",
  year: "2025",
  eventHref: "/past_event/shiksha-mahakumbh-5.0",
  sections: [
    {
      title: "Conference Patron",
      badge: "Leadership",
      members: [m("Prof. Dulal Panda", "Director, NIPER SAS Nagar")],
    },
    {
      title: "Conference Director",
      members: [
        m(
          "Dr. Thakur SKR",
          "Scientist/Engineer-SF, ISRO; Director, Department of Holistic Education (DHE)"
        ),
      ],
    },
    {
      title: "Conference Secretaries",
      members: [
        m("Prof. Kulbhushan Tikoo", "NIPER SAS Nagar"),
        m("Prof. Tarun Sharma", "NIPER SAS Nagar"),
        m(
          "Dr. Jatinder Garg",
          "Controller of Examinations, Central University of HP, Dharamshala (HP)"
        ),
        m("Sh. Pankaj Kumar", "CEO, KBD, Kurukshetra"),
      ],
    },
    {
      title: "Conference Joint Secretaries",
      members: [
        m("Prof. Krishan Gopal", "NIPER SAS Nagar"),
        m("Dr. Neeraj Mittal", "Secretary, DHE"),
        m("Dr. Krishna Pandey", "UIET, Kurukshetra"),
      ],
    },
    {
      title: "Conference Conveners",
      members: [
        m("Sh. Saurab Choudhary", "President, DHE"),
        m("Dr. Vikram Singh", "NIPER SAS Nagar"),
        m("Dr. Shamsher Singh", "AB College, Pathankot"),
        m("Dr. Vipin Kumar Jain", "Dean, CBLU, Bhiwani"),
      ],
    },
    {
      title: "Advisory Committee",
      badge: "Advisory",
      members: [
        m("Sh. Vijay Nadda", "Organizing Secretary, Vidya Bharti North Zone"),
        m("Sh. Bal Kishan", "Joint Organizing Secretary, Vidya Bharti North Zone"),
        m("Sh. Sukhraj Sethia", "President, Vidya Bharti North Zone"),
        m("Smt. Deepti Dharmani", "Vice President, Vidya Bharti North Zone"),
        m("Sh. Dilaram Chauhan", "General Secretary, Vidya Bharti North Zone"),
        m("Sh. Chander Has Gupta", "Secretary, Vidya Bharti North Zone"),
        m("Prof. Som Nath", "VC, Kurukshetra University"),
        m("Lt.(Dr.) Virender Pal", "Registrar, Kurukshetra University"),
      ],
    },
    {
      title: "Organizing Committee",
      badge: "Organising",
      members: [
        m("Dr. Deepika Singh", "NIPER SAS Nagar"),
        m("Dr. B. B. Mishra", "NIPER SAS Nagar"),
        m("Dr. U. R. Lal", "NIPER SAS Nagar"),
        m("Dr. Amit Kansal", "Ex-Director NHPC"),
        m("Dr. Vijay Kumar Sharma", "NIT Srinagar"),
        m("Sh. Sanyog Dutt", "Director, Swarup Consultancy"),
        m("Dr. Jitesh Kumar Pandey", "HR Manager, Government of Punjab"),
        m("Sh. Sanjay Soni", "Director, CSR, Vidya Bharti Haryana"),
        m("Sh. Sanjay Chaudhary", "Founder, HUM Foundation"),
        m("Adv. Prashant Tripathi", "Lawyer, Supreme Court of India"),
        m("Sh. Bhupendra Dharmani", "Ex-Information Commissioner, Haryana"),
        m("Dr. Shiksha Sharma", "Academic Advisor, DHE"),
        m("Dr. Ashwini Rana", "NIT Hamirpur"),
        m("Dr. Ravi Kant", "IIT Ropar"),
        m("Dr. Praveen Kumar", "IACS, Kolkata"),
        m("Prof. Sathans", "NIT Kurukshetra"),
        m("Dr. Pooja Mahajan", "Member DHE"),
        m("Dr. Rajneesh Talwar", "Chitkara University"),
        m("Dr. Tarun Changotra", "GNDU Campus Pathankot"),
        m("Dr. Lakshmi Dhingra", "AB College Pathankot"),
        m("Sh. Satish Saini", "Treasurer, DHE"),
        m("Prof. (Dr.) Ravishankar", "IIFT Delhi"),
        m("Prof. (Dr.) Sudhir Aggarwal", "Sr. Scientist, USA"),
        m("Prof. Dr. R.K. Mishra", "SLIET, Longowal"),
        m("Prof. Vivek Kumar", "IIT Delhi"),
        m("Dr. Gaurav Sharma", "Principal Scientist, IIT Delhi"),
        m("Dr. Ramotar Meena", "JNU"),
        m("Dr. Sachin Kumar Gupta", "MIT, Meerut"),
      ],
    },
    {
      title: "Key Visionaries — Conclaves & Programmes",
      members: [
        m("Dr. Manoj Teotia", "CRRID, Chandigarh — Conclaves"),
        m("Prof. Brahmjit Singh", "NIT Kurukshetra — Academics"),
        m("Adv. Aarti Sharma", "Member, DHE — Media"),
        m("Adv. Varinder Garg", "Director, DHBVNL — Finance"),
        m("Smt. Sonu Sharma", "Member, DHE — Students' Programmes"),
      ],
    },
  ],
};
