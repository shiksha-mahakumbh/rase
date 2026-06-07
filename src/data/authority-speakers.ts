export type SpeakerProfile = {
  name: string;
  title: string;
  organization: string;
  topic?: string;
  edition?: string;
  imageSrc?: string;
};

export const featuredSpeakers: SpeakerProfile[] = [
  {
    name: "Prof. Sunil",
    title: "Track Chair",
    organization: "NIT Hamirpur",
    topic: "Fundamental & Applied Sciences",
    edition: "SMK 6.0",
  },
  {
    name: "Dr. K. S. Pandey",
    title: "Track Chair",
    organization: "IIT Mandi",
    topic: "Engineering & Technology",
    edition: "SMK 6.0",
  },
  {
    name: "Dr. Naveen Mokta",
    title: "Education Systems",
    organization: "NCERT",
    topic: "Pedagogy & NEP alignment",
    edition: "SMK 6.0",
  },
  {
    name: "Dr. Shweta Chaurasia",
    title: "Health Sciences",
    organization: "PGIMER Chandigarh",
    edition: "SMK 6.0",
  },
  {
    name: "Prof. Brahmjit Singh",
    title: "Academic Council",
    organization: "NIT Kurukshetra",
    topic: "Conference leadership",
    edition: "SMK 6.0",
  },
  {
    name: "Dr. Chander Prakash",
    title: "Track Chair",
    organization: "NIT Hamirpur",
    topic: "Management & Commerce",
    edition: "SMK 6.0",
  },
  {
    name: "Dr. Praveen Kumar Sharma",
    title: "Conclave Chair",
    organization: "VC Conclave",
    topic: "Higher education policy",
    edition: "SMK 6.0",
  },
];
