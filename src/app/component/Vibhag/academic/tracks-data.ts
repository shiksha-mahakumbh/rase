const tracks = [
  {
    title: "Fundamental & Applied Sciences",
    details:
      "Physics, Chemistry, Biology, Mathematics, Earth & Space Sciences, Interdisciplinary Sciences",
    chair: "Prof. Sunil (NIT Hamirpur)",
    coChair: "Dr. Kuldeep Kumar, Dr. Kalyan S. Ghosh",
    convenor: "Dr. Om Prakash, Dr. Vikram, Dr. Praveen Sharma",
  },
  {
    title: "Engineering & Technology",
    details:
      "Core Engineering, AI, Robotics, Data Science, Quantum Technology",
    chair: "Dr. K. S. Pandey (IIT Mandi)",
    coChair: "Dr. Nitin Gupta, Dr. Varun Kumar",
    convenor: "Dr. Taleri Ganesh, Dr. Kirti Mahajan",
  },
  {
    title: "Management, Business & Entrepreneurship",
    details:
      "Business Administration, Startups, Social Entrepreneurship",
    chair: "Dr. Suman Kumar (CUHP)",
    coChair: "Dr. Ashutosh Vashishth",
    convenor: "Dr. Shampy Kamboj, Dr. Neeraj Dhiman",
  },
  {
    title: "International Relations, Law & Governance",
    details:
      "Public Policy, Global Affairs, Legal Studies, Human Rights",
    chair: "Prof. Sudershan Kumar (IIT Bombay)",
    coChair: "Dr. Somesh K. Sharma",
    convenor: "Dr. Sachin Kumar",
  },
  {
    title: "Social Sciences & Humanities",
    details:
      "Sociology, Psychology, History, Philosophy, Ethics",
    chair: "Dr. Yogesh Gupta",
    coChair: "Dr. Manoj Sharma",
    convenor: "Dr. Rinshu Dwivedi, Dr. Priya Jaiswal",
  },
  {
    title: "Education Systems & Pedagogy",
    details:
      "School Education, Higher Education, Inclusive Education, IKS",
    chair: "Dr. Naveen Mokta (NCERT)",
    coChair: "Dr. Ramesh Vats",
    convenor: "Dr. Om Prakash",
  },
  {
    title: "EdTech & Digital Education",
    details:
      "AI in Education, Online Learning, Digital Literacy",
    chair: "Prof. Dhirendra Kumar",
    coChair: "Dr. Siddarath Chauhan",
    convenor: "Dr. Aman Kumar",
  },
  {
    title: "Health Sciences & Traditional Medicine",
    details:
      "Modern Medicine, AYUSH, Public Health",
    chair: "Dr. Shweta Chaurasia (PGIMER)",
    coChair: "Dr. Hem Raj",
    convenor: "Dr. Amit Kaul, Dr. S. Kala Negi",
  },
  {
    title: "Sports, Physical Education & Well-being",
    details:
      "Sports Science, Mental Health, Yoga",
    chair: "Dr. Pawan Kumar",
    coChair: "Dr. R. K. Jamalta",
    convenor: "Dr. Subit Jain, Dr. Rakesh Rakta",
  },
  {
    title: "Agriculture, Food & Veterinary Sciences",
    details:
      "Sustainable Agriculture, Agri-Tech, Animal Husbandry",
    chair: "Dr. Som Dev",
    coChair: "-",
    convenor: "Dr. Puneet Banta",
  },
  {
    title: "Environment, Sustainability & Water Resources",
    details:
      "Climate Change, Environmental Education, Water Management",
    chair: "Dr. R. S. Banshtu",
    coChair: "Dr. Vijay S. Dogra",
    convenor: "Dr. Vivek Kumar, Dr. Ray Singh Meena",
  },
  {
    title: "Culture, Arts & Heritage",
    details:
      "Performing Arts, Folk Traditions, Cultural Conservation",
    chair: "Dr. Nand Lal",
    coChair: "Dr. Ashwani",
    convenor: "Dr. Venu, Ar. Suresh Kumar",
  },
  {
    title: "Languages & Linguistics",
    details:
      "Indian & Foreign Languages, Translation Technology",
    chair: "Prof. Mohini",
    coChair: "Dr. Garima Bhati",
    convenor: "Dr. Zarina, Dr. Manoj Yadav",
  },
  {
    title: "Vocational & Skill-Based Education",
    details:
      "Industrial Training, Crafts, Workforce Development",
    chair: "Prof. Ashok Sarial",
    coChair: "Dr. Ashwani Rana",
    convenor: "Dr. Vivek Kumar, Dr. Jitendra Man",
  },
  {
    title: "Indian Knowledge System (IKS)",
    details:
      "Philosophy, Nyaya, Mimamsa, Vedic Literature",
    chair: "Prof. Bhag Chand Chauhan",
    coChair: "Dr. Sant Ram",
    convenor: "Dr. Rakesh Kumar, Dr. Himesh Handa",
  },
];

export { tracks };
export type Track = (typeof tracks)[number];
