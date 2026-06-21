import type { CommitteeEditionData } from "./types";
import { m } from "./types";
import { committeeModuleKeyForEdition, committeeSlugForEdition } from "@/lib/committee/edition-slugs";

/** Edition 6.0 — NIT Hamirpur (Oct 2026). Source: brochure page 19. */
export const COMMITTEE_EDITION_6_0: CommitteeEditionData = {
  edition: "6.0",
  slug: committeeSlugForEdition("6.0"),
  moduleKey: committeeModuleKeyForEdition("6.0"),
  breadcrumbLabel: "Shiksha Mahakumbh 6.0",
  pageTitle: "Shiksha Mahakumbh 6.0 — NIT Hamirpur (2026)",
  venue: "NIT Hamirpur",
  dates: "9–11 October 2026",
  theme: "Shiksha, Prakriti aur Pragati — Education for Development and Harmony with Nature",
  year: "2026",
  eventHref: "/departments/academic-council",
  sections: [
    {
      title: "Patron",
      badge: "Leadership",
      members: [
        m("Prof. Hiralal Murlidhar Suryawanshi", "Director, NIT Hamirpur"),
      ],
    },
    {
      title: "Director General",
      members: [
        m(
          "Dr. Thakur SKR",
          "Scientist/Engineer-SF, ISRO; Director General, Department of Holistic Education"
        ),
      ],
    },
    {
      title: "Secretaries",
      members: [
        m("Dr. Jatinder Garg", "Controller of Examinations, Central University of Himachal Pradesh"),
        m("Dr. Chander Prakash", "NIT Hamirpur"),
      ],
    },
    {
      title: "Joint Secretaries",
      members: [
        m("Smt. Sonu Sharma", "President, DHE"),
        m("Dr. Krishna Pandey", "UIET, Kurukshetra"),
        m("Dr. Archana Nanoty", "Registrar, NIT Hamirpur"),
      ],
    },
    {
      title: "Conveners",
      members: [
        m("Dr. Shamsher Singh", "Manager, DHE"),
        m("Prof. Brahmjit Singh", "NIT Kurukshetra"),
        m("Dr. Pawan Kumar Sharma", "NIT Hamirpur"),
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
        m("Prof. Prem Lal Gautam", "Padma Shree 2026, Former VC"),
        m("Prof. Laxmidhar Behera", "Director, IIT Mandi"),
        m("Lt. Gen. (Dr.) Daljit Singh", "Director, AIIMS Bilaspur"),
        m("Prof. Sat Prakash Bansal", "Vice Chancellor, CU HP"),
        m("Prof. Rajeshwar Singh Chandel", "Dr. Y. S. Parmar University of Horticulture and Forestry"),
        m("Prof. Prafulla Agnihotri", "Director, IIM Sirmaur"),
        m("Prof. Mani Kant Paswan", "Director, SLIET Longowal"),
        m("Prof. Bhola Ram Gurjar", "Director, NITTR Chandigarh"),
        m("Prof. Arvind Kumar", "Ex VC PU Patiala, IISER Mohali"),
        m("Prof. Kailash Chand", "Ex. VC, Kurukshetra University"),
        m("Prof. Surender Kashyap", "Ex VC, AMRU, Mandi"),
        m("Prof. Dev Dutt Sharma", "Ex VC SPU Mandi, HPU Shimla"),
        m("Dr. Katar Chand Sounkh", "Padma Shree Awardee"),
        m("Sh. Nek Ram Sharma", "Padma Shree Awardee"),
        m("Sh. Hariman Sharma", "Padma Shree Awardee"),
      ],
    },
    {
      title: "Organizing Committee",
      badge: "Organising",
      members: [
        m("Prof. Rajeev Ahuja", "Director, IIT Ropar"),
        m("Dr. Thakur SKR", "Director General, DHE"),
        m("Dr. Siddartha Chauhan", "NIT Hamirpur"),
        m("Dr. Kuldeep Kumar", "NIT Hamirpur"),
        m("Prof. Ravi Kumar", "NIT Hamirpur"),
        m("Dr. Pooja", "CSIR-CSIO Chandigarh"),
        m("Er. Pankaj Kumar", "NIT Hamirpur"),
        m("Dr. Somesh Kumar", "NIT Hamirpur"),
        m("Dr. Rakesh Kumar", "NIT Hamirpur"),
        m("Adv. Aarti Sharma", "Member, DHE"),
        m("Dr. Arvind Kumar", "NIT Hamirpur"),
        m("Dr. Vipin Jain", "Registrar, NIT Hamirpur"),
        m("Dr. Sujeet Thakur", "IIT Delhi"),
        m("Prof. Y. D. Sharma", "NIT Hamirpur"),
        m("Dr. Rajeshwar Banshtu", "NIT Hamirpur"),
        m("Dr. Praveen Kumar Sharma", "Plaksha University, Mohali"),
        m("Dr. Gautam Dutt", "Exhibition Convenor"),
        m("Smt. Jyoti Tiwari", "Exhibition Convenor"),
        m("Sh. Anil Sheoran", "Exhibition Convenor"),
        m("Smt. Sonu Sharma", "President, DHE"),
        m("Dr. Rajeev Kumar", "NIT Hamirpur"),
        m("Smt. Meenu", "Treasurer, DHE"),
        m("Dr. Shiksha Sharma", "Member, DHE"),
        m("Sh. Sanjay Soni", "Director, CSR, Vidya Bharti Haryana"),
        m("Dr. Pardeep Kumar", "NIT Hamirpur"),
        m("Dr. Jitesh Pandey", "Government of Punjab"),
        m("Dr. Krishna Pandey", "UIET Kurukshetra"),
        m("Sh. Bikash Kumar", "COO, SavantX Technology"),
      ],
    },
  ],
};
