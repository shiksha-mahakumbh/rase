import type { ConferenceSectionId } from "@/lib/cms/conference-support-sections";
import { normalizeAffiliationKey } from "@/lib/cms/partner-showcase";

export type MasterAffiliation = {
  name: string;
  section: ConferenceSectionId;
  website?: string;
};

/** Names that must never appear in affiliation counts (locations, roles, professions). */
export const AFFILIATION_EXCLUSION_KEYS = new Set(
  [
    "Ahmedabad",
    "Bengaluru",
    "Kolkata",
    "Delhi",
    "Noida",
    "Bathinda",
    "Mohali",
    "Kurukshetra",
    "Karnataka",
    "Punjab",
    "Chhattisgarh",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Bhiwani",
    "Mandi",
    "Director",
    "Former VC",
    "Vice Chancellor CUHP",
    "Head of Department",
    "Research Associate",
    "Exhibition Convenor",
    "Logistics Coordinator",
    "Organizing Secretary",
    "Secretary Vidya Bharti North Zone",
    "General Secretary Vidya Bharti North Zone",
    "Vice President Vidya Bharti North Zone",
    "CEO Haryana City Bus Service",
    "Padma Shri Awardee",
    "Padma Shri 2026 Former VC",
    "AI Specialist",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Blockchain Developer",
    "Blockchain Consultant",
    "Machine Learning Engineer",
    "Quantum Computing Researcher",
    "Quantum Hardware Specialist",
    "Quantum Systems Engineer",
    "Quantum Algorithm Developer",
    "Network Security Engineer",
    "IT Security Specialist",
    "Senior Data Analyst",
    "Supply Chain Analyst",
    "UX Designer",
    "Risk Management Consultant",
  ].map(normalizeAffiliationKey)
);

function row(section: ConferenceSectionId, name: string, website?: string): MasterAffiliation {
  return { section, name, ...(website ? { website } : {}) };
}

const SECTION_A: MasterAffiliation[] = [
  row("A", "Department of Holistic Education", "https://www.dhe.org.in/"),
  row("A", "Swadeshi Jagran Manch", "https://www.swadeshijagran.org/"),
  row("A", "Vidya Bharati", "https://www.vidyabharati.org/"),
  row("A", "Arogya Bharati Haryana"),
  row("A", "ABVP Delhi"),
  row("A", "Jaipur Dialogues"),
  row("A", "GEIO Gita"),
  row("A", "Think India Delhi"),
  row("A", "Virsa Sambhal Muhim"),
];

const SECTION_B: MasterAffiliation[] = [
  row("B", "Ministry of Education"),
  row("B", "NCERT", "https://ncert.nic.in/"),
  row("B", "Haryana Yog Aayog"),
  row("B", "Haryana State Higher Education Council"),
  row("B", "Department of Technical Education Haryana"),
  row("B", "Department of Skill Development & IT Haryana"),
  row("B", "National Council for Vocational Education and Training (NCVET)"),
  row("B", "National Commission for Indian System of Medicine (NCISM)"),
  row("B", "Bureau of Indian Standards (BIS)"),
  row("B", "Indian Council of Historical Research (ICHR)"),
  row("B", "Indian Council of Agricultural Research (ICAR)"),
  row("B", "Punjab Pollution Control Board"),
  row("B", "Punjab School Education Board"),
  row("B", "Government of Punjab"),
  row("B", "Supreme Court of India"),
  row("B", "Indian Army"),
  row("B", "Technology Development Board (DST)"),
  row("B", "Jammu & Kashmir Board of School Education (JKBOSE)"),
];

const SECTION_C: MasterAffiliation[] = [
  row("C", "CSIR-CLRI"),
  row("C", "CSIR-CSIO Chandigarh"),
  row("C", "CSIR-NCL"),
  row("C", "CSIR-NIIST"),
  row("C", "CSIR-NEERI"),
  row("C", "CSIR-NIScPR Delhi"),
  row("C", "BARC"),
  row("C", "INST Mohali"),
  row("C", "IISER Mohali", "https://www.iisermohali.ac.in/"),
  row("C", "NIPER Mohali", "https://www.niper.gov.in/"),
  row("C", "PGIMER Chandigarh", "https://pgimer.edu.in/"),
  row("C", "ICAR-CITH"),
  row("C", "ICAR-CPRI"),
  row("C", "ICAR-IIPR"),
  row("C", "ICAR Research Complex for Eastern Region"),
  row("C", "DRDO", "https://www.drdo.gov.in/"),
  row("C", "DGRE-DRDO"),
  row("C", "IGCAR"),
  row("C", "IRDE"),
  row("C", "CSTRI"),
];

