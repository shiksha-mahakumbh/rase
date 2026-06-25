/** Canonical 15-track roster for Shiksha Mahakumbh 6.0 multi-track conference. */

export type AcademicConferenceTrack = {
  titleEn: string;
  titleHi: string;
  topics: string[];
  details: string;
  chair: string;
  coChair: string;
  convenor: string;
};

export const ACADEMIC_PUBLICATION_NOTE =
  "Selected papers may be considered for publication in SCI, Scopus, or Web of Science indexed outlets after peer review, subject to track guidelines and publisher requirements.";

export const ACADEMIC_CONFERENCE_TRACKS: AcademicConferenceTrack[] = [
  {
    titleEn: "Fundamental & Applied Sciences",
    titleHi: "मौलिक एवं अनुप्रयुक्त विज्ञान",
    topics: ["Physics", "Chemistry", "Mathematics", "Biology", "Earth & Space Sciences", "Interdisciplinary Sciences"],
    details: "Physics, Chemistry, Biology, Mathematics, Earth & Space Sciences, Interdisciplinary Sciences",
    chair: "Prof. Sunil (NIT Hamirpur)",
    coChair: "Dr. Kuldeep Kumar, Dr. Kalyan S. Ghosh",
    convenor: "Dr. Om Prakash, Dr. Vikram, Dr. Praveen Sharma",
  },
  {
    titleEn: "Engineering & Technology",
    titleHi: "अभियंत्रण एवं प्रौद्योगिकी",
    topics: ["Core Engineering", "AI", "Robotics", "Data Science", "Quantum Technology"],
    details: "Core Engineering, AI, Robotics, Data Science, Quantum Technology",
    chair: "Dr. K. S. Pandey (IIT Mandi)",
    coChair: "Dr. Nitin Gupta, Dr. Varun Kumar",
    convenor: "Dr. Taleri Ganesh, Dr. Kirti Mahajan",
  },
  {
    titleEn: "Management, Business & Entrepreneurship",
    titleHi: "प्रबंधन एवं उद्यमिता",
    topics: ["Business Administration", "Startups", "Social Entrepreneurship"],
    details: "Business Administration, Startups, Social Entrepreneurship",
    chair: "Dr. Suman Kumar (CUHP)",
    coChair: "Dr. Ashutosh Vashishth",
    convenor: "Dr. Shampy Kamboj, Dr. Neeraj Dhiman",
  },
  {
    titleEn: "International Relations, Law & Governance",
    titleHi: "अंतर्राष्ट्रीय संबंध, विधि एवं शासन",
    topics: ["Public Policy", "Global Affairs", "Legal Studies", "Human Rights"],
    details: "Public Policy, Global Affairs, Legal Studies, Human Rights",
    chair: "Prof. Sudershan Kumar (IIT Bombay)",
    coChair: "Dr. Somesh K. Sharma",
    convenor: "Dr. Sachin Kumar",
  },
  {
    titleEn: "Social Sciences & Humanities",
    titleHi: "सामाजिक विज्ञान एवं मानविकी",
    topics: ["Sociology", "Psychology", "History", "Philosophy", "Ethics"],
    details: "Sociology, Psychology, History, Philosophy, Ethics",
    chair: "Dr. Yogesh Gupta",
    coChair: "Dr. Manoj Sharma",
    convenor: "Dr. Rinshu Dwivedi, Dr. Priya Jaiswal",
  },
  {
    titleEn: "Education Systems & Pedagogy",
    titleHi: "शिक्षा प्रणाली एवं शिक्षण पद्धति",
    topics: ["School Education", "Higher Education", "Inclusive Education", "IKS"],
    details: "School Education, Higher Education, Inclusive Education, IKS",
    chair: "Dr. Naveen Mokta (NCERT)",
    coChair: "Dr. Ramesh Vats",
    convenor: "Dr. Om Prakash",
  },
  {
    titleEn: "EdTech & Digital Education",
    titleHi: "एडटेक एवं डिजिटल शिक्षा",
    topics: ["AI in Education", "Online Learning", "Digital Literacy"],
    details: "AI in Education, Online Learning, Digital Literacy",
    chair: "Prof. Dhirendra Kumar",
    coChair: "Dr. Siddarath Chauhan",
    convenor: "Dr. Aman Kumar",
  },
  {
    titleEn: "Health Sciences & Traditional Medicine",
    titleHi: "स्वास्थ्य विज्ञान एवं पारंपरिक चिकित्सा",
    topics: ["Modern Medicine", "AYUSH", "Public Health"],
    details: "Modern Medicine, AYUSH, Public Health",
    chair: "Dr. Shweta Chaurasia (PGIMER)",
    coChair: "Dr. Hem Raj",
    convenor: "Dr. Amit Kaul, Dr. S. Kala Negi",
  },
  {
    titleEn: "Sports, Physical Education & Well-being",
    titleHi: "खेल एवं कल्याण",
    topics: ["Sports Science", "Mental Health", "Yoga"],
    details: "Sports Science, Mental Health, Yoga",
    chair: "Dr. Pawan Kumar",
    coChair: "Dr. R. K. Jamalta",
    convenor: "Dr. Subit Jain, Dr. Rakesh Rakta",
  },
  {
    titleEn: "Agriculture, Food & Veterinary Sciences",
    titleHi: "कृषि एवं पशु चिकित्सा विज्ञान",
    topics: ["Sustainable Agriculture", "Agri-Tech", "Animal Husbandry"],
    details: "Sustainable Agriculture, Agri-Tech, Animal Husbandry",
    chair: "Dr. Som Dev",
    coChair: "—",
    convenor: "Dr. Puneet Banta",
  },
  {
    titleEn: "Environment, Sustainability & Water Resources",
    titleHi: "पर्यावरण एवं सतत विकास",
    topics: ["Climate Change", "Environmental Education", "Water Management"],
    details: "Climate Change, Environmental Education, Water Management",
    chair: "Dr. R. S. Banshtu",
    coChair: "Dr. Vijay S. Dogra",
    convenor: "Dr. Vivek Kumar, Dr. Ray Singh Meena",
  },
  {
    titleEn: "Culture, Arts & Heritage",
    titleHi: "संस्कृति, कला एवं विरासत",
    topics: ["Performing Arts", "Folk Traditions", "Cultural Conservation"],
    details: "Performing Arts, Folk Traditions, Cultural Conservation",
    chair: "Dr. Nand Lal",
    coChair: "Dr. Ashwani",
    convenor: "Dr. Venu, Ar. Suresh Kumar",
  },
  {
    titleEn: "Languages & Linguistics",
    titleHi: "भाषाएँ एवं भाषाविज्ञान",
    topics: ["Indian & Foreign Languages", "Translation Technology"],
    details: "Indian & Foreign Languages, Translation Technology",
    chair: "Prof. Mohini",
    coChair: "Dr. Garima Bhati",
    convenor: "Dr. Zarina, Dr. Manoj Yadav",
  },
  {
    titleEn: "Vocational & Skill-Based Education",
    titleHi: "व्यावसायिक एवं कौशल आधारित शिक्षा",
    topics: ["Industrial Training", "Crafts", "Workforce Development"],
    details: "Industrial Training, Crafts, Workforce Development",
    chair: "Prof. Ashok Sarial",
    coChair: "Dr. Ashwani Rana",
    convenor: "Dr. Vivek Kumar, Dr. Jitendra Man",
  },
  {
    titleEn: "Indian Knowledge System (IKS)",
    titleHi: "भारतीय ज्ञान प्रणाली",
    topics: ["Philosophy", "Nyaya", "Mimamsa", "Vedic Literature"],
    details: "Philosophy, Nyaya, Mimamsa, Vedic Literature",
    chair: "Prof. Bhag Chand Chauhan",
    coChair: "Dr. Sant Ram",
    convenor: "Dr. Rakesh Kumar, Dr. Himesh Handa",
  },
];

export function conferenceTracksForHub() {
  return ACADEMIC_CONFERENCE_TRACKS.map(({ titleEn, titleHi, topics }) => ({
    titleEn,
    titleHi,
    topics,
  }));
}
