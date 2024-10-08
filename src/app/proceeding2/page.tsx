'use client';
import React from 'react';
import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import NavBar from '../component/NavBar';
import Proceeding2 from '../component/Proceeding2';

// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
  chapter: "4",
  title: "Papers",
  pageStart: 63,
  sections: [
    {
      title: "Introduction",
      content: [
        "Chapter 4 of our National Conference on the Role of Academic-driven Startups in Developing Economyof J&K is dedicated to the scholarly exploration and insightful revelations encapsulated in thenumerous paper submissions. This crucial segment serves as a platform for intellectual exchange,fostering an environment where ideas converge to shape the contours of academic-drivenentrepreneurship. A total of 61 papers have been presented, representing a rich tapestry of perspectivesand research endeavors.These submissions, spanning both online and offline modes, exemplify the diverse dimensions ofacademic contributions to the entrepreneurial landscape. Categorizing these papers into three distinctthemes – Startup Conceptualization and Product Development, Marketing, Branding and Funding, andMiscellaneous – provides a comprehensive lens to examine the multifaceted impact of academic-drivenstartups on our economy.The papers offer a deep dive into the core areas, unraveling the symbiotic relationship betweenacademia and entrepreneurship. Each category, with its unique focus, contributes to the overarchingnarrative of innovation, skill development, and the transformative role of startups in the economicparadigm of J&K.As we traverse through the chapters of these intellectual contributions, we embark on a journey of discovery, exploring the nexus between academia and the vibrant entrepreneurial spirit that propels our region towards progress and prosperity."
      ]
    },
    {
      title: "Startup Conceptualization and Product Development",
      pageStart: 36,
      sessionChairs: [
        "Dr. Deepti Dharmani, VC, Chaudhary Devi Lal University, Bhiwani",
        "Dr. Rekha Kalia Bhardwaj, Registrar, DAV University Jalandhar ",
        "Prof. Sathans, Dean, NIT Srinagar",
        "Prof. Sandhya Tiwari, Dean, Central University of Kashmir ",
        "Dr..Rajneesh Talwar, Dean DICE, Chitkara University",
        "Dr. NeeluNawani, Professor and Incharge of Microbial Diversity Research Centre",
        "Prof Manjit Bansal, Professor & Dean, MRSPTU, Bathinda"
      ],
      papers: [
        {
          id: "G1-P1",
          title: "New Data Protection Regime in India: Challenges and Opportunities for Start-ups",
          authors: [
              "Ankit Tyagi, Department of Chemical Engineering, Indian Institute of Technology Jammu, India",
              "Ankita Yadav, Department of Legal Studies, Dr. Ram Manohar Lohiya National Law University, Lucknow, India"
          ],
          contact: "ankit.tyagi@iitjammu.ac.in, rmlankitayadav@gmail.com",
          abstract: "In the present age, data has emerged as a new currency across the globe. The digital economy is interconnected, and data protection regulations have been significant in almost every country's legislation. The introduction of the General Data Protection Regulation (GDPR) has changed privacy and security laws in different countries. In line with GDPR, India also brought the Data Protection Act (DPA) 2023, although the act is not as stringent as GDPR. The DPA 2023 brought the landscape for emerging businesses in the area of privacy by focusing on their compliance obligations, operational challenges, and strategic implications. The present act provides the country's people with a legitimate choice and control to determine the use of their personal data. Act provides a comprehensive framework for managing data at different levels. The present paper looks into how this most awaited DPA, 2023, brings challenges and opportunities for the startups in the country. Regulation no doubt brings opportunities for startups to build a foundation of trust, resilience, and responsibility. Adhering to the regulation strengthen the trust and credibility among stakeholders, including customers, investors, and partners. But for certain startups compliance with the act's provisions can be daunting as they have to navigate the new regulatory framework and how startups will manage their growth with limited resources. Though the act gives certain exceptions to startups, it will be a prefatory remark to say that it will benefit Indian startups. To look into the implications of the DPA, 2023 information is collected from certain startups to look into the impact of the new act and what are the challenges faced by the startups dealing with personal data.",
          keywords: [
              "Data Protection Act",
              "Start-ups",
              "General Data Protection Regulation (GDPR)"
          ]
      },
      {
          id: "G1-P2",
          title: "NP Series' NP30 Introducing State-of-the-Art Electric Bicycles",
          authors: [
              "Bikash Kumar, Graduate Engineer Trainee, Department of Holistic Education",
              "Ramendra Singh, Project Manager, Department of Holistic Education",
              "Prince Raj, Software Developer, Department of Holistic Education",
              "Dr. Thakur SKR, Director, Department of Holistic Education"
          ],
          contact: "contact.biku001@gmail.com",
          abstract: "The NP Series' NP30 represents a state-of-the-art advancement in electric bicycles, a product of the Department of Holistic Education. The NP30 is available in three models: Advanced, Basic, and Sports. All models feature a 26-inch steel frame with a glossy powder coating, double-wall aluminum alloy rims, and a 24V DC, 250W motor, ensuring a robust and reliable ride. The Advanced and Basic models share similar specifications, including a lithium-ion 7.5Ah, 24V, 240Wh battery, and a range of 30 km per charge. The Sports model, designed for enhanced performance, includes a 10Ah battery, offering a range of 60 km. Each model includes standard features like LED lights, electronic horn, and adjustable saddle settings. These bicycles are designed to cater to various needs, providing an eco-friendly and efficient mode of transportation. The introduction of the NP30 series underscores the commitment to innovation and sustainable mobility solutions.",
          keywords: [
              "Electric Bicycle",
              "NP30 Series",
              "Sustainable Transportation",
              "Holistic Education",
              "Eco-friendly Mobility",
              "Lithium-ion Battery"
          ]
      },
      {
          id: "G1-P3",
          title: "Secure Satellite-to-Satellite Communication: An ECC-Based Authentication Protocol",
          authors: [
              "Deepika Gautam, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
              "Pankaj Kumar, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
              "Garima Thakur, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh"
          ],
          contact: "gautamdeepika1999@gmail.com, pkumar240183@gmail.com, garimathakur@gmail.com",
          abstract: "The remarkable flexibility is offered by the satellite resource-based communication network in a wide range of applications such as news gathering, aeronautical, and maritime tracking. For remote areas, a satellite resources-based terrestrial network facilitates high-throughput services, stable and reliable network quality, and seamless geographical coverage. Though, this network is also susceptible to unauthorized intrusions and faces significant and potentially hazardous disruptions. To resolve these issues, plenty of researchers came up with various authentication protocols, but these protocols are either user-oriented or have security and efficiency challenges. Therefore, we propose an authentication protocol for satellite-to-satellite communication relying on the elliptic curve discrete logarithm problem. The Real-or-Random (ROR) model, Burrows–Abadi–Needham (BAN) logic are the formal proofs utilized to demonstrate the robustness of the proposed protocol. Additionally, informal analysis and scyther verification tools are other methods employed in security analysis. The metrics such as computational, communication, and bandwidth overhead are used for the comparative analysis of the proposed protocol with other state-of-the-art. The obtained results highlight the efficiency and superiority of the proposed protocol, which makes it suitable for the satellite communication network.",
          keywords: [
              "Authentication",
              "Satellite-to-satellite Communication",
              "Real-or-Random (ROR) Model",
              "Burrows–Abadi–Needham (BAN)"
          ]
      },
      {
          id: "G1-P4",
          title: "Integration of Artificial Intelligence and Machine Learning in Academic Startup",
          authors: [
              "Swadhin Kumar Rout, Assistant Professor, Business Management & Commerce, Arni University Indora, Kangra-H. P",
              "Dr. Sunita, Assistant Professor, Computer Science & Application, Arni University Indora, Kangra-H. P",
              "Lipsita Mohanty, Assistant Professor, Business Management & Commerce, Arni University Indora, Kangra-H. P"
          ],
          contact: "sunitamahajan2603@gmail.com",
          abstract: "Every person has the fundamental right to an education. Over the past few years, there have been numerous changes to education at different levels. The method that professors teach and how students learn has changed significantly as a result of the numerous technological breakthroughs. The development of artificial intelligence and machine learning has been one of the major turning points in the history of technology. Artificial intelligence (AI) & Machine learning, once simply a pipe dream, is now a reality, permeating every facet of our life, including education, and becoming a part of our daily routines. Although the field is still in its early stages, we will be able to see how AI develops and discover its unrealized potential as time goes on. The ways that teaching and learning are conducted are impacted by the advent of new technologies. The use of artificial intelligence (AI) in education has grown in popularity as a result of the technology's recent rapid progress. It's true that educators and teachers are indispensable. But the role of a teacher and best practices in education will alter significantly as a result of technology. This paper discusses the use of Artificial Intelligence (AI) & Machine Learning in education, including virtual classrooms, adaptive learning, smart campus, Sensible Tutoring Machines. In light of this, this paper also explores the present and potential applications of AI in academic start-ups.",
          keywords: [
              "Artificial Intelligence (AI)",
              "Machine Learning",
              "Education",
              "Start-ups"
          ]
      },
      {
          id: "G1-P5",
          title: "Secure and Lightweight Authentication for Patient Monitoring via Wireless Medical Sensors",
          authors: [
              "Garima Thakur, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
              "Deepika Gautam, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
              "Pankaj Kumar, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh"
          ],
          contact: "garimathakur@gmail.com, gautamdeepika1999@gmail.com, pkumar240183@gmail.com",
          abstract: "The integration of wireless medical sensor networks into conventional medical networks has significantly enhanced efficiency while introducing new security challenges. Recently, Servati and Safkhani proposed an IoT-based authentication scheme for healthcare environments, aiming to provide a secure protocol resistant to various attacks. However, analysis reveals that their protocol is vulnerable to user, gateway node and server impersonation attacks in addition to the gateway bypassing attacks, ephemeral secret leakage attacks and offline password guessing attacks. To mitigate these security flaws, we devised a lightweight three-factor authentication protocol utilizing the user’s biometric data and fuzzy extractor technique. We validate our approach utilizing the Burrows-Abadi-Needham (BAN) logic, the Real-or-Random (ROR) oracle model and the SCYTHER simulation tool. Heuristic analysis demonstrates that our proposed framework is resilient against potential threats and provides enhanced security features. A comprehensive comparison with existing state-of-the-arts delineates that our framework significantly improves security and efficiency while reducing communication, computational and security overheads.",
          keywords: [
              "Wireless Medical Sensor Network (WMSN)",
              "Authentication",
              "Security",
              "ROR Model",
              "SCYTHER"
          ]
      },
      {
          id: "G1-P6",
          title: "Fostering Growth: How Entrepreneurship Education Can Drive Economic Development in Jammu and Kashmir",
          authors: [
              "Hilal Ahmad Wani, Department of Civil Engineering, National Institute of Technology, Srinagar",
              "Dr. Sagadevan R, Department of Civil Engineering, National Institute of Technology, Srinagar",
              "Tahir, Department of Civil Engineering, National Institute of Technology, Srinagar",
              "Mohammad Bhat, Department of Civil Engineering, National Institute of Technology, Srinagar"
          ],
          contact: "hilal_2022phaciv027@nitsri.ac.in, sagadevan@nitsri.ac.in",
          abstract: "Entrepreneurship education is crucial for economic development, especially in regions with unique socio-economic challenges like Jammu and Kashmir. This study investigates the role of entrepreneurship education in catalyzing economic growth by equipping individuals with the skills, knowledge, and mindset needed to initiate and sustain businesses. It evaluates the existing educational landscape, identifies the region's specific needs, and highlights the potential benefits of entrepreneurship education. The analysis underscores the transformative impact of such education on the local economy, emphasizing its contributions to job creation, innovation, and the establishment of a resilient entrepreneurial ecosystem. Key findings reveal that entrepreneurship education can directly address high unemployment rates by fostering new business ventures and supporting small and medium-sized enterprises (SMEs), which are vital for local economic stability. Furthermore, it promotes a culture of innovation, enhancing regional competitiveness and encouraging the development of new markets and industries. The study also identifies challenges in implementing effective entrepreneurship education, such as limited resources, cultural barriers, and difficulties in accessing finance. Recommendations include policy support, public-private partnerships, capacity building, and improved financial access to fully leverage the potential of entrepreneurship education for economic revitalization. This comprehensive approach aims to transform Jammu and Kashmir's economic landscape, fostering sustainable development and resilience against external economic shocks.",
          keywords: [
              "Resilient Entrepreneurial Ecosystem",
              "Entrepreneurship Education",
              "Socio-Economic Challenges",
              "Economic Development",
              "Job Creation",
              "Jammu and Kashmir"
          ]
      },
      {
        id: "G1-P7",
        title: "Cyber Security and Data Privacy in Academic-driven Tech Start-ups",
        authors: [
            "Mr. Manu Mahajan, Assistant Professor in Business Management & Commerce, Arni University Indora, Kangra-H.P.",
            "Rahul Kumar, Assistant Professor in Law, Arni University Indora, Kangra-H. P"
        ],
        contact: "mahajanmanu117@gmail.com, rahulsaroch99@gmail.com",
        abstract: "In recent years, technology has greatly influenced the landscape of Indian school education, playing a pivotal role in its expansion and development. In the current national education policies, the Indian government has given significant importance to education technology (ET). Edtech struggled to secure adequate funding until 2019, but the emergence of the Covid-19 pandemic accelerated the growth of online education and led to the establishment of numerous EdTech start-ups in India and other countries. These Edtech businesses, with nearly two decades of experience, presented a promising outlook for education. Education is widely recognized as the key factor that greatly contributes to the prosperity of millions of individuals living in Asian nations. However, it was some time before the primary delivery method experienced a noteworthy change. The education sector was slow to adopt and incorporate the latest technology, despite the fact that some institutions had started to take advantage of it. The primary concept behind this was that, particularly in the realm of school education, the introduction of digital methods of teaching could potentially lead to a reduction in the number of teaching positions.",
        keywords: [
            "EdTech",
            "Funding",
            "Start-ups",
            "Education",
            "Digital"
        ]
    },
    {
        id: "G1-P8",
        title: "Startup Kashmir: Designing a Sustainable Entrepreneurial Ecosystem Model for the Academia",
        authors: [
            "Pawan K. Dhar, Professor & Head, Synthetic Biology group, School of Biotechnology, Jawaharlal Nehru University, New Delhi",
            "Anju K Ojha, Assistant Professor, Department of Botany, Ramjas College, Delhi University"
        ],
        contact: "anjuojhajnu@gmail.com, pawandhar@mail.jnu.ac.in",
        abstract: "The extraordinary times we live in demand that education be consciously and actively connected with opportunity. Unlike in previous times, when the population and competition were less, one could quickly get admission for higher studies and go for a postdoc before settling in a permanent job. Times have changed. The traditional career formulae are no longer working. It’s time to reboot our thinking and create a new center of gravity. The “lonely innovator” is a thing of the past. The modern world is about collaboration, creating viable ecosystems, and partnering with all stakeholders for the common good. There is a pressing unmet need to foster an entrepreneurial culture within academia. By actively connecting education with opportunity, universities can empower graduates with the skills and resources to create their own paths. This shift requires a fundamental change in the mindsets of students and faculty. Having experienced entrepreneurship, we envision a vibrant ecosystem within universities where students, faculty, and stakeholders work together. This collaboration can leverage university resources, expertise, and partnerships with the private sector to create a launchpad for student ventures. By integrating entrepreneurial education into existing curriculums, universities can equip graduates with essential skills like problem-solving, critical thinking, risk assessment, and innovation. Fostering a collaborative culture within academia can also connect students with mentors and resources, enabling them to translate their ideas into viable businesses. This shift towards an entrepreneurial ecosystem empowers graduates to become self-reliant contributors to the economy. They can leverage their unique talents and contribute meaningfully to society, no longer confined by the limitations of the traditional employment model. Developing an entrepreneurial culture within academia is a strategic investment in a future where graduates are future-ready!",
        keywords: [
            "Startup",
            "Academia",
            "Model",
            "Entrepreneur"
        ]
    },
    {
        id: "G1-P9",
        title: "A Quantum Authentication Scheme for Wireless Body Area Networks",
        authors: [
            "Sunil Prajapat, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
            "Pankaj Kumar, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
            "Deepak Ranga, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh"
        ],
        contact: "sunilprajapat645@gmail.com, pkumar240183@gmail.com, deepakranga1994@gmail.com",
        abstract: "The wireless body area network (WBAN) has emerged as a promising networking paradigm thanks to embedded systems, integrated circuit technologies, and wireless communications advancements. WBAN has the ability to send real-time biomedical data to remote medical personnel for clinical diagnostics through intelligent medical sensors in or around the patient’s body. Moreover, WBANs have played an increasingly important role in modern medical systems over the past decade as part of the Internet of Things (IoT). In addition to their conveniences, WBANs present us with the data confidentiality challenge and protecting patient’s privacy. The system requires a robust security mechanism to protect against threats because of the massive production of delay-sensitive data. We proposed a novel privacy-preserving quantum authentication scheme for WBANs to enhance security by encrypting medical data and safeguarding patient’s identities.",
        keywords: [
            "Quantum Cryptography",
            "Quantum Key Distribution",
            "Wireless Body Area Network",
            "Quantum Entanglement",
            "Internet of Things"
        ]
    },
    {
        id: "G1-P10",
        title: "A Secure Quantum Designated Verifier Signature Scheme for Electronic Voting Machine",
        authors: [
            "Urmika Gautam, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
            "Pankaj Kumar, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh",
            "Sunil Prajapat, Srinivasa Ramanujan Department of Mathematics, Central University of Himachal Pradesh"
        ],
        contact: "urmika52@gmail.com, pkumar240183@gmail.com, sunilprajapat645@gmail.com",
        abstract: "Designated verifier signatures prove to be an invaluable tool in applications like electronic voting, electronic bidding, and electronic transactions. The development of quantum computing presents a looming danger to the security of current cryptographic approaches. To address this issue, we propose an identity-based, quantum designated verifier signature protocol that provides robust security against quantum attacks.",
        keywords: [
            "Designated Verifier",
            "Quantum Signature",
            "Unforgeability",
            "Non-Transferability",
            "Hiding Source"
        ]
    },
    {
        id: "G1-P11",
        title: "Exploring the Role of Academic Startups in Creating Socially Responsible Reverse Logistics for the Packaging Industry",
        authors: [
            "Shagun Smith, Centre of Management and Humanities, Punjab Engineering College (Deemed to be University), Chandigarh",
            "Mohit Tyagi, Centre of Management and Humanities, Punjab Engineering College (Deemed to be University), Chandigarh",
            "Anju Singla, Department of Production and Industrial Engineering, Punjab Engineering College (Deemed to be University), Chandigarh",
            "R S Walia, Department of Production and Industrial Engineering, Punjab Engineering College (Deemed to be University), Chandigarh"
        ],
        contact: "shagunsmith.phd22cmh@pec.edu.in, tyagim@pec.edu.in, anjusingla@pec.edu.in",
        abstract: "This research paper explores the pivotal role of academic startups in fostering socially responsible reverse logistics within the packaging industry. These academic startups emerge from university research and development and provide a distinct advantage in spearheading innovation in this particular domain. This paper investigates the role of these startups in developing and executing reverse logistics systems that prioritize sustainability and social responsibility. Through a comprehensive literature review, the paper identifies key areas where academic startups have made substantial impacts. Additionally, the study highlights the role of these startups in advocating for regulatory changes and increasing public consciousness regarding sustainable practices. The findings demonstrate that academic startups not only bring in innovative solutions but also engage in significant collaborations with industry partners, government agencies, and local communities to enhance the effectiveness of reverse logistics systems. Nevertheless, the research also pinpoints the challenges faced by these startups, including financial limitations, reluctance from the market, and regulatory complexities. This work is crucial in showcasing how academic startups may revolutionize the packaging business by integrating social responsibility into reverse logistics operations and help in creating a more sustainable and socially responsible future for packaging waste management.",
        keywords: [
            "Academic Start-ups",
            "Reverse Logistics",
            "Packaging Industry",
            "Social Responsibility",
            "Sustainability",
            "Innovation"
        ]
    },
    {
        id: "G1-P12",
        title: "Tredul – Travel, Educate & Live",
        authors: [
            "Manpreet Kaur, Graduate Engineer Trainee, Department of Holistic Education, Plot No.1, Sector 71, SAS Nagar (Mohali) - 160071",
            "Ramandeep Kaur, Graduate Engineer Trainee, Department of Holistic Education, Plot No.1, Sector 71, SAS Nagar (Mohali) - 160071",
            "Ramendra Pratap Singh Rana, Project Manager, Department of Holistic Education",
            "Prince Raj, Software Developer, Department of Holistic Education",
            "Dr. Thakur SKR, Director, Department of Holistic Education"
        ],
        contact: "kaurmanpreet8767@gmail.com",
        abstract: "Tredul is an innovative platform designed to connect tourists with educational institutions, such as schools and universities, to foster meaningful cultural and educational exchanges. The platform is developed using HTML, CSS, JavaScript, React, TypeScript, Node.js, Express.js, and MySQL. Tredul enables tourists to register, create detailed profiles, browse available educational hosts, and send visit requests. Hosts receive notifications, review tourist profiles, and manage requests efficiently through an integrated booking system that supports real-time scheduling and secure user authentication. The user interface is designed to be intuitive and user-friendly, incorporating continuous feedback from usability tests to ensure a seamless experience. A future mobile application is planned to enhance accessibility further. Tredul's development follows an incremental model, ensuring iterative improvements and robust performance. This project highlights the successful application of modern web technologies and iterative development processes to create a dynamic and user-centered platform for educational tourism.",
        keywords: [
            "Educational Tourism",
            "Tredul",
            "Education",
            "Booking System",
            "Real-time Scheduling",
            "Travel"
        ]
    },
    {
        id: "G1-P13",
        title: "Holistic Harbour: Celebrating Diversity in Religious and Cultural Practices",
        authors: [
            "Ankita Ranjan, Graduate Engineer Trainee, Department of Holistic Education",
            "Ramendra Singh, Project Manager, Department of Holistic Education",
            "Prince Raj, Software Developer, Department of Holistic Education",
            "Dr. Thakur SKR, Director, Department of Holistic Education"
        ],
        contact: "contact.ankita1499@gmail.com",
        abstract: "Holistic Harbour is a unique platform dedicated to celebrating the diversity of religious and cultural practices globally. Initiated by the Department of Holistic Education, it serves as a vibrant space for individuals of all ages to document and share their cultural heritage. This manuscript outlines our mission to create an inclusive community-driven platform that fosters understanding, respect, and appreciation for different traditions. We detail our commitment to promoting harmony and tolerance through the documentation of cultural practices, pilgrimages, and events. Our vision is to break down barriers and create a world where every tradition is valued and respected. Through this endeavor, we aim to build a sense of belonging and mutual respect among our global audience, thereby preserving and celebrating our shared cultural heritage.",
        keywords: [
            "Cultural Diversity",
            "Religious Practices",
            "Holistic Education",
            "Community-Driven Platform",
            "Cultural Heritage",
            "Global Audience"
        ]
    },
    {
        id: "G1-P14",
        title: "A Dynamic Platform Connecting Tourists and Educational Institutions: Tredul",
        authors: [
            "Ramandeep Kaur, Graduate Engineer Trainee, Department of Holistic Education",
            "Manpreet Kaur, Graduate Engineer Trainee, Department of Holistic Education",
            "Ramendra Singh, Project Manager, Department of Holistic Education",
            "Prince Raj, Software Developer, Department of Holistic Education",
            "Dr. Thakur SKR, Director, Department of Holistic Education"
        ],
        contact: "deepvishalgill621@gmail.com",
        abstract: "This research paper examines Tredul, an innovative platform that connects tourists with educational institutions, such as schools and universities, to foster meaningful cultural and educational exchanges. Developed with a robust stack of technologies including HTML, CSS, JavaScript, React, TypeScript, Node.js, Express.js, and MySQL, Tredul facilitates comprehensive interactions between tourists and educational hosts. Tourists can register, create detailed profiles, browse available educational hosts, and send visit requests. Educational hosts receive notifications, review tourist profiles, and manage requests through an integrated booking system that supports real-time scheduling and secure user authentication. The platform's user interface is designed to be intuitive and user-friendly, continuously refined through feedback from usability tests to ensure a seamless user experience. A mobile application is planned for future development to enhance accessibility. Tredul's development adheres to an incremental model, ensuring iterative improvements and robust performance. This study showcases the successful application of modern web technologies and iterative development processes in creating a dynamic, user-centered platform for educational tourism. The findings demonstrate Tredul's potential to transform educational tourism by providing a bridge for cultural and educational exchanges between tourists and academic institutions. Moreover, Tredul exemplifies how modern web technologies can be harnessed to create platforms that not only meet user needs but also promote global learning and cultural exchange. By continuously incorporating user feedback, Tredul ensures a high-quality user experience, making it a significant contribution to the field of educational tourism. The platform's future expansion to mobile devices further emphasizes its commitment to accessibility and user engagement, positioning Tredul as a pioneering solution in the educational tourism sector.",
        keywords: [
            "Educational Tourism",
            "Tredul",
            "Education",
            "Booking System",
            "Real-time Scheduling",
            "Travel"
        ]
    },
    {
      id: "G1-P15",
      title: "Sarvatr: A Comprehensive Management System for Educational and Non-Educational Institutions",
      authors: [
          "Raushan Kumar Bharti, Graduate Engineer Trainee, Department of Holistic Education",
          "Ramendra Singh, Project Manager, Department of Holistic Education",
          "Prince Raj, Software Developer, Department of Holistic Education",
          "Dr. Thakur SKR, Director, Department of Holistic Education"
      ],
      contact: "raushanbharti12345@gmail.com",
      abstract: "Sarvatr is an integrated management system designed to streamline administrative functions for both educational and non-educational institutions. It offers a comprehensive suite of features to manage employee details, tasks, and attendance for office environments, while providing robust tools for school management, including super-admin and admin panels. Sarvatr’s educational component allows for detailed oversight of student records, class organization, exams, grades, and parental engagement. Super Admins have exclusive rights to delete records, create user accounts, and oversee system settings. The system enhances communication within institutions by offering dashboards, attendance tracking, task management, and messaging features. Future developments aim to unify all web applications on a single platform, connecting various non-institutional organizations and schools. Sarvatr represents a significant step towards efficient institutional management, fostering improved communication, streamlined administrative processes, and enhanced educational outcomes.",
      keywords: [
          "Management System",
          "Educational Administration",
          "Non-Educational Administration",
          "Institutional Management",
          "Super Admin",
          "Admin Panel"
      ]
  },
  {
      id: "G1-P16",
      title: "VB Institute of Training & Research: Empowering Educators for Excellence",
      authors: [
          "Shubham Kumari, Graduate Engineer Trainee, Department of Holistic Education",
          "Ramendra Singh, Project Manager, Department of Holistic Education",
          "Prince Raj, Software Developer, Department of Holistic Education",
          "Dr. Thakur SKR, Director, Department of Holistic Education"
      ],
      contact: "kumarishubham273@gmail.com",
      abstract: "VB Institute of Training & Research is dedicated to transforming the landscape of education through comprehensive training programs aimed at empowering educators. Conceptualized by Dr. Thakur SKR, a visionary ISRO scientist, and guided by Mr. Vijay Nadda, a forward-thinking RSS Pracharak, the institute seeks to prepare teachers to meet contemporary educational challenges. The institute offers a range of development programs including Skill Development, Faculty Development, Management Development, Staff Development, and Teacher Development. These programs focus on integrating technology into teaching, enhancing research skills, developing leadership capabilities, and improving administrative efficiency. Additionally, the institute's research initiatives cover areas such as community education, educational technology, cultural competency, environmental education, and social skills. VB Institute aims to cultivate a culture of lifelong learning and scholarly inquiry, contributing to the broader body of knowledge through impactful research while fostering an environment of inclusive and transformative education.",
      keywords: [
          "Educational Empowerment",
          "Teacher Training",
          "Pedagogical Innovation",
          "Research Initiatives",
          "Lifelong Learning",
          "Inclusive Education"
      ]
  },
  {
      id: "G1-P17",
      title: "Empowering Employment with Technology: Jobs360Degree",
      authors: [
          "Sonal, Graduate Engineer Trainee, Department of Holistic Education",
          "Jyoti Sheron, Graduate Engineer Trainee, Department of Holistic Education",
          "Ramendra Singh, Project Manager, Department of Holistic Education",
          "Prince Raj, Software Developer, Department of Holistic Education",
          "Dr. Thakur SKR, Director, Department of Holistic Education"
      ],
      contact: "sonal12212001@gmail.com",
      abstract: "Jobs360degree is a comprehensive job application platform designed to connect job seekers with potential employers across diverse industries. The website offers an intuitive interface for users to create detailed profiles, upload resumes, and apply for a wide range of job opportunities. Advanced features include personalized job recommendations, real-time application tracking, and the ability to save job searches for future reference. Employers benefit from a robust suite of tools to post job listings, manage applications, and identify ideal candidates through advanced search and filtering options. These tools streamline the hiring process, reduce time-to-hire, and improve candidate quality. The platform’s analytics and reporting capabilities provide insights into the effectiveness of job postings and recruitment strategies, aiding data-driven decisions. Dedicated to revolutionizing the job search and recruitment landscape, Jobs360degree provides a reliable, user-friendly, and efficient platform that bridges the gap between talent and opportunity. Whether you are a job seeker or an employer, Jobs360degree offers the tools and resources to achieve your employment goals.",
      keywords: [
          "Jobs",
          "Technology in Employment",
          "Careers",
          "Employment"
      ]
  },
  {
      id: "G1-P18",
      title: "Punjab Super 100 - Transforming Future Education",
      authors: [
          "Sristi Pandey, Graduate Engineer Trainee, Department of Holistic Education",
          "Ramendra Singh, Project Manager, Department of Holistic Education",
          "Prince Raj, Software Developer, Department of Holistic Education",
          "Dr. Thakur SKR, Director, Department of Holistic Education"
      ],
      contact: "srishtijee1@gmail.com",
      abstract: "Punjab Super 100 is a unique educational initiative designed to provide innovative and comprehensive support to school students, enhancing their fundamental knowledge and exposing them to various professions. Initially launched in the academic year 2021-22 as Sarvhitkari Super 100 for Sarvhitkari Educational Society schools, it catered to students from grades 6-8 entirely and grades 9 and 11 partially. Following its success and positive feedback, the program expanded to include students from all over Punjab and was renamed Punjab Super 100. The program aims to establish a residential campus to accommodate 700 students and staff, embodying the values of the Bhartiya Gurukul System through advanced technologies such as AI, VR, AR, and ML. Punjab Super 100 is divided into three phases, focusing on foundational learning, interest-specific subject exposure, and career-specific education. The initiative is supported by a diverse team of regular and visiting faculties from prestigious institutions and organizations, providing top-tier education and mentorship. The program's vision is to create a world-class, competitive education system available to all students globally, ensuring they have the foundation and exposure to excel in their chosen professions.",
      keywords: [
          "Innovative Education",
          "Punjab Super 100",
          "Professional Exposure",
          "Holistic Learning",
          "Bhartiya Gurukul System",
          "AI in Education"
      ]
  },
  {
      id: "G1-P19",
      title: "Empowering Agriculture in Jammu and Kashmir: The Role of Weather-Based Information Startups in Economic Growth",
      authors: [
          "Karan Chhabra, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Manoj Kumar, ICAR- CITH, Krishi Vigyan Kendra, Baramulla"
      ],
      contact: "karanchhabrakvk@gmail.com",
      abstract: "Weather-based agriculture information systems have emerged as pivotal tools in modern agricultural practices, offering timely insights to farmers for informed decision-making. This abstract explores the potential of establishing a startup focused on weather-based agriculture information in Jammu and Kashmir, aiming to enhance the region's agricultural productivity and economic resilience. By harnessing meteorological data through advanced technology and analytics, such a startup could empower farmers with accurate forecasts, crop-specific advisories, and climate risk assessments tailored to the unique agro-climatic conditions of the region. This initiative not only seeks to optimize crop yields and resource utilization but also aims to mitigate weather-related risks, thereby contributing significantly to the overall economic upliftment of farmers in Jammu and Kashmir. Through strategic partnerships, innovative business models, and targeted farmer outreach, the proposed startup endeavors to foster sustainable agricultural practices and foster economic growth in the region. Our centre has benefitted numerous farmers (>50 thousand of district) by this startup mechanism, through media platforms and village-level farmers awareness programs (>90 FAPs) during 2020-24. Results show that farmers received, on average, 25-30% more economic benefits and improved crop/fruit quality by following the advisories on time.",
      keywords: [
          "Advisories",
          "Climate Risks",
          "Crop Growth",
          "Economic Growth",
          "FAPs"
      ]
  },
  {
      id: "G1-P20",
      title: "Attracting and Retaining Youths in Agriculture (ARYA) Project: An Initiative for Entrepreneurship Development among Rural Youth of Baramulla District of J&K",
      authors: [
          "Vishal Vihan, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Manoj Kumar, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Neeraj, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Anjali Gairola, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Karan Chhabra, ICAR- CITH, Krishi Vigyan Kendra, Baramulla",
          "Shoaib Nissar Kirmani, ICAR- CITH, Krishi Vigyan Kendra, Baramulla"
      ],
      contact: "manojkumar.cith@gmail.com",
      abstract: "The Attracting and Retaining Youths in Agriculture (ARYA) project is a comprehensive initiative aimed at fostering entrepreneurship and self-employment among rural youth in the Baramulla district of Jammu and Kashmir. Launched in 2014, the ARYA project addresses the pressing need to engage young people in agriculture by providing them with the skills, knowledge, and resources required to establish and manage agricultural enterprises. The project focuses on training and capacity-building activities, including workshops, field demonstrations, and mentoring programs, to equip youths with practical skills and entrepreneurial acumen. By facilitating access to financial support, technical expertise, and market linkages, the ARYA project seeks to create a sustainable ecosystem for rural entrepreneurship in agriculture. The project has successfully impacted the lives of numerous youths in Baramulla, fostering innovation, improving livelihoods, and contributing to the overall economic development of the region. Through ongoing support and engagement, the ARYA project aims to inspire and empower the next generation of agricultural entrepreneurs, thereby enhancing the socio-economic fabric of rural communities in Jammu and Kashmir.",
      keywords: [
          "Youth Entrepreneurship",
          "Rural Development",
          "Agriculture",
          "Economic Development",
          "Capacity Building"
      ]
  },
  {
      id: "G1-P21",
      title: "Leveraging Data Science for Financial Inclusivity: A Study of Machine Learning and AI Applications in Banking",
      authors: [
          "Amit Kumar, Data Scientist, Department of Financial Technologies",
          "Rohit Kumar, Senior Data Analyst, Department of Financial Technologies",
          "Nisha Gupta, Research Associate, Department of Financial Technologies",
          "Deepak Jain, Professor, Department of Financial Technologies",
          "Dr. Priya Singh, Head of Department, Department of Financial Technologies"
      ],
      contact: "amitkumar.ftech@gmail.com",
      abstract: "The integration of Data Science, Machine Learning (ML), and Artificial Intelligence (AI) into banking has revolutionized financial inclusivity and efficiency. This study investigates how these technologies are applied within the banking sector to enhance services and expand access to financial products. Data Science enables the analysis of vast amounts of financial data, providing insights that drive strategic decision-making. Machine Learning algorithms are utilized for credit scoring, fraud detection, and personalized financial recommendations, thereby improving customer experience and mitigating risks. AI applications, including chatbots and virtual assistants, offer 24/7 customer support and streamline routine banking processes. The study highlights case studies and real-world implementations, demonstrating how these technologies contribute to financial inclusivity by reaching underserved populations, offering tailored financial solutions, and promoting responsible lending practices. The findings underscore the potential for Data Science, ML, and AI to drive innovation in banking, making financial services more accessible, secure, and efficient for all.",
      keywords: [
          "Data Science",
          "Machine Learning",
          "Artificial Intelligence",
          "Financial Inclusivity",
          "Banking"
      ]
  },
  {
      id: "G1-P22",
      title: "AI-Driven Customer Experience Enhancement: Innovations and Applications",
      authors: [
          "Ananya Singh, AI Specialist, Department of Customer Experience",
          "Ravi Sharma, Machine Learning Engineer, Department of Customer Experience",
          "Sneha Patel, UX Designer, Department of Customer Experience",
          "Arjun Kumar, Data Scientist, Department of Customer Experience",
          "Dr. Maya Reddy, Head of Department, Department of Customer Experience"
      ],
      contact: "ananyasingh.cx@gmail.com",
      abstract: "Artificial Intelligence (AI) has emerged as a transformative force in enhancing customer experience across various industries. This paper explores the innovative applications of AI technologies in improving customer interactions, personalization, and satisfaction. Key innovations include AI-driven chatbots, which provide instant and accurate responses to customer inquiries, and sentiment analysis tools that gauge customer emotions and feedback. Machine Learning algorithms analyze customer behavior and preferences to deliver personalized recommendations and targeted marketing strategies. Additionally, AI-powered analytics platforms enable businesses to gain deeper insights into customer needs and trends, facilitating proactive engagement and service optimization. The study reviews successful implementations of AI-driven customer experience enhancements, showcasing their impact on customer loyalty, operational efficiency, and business growth. By leveraging AI technologies, businesses can create more meaningful and personalized interactions, ultimately driving customer satisfaction and fostering long-term relationships.",
      keywords: [
          "Artificial Intelligence",
          "Customer Experience",
          "Personalization",
          "Machine Learning",
          "Chatbots"
      ]
  },
  {
      id: "G1-P23",
      title: "Blockchain for Supply Chain Management: Enhancing Transparency and Efficiency",
      authors: [
          "Neha Sharma, Blockchain Consultant, Department of Supply Chain Solutions",
          "Rajiv Gupta, Blockchain Developer, Department of Supply Chain Solutions",
          "Amit Verma, Supply Chain Analyst, Department of Supply Chain Solutions",
          "Sunita Rao, Logistics Coordinator, Department of Supply Chain Solutions",
          "Dr. Sanjay Kumar, Head of Department, Department of Supply Chain Solutions"
      ],
      contact: "nehasharma.scm@gmail.com",
      abstract: "Blockchain technology offers significant potential to transform supply chain management by enhancing transparency, traceability, and efficiency. This paper examines the application of blockchain in supply chain operations, focusing on its ability to create an immutable ledger of transactions, enabling real-time tracking and verification of goods. The use of smart contracts facilitates automated and transparent execution of supply chain agreements, reducing the need for intermediaries and minimizing fraud. Blockchain's decentralized nature ensures data integrity and security, fostering trust among stakeholders. The study highlights various case studies where blockchain has been implemented to optimize supply chain processes, improve visibility, and streamline operations. By adopting blockchain technology, organizations can achieve greater operational efficiency, reduced costs, and improved collaboration across the supply chain network. The paper emphasizes the transformative impact of blockchain on supply chain management and its potential to drive innovation and competitiveness in the industry.",
      keywords: [
          "Blockchain",
          "Supply Chain Management",
          "Transparency",
          "Efficiency",
          "Smart Contracts"
      ]
  },
  {
      id: "G1-P24",
      title: "Cybersecurity Threats and Mitigation Strategies: A Comprehensive Review",
      authors: [
          "Ravi Kumar, Cybersecurity Analyst, Department of Information Security",
          "Meera Gupta, IT Security Specialist, Department of Information Security",
          "Rajesh Singh, Network Security Engineer, Department of Information Security",
          "Pooja Sharma, Risk Management Consultant, Department of Information Security",
          "Dr. Arvind Patel, Chief Information Security Officer, Department of Information Security"
      ],
      contact: "ravikumar.isec@gmail.com",
      abstract: "In the digital age, cybersecurity threats have become increasingly sophisticated, posing significant risks to organizational and personal data. This comprehensive review explores the current landscape of cybersecurity threats and the strategies employed to mitigate them. Key threats include malware, ransomware, phishing attacks, and advanced persistent threats (APTs). The review covers various mitigation strategies such as multi-factor authentication, encryption, intrusion detection systems, and regular security audits. Additionally, the paper discusses the importance of employee training and awareness programs in enhancing overall security posture. By analyzing recent case studies and emerging trends, the review provides insights into effective approaches for safeguarding information assets and ensuring data integrity. The study underscores the need for a proactive and multi-layered approach to cybersecurity, combining technological solutions with human factors to address the evolving threat landscape.",
      keywords: [
          "Cybersecurity",
          "Threats",
          "Mitigation Strategies",
          "Data Protection",
          "Risk Management"
      ]
  },
  {
      id: "G1-P25",
      title: "Advancements in Quantum Computing: Opportunities and Challenges",
      authors: [
          "Dr. Anil Sharma, Quantum Computing Researcher, Department of Computational Sciences",
          "Neha Agarwal, Quantum Algorithm Developer, Department of Computational Sciences",
          "Ravi Singh, Quantum Systems Engineer, Department of Computational Sciences",
          "Amit Patel, Quantum Hardware Specialist, Department of Computational Sciences",
          "Dr. Priya Kapoor, Director, Department of Computational Sciences"
      ],
      contact: "anilsharma.qc@gmail.com",
      abstract: "Quantum computing represents a revolutionary advancement in computational technology, with the potential to solve complex problems beyond the reach of classical computers. This paper explores the latest developments in quantum computing, focusing on the opportunities and challenges associated with this emerging field. Key advancements include progress in quantum algorithms, hardware development, and error correction techniques. The paper discusses the potential applications of quantum computing in various domains such as cryptography, optimization, drug discovery, and material science. It also addresses the significant challenges that remain, including quantum decoherence, scalability, and the need for specialized programming techniques. The study highlights ongoing research efforts and collaborative initiatives aimed at overcoming these challenges and accelerating the practical implementation of quantum computing technologies. By examining current trends and future prospects, the paper provides a comprehensive overview of the state of quantum computing and its implications for various industries.",
      keywords: [
          "Quantum Computing",
          "Quantum Algorithms",
          "Hardware Development",
          "Error Correction",
          "Applications"
      ]
  },
  {
    id: "G1-P26",
    title: "Role of Entrepreneurship Education and Training in Rural Skill Development in India",
    authors: [
        "Prof. Sunita Bharatwal, Dean, Faculty of Commerce & Management, Chaudhary Bansi Lal University, Bhiwani (127021), Haryana",
        "Ms. Urshita Bansal, Assistant Professor, Department of Management Studies, The Technological Institute of Textile & Sciences, Bhiwani (127021), Haryana"
    ],
    contact: "sunita_bharatwal@rediffmail.com, urshitaaggarwal@gmail.com",
    abstract: "The significance of entrepreneurship education and training in promoting skill development among rural students in India is an important research topic, particularly in terms of economic empowerment and sustainable development. This research article uses secondary data to investigate several aspects of this position, including a thorough analysis of government initiatives, comparable models, and the influence of digital education platforms. The study focuses on the strengths and limitations of various educational approaches, emphasizing long-term outcomes, gender-specific consequences, and sectoral disparities in skill development. Reviewing existing regulations and public-private partnerships, the report sheds light on the socioeconomic constraints that impede effective entrepreneurship education and makes concrete recommendations to policymakers and educators. The report emphasizes the practical benefits of entrepreneurship education by using case studies of successful rural entrepreneurs provided by the Employment & Training Centre, (Rozgar Srijan Kendra), CBLU. The findings underline the importance of personalized educational programs that target the specific needs of rural students, thereby improving their entrepreneurial abilities and contributing to overall economic development. The report concludes with recommendations for future research to address existing gaps and improve the effectiveness of entrepreneurship education in rural India.",
    keywords: [
        "Education",
        "Entrepreneurial Skills",
        "Training",
        "Individual Entrepreneurial Inclination",
        "Enterprise Establishment",
        "Entrepreneurship Program"
    ]
},
{
    id: "G1-P27",
    title: "Seamlessly Integrating Ancient Spiritual Traditions with Modern Convenience: The Pooja Wala Platform",
    authors: [
        "Yogesh, Graduate Engineer Trainee, Department of Holistic Education",
        "Manisa Roy Chowdhury, Full Stack Java Development Intern, Q Spider, Noida",
        "Ramendra Singh, Project Manager, Department of Holistic Education",
        "Prince Raj, Software Developer, Department of Holistic Education",
        "Dr. Thakur SKR, Director, Department of Holistic Education"
    ],
    contact: "er.yogeshjangra1@gmail.com",
    abstract: "Spirituality is a cornerstone of human existence, offering a sense of purpose and connection. Recognizing this essential need, the Pooja Wala project aims to seamlessly integrate ancient spiritual traditions with modern convenience through a robust online platform. Pooja Wala is an initiative designed to streamline the booking of pandits for a wide array of ceremonies and rituals, catering to linguistic preferences such as Odia, Hindi, Gujarati, and Marathi. Offering over 250 distinct poojas and rituals, the platform provides users with a comprehensive selection to fulfill their needs. This innovative platform enables individuals to register either as users seeking pandit services or as pandits offering their expertise. The registration process is thorough, capturing essential details and addresses to enhance both user and pandit profiles with comprehensive information. Additionally, Pooja Wala offers detailed state-wise pooja and ritual descriptions, supplemented by instructional videos, ensuring users have a deep understanding and can perform ceremonies correctly. Pooja Wala's mission is to foster the preservation and promotion of Indian spiritual heritage by leveraging cutting-edge technology to offer accessible and reliable pandit booking services. The platform aims to bridge the gap between tradition and modernity, connecting people with qualified pandits to ensure that rituals are conducted with authenticity and reverence. By accommodating diverse linguistic and cultural needs, Pooja Wala not only upholds the sanctity of spiritual practices but also fosters a sense of community and continuity in today's fast-paced world.",
    keywords: [
        "Spirituality",
        "Online Platform",
        "Pandit Booking",
        "Poojas and Rituals",
        "Cultural Preservation",
        "Linguistic Diversity"
    ]
},
{
    id: "G1-P28",
    title: "The Government Initiative and Policies for Promoting Academic Driven Start-ups in Jammu and Kashmir – An Evaluation",
    authors: [
        "Dr. Kothapeta Lakshman, Associate Professor, Department of Politics and Governance, Central University of Kashmir, Ganderbal (J&K)"
    ],
    contact: "lakshmankothapeta@gmail.com",
    abstract: "The Government of India has initiated a flagship program known as Start-up India on January 16, 2016. It envisions shaping a strong ecosystem for nurturing innovation and startups in the country to drive sustainable economic growth and generate large-scale employment opportunities. The Government aims to empower startups through innovation and design. Subsequently, Start-up India has rolled out several programs to support entrepreneurs and transform India into a country of job creators rather than job seekers. Various ministries and departments have introduced schemes to provide financial, infrastructural, and regulatory support to startups. These schemes cover sectors like technology, manufacturing, agriculture, healthcare, and more. The Ministry of Human Resource Development released the National Innovation and Startup Policy 2019 for students and faculty of Higher Education Institutions (HEIs), in line with the Central Government's focus on entrepreneurial projects. The policy framework enables institutes to actively engage students, faculty, and staff in innovation and entrepreneurship-related activities. The Government of Jammu and Kashmir recognizes the importance of startups in driving initiative and economic growth. The policy envisions inspiring the young and entrepreneurial minds of Jammu and Kashmir to pursue innovation and entrepreneurship, creating a vibrant and robust startup ecosystem. Objectives of the Study include analyzing government initiatives and policies for promoting academic-driven startups in India, particularly in Jammu and Kashmir; evaluating the implementation and impact of startup policies in academic institutions in Jammu and Kashmir; and tracing best practices of startups in HEIs in Jammu and Kashmir. The study adopts a descriptive, conceptual, and analytical method, using secondary data sources.",
    keywords: [
        "Government Initiatives",
        "Startup Policies",
        "Higher Education Institutes",
        "Academic-Driven Startups",
        "Jammu and Kashmir"
    ]
},
{
    id: "G1-P29",
    title: "Empowering Employment With Technology: Jobs360Degree",
    authors: [
        "Jyoti, Graduate Engineer Trainee, Department of Holistic Education",
        "Sonal, Graduate Engineer Trainee, Department of Holistic Education",
        "Ramendra Singh, Project Manager, Department of Holistic Education",
        "Prince Raj, Software Developer, Department of Holistic Education",
        "Dr. Thakur SKR, Director, Department of Holistic Education"
    ],
    contact: "jyotisheoran79@gmail.com",
    abstract: "JOB 360 Degree is a job portal designed to find the perfect job match according to individual requirements and skills, facilitating easy interview calls and responses from recruiters and employers. This Swadeshi job portal focuses on connecting school teachers with rewarding opportunities. Founded on principles of efficiency and responsiveness, the platform addresses the unique needs of educators, ensuring a seamless job search experience. It features a two-way rating system and automatic application cancellation within a week. Jobs360Degree aims to revolutionize job search and career development by integrating comprehensive career services into a single platform. This innovative solution utilizes advanced algorithms and machine learning to provide personalized job recommendations, skill assessments, and career guidance. Users benefit from a seamless experience encompassing job searching, skill development, networking opportunities, and career planning, all accessible through a user-friendly interface. Jobs360Degree seeks to empower job seekers and professionals with tools and insights needed to navigate today’s dynamic employment market successfully.",
    keywords: [
        "Job Search Platform",
        "Career Development",
        "Personalized Recommendations",
        "Skill Assessment",
        "User Interface",
        "Professional Development"
    ]
},
{
    id: "G1-P30",
    title: "Evaluating Indian Government Initiatives and Policies for Promoting Academic-Driven Startups: A Comprehensive Analysis",
    authors: [
        "Malti Rajput, Department of Chemistry, GDC Bhaderwah"
    ],
    contact: "maltirajput83@gmail.com",
    abstract: "This study examines the Indian government initiatives and policies designed to promote academic-driven startups. It underscores the significance of these policies in fostering innovation, entrepreneurship, and economic growth by leveraging academic research and student innovation. The research adopts a qualitative approach, reviewing and synthesizing existing literature, government reports, and policy documents. It conducts a detailed analysis of key initiatives such as Startup India, Atal Innovation Mission, and NIDHI to understand their impact on academic-driven entrepreneurship. The study finds that Indian government initiatives have significantly strengthened the startup ecosystem by providing financial support, infrastructure, and mentorship. These efforts have led to increased startup activity in academic institutions, promoting innovation and economic development. However, challenges such as bureaucratic obstacles and inconsistent policy implementation persist. This study is based on qualitative analysis using secondary data sources. Further empirical research is necessary to quantify the impact of these initiatives. The findings suggest a need for continuous policy refinement and effective implementation to sustain and enhance the startup ecosystem. This research offers a comprehensive overview of Indian government policies promoting academic-driven startups, highlighting their unique approach in integrating academia with entrepreneurship.",
    keywords: [
        "Academic-Driven Startups",
        "Indian Government Initiatives",
        "Atal Innovation Mission",
        "Entrepreneurship",
        "Startup India",
        "NIDHI"
    ]
}
        // List of paper objects
      ]
    }
  ]
};

export default function Home() {
  return (
    <div className='bg-white'>
      <CompanyInfo />
      <NavBar />
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/5">
          {/* Left sidebar or additional content */}
        </div>
        <div className="w-full sm:w-3/5">
          <Proceeding2 data={data} />
        </div>
        <div className="w-full sm:w-1/5">
          {/* Right sidebar or additional content */}
        </div>
      </div>
      <Footer />
    </div>
  );
}