const SECTION_D: MasterAffiliation[] = [
  row("D", "IIT Delhi", "https://home.iitd.ac.in/"),
  row("D", "IIT Kanpur", "https://www.iitk.ac.in/"),
  row("D", "IIT Mandi", "https://www.iitmandi.ac.in/"),
  row("D", "IIT Ropar", "https://www.iitrpr.ac.in/"),
  row("D", "IIT Indore", "https://www.iiti.ac.in/"),
  row("D", "IIT Jammu", "https://www.iitjammu.ac.in/"),
  row("D", "IIM Amritsar", "https://iimamritsar.ac.in/"),
  row("D", "IIM Trichy", "https://www.iimtrichy.ac.in/"),
  row("D", "IIM Sirmaur", "https://iimsirmaur.ac.in/"),
  row("D", "IIM Jammu", "https://iimj.ac.in/"),
  row("D", "IIM Ahmedabad", "https://www.iima.ac.in/"),
  row("D", "IIM Kozhikode", "https://iimk.ac.in/"),
  row("D", "NIT Kurukshetra", "https://nitkkr.ac.in/"),
  row("D", "NIT Jalandhar", "https://nitj.ac.in/"),
  row("D", "NIT Hamirpur", "https://nith.ac.in/"),
  row("D", "NIT Srinagar", "https://nitsri.ac.in/"),
  row("D", "NIT Uttarakhand"),
  row("D", "NIT Jamshedpur", "https://www.nitjsr.ac.in/"),
  row("D", "NITTTR Chandigarh"),
  row("D", "SLIET Longowal", "https://www.sliet.ac.in/"),
  row("D", "AIIMS Bilaspur"),
  row("D", "AIIMS Bhubaneswar", "https://www.aiimsbhubaneswar.nic.in/"),
];

const SECTION_E: MasterAffiliation[] = [
  row("E", "Central University of Punjab"),
  row("E", "Central University of Haryana"),
  row("E", "Central University of Himachal Pradesh"),
  row("E", "Central University of Jammu"),
  row("E", "Central University of Kashmir"),
];

const SECTION_F: MasterAffiliation[] = [
  row("F", "Kurukshetra University", "https://kuk.ac.in/"),
  row("F", "Maharshi Dayanand University"),
  row("F", "Chaudhary Bansi Lal University"),
  row("F", "Indira Gandhi University"),
  row("F", "Gurugram University"),
  row("F", "Chaudhary Devi Lal University"),
  row("F", "Guru Jambheshwar University of Science & Technology"),
  row("F", "DCRUST Murthal"),
  row("F", "CCS Haryana Agricultural University"),
  row("F", "Lala Lajpat Rai University of Veterinary & Animal Sciences"),
  row("F", "Shri Vishwakarma Skill University"),
  row("F", "Dada Lakhmi Chand State University of Performing & Visual Arts"),
  row("F", "Shahid Veerendra Singh University"),
  row("F", "Sardar Patel University"),
  row("F", "Saurashtra University"),
  row("F", "Purnea University"),
  row("F", "Gangadhar Meher University"),
  row("F", "Veer Narmad South Gujarat University"),
  row("F", "Himachal Pradesh University"),
  row("F", "Nalanda University"),
  row("F", "Shri Krishna AYUSH University"),
];

const SECTION_G: MasterAffiliation[] = [
  row("G", "Rishihood University"),
  row("G", "Chitkara University", "https://www.chitkara.edu.in/"),
  row("G", "Arni University"),
  row("G", "Plaksha University"),
  row("G", "Shobhit University"),
  row("G", "Ramaiah University"),
  row("G", "ICFAI Foundation for Higher Education"),
  row("G", "Boston University"),
  row("G", "University of Oxford"),
];

const SECTION_H: MasterAffiliation[] = [
  row("H", "Punjab Engineering College"),
  row("H", "Ramjas College"),
  row("H", "MM PG College"),
  row("H", "National College of Education"),
  row("H", "Ch. Devi Lal State Institute of Engineering & Technology"),
  row("H", "DAV University Jalandhar"),
  row("H", "PTU Jalandhar"),
  row("H", "UIET Kurukshetra University"),
];

