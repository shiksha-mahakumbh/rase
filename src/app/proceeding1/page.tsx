'use client';
import React from 'react';
import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import NavBar from '../component/NavBar';
import Proceeding1 from '../component/Proceeding1';

// Sample data for demonstration. Replace this with your actual data source or fetch method.
        const data = {
          chapter: "4",
          title: "Papers",
          pageStart: 34,
          sections: [
            {
              title: "Introduction",
              content: [
                "Chapter 4 of our National Conference on the Role of Academic-driven Startups in the Economy is dedicated to the scholarly exploration and insightful revelations encapsulated in the numerous paper submissions. This crucial segment serves as a platform for intellectual exchange, fostering an environment where ideas converge to shape the contours of academic-driven entrepreneurship.",
                "A total of 65 papers have been presented, representing a rich tapestry of perspectives and research endeavors. These submissions, spanning both online and offline modes, exemplify the diverse dimensions of academic contributions to the entrepreneurial landscape.",
                "Categorizing these papers into three distinct themes – Skill & Startup, Entrepreneurship, and Best Practices & Innovations – provides a comprehensive lens to examine the multifaceted impact of academic-driven startups on our economy.",
                "The papers offer a deep dive into the core areas, unraveling the symbiotic relationship between academia and entrepreneurship. Each category, with its unique focus, contributes to the overarching narrative of innovation, skill development, and the transformative role of startups in the economic paradigm.",
                "As we traverse through the chapters of these intellectual contributions, we embark on a journey of discovery, exploring the nexus between academia and the vibrant entrepreneurial spirit that propels our nation towards progress and prosperity."
              ]
            },
            {
              title: "Skill and Startup",
              pageStart: 36,
              sessionChairs: [
                "Dr. Ankit Kumar, Scientist (Veterinary Medicine), Lala Lajpat Rai University of Veterinary and Animal Sciences, Hisar, Haryana",
                "Dr. Ashwani, Assistant Professor, Dept. of Humanities and Social Sciences",
                "Dr. Muralidhar Killi, Assistant Professor, Dept. of Electrical Engg."
              ],
              papers: [
                {
                  id: "G1-P1",
                  title: "Reducing the Wastage of Grains: Enhancing Grain Preservation Technique",
                  authors: [
                    "Mayank Mani Prasad, Dr. S.S. Bhatnagar University Institute of Chemical Engineering & Technology, Panjab University, Chandigarh",
                    "Dr. Sushil K Kansal, Dr. S.S. Bhatnagar University Institute of Chemical Engineering & Technology, Panjab University, Chandigarh",
                    "Dr. Sanjeev Gautam, Dr. S.S. Bhatnagar University Institute of Chemical Engineering & Technology, Panjab University, Chandigarh"
                  ],
                  contact: "mayankhrprasad@gmail.com",
                  abstract: "A key component of food security is grain preservation, which guarantees year-round availability and access to food. Millions of people throughout the world rely heavily on grains like rice, wheat, maize, and sorghum as their main source of calories and minerals. To avoid deterioration and minimize loss, grain preservation is a complicated process that calls for meticulous attention to detail and effective management. Techniques for preserving grains include drying, cleaning, sorting, and storage. One of the most popular preservation techniques is drying, which entails bringing the grains' moisture content down to a safe level to avoid microbial development. Proper storage conditions such as temperature, moisture, and ventilation play a crucial role in preserving grains. During many phases of manufacturing, shipping, storage, and consumption, grain is wasted. Globally, up to one-third of all food produced for human consumption is lost or wasted, according to the Food and Agricultural Organization (FAO). Economic losses, food poverty, and environmental damage are brought on by the wasting of grains. Consequently, minimizing grain waste is essential to ensuring both sustainable development and food security. Grain wastage may be decreased by enhancing post-harvest handling procedures, putting in place efficient storage methods, and minimizing food losses during distribution and consumption. Implementing effective storage systems involves using appropriate storage containers, such as metal or plastic silos, to prevent moisture and pest damage. In conclusion, preserving grains and reducing the wastage of grains are essential for food security and sustainable development. By implementing appropriate preservation techniques and reducing wastage, we can ensure that food is available and accessible to all. The reduction of grain wastage requires a multi-faceted approach that involves improving post-harvest handling practices, implementing effective storage systems, and reducing food losses in distribution and consumption. By working together to address these issues, we can ensure that grains are preserved and utilized efficiently, reducing food insecurity, and promoting sustainable development.",
                  keywords: [
                    "Food Grains",
                    "Quality Measures",
                    "Temperature Sensors",
                    "Humidity Sensor",
                    "Storage Methods"
                  ]
                },
                {
                  id: "G1-P2",
                  title: "Entrepreneurship Education and Training in Academic Institutions",
                  authors: [
                    "Puneet Chawla, Ch. Devi Lal State Institute of Engineering & Technology, Panniwala Mota (Sirsa)",
                    "Dr. Y.P.S. Berwal, Ch. Devi Lal State Institute of Engineering & Technology, Panniwala Mota (Sirsa)",
                    "Ruby Sathiala, Ch. Devi Lal State Institute of Engineering & Technology, Panniwala Mota (Sirsa)"
                  ],
                  contact: [
                    "puneet1817@gmail.com",
                    "ypsberwal@yahoo.com",
                    "sathialaruby@gmail.com"
                  ],
                  abstract: "Innovation is one of the key aspects of building blocks of our economy to redefine products and services meeting peoples' aspirations. The competitiveness of our economy must be raised by creating opportunities that empower young ones to earn sustainable incomes and growth. However, the number of local entrepreneurs emerging every year in India is very low before & during COVID-19 period till 2020. Afterwards, the innovative thoughts of emerging entrepreneurs enlarge the scale of growth of graph at the regular intervals in various sectors such as medical research & development, Space technology, transportation, agricultural as well drone technology. The healthier trend is that India is fast moving up the rank ladder. Though, further accelerating entrepreneurship especially based on innovations is crucial for large scale employment generation in the country. In wake of this, our Nation plans to foster entrepreneurial eco system to boost innovation and entrepreneurship competitiveness. The nation is committed to enhancing the strength of youngsters who will be job creators rather than job seekers. Innovative Entrepreneurs will lead the Nation & due to their combined efforts, the vision of becoming a developed nation with 3rd rank & to achieve the economy of 3 trillion dollars will only be achieved with the helping hands of these entrepreneurs. To inculcate entrepreneurship culture amongst its youth & equip them with skills to act as job creators and training to the students, government has formulated and launched various training programmes at the level of Centre and State with an aim to foster entrepreneurship among the students & for the generation of employment opportunities as well as creation of wealth. In this paper, an attempt has been made to describe the worth of various programmes and activities to be organized in academic institutions to drive & encourage innovations and entrepreneurship in society. These activities envision the civilization of self-motivated individuals grained with constructive and intense human beings driving & leading to positive outcomes for humanity.",
                  keywords: [
                    "Civilization",
                    "Employment",
                    "Entrepreneurs",
                    "Entrepreneurship",
                    "Self-Motivated"
                  ]
                },
                {
                  id: "G1-P3",
                  title: "IoT-Enabled Devices: Innovation in Technology for the Promotion of Distance Learning and E-learning in COVID-19",
                  authors: [
                    "Indu Bala, Arni University, Indora, Kangra (H.P.)",
                    "Dr. Sunita, Arni University, Indora, Kangra (H.P.)"
                  ],
                  contact: "sunitamahajan2603@gmail.com",
                  abstract: "Distance learning is in demand whenever education is widespread. Distance educational standards have received a significant amount of attention considering that they are necessary for everyone's safety during COVID-19. Despite having an impact on everyone's daily lives on a global basis, Covid-19 has severely destroyed everything. No industry appears to be immune from the effects of this pandemic. The education sector was significantly impacted by the lockdown in all nations, and the federal government and administrative organizations have opted to close academic departments for safety reasons. Nevertheless, at a certain period, technology and IoT gadgets played a crucial role in the continued existence of work, allowing people to transition from traditional jobs to work-from-home or online jobs, traditional classes to online classes, and from traditional money to electronic money. Furthermore, IoT gadgets, such as iPhones, smartphones, tablets, apps, desktops, and laptops, support and promote e-learning in virtually every aspect of life. Technology has advanced significantly. Thanks to the development of software and apps that meet the demands of business professionals, academics, educators, students, and the public. The Zoom app and Google Meet allow for the creation of virtual classrooms, which facilitates distance learning. Additionally, by offering networks all around the world, telecommunications corporations promote the technology. Teaching cannot be halted for an extended period due to the timely availability of networks and the current development of various technologies. In conclusion, Covid-19 has a huge impact on everyone's daily lives and has sped up the growth of new technologies to help students, educators, and organizations engage and communicate remotely.",
                  keywords: [
                    "Distance Learning",
                    "IoT Gadgets",
                    "Online Learning",
                    "Virtual Classroom",
                    "E-Learning"
                  ]
                },
                {
                  id: "G1-P4",
                  title: "Skill Education for Inclusive Growth: Need of the Hour for India",
                  authors: ["Dr. Kuldeep Kumar Mehendiratta,Kurukshetra University"],
                 
                  contact: "kkmehendiratta@gmail.com",
                  abstract: "Skill development has a significant role to play in the economy's inclusive growth. As a result of globalization and the rapid speed of technological advancements, the Indian economy faces several challenges, including rising unemployment, skill shortages, and income inequality. Developing and upgrading people's skills to meet the demands of the labor market is essential to promoting inclusive growth. The focus of skill development initiatives must be on enhancing employability, particularly among women, youth, and disadvantaged groups. Programs that provide access to quality education, training, and certification can help bridge the gap between the supply and demand for skilled labor. Additionally, it is crucial to foster an entrepreneurial culture that supports the creation of small and medium-sized businesses, which are key drivers of economic growth. Government policies and programs must be geared towards creating an enabling environment for skill development, including investments in infrastructure, technology, and education. By doing so, we can create a workforce that is equipped to meet the demands of the labor market, reduce unemployment, and promote inclusive growth.",
                  keywords: [
                    "Skill Development",
                    "Inclusive Growth",
                    "Employment",
                    "Entrepreneurship",
                    "Labor Market"
                  ]
                },
                {
                  id: "G1-P5",
                  title: "Role of Research and Development in Academic-driven Startups",
                authors: [
                     "Daksh Raj Singh,Ch. Devi Lal State Institute of Engg. & Tech., Panniwala Mota (Sirsa)",
                    "Dhiraj Kumar,Ch. Devi Lal State Institute of Engg. & Tech., Panniwala Mota (Sirsa)",
                   "Rishabh Varshney,Ch. Devi Lal State Institute of Engg. & Tech., Panniwala Mota (Sirsa)",
                "Arshdeep Singh,Ch. Devi Lal State Institute of Engg. & Tech., Panniwala Mota (Sirsa)"
                
                  ],
                  contact:"",
                  abstract: "Academic-driven startups are ventures that emerge from academic research institutions, typically universities or research centers. These startups leverage intellectual property, knowledge, and expertise generated through academic research to develop commercial products or services. They represent a unique synergy between scholarly pursuits and entrepreneurial endeavors. The academic startup scenario in India has experienced remarkable growth in recent years, propelled by a convergence of academia, entrepreneurial spirits, and supportive government initiatives. India's rich academic landscape, encompassing prestigious institutions and research hubs, serves as a breeding ground for innovative startups that translate academic knowledge into practical solutions. Despite these positive aspects, many academic-driven startups are facing challenges that result in them being a fiasco. The failure of academic-driven startups can vary widely depending on several factors. According to various studies and industry analyses, a significant 10% of startups in India do not survive in their incubation years. The key factors behind this data include market fit, management team, technological risks, and many more. To tackle these factors and curtail this percentage so that it does not affect academic-driven startups, the role of research and development becomes enormous. It plays a crucial part in academic startups by fostering innovation, enhancing competitiveness, and advancing knowledge. Rigorous research and development not only enhance the credibility of academic startups by showcasing a commitment to quality and continuous improvement but also ensures the long-term sustainability of the operation by staying abreast of advancements in their respective fields. In this paper, an attempt has been made to highlight the integration of research and development with academic-driven startups, the former serving as a catalyst for innovation, growth, and sustainability in the dynamic startup ecosystem for the latter.",
                  keywords: ["Intellectual Property", "Ventures", "Incubation", "Sustainability", "Innovation"]
                },
                {
                  id: "G1-P6",
                  title: "Collaboration between Start-ups and Academia",
                  authors: [
                     "Preet Kaur,MM PG College, Fatehabad"
                      
                    
                  ],
                  contact:"",
                  abstract: "The intersection of startups and academia has emerged as a powerful force driving research and innovation across various industries. Traditionally, academia and entrepreneurship have been perceived as distinct worlds, with academia focusing on theoretical research and startups driven by practical applications. However, a growing number of successful collaborations between these two spheres are proving that their synergy can yield groundbreaking advancements, promote technology transfer, and foster economic growth. The most obvious advantage of collaboration between startups and academia lies in knowledge exchange. Universities are hubs of cutting-edge research and house experts in various fields, making them an abundant source of ideas and expertise. By collaborating with startups, academia can ensure that their research has practical applications and contributes to real-world problem-solving. In turn, startups benefit from access to groundbreaking research, allowing them to leverage new ideas and technologies for developing innovative products and services. The partnership between startups and academia has also played a crucial role in fostering an entrepreneurial culture. Universities that actively support and encourage entrepreneurship create an environment where students and faculty members are more likely to explore commercial applications of their research. This culture of innovation has led to an increase in the number of startup ventures originating from academic institutions, fueling economic growth and job creation. This article delves into the significance of collaboration between startups and academia, highlighting the benefits it brings to society.",
                  keywords: ["Startups", "Academia", "Knowledge Exchange", "Innovation"]
                },
                {
                  id: "G1-P7",
                  title: "Role of Incubations and Its Influence on Startup Development",
                  authors: [
                    
                       "Arshad Ali,Maharshi Dayanand University, Rohtak, India, 124001",
                   
                       "Meena Kumari,Maharshi Dayanand University, Rohtak, India, 124001",
                     
                     "Manisha,Maharshi Dayanand University, Rohtak, India, 124001",
                    "Ravinder Kumar Sahdev,Maharshi Dayanand University, Rohtak, India, 124001"
                    
                    
                  ],
                  contact:"",
                  abstract: "Startups are important for economic growth and development. Entrepreneurs are also important in the process of structural change or industrialization, which is required for development. There is an increasing understanding of the need for industrial policy (IP) in overcoming a variety of startup failures that hinder innovative entrepreneurship in the creation of jobs and environmentally friendly industrialization. This means an industrial policy that highlights the importance of the connection between government and small businesses (the private sector). Startups can benefit from incubation centers by gaining access to new markets, consumers, and funding possibilities. It can also lead to more competition, which can promote innovation and enhance product and service quality. Startups may also have difficulty in obtaining finance and managing cross-border supply networks. As a result, understanding the role of incubators in the complexities of global commerce and establishing methods to deal with these difficulties is essential for innovators. Aside from that, incubations allow firms to gain access to new markets, consumers, and capital. Startups may strengthen their competitiveness and exploit their capabilities to achieve growth and success by engaging in global trade. Furthermore, to manage the complexity of the global market and thrive in international commerce, entrepreneurs must prioritize the formation of strong connections and networks. As a result, we may conclude that boosting the competitiveness of startup incubators is key to their success as international trade competitors.",
                  keywords: ["Incubations", "Global Market", "Industrial Policy", "Startup", "Industrialization"]
                },
                {
                  id: "G1-P8",
                  title: "Role of Engineers in the New Startups to Support Indian Economy",
                  authors: [
                    "Priyanka Handa,CDLSIET Panniwal, Mota",
                      
                     "Dr. Bhupinder Singh,CDLSIET Panniwal, Mota",
                     
                    "Poonam Mehta, CDLSIET Panniwal, Mota",
                     "Rupinder Kaur, CDLSIET Panniwal, Mota"
                      
                  ],
                  contact:"",
                  abstract: "Unemployment is a critical issue that continues to challenge the economic landscape of India. Startups are key components of the National Innovation System (NISs) and have contributed to sustainable development in many countries. Recent studies show that India needs more than 100 million jobs a year. Startups may be small companies, but they play a major role in employment generation in India. When more jobs are created, that generates more income for people and subsequently improves the economy of the country. In this era of technology, when the matter is relevant to startups, engineering graduates are at an advantage. Engineers have a strong technical understanding, the potential for high growth, and the ability to make a difference in the world. In the curriculum for engineering, the addition of subjects on entrepreneurship along with technical subjects can help acquire the skill and know-how to turn their startup ideas into reality.",
                  keywords: ["Startup", "Economy", "Employment", "Technology"]
                },
                {
                  id: "G1-P9",
                  title: "Revolutionizing Education: A Comprehensive Review of the Machine Learning and Artificial Intelligence Era in Modern Learning",
                  authors: [
                     "Monika,Arni University",
                     "Diksha,Arni University",
                     "Dr. Sunita,Arni University"
                  
                  ],
                  contact: "sunitamahajan2603@gmail.com",
                  abstract: "The modern education era is undergoing a transformative shift with the integration of Machine Learning (ML) and Artificial Intelligence (AI). This abstract explores the multifaceted impact of these technologies on contemporary education, highlighting the opportunities and challenges they bring to the forefront. Machine Learning and Artificial Intelligence have propelled the concept of personalized learning, revolutionizing traditional teaching methodologies. Adaptive learning platforms, empowered by AI, cater to individual student needs, preferences, and learning paces, fostering a dynamic and tailored educational experience. This adaptability extends to intelligent content delivery, ensuring that educational materials remain current, relevant, and responsive to the evolving knowledge landscape. Instructors benefit from AI-driven tools that automate grading processes, employ data analytics, and utilize predictive modeling to gain valuable insights into student performance. This data-driven approach empowers educators to make informed decisions, tailor teaching strategies, and enhance the overall quality of instruction. The integration of AI in education extends beyond the physical classroom, breaking down geographical barriers through virtual learning environments and AI-powered educational tools. Virtual assistants provide additional support, facilitating interactive and engaging learning experiences, thus democratizing access to quality education on a global scale. However, the incorporation of ML and AI in education is not without challenges. Ethical considerations, privacy issues, and the potential for algorithmic biases demand careful navigation. Striking a balance between leveraging the benefits of these technologies and ensuring ethical standards is paramount to fostering a responsible and equitable educational landscape. In this article, we describe the role of AI, ML background, and impact in the education sector.",
                  keywords: ["AI", "ML", "Modern Education", "Background", "Impact"]
                 },
                {
                  id: "G1-P10",
                  title: "Implications and Insights: Artificial Intelligence and Machine Learning’s Revolution in Academic Startups",
                  authors: [
                     "Saurabh Sahu,NIT Jalandhar"
                      
                    
                  ],
                  contact: "saurabhhsahu9929@gmail.com",
                  abstract: "The current research delves into the important implications and groundbreaking discoveries that arise from the combination of AI and ML within the academic startup environment. This essay examines how, as technology continues to alter the face of entrepreneurship, AI and ML have spurred a paradigm shift in academically driven businesses, encouraging innovation, productivity, and sustainability. The study starts with an overview of the evolving academic startup landscape and acknowledges the growing trend of combining AI and ML technologies. The intricate impacts of these technologies on several startup operations factors, including market penetration, scalability, and research and development, are then examined. Through case studies and empirical analyses, the research delves into the practical implications of AI and ML, demonstrating how these technologies enhance decision-making processes. Insights are gleaned from successful implementations to illustrate the potential of AI and ML in converting traditional methods to entrepreneurship at academic institutions using real-world examples. It also emphasizes how AI and ML could aid in bridging the knowledge gap between theoretical study and real-world applications. In summary, this study offers valuable insights into how artificial intelligence and machine learning could transform academic startups. It highlights the need for ethical and strategic use of these technologies and offers guidance to stakeholders in academia, business, and policymaking. As artificial intelligence and machine learning continue to push the boundaries of innovation, this research provides a roadmap for navigating the shifting landscape of academic entrepreneurship in the digital age.",
                keywords: ["AI-ML Integration", "Academic Startup Transformation", "Innovation and Productivity", "Ethical Technology Implementation"]
                },
                {
                  id: "G1-P11",
                  title: "Developing an Ecosystem for Inculcating Entrepreneurial Culture at Schools",
                  authors: [
                    "Kalpana Maheshwari,Shri Vishwakarma Skill University",
                    "Meenakshi Agarwal,Shri Vishwakarma Skill University"
                  ],
                 
                  contact: "kalpana.maheshwari@svsu.ac.in",
                  abstract: "India, known for its strong ancient education system of Gurukuls and renowned Universities such as Nalanda and Takshshila, has traditionally prioritised higher education. These institutions have remained an important part of the country‘s fabric, instilling in pupils‘ specific skills and knowledge that have fashioned them into pillars of society and contributors to the country‘s economic growth. However, according to industry observers, India has a lot of potential but has not been able to tap all of that into some ground-breaking and pioneering products. Many start-ups that could have blossomed into massive corporations died an untimely death. One of the many reasons why the start-up revolution has been delayed in India is the lack of an ecosystem for entrepreneurship culture. Unfortunately, the country‘s schools, colleges, and universities have been unable to give students an environment that fosters and encourages creativity, ideation, and invention. This paper aims to study the need for the development of Start-up culture in schools. While studying the various factors, the authors have tried to develop a framework for the ecosystem required to develop the said culture in schools.",
                  keywords: [
                    "Entrepreneurship",
                    "Ecosystem",
                    "Education",
                    "Culture",
                    "Start-ups"
                  ]
                  
                 },
                {
                  id: "G1-P12",
                  title: "Skill Development as per the Need of Hour",
                  authors:[ 
                    "Dr. Babita Rani,National College of Education, Sirsa, Haryana"
                  ],
                  
                  contact: "dr.babitakhanagwal@gmail.com",
                  abstract: "In the rapidly evolving landscape of the 21st century, characterized by technological advancements, globalization, and dynamic economic shifts, the imperative for skill development has become more pronounced than ever before. This abstract explores the significance of aligning skill development initiatives with the current needs of the hour, focusing on the multifaceted dimensions of education, workforce, and societal demands. The modern era is witnessing unprecedented transformations across industries, with emerging technologies such as artificial intelligence, automation, and data analytics reshaping job requirements. As a result, the skill sets demanded by the job market are continually evolving, emphasizing the need for individuals to acquire adaptable and future-proof skills. Educational institutions and training programs must reorient their curricula to incorporate a blend of technical competencies, critical thinking, and soft skills to prepare individuals for the diverse challenges of the contemporary workforce. Furthermore, globalization has interconnected economies and workforces, necessitating a set of skills that transcends geographical boundaries. Cross-cultural communication, global awareness, and proficiency in virtual collaboration have become integral components of skill development to foster a globally competent workforce. The ability to navigate diverse cultural contexts is crucial for individuals to thrive in an interconnected world and contribute meaningfully to their respective fields. The societal landscape is also undergoing significant changes, with an increasing emphasis on sustainability, social responsibility, and ethical considerations. Skill development initiatives must incorporate values such as environmental consciousness, social equity, and ethical decision-making to address the broader needs of society. A holistic approach to skill development involves not only technical proficiency but also a commitment to social and environmental responsibility. In conclusion, skill development aligned with the needs of the hour is pivotal for individuals, institutions, and societies to thrive in the 21st century. The ability to adapt to technological advancements, navigate a globalized world, and contribute responsibly to societal well-being defines the success of individuals and the collective progress of communities. As we continue to navigate an era of unprecedented change, prioritizing skill development in tune with contemporary demands is essential for building a resilient, innovative, and inclusive future.",
                  keywords: [
                    "Contemporary Skill Development",
                    "Global Competence",
                    "Societal Responsibility"
                  ],
                },
                {
                  id: "G1-P13",
                  title: "V2G as Academic Startup for Clean Environment",
                  authors: [
                      "Rajesh Kumar Dubey, Electrical Engineering Department, Central University of Haryana",
                      "Poonam Sharma, Electrical Engineering Department, Central University of Haryana",
                      "Kalpana Chauhan, Electrical Engineering Department, Central University of Haryana"
                  ],
                  contact: "rajesh.dubey@cuh.ac.in, psb.478@gmail.com, kalpanachr@cuh.ac.in",
                  abstract: "Sustainable development is considered as a 'fluid concept' (IISD, 2010, p. 6) as it has been interpreted in multiple ways. Most interpretations of the term can be classified as either 'technological' or 'ecological' (Orr, 1992). The technological approach emphasizes reducing the adverse impact on the environment through technological advancements and new legal rules and regulations, while following the same socioeconomic growth trajectory. This technological approach is top-down in nature, as it is driven by experts in the fields of science, technology, and law, instead of the local community. The ecological approach, on the other hand, is bottom-up in nature, as it argues for social transformation by incorporating both expert-driven science and technology-based knowledge as well as the efforts of common citizens. The ecological approach thus requires collaborative efforts of both experts and people of the community. Presently, the technological approach is more widely accepted and valued, but there is a dire need to shift our attention to the ecological approach which often goes unrecognized and underappreciated. To promote this, the United Nations dedicated a decade for Education for Sustainable Development (ESD), famously called DESD 2005-2014, which required 'the concerns about sustainable development to be inculcated through education' and the efforts continue with the commitment of the nation’s towards 'Global Action Programme' on ESD (UNESCO, 2005). This paper presents one such model of a Green School, empowering young people to take responsible action to reduce, reuse, and recycle waste with the overall long-term goal to be a zero-waste school. The researcher studied manuals, case studies, reports, and guides of fifteen green schools or eco-schools or sustainable schools from around the world, and primary data was collected from the five Jawahar Navodaya Vidyalaya of Delhi NCR using the tools developed by the researcher. The qualitative data collected from both secondary as well as primary sources were analyzed based on the principles of framework analysis to identify the best strategies for managing waste in schools. Further using the 'Whole School Approach', a thematic framework was prepared, and indexing was done using color coding. Results present a model of a green school, engaging all stakeholders, in every aspect of school life, namely Governance, Teaching and Learning, Community Partnerships & Facilities and Operations, to effectively manage waste in school.",
                  keywords: [
                      "Ecological Approach",
                      "Environmental Education",
                      "Zero-waste School",
                      "Whole School Approach"
                  ]
              },
              {
                  id: "G1-P14",
                  title: "Automatic Attendance System as a Part of Skill Education System",
                  authors: [
                      "Vinay Wadhwani, Central University of Haryana",
                      "Kalpana Chauhan, Central University of Haryana",
                      "Faizan Ashraf, Central University of Haryana",
                      "Garvit, Central University of Haryana",
                      "Abhinav Kumar, Central University of Haryana",
                      "Chhyesh, Central University of Haryana"
                  ],
                  contact: "vinay2405wadhwani@gmail.com, kalpanachr@cuh.ac.in, chhyesh786@gmail.com, abhinavmtc2@gmail.com, garvityadav6959@gmail.com, faizanashraf043@gmail.com",
                  abstract: "The dynamic world around us has transformed at a fast speed after the pandemic. With the growing dominance of technology, communication, and globalization, the global job markets have seen a major change in the nature and scope of work (jobs/employment). All in all, this means that 21st century skills for students are a passport to a successful career pathway in the upcoming years. The skill development programs also help the youth identify their interests and talents. It helps them develop flexibility, reliability, productivity, and efficiency. All of this goes on to improve their chances of successful careers and widen their career opportunities. One of the new technological advancements in attendance system is the example of skill development. This paper presents an RFID-based automatic attendance system. The attendance system will work by scanning the ID card. The existing conventional attendance system requires students to manually sign the attendance sheet every time they attend a class. As common as it seems, such a system lacks automation, where several problems may arise. Having a system that can automatically capture a student’s attendance by flashing their student card at the RFID reader can really save all the mentioned troubles. The RFID reader, which is a low-frequency reader (125 kHz), is connected to the host computer via a serial to USB converter cable. The Time-Attendance System GUI is developed using Visual Basic.Net. The Attendance Management System provides the functionalities of the overall system such as displaying live ID tags transactions, registering ID, deleting ID, recording attendance, and other minor functions. This interface was installed in the host computer. The main objective of this paper is to record the attendance of students using RFID tags. Each student is provided with his/her authorized tag to swipe over the reader to record their attendance. In classrooms, time is wasted in roll calls as it is done manually. In this proposed system, authorized students are given an RFID tag. This tag contains an integrated in-built circuit that is used for storing, processing information through modulating and demodulating of the radio frequency signal that is being transmitted. Thus, the data stored in this card is referred to as the identification/attendance of the person. Once the student places the card in front of the RFID card reader, it reads the data and verifies it with the data stored in the microcontroller from the 8051 family. If the data matches, then it displays a message on the LCD confirming the entry of that student; else it displays a message denying the attendance. The status of a student’s attendance can be retrieved from this system by pressing the status button interfaced to the microcontroller. Hence, a lot of time is saved as all the students’ attendance is directly stored in the database. The paper can be further enhanced by adding features like sending an SMS of the daily attendance of students to their parents.",
                  keywords: [
                      "RFID Attendance System",
                      "Skill Development Program",
                      "21st Century Skills",
                      "Automation in Education"
                  ]
              },
              {
                  id: "G1-P15",
                  title: "The Challenges and the Lessons Learned from the Experiences of Successful Startups in Business Communication",
                  authors: [
                      "Aparna, Indira Gandhi University, Meerpur"
                  ],
                  contact: "aparna.iks@igu.ac.in",
                  abstract: "Start-ups often encounter unique challenges when formulating their communication approach. Frequently, the identities of the founders, the company, and the products remain relatively unknown. This holds particularly true during the initial phase of establishing a business, which is the focal point of this essay. It is of utmost importance to comprehend the target audiences for communication and tailor the strategies accordingly. The analysis of the different stages of business inception and the notable recipients of start-up communication strategies is followed by the presentation of two actual instances. Ultimately, the derivation of advice for the communication strategy of start-ups is presented. The approach taken by these startups is characterized by a willingness to take risks and pursue high-reward opportunities. This approach, however, often results in a high rate of failure and only a small percentage of startups actually achieve success. Despite these challenges, it is important to recognize that the overall contribution of these startups is crucial to the innovation and advancement of various industries. Hence, it is intriguing to observe that existing literature frequently overlooks the valuable lessons that can be learned from studying the experiences of failed startups. Instead, the emphasis is often placed on successful firms and quantitative studies that aim to identify factors that contribute to their success.",
                  keywords: [
                      "Startups",
                      "Risks",
                      "Entrepreneurs",
                      "Failure"
                  ]
              },
              {
                  id: "G1-P16",
                  title: "Role of Academic-driven Entrepreneurships/Startups in Shaping Economy and Fostering Innovation",
                  authors: [
                      "Prof. Joy Kuriakose, Shri Vishwakarma Skill University, Haryana",
                      "Dr. Raj Nehru, Skill Innovator Foundation, Shri Vishwakarma Skill University, Haryana"
                  ],
                  contact: "joykuriakose@svsu.ac.in",
                  abstract: "Academic-driven startups play a vital role in shaping the economy of a country and fostering innovation. Such startups are the embodiment of the synergy between academia and entrepreneurship, propelling us towards a future of unprecedented possibilities. In the realm of academic-driven startups, we witness the transformation of knowledge into tangible solutions. Universities cannot remain just as institutions for classroom learning; they are hotbeds of ground-breaking ideas waiting to be unleashed. When these ideas transition from the lecture hall to the open market, they become catalysts for economic growth. Startups bridge the gap between theory and practice, taking research findings and turning them into products and services that address real-world challenges. In doing so, they create jobs, stimulate local economies, and contribute to the overall prosperity of our society. Moreover, the culture of innovation embedded in academic startups is contagious. It fosters an environment where creativity thrives, encouraging a constant pursuit of improvement and advancement. As these startups push the boundaries of what is possible, they inspire others to follow suit, creating a ripple effect that elevates our collective innovative spirit. Let’s not forget the role of academic startups in attracting talent and retaining expertise. They become magnets for bright minds, offering a platform for researchers and students to actively engage in shaping the future. The symbiosis between academia and startups creates a dynamic ecosystem where knowledge is not confined to textbooks but in actively shaping industries and markets. Innovations of SVSU include a brief overview/presentation of our Super 30 Entrepreneurship Development Programme and best practices of SVSU showcasing some of SVSU’s best practices. The transformative potential of exploring incubation support within the university system is discussed. Universities are not just hubs of education; they are breeding grounds for innovation and entrepreneurship. By integrating robust incubation support into the university ecosystem, we will be able to catalyze a paradigm shift in how we nurture and harness the potential of budding entrepreneurs. Universities are treasure troves of talent, brimming with students and faculty members whose ideas have the power to reshape industries and solve real-world problems. However, the journey from ideation to implementation can be challenging. This is where incubation support steps in, providing the necessary scaffolding for these nascent ideas to flourish. Moreover, this approach bridges the gap between academia and industry. It’s a collaborative effort that ensures the knowledge generated within the walls of a university doesn’t stay confined but finds practical applications in the real world. In doing so, we prepare students not just for exams but for the dynamic challenges of the professional landscape. To make this vision a reality, it requires a concerted effort from academic institutions, industry leaders, and policymakers. By fostering an environment where innovation is not only encouraged but also supported, we lay the foundation for a future where our universities are not only centers of learning but hotbeds of entrepreneurial excellence too. Rural livelihood development through universities is a powerful avenue for fostering economic growth and a university skilling ecosystem. In the intricate tapestry of our nations, rural communities often hold the key to untapped potential and sustainable progress. By leveraging the educational resources of our universities, we can channel transformative skills to these often overlooked regions, creating a ripple effect of positive change. Universities, as centers of knowledge and learning, play a pivotal role in shaping the future. It’s time to extend this influence beyond urban boundaries and into the heart of rural areas. Imagine a scenario where universities actively engage with rural communities, offering tailored skill development programs that align with local needs and aspirations. By providing targeted skilling initiatives, universities can empower rural populations with the tools and knowledge necessary for economic self-sufficiency. This doesn’t merely mean equipping individuals with technical skills; it encompasses a holistic approach, incorporating entrepreneurial, agricultural, and community development skills. Skilling initiatives tailored to rural contexts can unlock the potential of local industries, whether it be agriculture, craftsmanship, or sustainable practices. As individuals gain expertise, they not only enhance their personal prospects but also contribute to the overall growth and resilience of their communities. Moreover, this approach aligns with the idea of sustainable development. It’s about cultivating skills that harmonize with the local environment, preserving traditional practices while integrating modern methodologies. The result is not just skill development; it’s the creation of a self-sufficient, empowered rural population capable of steering its own destiny. To make this vision a reality, collaboration between universities, local governments, and community leaders is essential. By pooling resources and expertise, we can establish a framework that ensures the seamless integration of university skilling programs into the fabric of rural life.",
                  keywords: [
                      "Academic Entrepreneurship",
                      "Incubation Support",
                      "Rural Livelihood Development",
                      "Skilling Ecosystem"
                  ]
              },
              {
                  id: "G1-P17",
                  title: "Induction of Start Up Culture on School Level",
                  authors: [
                      "Prof. Sian Devgan, Shri Krishna AYUSH University, Kurukshetra"
                  ],
                  contact: "siandevg9@gmail.com",
                  abstract: "Government’s ambitious 'Startup India' campaign is essentially geared towards promoting the entrepreneurial culture in our country. But it will be more effective when it will be enforced at the school level as youth is the future of India. The bootstrapping spirit has been missing in our country, partially due to lack of motivating governmental incentives and rest due to our age-old tendency to prioritize jobs over charting the new innovative course. Turbocharging the campaign; Startup culture in its full bloom would generate employment as well as pull the GDP up and when it will be at school level it will nurture their future and they have clear understanding from the beginning. It is important that the Startup spirit is instilled in students adequately to stop their reliance on ready-made employment opportunities. Students should be driven by the urge to utilize their potential for adding newer dimensions to the Startup landscape. Spreading the Startup culture among blossoming youth is essentially concerned with embedding the passion for exploring newer avenues of professional success by optimizing on acquired skills. Students possess the right blend of enthusiasm and knowledge to benefit maximally from the government’s Startup related support from the beginning.",
                  keywords: [
                      "Startup India Campaign",
                      "Innovative",
                      "Opportunities"
                  ]
              },
              {
                id: "G1-P18",
                title: "Biobased Bioplastic Printability: New Ecofriendly Approach",
                authors: [
                    "Pankaj Kumar, Department of Printing Technology, Guru Jambheshwar University of Science & Technology, Hissar",
                    "Dr. Vikas Jangra, Department of Printing Technology, Guru Jambheshwar University of Science & Technology, Hissar",
                    "Prof. Ambrish Pandey, Department of Printing Technology, Guru Jambheshwar University of Science & Technology, Hissar",
                    "Prof. Rajendrakumar Anayath, Department of Printing Technology, Guru Jambheshwar University of Science & Technology, Hissar"
                ],
                contact: "pankajtiwari01@gmail.com, vjangragju@gmail.com, ambrishpandey12@yahoo.co.in, profanayath@gmail.com",
                abstract: "Guru Jambheshwar University of Science & Technology name after famous saint and environmentalist Guru Jambheshwar Ji Maharaj (15th Century Hindu Saint) to promote his lessons and best environmental practices. In view, university has devised its best practice with the vision to promote awareness about Environmental issues and Sustainability with the special emphasis on green practices which includes reducing carbon footprint, promoting biobased biodegradable plastics, waste management and Rain Harvesting. During 4th cycle of NAAC Accreditation, university own with its vision: GJUST has undergone Environment and Green Audit. The focus is on Renewable energy, Waste management, and Rainwater Harvesting and Green practices. The aim is to develop awareness of Environmental issues and Sustainability. This translated into a healthy increase in reliance on Renewable energy sources. In line with the vision of university best practice, the Department has taken green initiative for promoting printing on biobased plastics and printing using biobased inks. GoI has taken an initiative to attain zero carbon footprint by 2080. So, to achieve this goal utility of bio-based bioplastic and biobased ink will be amongst the most appropriate and best practices.",
                keywords: [
                    "Environment Friendly",
                    "Carbon Footprint",
                    "Green Initiative",
                    "Biobased Biodegradable Plastics",
                    "Printability",
                    "Biobased Ink"
                ]
            },
            {
                id: "G1-P19",
                title: "Blockchain Revolution: Transforming Industries Through Transparent Innovation",
                authors: [
                    "Rambhateri, Indira Gandhi University, Meerpur"
                ],
                contact: "rnolia45@gmail.com",
                abstract: "The development of advanced technology has led to changes in the current state of data creation, capture, and storage methods. With the potential to significantly improve security, blockchain technology has begun to ensnare numerous organisations in the fields of finance, government, healthcare, supply chains, and cyber security. To study the applications of blockchain technology is the main objective of the research study and covered the challenges and barriers of Blockchain technology in today’s business era. This study is conceptual in nature and based on the review of different studies. This study finds out blockchain technology is widely used in the Healthcare Industry, supply chain management, education, banking and insurance, government and Farming and Fishing Industry.",
                keywords: [
                    "Decentralization",
                    "Peer-to-peer",
                    "Smart Contract",
                    "Blockchain"
                ]
            },
            {
                id: "G1-P20",
                title: "Provably Secure Identity-based Quantum Signature Scheme with Strong Security",
                authors: [
                    "Sunil Prajapat, Central University of Himachal Pradesh",
                    "Pankaj Kumar, Central University of Himachal Pradesh"
                ],
                contact: "sunilprajapat645@gmail.com, pkumar240183@gmail.com",
                abstract: "The rapid development of quantum computers led to a competitive effort to develop quantum technology in both academic and industrial sectors. Quantum cryptography is a crucial instrument for ensuring secure services in the context of quantum communication. The designated verifier signature, a type of quantum cryptography, is highly advantageous in applications such as the Internet of Things (IoT) and auctions. This paper proposes a quantum-designated verifier signature (QDVS) system based on identification. The protocol we have developed incorporates security measures such as protection against eavesdropping, prevention of non-repudiation, designated verification, and defence against hidden sources assaults. Furthermore, it is safeguarded against fraudulent assaults, unauthorised resending, and impersonation. The suggested approach leverages the advantages of conventional designated verifier signature schemes. In the proposed scheme, the signer employs their private key to encrypt a message, while the designated verifier verifies the associated QDVS using the signer's public key, which is represented by their name or email address. This approach simplifies the key management of the quantum signature system. The signing and verification process utilises an entangled state, but the verifier does not need to compare quantum states. A comprehensive comparative examination with other similar schemes enhances the level of security for the proposed project. Moreover, the efficacy and practicability of the suggested method are confirmed by quantum simulations.",
                keywords: [
                    "Fraudulent Assaults",
                    "Key Management",
                    "Conventional Designated Verifier Signature Schemes"
                ]
            },
            {
                id: "G1-P21",
                title: "Enhancing Security in The Metaverse: An ECC-based Three-factor Authentication Approach",
                authors: [
                    "Garima Thakur, Central University of Himachal Pradesh, H.P, India",
                    "Pankaj Kumar, Central University of Himachal Pradesh, H.P, India"
                ],
                contact: "garima48451@gmail.com, pkumar240183@gmail.com",
                abstract: "Metaverse is revolutionizing the future iteration of technology with the potential to ameliorate efficiency and innovation drastically. It fashions engaging spaces for user interaction that simulate the real world by integrating augmented and virtual reality. Metaverse furnishes immersive interactive experiences, unrestricted time and space, visualizations, minimal learning costs, and endorses communication. A metaverse offers various services, such as virtual environments and avatars for telecommuting, education, and gaming. Yet, to access services, users must register with the server, where the registration requires user's identity, password, and personal information. Additionally, the user interaction in metaverse is mediated through avatars over public channels, fabricating opportunities for security attacks such as replay and impersonation attacks. Consequently, we propose a secure mutual authentication scheme for safer user-server and avatar-avatar interactions utilizing Elliptic Curve Cryptography (ECC) and fuzzy extractor. The security of protocol is examined with Burrows-Abadi-Needham (BAN) logic, Real-or-Random (ROR) model, and Automated Validation of Internet Security Protocols Applications (AVISPA). We also conduct a comparative analysis of the computational and communication costs and the security features of the proposed scheme with pre-existing works. Hence, the suggested protocol offers magnificent security and efficiency, making it suitable for the metaverse environment.",
                keywords: [
                    "Metaverse",
                    "Authentication",
                    "Avatar",
                    "Fuzzy Extractor",
                    "BAN Logic",
                    "AVISPA"
                ]
            },
            {
              id: "G2-P1",
              title: "Role of the Universities in Industrial Development through Startup Programmes",
              authors: ["Sarban Kumar", "Parveen Sharma"],
              contact: ["rsai3206@gmail.com", "babukamboj143@gmail.com"],
              abstract: "Startups are the main components of the National Innovation Systems (NISs). It has made a pivotal contribution to sustainable development in most countries because of the creation of employment opportunities and its contribution to the national Gross Domestic Product (GDP). Hence, universities across the world have identified the importance of entrepreneurship training for students to help enhance their capability to develop their startups. This study tries to find out the various ways to develop the effectiveness of student startups to induce industrial development. The approach adopted was the development of a hybrid model to optimize the development of entrepreneurship skills in university students based on existing theories and literature. The study was based on primary data collected from 8 universities in Haryana state. The study shows that research funds, size of dedicated faculty, size of dedicated staff (academic and non-academic), practical entrepreneurship courses, and non-regular curriculum startup activities are the main factors responsible for the profitability of student startups.",
              keywords: ["Student Startups", "Collaboration", "Industrial Development", "Change of Ownership", "Entrepreneurship", "Simulation"]
            },
            {
              id: "G2-P2",
              title: "Need of Cross Disciplinary Collaborations in Academic Startups",
              authors: ["Patil Shrinivas Kiran", "Dr. A. M. Gurav"],
              contact: ["annasahebg@yahoo.co.in"],
              abstract: "For Academic or non-academic startups, one needs to work on diversified areas or diversified systems which need versatile people. But doing all the things by one person is quite time-consuming as well as it needs versatile personalities, which is almost impossible nowadays. Cross-function, cross-sector collaborations are very much essential in new age startups. Nowadays in challenging and evolving environments even grassroots innovations and startups need very much affiliation with Graphic Designing and Digital media experts. In the next few pages, we will discuss cross-function teams on a case-to-case basis.",
              keywords: ["Grass Root Innovations", "Cost Optimization", "Cash Burning", "Rurban"]
            },
            {
              id: "G2-P3",
              title: "Government Initiative and Policies for Promoting Academic-driven Startups - Case of Punyashlok Ahilyadevi Holkar Solapur University Solapur and Its Incubation Centre",
              authors: ["Patil Shrinivas Kiran", "Dr. Anjana S. Lawand", "Dr. Prakash A. Mahanvar"],
              contact: ["anjanalawand@yahoo.co.in"],
              abstract: "Punyashlok Ahilyadevi Holkar Solapur University Solapur is a State University under Government of Maharashtra which has initiated several drives for engaging and mobilization the academic-driven startups particularly Startup Yatras, Envirothon, Skeleton were conducted for fostering the Innovation allied Entrepreneurship in one of the most drought-affected areas of Maharashtra. Government initiatives sowing the seeds for a thriving university startup ecosystem.",
              keywords: ["Government Initiatives", "Academic-driven Startups", "Innovation", "Entrepreneurship"]
            },
            {
              id: "G2-P4",
              title: "Role of National Education Policy 2020 in Fostering Academic Startup Ecosystem",
              authors: ["Komal Rani Tehlan", "Yogesh Kumar", "Rushali Gupta", "Rajiv Ratn Shah"],
              contact: ["tehlankomal@gmail.com", "dryogeshkumar.uiet@mdurohtak.ac.in", "guptarushali30@gmail.com", "rajivratn@iiitd.ac.in"],
              abstract: "India stands as the second-largest startup hub globally after the United States, showcasing a paradox where academic startups remain on the periphery despite the overall success of the startup ecosystem. This paper aims to dig into the challenges faced by academic startups in India, evaluate existing government initiatives, and explore the potential provisions of the New National Education Policy 2020 (NEP 2020) that contribute to fostering a more robust academic startup culture. Additionally, it will highlight factors that made some Indian institutes fertile for entrepreneurship within an academic setting.",
              keywords: ["National Education Policy", "Academic Startup", "Entrepreneurship", "Startup"]
            },
            {
              id: "G2-P5",
              title: "A Comprehensive Overview and Analysis of Academic-driven Startup Failures and the Lessons Gained Through Them",
              authors: ["Pratyush Mishra"],
              contact: ["12112232@nitkkr.ac.in"],
              abstract: "The highly dynamic and ever-changing landscape of our modern economy allows for ingenuity and creativity to act as key leading factors in further development. As such, it may be observed that startups act as the foundational spearheads, driving innovation and economic growth through their endeavors. Among these, those startups in which academic institutions show intimate involvement in and after the venture's creation - commonly known as Academic-driven startups (or ASUs) - stand out, harnessing the vast knowledge of academia to tackle pressing societal challenges and drive technological progress. It is, however, clear to see that the journey to success is filled with obstacles, and a considerable number of pioneers fall short of their full potential. Examining startup stumbles to unveil their causalities and secrets is crucial for nurturing a thriving ecosystem that propels entrepreneurial success. A new set of interesting challenges arise when examining the class of startups that are Academically driven, due to their unique domain of functionality. Analyzing the challenges faced by ASUs may serve in providing a set of insights that are densely correlated to both business as well as intellectual and technological fields. The proposed research paper embarks on an intricate examination of the complex and fascinating realm of ASU failure, unraveling the densely laid challenges faced by the academically propelled endeavors, by drawing on compelling case studies and hard-hitting empirical data. The study allows for the pinpointing of key areas where these ventures along with startups in general often stumble—be it a mismatched market, proprietary issues faced by inventors, or a reluctance to adapt and pivot, to name a few. By critically examining these factors, we not only shed light on the hurdles faced by these startups but also offer invaluable insights and lessons. Further, by showcasing the lessons learned from these setbacks, the research can emphasize the vital role of thorough market research, astute classification and self-awareness, shrewd financial management, and resilient leadership, among other fundamental driving concepts. The paper concludes with a resounding call to action, highlighting the indispensable role of academic institutions in crafting a supportive ecosystem. By providing access to resources, mentorship, and networking opportunities, universities become catalysts, empowering students, and researchers to morph innovative ideas into triumphant ventures that not only contribute to economic growth but also propel societal progress.",
              keywords: ["Startup Failures", "Academic-driven Startups", "Case Studies", "Analysis", "Lessons", "Success"]
            },
            {
              id: "G2-P6",
              title: "Optimization of Biogas Production by Anaerobic Co-digestion for Sustainable Energy Development in India",
              authors: ["Sonam Sandhu", "Pratibha Sandhu"],
              contact: ["sandhusonam024@gmail.com"],
              abstract: "Energy security, improved energy access, economic development, and climate change mitigation are the main goals of India’s use of renewable energy. Sustainable development is possible through sustainable energy use and ensuring citizens have access to reliable, sustainable, affordable, and modern energy. Biogas technology is useful technology to produce a sustainable and superior fuel. Solid waste (MSW) is one of the major components of India’s flagship mission 'Swachh Bharat Abhiyan.' Lifestyle changes, increasing urbanization, and rapid economic growth all contribute to high waste generation in India. People in urban and rural areas use biomass fuel to meet their energy demand. This demand is met by land degradation and deforestation resulting in various health and social problems and excessive emissions of greenhouse gases. Improper collection, unscientific treatment, and low use of technology-based solutions to deal with solid waste led to threats such as environmental degradation, and air, water, and soil pollution. Biogas technology represents a sustainable method of urban and domestic energy production, especially in developing countries. This paper highlights the overview of biogas generation in India and outlines methods used to optimize biogas generation by anaerobic co-digestion.",
              keywords: ["Urbanization", "Anaerobic Digestion", "Solid Waste", "Biomass Energy", "Renewable Energy", "VOS Viewer"]
            },
            {
              id: "G2-P7",
              title: "A Sustainable Solar Energy Source to Meet Energy Demand in Rural Areas",
              authors: ["Pratibha Sandhu", "Sathans Suhag"],
              contact: ["Pratibhasandhu@nitkkr.ac.in"],
              abstract: "The use of renewable energy (RE) as a future resource of energy is attracting significant attention worldwide. Solar energy is one of the abundantly available and environmentally friendly RE sources worldwide. The study highlights applications of solar energy and rank of different states of India in terms of solar energy potential. It is expected that solar energy will contribute significantly to attainment of energy solutions for sustainable development. India’s vast solar energy potential offers a clean and viable option of replacing the polluting, rapidly running out, and harmful conventional energy sources for producing power. This paper presents the solar energy overview in India, present status of solar energy and its importance, and different startups of solar energy in India. The study also highlights the sustainability of solar energy including economic and environmental development.",
              keywords: ["Solar Energy", "Renewable Energy", "Sustainability", "Energy Demand", "India"]
            },
            {
              id: "G2-P8",
              title: "Sustainable Strategies for University Incubation Centres",
              authors: ["Dr. Rajendra Gohil"],
              contact: ["gohil@cug.ac.in"],
              abstract: "Sustainable incubation centres are a critical factor in nurturing new ventures in universities. The strategies for making incubation centres sustainable include creating supportive ecosystems, attracting investment, and providing ongoing mentorship. This paper discusses various sustainable strategies for university incubation centres and how they can be implemented to support academic startups effectively.",
              keywords: ["University Incubation", "Sustainability", "Startups", "Supportive Ecosystem", "Mentorship"]
            },
            {
              id: "G2-P9",
              title: "Enhancing Academic Startups Through Government Policies and Support Mechanisms",
              authors: ["Dr. Meera Rajan", "Dr. Neel Kumar"],
              contact: ["meera.rajan@education.in", "neel.kumar@university.edu"],
              abstract: "Government policies play a significant role in supporting and enhancing academic startups. This paper examines various government initiatives aimed at promoting academic-driven ventures and provides recommendations for improving the effectiveness of these policies. The study also explores the impact of these policies on the success rate of academic startups.",
              keywords: ["Government Policies", "Academic Startups", "Support Mechanisms", "Policy Impact"]
            },
            {
              id: "G2-P10",
              title: "Innovation in Academic Startups: Case Studies and Future Directions",
              authors: ["Dr. Amit Verma", "Dr. Kavita Singh"],
              contact: ["amit.verma@research.org", "kavita.singh@edu.com"],
              abstract: "Innovation is a key driver of success in academic startups. This paper presents case studies of successful academic startups and analyzes the innovative strategies that contributed to their success. It also outlines future directions for fostering innovation in academic-driven ventures.",
              keywords: ["Innovation", "Case Studies", "Academic Startups", "Future Directions"]
            },
            {
              id: "G2-P18",
              title: "Preserving heritage, imparting values: Kurukshetra University's best practice in holistic education.",
              authors: ["Kurukshetra University"],
              contact: [],
              abstract: "This historic event depicts the valour and sacrifice of our freedom fighters. The University has established a multi-disciplinary Centre of Excellence for Research on Saraswati River (CERSR). Efforts made by the University in preserving and showcasing the cultural heritage of Haryana in the ‘Dharohar’ museum have received an overwhelming response, with more than 26.5 lakh visitors. Delegates from 110 different countries have visited and admired the museum; research scholars have been regularly consulting various items/resources available in the museum. The recently established museum on ‘First War of Independence 1857’ has earned appreciation from visitors and has been spreading the waves of patriotism. The ‘Ratnawali Festival’, a state-level mega cultural fest held on the occasion of Haryana statehood day, has grown into a ‘Mahakumbh of Haryana Sanskriti,’ which has not only entrenched youth into Haryanvi culture but also attracted numerous elders from adjoining towns/villages. The practice of preservation of Indian Heritage and Indic values-based holistic education meets one of the objectives of NEP-2020.",
              keywords: ["Holistic Education", "Cultural Heritage Preservation", "Dharohar Museum"]
            },
            {
              id: "G2-P19",
              title: "Indian Ecosystem: Government Initiatives & Schemes for Start Ups",
              authors: ["Dr. Namita Kochhar", "Dr. Sameer Varma"],
              contact: ["namita.kalra@gnauniversity.edu.in", "sameer.varma@gnauniversity.edu.in"],
              abstract: "India is a developing country with a high demand for jobs. Many programs and policies are introduced daily by the government to create a business-friendly atmosphere. A startup ecosystem, comprising individuals, startups at various stages, and organizations working together, aims to build and grow new startup businesses. The goal is to foster a robust ecosystem that supports startup expansion, job creation, and economic growth. India, with its growing number of startups and high concentration of accelerators and incubators, is committed to developing a thriving startup environment. This study focuses on the rise and potential of startup ecosystems in India, examining government participation and various initiatives such as the Pradhan Mantri Mudra Yojana, Bank Credit Facilitation Scheme, and Start-up India initiative. The study also investigates awareness and benefits of these schemes among startups in Ludhiana, known as the Manchester of Punjab.",
              keywords: ["Start-up Ecosystem", "Government Initiatives", "Start-up Financing"]
            },
            {
              id: "G2-P20",
              title: "Effect of Data Encoding on Expressive Power with Quantum Neural Network Models",
              authors: ["Deepak", "Kranti Kumar", "Sunil Prajapat", "Pankaj Kumar"],
              contact: ["deepakranga1994@gmail.com", "kranti31lu@gmail.com", "sunilprajapat645@gmail.com", "pkumar240183@gmail.com"],
              abstract: "Supervised learning with quantum computers utilizes parametrized quantum circuits as models that map input data to predictions. This study explores the impact of encoding techniques on the expressive power of these quantum circuits. We show that quantum models can be expressed as partial Fourier series, with accessible frequencies determined by the data encoding gates used. By employing basic encoding gates iteratively, quantum models can access a wider frequency spectrum, making them universal function approximators. This research highlights the ability of quantum models to represent any collection of Fourier coefficients and approximate any function, given a diverse range of frequencies.",
              keywords: ["Supervised Learning", "Quantum Circuits", "Fourier Series", "Function Approximation"]
            },
            {
              id: "G3-P1",
              title: "Virgo Panel Product: A Pioneer in Eco Environment-Friendly Plywood Manufacturing",
              authors: ["Mandeep Tiwari"],
              contact: ["virgohsp@gmail.com"],
              abstract: "Virgo Panel Product, established in 1983, stands as a pioneering force in Punjab, specializing in the manufacturing of Plywood. With 40 years of successful operations, the firm has achieved notable milestones, particularly as the first in the region to implement environmentally friendly manufacturing techniques.",
              keywords: ["Plywood", "Community Contributions", "Digital Transformation", "Transparent Communication", "Innovation in Manufacturing"]
            },
            {
              id: "G3-P2",
              title: "Revolutionizing Book Printing: A Journey of Innovation and Excellence by Choice Books & Printers Pvt. Ltd.",
              authors: ["Ashwani Gupta"],
              contact: ["choicebooks@rediffmail.com"],
              abstract: "Choice Books & Printers Pvt. Ltd., established in 1994, has been a revolutionary force in book production on reel paper. This endeavor not only provided employment to more than 50 families but also resulted in significant cost-cutting in book production processes. The company is a leading printer in Northern India, specializing in a diverse range of materials including educational books, magazines, and more. The innovative approach of using reel-fed paper machines has enhanced efficiency and cost-effectiveness.",
              keywords: ["Book Production", "Web Offset Printing", "Sheet Fed Offset Printing"]
            },
            {
              id: "G3-P3",
              title: "Empowering Lives, Building Values: A Decade of Social Initiatives by Bal Kalyan Sanskar Kendra in Jalandhar",
              authors: ["Sandeep Naran"],
              contact: ["perfectpackers87@gmail.com"],
              abstract: "Bal Kalyan Sanskar Kendra in Jalandhar, Punjab, was established in September 2004 with Sh. Anil Sharma and Sandeep Narang as founding members. The organization aims to educate and instill moral values in children. Starting as a free tuition center, it has evolved into SBT Model School, accommodating around 600 children from economically challenged backgrounds. The organization also runs evening sessions, a dispensary, vocational training centers, and supports families with charitable activities.",
              keywords: ["Social Empowerment", "Education for All", "Women's Skill Development", "Community Health Initiatives"]
            },
            {
              id: "G3-P4",
              title: "O.P. Soaps & Cosmetics: A Star Export House Renowned for its Surpassing Quality",
              authors: ["Dhruv Bhandari"],
              contact: ["dhruv@ophomecare.com"],
              abstract: "O.P. Soaps & Cosmetics, established in 1952, is a firm engaged in manufacturing, exporting, and trading high-quality laundry products. With 72 years of experience, the company has achieved significant milestones domestically and internationally. The firm is known for using eco-friendly raw materials and contributing positively to environmental conservation while maintaining a focus on quality and employee welfare.",
              keywords: ["Eco-friendly Products", "Community Contributions", "Infrastructure", "Transparent Communication", "Innovation in Manufacturing", "Quality Assurance"]
            },
            {
              id: "G3-P5",
              title: "DD Khosla Transport Pvt. Ltd.: A Leading Transport Company",
              authors: ["Puneet Khosla"],
              contact: ["ddkagency7007@gmail.com"],
              abstract: "DD Khosla Transport Private Limited, incorporated on December 10, 2004, is a prominent transport company operating in the transport, storage, and communications sector. The company is involved with major clients such as Concor, IOC, BPCL, and others. DD Khosla Transport is committed to corporate social responsibility, providing health insurance, retirement plans, and contributing to community welfare while motivating employees.",
              keywords: ["Corporate Social Responsibility", "Transport and Logistics"]
            },
            {
              id: "G3-P6",
              title: "Refining India's Skill Ecosystem: A Comprehensive Study on Skill-based Courses and Employment Opportunities",
              authors: ["Pooja Tanwar"],
              contact: ["iaspoojatanwar1409@gmail.com"],
              abstract: "This study examines the skill ecosystem in India, highlighting the gaps between acquired and desired skills. It explores the National Skill Qualification Framework (NSQF) and the success of skill-based courses in aligning with industry needs. The study emphasizes the need for further refinement of courses and training models to improve employability and self-dependence among the youth.",
              keywords: ["Skill Ecosystem", "National Skill Qualification Framework (NSQF)", "Employability", "Skill-based Courses", "Academic Revisions"]
            },
            {
              id: "G3-P7",
              title: "Skill Education as per Need of Time",
              authors: ["Prof. Pratibha Makhija", "Prof. Rakesh Kumar"],
              contact: ["rakeshmakhija98@gmail.com", "pratibhamakhija09@gmail.com"],
              abstract: "The paper discusses the shift from job-seeking to job-creating among youth and the importance of skill development in the context of NEP 2020. It examines the National Skills Qualification Framework (NSQF) and the role of sector skill councils in developing qualification packs. The study underscores the need for skill development to enhance self-employment and adapt to modern technology demands.",
              keywords: ["Skill Development", "Self-Employment", "Modern Technology", "Youth Empowerment"]
            },
            {
              id: "G3-P8",
              title: "Ayurveda: Opportunities, Emerging Trends and Challenges",
              authors: ["Dr. Neeraj Kumar", "Dr. Naresh Kumar"],
              contact: ["indian.verma123@gmail.com"],
              abstract: "This paper discusses the potential for Ayurveda to be integrated with modern technologies and to be accepted as a mainstream global health profession. It highlights the growing international interest in Ayurveda and the need for structural revisions, collaborations, and global marketing strategies to enhance its viability and acceptance.",
              keywords: ["Ayurveda", "Review", "Globalization", "MoU"]
            },
            {
              id: "G3-P9",
              title: "Skill Education as per Need of the Time",
              authors: ["Subhash Mahajan"],
              contact: ["mahajanscfdk@gmail.com"],
              abstract: "The paper explores the shift from job-seeking to job-creating among youth, emphasizing the importance of skill development in light of NEP 2020. It reviews the National Skills Qualification Framework (NSQF) and the need for skill-based education to adapt to modern demands and foster self-employment.",
              keywords: ["New Demands of Society", "Self-Employment", "Sustainability", "Economic Growth"]
            },
            {
              id: "G3-P10",
              title: "Success Stories and Case Studies of Academic-driven Startups M/S Mane Industries, Indapur as Technology Enabled Startup",
              authors: ["Patil Shrinivas Kiran", "Dr. Manojkumar Mane"],
              contact: ["sk.patil0001@gmail.com"],
              abstract: "This case study highlights the innovations and technological advancements achieved by M/S Mane Industries. Developed by Dr. Mane, the startup focuses on biomass pellet technology and sustainable products. The paper showcases the role of incubation centers in mentoring and supporting technological innovations for a better tomorrow.",
              keywords: ["Innovation", "Technology", "Biomass Pellet", "Sustainable Products"]
            },
            {
              id: "G3-P11",
              title: "Development and Properties of Sustainable Biogenic Calcium Silicate Glasses",
              authors: ["Gaurav Sharma", "Nahid Tyagi", "K. Singh"],
              contact: ["gauravsharma@physics.iitd.ac.in", "gks107@gmail.com"],
              abstract: "This study presents the synthesis of biogenic calcium silicate glasses from biomass wastes. The research investigates the optical and dielectric properties of these glasses, their potential applications in semiconductors, energy harvesting, and storage devices. The study also examines the effects of composition on the properties of the glasses.",
              keywords: ["Biomass", "Glasses and Glass-ceramics", "Optical & Dielectric Properties", "Energy Storage Devices"]
            },
            {
              id: "G3-P12",
              title: "Mxene Based Hybrid Nanocomposite for The Removal of Pollutants from Contaminated Water",
              authors: ["Nahid Tyagi", "Gaurav Sharma", "Manoj Kumar Singh", "Manika Khanuja"],
              contact: ["manojksingh@cuh.ac.in"],
              abstract: "This research focuses on a novel 2D/2D heterostructure of MXene and V2O5 for the efficient removal of crystal violet dye from contaminated water. The study explores the photocatalytic performance, degradation mechanisms, and reusability of the synthesized nanocomposite. The findings suggest its potential for wastewater treatment and industrial applications.",
              keywords: ["Novel MXene/V2O5 Heterostructure", "Textile Dyes", "Photocatalysis", "Degradation Pathways", "EPR And Trapping Study"]
            },
            {
              id: "G3-P13",
              title: "A Review of Micro-hydro Systems Operating at Off-grid Locations",
              authors: ["Pratibha Chauhan", "Dr. Dhruv Bhandari"],
              contact: ["pratibha2005@gmail.com"],
              abstract: "This review paper explores micro-hydro systems designed for off-grid locations. It examines various technologies, efficiency, and the potential benefits of micro-hydro power in providing sustainable energy solutions to remote areas. The study highlights case studies and advancements in micro-hydro technology.",
              keywords: ["Micro-hydro Power", "Off-grid Solutions", "Sustainable Energy", "Technological Advancements"]
            },
            {
              id: "G3-P14",
              title: "Challenges and Solutions in Implementing Smart Cities in Developing Countries",
              authors: ["Rajesh Kumar", "Meena Patel"],
              contact: ["rajeshkumar@gmail.com", "meenapatel@gmail.com"],
              abstract: "This paper analyzes the challenges faced in implementing smart city initiatives in developing countries. It reviews technological, economic, and social barriers and proposes solutions to address these challenges. The study provides insights into successful smart city projects and their impact on urban development.",
              keywords: ["Smart Cities", "Developing Countries", "Technological Challenges", "Urban Development"]
            },
            {
              id: "G3-P15",
              title: "Exploring the Role of Artificial Intelligence in Healthcare: A Comprehensive Review",
              authors: ["Kavita Singh", "Arun Verma"],
              contact: ["kavitas@gmail.com"],
              abstract: "This comprehensive review paper discusses the role of artificial intelligence in healthcare, covering applications in diagnostics, treatment planning, patient monitoring, and administrative tasks. The study evaluates current AI technologies, their effectiveness, and potential future developments in transforming healthcare systems.",
              keywords: ["Artificial Intelligence", "Healthcare", "Diagnostics", "Patient Monitoring"]
            },
            {
              id: "G3-P14",
              title: "A Low Wind Power Generation System Modulation and Simulation",
              authors: ["Anil Kumar", "Kamal Kumar", "Naresh"],
              contact: ["anil.kamboj777@gmail.com"],
              abstract: "The goal of this study is to develop a Low Wind Power Generation system, which can generate electricity from the wind in places where the wind speed is quite low. The project incorporates a novel concept of deflecting air through a tunnel with a diminishing area to increase air velocity before striking a light turbine. The system's design includes a light turbine, a diffuser, and a tunnel optimized using ANSYS Fluent. The power generation is based on the outlet wind speed, and the system is designed for household use. MATLAB is used to investigate the system's applicability and feasibility, and a comparison with solar systems demonstrates its viability.",
              keywords: ["ANSYS CFD", "MATLAB", "Manometer", "LWPS"]
            },
            {
              id: "G3-P15",
              title: "Restricting and Motivator Factors That Are Affecting the Purchase Decisions of Consumers Towards Green Skincare Products",
              authors: ["Neha Rani", "Prof. Sunita Bharatwal"],
              contact: ["chhachhiyaneha@gmail.com", "sunita_bharatwal@rediffmail.com"],
              abstract: "This study focuses on the factors influencing consumer behavior towards green skincare products. Conducted in Bhiwani, it analyzes 107 responses using factor analysis in IBM SPSS. The study identifies various factors that positively and negatively affect consumer decisions, highlighting the growing trend of using natural ingredients in skincare products.",
              keywords: ["Green Skincare Products", "Buying Behavior", "Environment Protection", "Healthy Life"]
            },
            {
              id: "G3-P16",
              title: "Integration of AI into the Education System of India: Implications on NEP 2020",
              authors: ["Renuka Shyam Narain"],
              contact: ["sharma.renuka30@gmail.com"],
              abstract: "This paper explores the integration of Artificial Intelligence (AI) into the Indian education system and its alignment with the National Education Policy (NEP) 2020. It examines how AI can enhance personalized learning, adaptive assessment systems, and intelligent educational tools. The study also addresses challenges and ethical considerations associated with AI in education and proposes strategies for effective implementation.",
              keywords: ["Artificial Intelligence", "Skill Education", "Ecosystem"]
            },
            {
              id: "G3-P17",
              title: "Privacy and Security Challenges in Digital Academic Environments",
              authors: ["Diksha", "Dr. Sunita", "Dr. Gurvinder Singh"],
              contact: ["diksha2938@gmail.com", "sunitamahajan2603@gmail.com", "drkahlon29@gmail.com"],
              abstract: "This paper provides an overview of privacy and security challenges in digital academic environments. It discusses issues such as data collection, surveillance practices, and data breaches. The paper emphasizes the need for comprehensive strategies, including technical solutions, policy frameworks, and awareness campaigns, to protect sensitive data and ensure a secure learning environment.",
              keywords: ["Learning Management", "Secure Learning Environment", "Digitalization"]
            },
            {
              id: "G3-P18",
              title: "Government Initiatives and Policies for Promoting Academic Driven Startups",
              authors: ["Dr. Ram Singh", "Yogita Rani"],
              contact: ["yogitaahluwalia1975@gmail.com"],
              abstract: "This paper reviews government initiatives and policies aimed at promoting academic-driven startups. It highlights various programs, including grants and seed funding, research parks, incubators, and technology transfer agencies. The paper discusses the impact of these initiatives on entrepreneurship, innovation, and employment, and emphasizes the role of policies such as Aatmanirbhar Bharat and the New Education Policy 2020.",
              keywords: ["Atmosphere for Entrepreneurship", "Technology Transfer Agencies", "Information and Resources"]
            },
            {
              id: "G3-P19",
              title: "Education to Employability: Feasibility Check of Skill Courses in Indian Region",
              authors: ["Dr. Parul Bhatia", "Pooja Tanwar"],
              contact: ["iaspoojatanwar1409@gmail.com"],
              abstract: "This study examines the feasibility of skill-based courses in India and their alignment with industry needs. It highlights the gaps between acquired and desired skills and discusses potential improvements in course content, syllabi, and training models. The study aims to enhance employability and self-dependence among youth by refining skill education frameworks.",
              keywords: ["Skill Ecosystem", "Skill Refinement", "Infrastructural Requirements", "Pedagogy of Skilled Courses"]
            },
            {
              id: "G3-P20",
              title: "Securing Vehicular Digital Twin: Blockchain Based Authentication System",
              authors: ["Deepika Gautam", "Pankaj Kumar"],
              contact: ["gautamdeepika1999@gmail.com", "pkumar240183@gmail.com"],
              abstract: "This paper introduces a blockchain-based authentication framework for securing vehicular digital twins. The system enhances data integrity and verifiability within and between vehicular digital twins. The study evaluates the framework's performance and security, highlighting its advantages in computation and communication overhead compared to existing technologies.",
              keywords: ["Digital Twin", "VANET", "Blockchain", "Vehicular Digital Twin"]
            }
            
            
          ]
            },
        
        ]
          
      
        };

export default function Home() {
  return (
    <div className='bg-white'>
      <CompanyInfo />
      <NavBar/>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/5">
          {/* Left sidebar or additional content */}
        </div>
        <div className="w-full sm:w-3/5">
          <Proceeding1 data={data} />
        </div>
        <div className="w-full sm:w-1/5">
          {/* Right sidebar or additional content */}
        </div>
      </div>
      <Footer />
    </div>
  );
}