const SECTION_I: MasterAffiliation[] = [
  row("I", "School of Eminence, Mohali"),
  row("I", "Vidya Mandir Public Senior Secondary School, Pathankot"),
  row("I", "Kundan International School, Chandigarh"),
  row("I", "PM Shri School Jawahar Navodaya Vidyalaya, Patiala"),
  row("I", "Sawan Sr. Sec. School, Pathankot"),
  row("I", "St. Vivekanand Millennium School, Panchkula"),
  row("I", "Sh. Kulwant Rai Sarvhitkari Vidya Mandir, Chandigarh"),
  row("I", "Angels World School"),
  row("I", "GMSSSS Sector 26 Panchkula"),
  row("I", "Jitenderveer Sarvhitkari Model Sr. Sec. School, Mohali"),
  row("I", "BSH Arya Senior Secondary School, Mohali"),
  row("I", "Wisdom World School, Kurukshetra"),
  row("I", "Adarsh Shishu Vatika Public School, Pathankot"),
  row("I", "Sharda Sarvhitkari Model Sr. Sec. School, Chandigarh"),
  row("I", "SMB Gita primary school (Balghar), Kurukshetra"),
  row("I", "PM Shri Kendriya Vidyalaya, Mohali"),
  row("I", "Geeta Niketan Awasiya Vidyalaya, Kurukshetra"),
  row("I", "Gita Girls Sr. Sec. School, Kurukshetra"),
  row("I", "Gita Niketan Vidya Mandir Sector 3, Kurukshetra"),
  row("I", "Gita Niketan Vidya Mandir, Kurukshetra"),
  row("I", "Shrimad Bhagwad Gita Senior Secondary School, Kurukshetra"),
  row("I", "University senior secondary model school, Kurukshetra"),
  row("I", "Ripu Sudan Singh Gita Vidya Mandir Babain, Kurukshetra"),
  row("I", "Vaishnavi Public School, Pathankot"),
  row("I", "Vatsalya Vatika Primary School, Kurukshetra"),
  row("I", "Aarti Ki Pathshala"),
  row("I", "Govt. Sr. Sec. Smart School PAU"),
  row("I", "Private School Association J&K"),
];

const SECTION_J: MasterAffiliation[] = [
  row("J", "Bharatiya Shikshan Mandal", "https://www.bharatiyashikshanmandalfbd.org/"),
  row("J", "Vijnana Bharati"),
  row("J", "Shiksha Sanskriti Utthan Nyas"),
  row("J", "Saksham"),
  row("J", "Chinmaya Mission"),
  row("J", "ISKCON Kurukshetra"),
  row("J", "Ramakrishna Mission Chandigarh"),
  row("J", "Art of Living (Institutional Programs)"),
  row("J", "Patanjali Research Foundation"),
  row("J", "Sarvhitkari Educational Society"),
  row("J", "Skill Innovator Foundation"),
  row("J", "Pravasi Bhartiya Association"),
  row("J", "Viksit Bharat"),
  row("J", "Swami Vivekananda Association"),
  row("J", "Hariawal Punjab"),
  row("J", "Nikhil Singal Noble Trust"),
];

const SECTION_K: MasterAffiliation[] = [
  row("K", "NHPC", "https://www.nhpcindia.com/"),
  row("K", "NFIL", "https://www.nfil.in/"),
  row("K", "Allengers"),
  row("K", "E2E Networks"),
  row("K", "Requil India", "https://www.requil.com/"),
  row("K", "Youngovator", "https://youngovator.com/"),
  row("K", "SavantX Technology", "https://savantx.com/"),
  row("K", "Sisco Research Laboratories (SRL)"),
  row("K", "S & G Lab Supplies"),
  row("K", "Serenity Solutions"),
  row("K", "INDISEC Privacy Edge Pvt Ltd"),
  row("K", "English Connection", "https://www.englishconnection.online/"),
  row("K", "Level 9"),
  row("K", "Perfect Crew Services Pvt Ltd"),
  row("K", "Virgo Panel"),
  row("K", "Hero Ecotech Ltd"),
  row("K", "PYE Tools Pvt Ltd"),
  row("K", "Modern Publishers"),
  row("K", "Holy Faith International"),
  row("K", "Kross Bikes"),
  row("K", "NPI E-Cycle"),
  row("K", "Apna Sahitya"),
  row("K", "MBD Books"),
];

const SECTION_L: MasterAffiliation[] = [
  row("L", "Business World", "https://businessworld.in/"),
  row("L", "The Pioneer", "https://www.dailypioneer.com/"),
  row("L", "Uttam Hindu", "https://www.uttamhindu.com/"),
  row("L", "Dainik Savera", "https://epaper.dainiksaveratimes.in/"),
];

const SECTION_M: MasterAffiliation[] = [
  row("M", "English Lover"),
  row("M", "Adhyayan Mantra"),
  row("M", "Abhinay Maths"),
  row("M", "Ankit Madan Official"),
  row("M", "Fox Path"),
  row("M", "Gate Smashers"),
  row("M", "Technocrat Anshul"),
];

export const CONFERENCE_SUPPORT_MASTER: MasterAffiliation[] = [
  ...SECTION_A,
  ...SECTION_B,
  ...SECTION_C,
  ...SECTION_D,
  ...SECTION_E,
  ...SECTION_F,
  ...SECTION_G,
  ...SECTION_H,
  ...SECTION_I,
  ...SECTION_J,
  ...SECTION_K,
  ...SECTION_L,
  ...SECTION_M,
];

export function isExcludedAffiliation(name: string): boolean {
  const key = normalizeAffiliationKey(name);
  if (AFFILIATION_EXCLUSION_KEYS.has(key)) return true;
  if (key.length < 3) return true;
  return false;
}
