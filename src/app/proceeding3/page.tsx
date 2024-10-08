'use client';
import React from 'react';
import CompanyInfo from '../component/CompanyInfo';
import Footer from '../component/Footer';
import NavBar from '../component/NavBar';
import Proceeding3 from '../component/Proceeding3';

// Sample data for demonstration. Replace this with your actual data source or fetch method.
const data = {
        chapter: "5",
          title: "Papers and Projects",
          pageStart: 60,
          sections: [
            {
              title: "Integration of Bhartiya Traditional and Modern Education System for sustainability",
              content: [
                "Chapter 5 of our National Conference on Integration of Bhartiya Traditional and Modern Education System for sustainability is dedicated to the scholarly exploration and insightful revelations encapsulated in the numerous paper submissions. This crucial segment serves as a platform for intellectual exchange, fostering an environment where ideas converge to shape the contours of academic-driven entrepreneurship.",
                "A total of 65 papers have been presented, representing a rich tapestry of perspectives and research endeavors. These submissions, spanning both online and offline modes, exemplify the diverse dimensions of academic contributions to the entrepreneurial landscape.",
                "Categorizing these papers into three distinct themes – Skill & Startup, Entrepreneurship, and Best Practices & Innovations – provides a comprehensive lens to examine the multifaceted impact of academic-driven startups on our economy.",
                "The papers offer a deep dive into the core areas, unraveling the symbiotic relationship between academia and entrepreneurship. Each category, with its unique focus, contributes to the overarching narrative of innovation, skill development, and the transformative role of startups in the economic paradigm.",
                "As we traverse through the chapters of these intellectual contributions, we embark on a journey of discovery, exploring the nexus between academia and the vibrant entrepreneurial spirit that propels our nation towards progress and prosperity."
              ]
            },
            {
              title: "Integrat",
              pageStart: 66,
              sessionChairs: [
                "Dr. Ankit Kumar, Scientist (Veterinary Medicine), Lala Lajpat Rai University of Veterinary and Animal Sciences, Hisar, Haryana",
                "Dr. Ashwani, Assistant Professor, Dept. of Humanities and Social Sciences",
                "Dr. Muralidhar Killi, Assistant Professor, Dept. of Electrical Engg."
              ],
        papers: [
          {
            id: "287",
            title: "Bhartiya Gurukul Education System for Holistic Development of Student",
            authors: [
              "Harpreet Kaur, Govt. Sr. Sec. Smart School PAU, Ludhiana",
              "Dr. Dimpal Rani, Govt. Sr. Sec. Smart School PAU, Ludhiana"
            ],
            contact: "hds.brar83@gmail.com, goyaladv2006@gmail.com",
            abstract: "India has always boasted of a rich tradition in the area of teaching-learning and education system since ancient times. Even people from other nations such as Europe, The Middle East and Portugal came to India to get quality education. The main focus of Gurukul System of Education of ancient India was to impart learning in natural surrounding where the shishyas (student) and guru (teacher) lived with each other with brotherhood, humanity, love and discipline. The Guru (teacher) imparted the knowledge of everything such as religion, Sanskrit, scriptures, medicines, philosophy, literature, warfare, statecraft, astrology, history, politics, mathematics, leadership and many more. The learning was not only to read books but correlating it with the nature and life. It was not memorizing the facts and figures and writing the answers in the examination but it was based on Vedas, rules of sacrifice, grammar, derivation, understanding the secrets of nature, logical reasoning, science and skills necessary for an occupation. Now-a-days there is a total absence of personality development, creation of moral conscience and ethical training. One of the biggest flaws about this education is that it is more commercial in nature rather than institutional concept that should impart holistic learning to the students. It devotes very less time for physical, mental, emotional and ethical aspect which encases a student in a better human being. The recent new education policy is also focus more on experiential learning, skill development, creative, logical reasoning, to nurture each child’s potential, flexible learning , innovative ability and to empower the children. All these goals are going to be achieved with incorporating Gurukul education system.",
            keywords: [
              "Gurukul system",
              "ancient India",
              "teaching-learning",
              "shishyas",
              "guru",
              "occupation"
            ]
          },
          {
            id: "853",
            title: "Relevance of Traditional Education System in Modern Era",
            authors: [
              "Sangeeta, Teacher, St.Vivekanand Millennium School, HMT Township, Pinjore."
            ],
            contact: "sangeetasvms@gmail.com",
            abstract: "The purpose of writing this article is to make everyone aware about the importance of traditional education system with the amalgamation of modernity. If we see the great people of that time, they were more learned. He studied not only Indian religion but also mathematics and science. He studied in Gurukulas and Ashrams, where he was trained to become a good human being who possessed many skills. In modern times students are studying with new technologies, electronic gadgets and prescribed syllabus etc. Even though digital mediums of learning have many advantages, traditional education is still the key to success. An attempt has been made to write this article on the basis of practical study and own experience. How interesting it must have been to get education in the traditional Gurukul tradition and in the company of a Guru. Religious texts, books, articles shown from time to time give us incredible information about this subject. Learned something from there, learned something from my parents and converted it into an article. In the traditional education system, students learned through direct instruction and lectures, seatwork, listening, and observation. Work based on textbooks, lectures, and individual written assignments. The modern education system emphasizes progressive learning and project-based learning using any available resources, including student-led exploration, group activities, the Internet, the library, and external experts. The limitation of this education system is that amidst the new dimensions of the modern system, traditional education has been left behind. In today's time, there is a dearth of people who promote it. In this, instead of one and one two, one has to work with the thinking of one and one eleven. This article is completely written by me. I have tried to put my feelings on this paper. I believe that in times to come, along with modern education, traditional values should also be taught to children in every educational institution. With this, not only will they be able to work on a good position, but will also empower the nation by becoming excellent citizens.",
            keywords: [
              "Traditional Education",
              "Progressivism",
              "Project-Based Learning",
              "Direct Instruction",
              "Observation",
              "Learning Methods",
              "Student-Led Exploration"
            ]
          },
          {
            id: "2895",
            title: "Bhartiya Gurukul Education System for Holistic Development of a Student",
            authors: [
              "Prabuddha Tripathi, NIT Jalandhar"
            ],
            contact: "prabuddhat.cm.22@nitj.ac.in",
            abstract: "The Gurukul system of education is a traditional Indian system of education that has a long and rich history. It is a residential system of education where students live with their teachers, called gurus, and learn from them in a variety of subjects, including the Vedas, the Upanishads, and the Hindu epics. The Gurukul system is based on the principles of discipline, respect, and service to the guru and the community. The Gurukul system has a number of benefits for students, including holistic education, strong moral character, lifelong learning, and community service. However, it also faces a number of challenges, such as cost, access, and lack of government support. Despite these challenges, the Gurukul system of education is still relevant in today's world. It can provide students with a holistic education that prepares them for the challenges of life. It can also help to instill in them strong moral character and a commitment to community service.",
            keywords: [
              "Gurukul system",
              "holistic development",
              "student development",
              "residential system",
              "lifelong learning",
              "community service"
            ]
          },
          {
            id: "2718",
            title: "Bhartiya Gurukul Education System is a Traditional Indian System of Education",
            authors: [
              "Subash Mahajan, Sarvhitkari Educational Society",
              "Prof. Navdeep Shekhar, Sarvhitkari Educational Society"
            ],
            contact: "mahajanscfdk@gmail.com, navdeep.shekhar56@gmail.com",
            abstract: "The Bhartiya Gurukul education system is a traditional Indian system of education that focuses on holistic development and the overall growth of a student. It is rooted in ancient Indian traditions and emphasizes not just academic knowledge but also physical, emotional, and spiritual development. Some key aspects of the Bhartiya Gurukul education system are described in subsequent sections. Gurukul Structure: The system is based on the Gurukul structure, where students live and learn together in a residential setup. They stay with their teachers, known as gurus, who not only impart academic knowledge but also serve as mentors and guides in various aspects of life. Holistic Curriculum: The curriculum in a Bhartiya Gurukul focuses on a wide range of subjects, including academic disciplines, arts, sports, yoga, meditation, and character building. The goal is to provide a well-rounded education that nurtures every aspect of a student's personality. Teacher-Student Relationship: The relationship between teachers and students is highly revered in the Bhartiya Gurukul system. The gurus are respected figures who inspire, guide, and support the students. They establish a close bond with the students and provide personalized attention to their individual needs and talents. Experiential Learning: Bhartiya Gurukuls emphasize experiential learning rather than rote memorization. Students engage in hands-on activities, discussions, and practical experiences to deepen their understanding of concepts and develop critical thinking skills. Value-Based Education: The Bhartiya Gurukul system places great emphasis on imparting moral values, ethics, and virtues to students. They are taught to uphold principles such as honesty, compassion, respect, and integrity, which are integrated into their daily lives. Physical and Mental Well-being: Physical fitness and mental well-being are given equal importance in the Bhartiya Gurukul system. Students participate in regular physical activities, yoga, and meditation to maintain a healthy lifestyle and develop self-discipline. Community and Social Responsibility: Students in Bhartiya Gurukuls are encouraged to develop a sense of community and social responsibility. They learn the importance of serving others, being environmentally conscious, and contributing positively to society. Individualized Learning: The Bhartiya Gurukul system recognizes that each student has unique strengths and weaknesses. Teachers tailor their teaching methods to suit the learning style and pace of each student, fostering individual growth and self-confidence. Character Development: Character development is a key aspect of the Bhartiya Gurukul system. Students are encouraged to cultivate virtues like humility, perseverance, self-discipline, and empathy, which play a vital role in shaping their overall personality. Lifelong Learning: The Bhartiya Gurukul education system instills a love for learning and a thirst for knowledge in students. It aims to create lifelong learners who are curious, adaptable, and open-minded, equipped to face the challenges of the modern world.",
            keywords: [
              "Bhartiya Gurukul",
              "traditional Indian system",
              "holistic development",
              "experiential learning",
              "value-based education",
              "community service",
              "lifelong learning"
            ]
          },
          {
            id: "6179",
            title: "आधुनिक युग में पारंपरिक शिक्षा की प्रासंगिकता",
            authors: [
                "Dr. Jyoti Verma"
            ],
            contact: "drjyotikhanna13@gmail.com",
            abstract: "\"विद्या नाम नरस्य रूपमधिकं प्रच्छन्नगुप्तं धनम्। विद्या भोगकरी यश:सुखकरी विद्या गुरुणां गुरु:। विधा बन्धुजनो विदेश गमने विद्या परा देवता विद्या राजसु पूज्यते,न तु धनम् विधाविहीन: पशु!!\" नीतिशतकम् (सुभाषित) भर्तृहरि( विद्या की महिमा में) शिक्षा शब्द संस्कृत भाषा की शिक्ष् धातु में 'अ' प्रत्यय लगाने से बना है। जिसका अर्थ है सीखना और सिखाना। शिक्षा का अर्थ हुआ सीखने सिखाने की क्रिया। शिक्षा किसी समाज में सदैव चलने वाली सोद्देश्य सामाजिक क्रिया है। जिसके द्वारा मनुष्य की जन्मजात शक्तियों का विकास ज्ञान कला कौशल बुद्धि व्यवहार में उचित परिवर्तन करके अनुकूल सभ्य व सुसंस्कृत व्यक्तित्व निर्माण किया जा सकता है इसी में व्यक्ति तथा समाज दोनों निरंतर विकास कर सकते हैं। औपचारिक व अनौपचारिक दोनों माध्यमों से वैयक्तिक उत्थान संभव है। हमारे शास्त्र कहते हैं- \"माता शत्रुः पिता वैरी येन बालो‌ न पाठितः। न शोभते सभामध्ये हंसमध्ये बकोयथा!!\" भावार्थ- जो माता-पिता अपने बच्चों को शिक्षित नहीं करते / पढ़ाते नहीं वे बच्चों के शत्रु हैं। शिक्षा प्राप्ति किसी भी बच्चे का अधिकार तो है ही माता-पिता का एक कर्तव्य भी है। प्राचीन शिक्षा पद्धति (गुरुकुल पद्धति) अत्यधिक प्रभावशाली रही है। औपचारिक शिक्षा मंदिर ,आश्रम, गुरुकुलों, के माध्यम से दी जाने वाली शिक्षा पद्धति में विद्यार्थी जीवन तप माना जाता था। माता-पिता से दूर लोभ- प्रलोभ से हटकर ना केवल पुस्तकीय ज्ञान बल्कि कौशल ज्ञान, प्राथमिक ज्ञान, मौलिकता, नैतिकता, उच्च शिक्षा, शास्त्र ज्ञान व शस्त्र ज्ञान सभी प्रकार की विधाऍं दी जाती थीं।आचार्यगण का हृदय तल से अभिनंदन व आदर होता था। वर्तमान समय में यदि गुरुकुल शिक्षा का प्रचार प्रसार माध्यम पुनः दोहराया जाए तो सर्वथा उचित होगा। समानता की भावना, अनुशासन का प्रचार प्रसार होता था। ऋग्वैदिक युगीन पद्धति शत प्रतिशत विद्यार्थी जीवन का चहुँमुखी विकास करने में सक्षम है। जहां लगभग 24 वर्षों तक विद्यार्थी आश्रम में निवास करते है। प्राचीन शिक्षा पद्धति बालक के मानसिक विकास पर बल देने के साथ-साथ ज्ञानार्जन अध्यात्मिक विकास व ज्ञान पर बल देती थी। चरित्र निर्माण शिक्षा प्रमुख मानी जाती थी। जीवन के नैतिक ,भौतिक ,अध्यात्मिक ,बौद्धिक ,पहलुओं को उजागर करती थी मानव और प्रकृति के मध्य का संबंध खगोलीय ज्ञान, रासायन विज्ञान, भौतिक सबकुछ आचार्यगण द्वारा न केवल पढ़ाकर बल्कि प्रायोगिक विधि से होता था। साधनों में वेद, ब्राह्मण, उपनिषद धर्मसूत्र आदि स्रोत हुआ करते थे। चरक ,सुश्रुत ,पाणिनी,आर्यभट्ट,कात्यायन ,पतंजलि जैसे आचार्य हुआ करते थे। जो तर्क, व्याकरण, गणित के सूत्र बताते थे माध्यम संस्कृत भाषा होता था। तक्षशिला विश्वविद्यालय मुख्य केंद्र रहा। हिंदू व बौद्ध दोनों का प्रमुख केंद्र बच्चे, सभ्यता, संस्कृति, राष्ट्रीय प्रगति, वैयक्तिक शिक्षा ज्ञान अर्जित करते थे। आजकल समय की पुकार यही है कि विद्यार्थी को पारंपरिक शिक्षा अनुसार ही पढ़ाया जाए। वेद मंत्र सिखाए जाएंँ जिससे उनका वातावरण, स्वास्थ्य तक भी शुद्ध हो जाए। प्राचीन शिक्षा पद्धति तथा गुरुकुल पद्धति को स्कूलों से जोड़ देना चाहिए। मैं पूर्णतया पक्ष में हूंँ। मेरा निजी विचार है कि विनम्रता, सच्चाई ,आत्मनिर्भरता कौशल नैतिकता, सांस्कृतिकता, सभ्यता, वेदोच्चारण, प्राकृतिक ज्ञान, यौगिक विधियाँ, सभी स्कूलों से जुड़ जानी चाहिएँ। शिक्षा उज्ज्वल भविष्य के लिए अत्यावश्यक है वर्तमान समय में चल रहे शिक्षा के महाकुंभ में जिन उद्देश्यों को समक्ष रखा गया है जिसमें समूचा देश प्रतिभागी बन सकता है अत्यधिक चिंतन और मंथन कर शिक्षा पद्धति को पांच मुख्य बिंदुओं में समाहित किया गया स्कूली शिक्षा पद्धति को राष्ट्रीय सम्मान मिले। शिक्षा का महाकुंभ प्रत्येक वर्ष मनाया जाए जिसमें समूचा आर्यव्रत शामिल हो, गुरुकुल पद्धति का प्रचार एवं प्रसार हो। स्कूली पाठ्यक्रम कौशल युक्त हो, प्राथमिक शिक्षा तथा उच्च शिक्षा सहित एकीकृत होकर विशिष्ट शिक्षा व प्राथमिक शिक्षा दोनों पर समान रूप से बल दिया जाए। तिथि 9 जून 2023 से 11 जून 2023 तक चलने वाले शिक्षा महाकुंभ का धरातल बिंदु N.E.P 20-20 की नई शिक्षा पद्धति व पाठ्यक्रम है। जिसे सर्वहित कारी शिक्षा समिति व्यापक स्तर पर करने जा रही है। शिक्षा की प्राचीन पद्धति गुरुकुल पद्धति सर्वांगीण विकास हेतु अग्रसर करने में पूर्णतया सक्षम है। आधुनिक युग में पारंपरिक शिक्षा विधि पद्धति अत्यधिक प्रभावशाली व पूर्णतया प्रासंगिकतानुकूल सिद्ध हो सकती है। शिक्षा के इस महाकुंभ हेतु सभी विद्वजनों को प्रसन्नता अनुभव कर रही हूंँ कि इतने प्रभावशाली विषय पर मुझे अपने विचार लिखने का सुअवसर मिला। मैं हार्दिक शुभेच्छा से अभिनंदन करती हूँ। जय हिंद। जय भारत।",
            keywords: ["पारंपरिक शिक्षा", 
                "गुरुकुल पद्धति", 
                "शिक्षा का महाकुंभ", 
                "N.E.P 2020"]
        },
        {
            id: "7274",
            title: "Gurukula Education System for Holistic Development",
            authors: [
                "Jyoti Sharma"
            ],
            contact: "jyoti68247@gmail.com",
            abstract: "Education is the most effective tool you have for making a difference in the world. Maintaining proper students' health and setting a best educational system is among top priority of every country because students will be the ones who shape future of a nation. Gurukula is a compound word made up of the two Sanskrit word’s guru means a teacher and Kula means family or home. In Gurukula, Shishya/ student were taught and educated by their guru while residing in the same home/ school as or near to the guru. Also, one of the biggest problems with modern educational system is their commercial institutional concept. Personality development, development of moral conscience and ethical training are completely absent. It devotes a very small amount of time to physical exercise and the growth of other skill sets that can help a student become a better person. The fundamental goal of Gurukula was to teach pupils in a natural setting where the shishyas may live in harmony with one another and develop their intelligence and discipline via brotherhood, humanity, love, yoga, meditation, arts, sports, and singing. All of these, aids in the development of their personalities and boosted their self-assurance, sense of discipline, intellect, and mindfulness—qualities still important in modern times to tackle the challenges of the world. The present article review's objective was to examine data that showed “why Gurukula are the best setting for encouragement of children's well-being?”",
            keywords: ["Gurukula", 
                "holistic development", 
                "education system", 
                "students' well-being"]
        },
        {
            id: "8577",
            title: "Bhartiya Gurukul System as a Pedagogical Model in the Context of NEP 2020",
            authors: [
                "Lavanya Magatapalli",
                "Raghu Ananthula"
            ],
            contact: "lavanya@lingayasvidyapeeth.edu.in, raghu.education@gmail.com",
            abstract: "Purpose - This research paper explores the Bhartiya Gurukul system as a pedagogical model within the context of the National Education Policy (NEP) 2020 in India. The NEP 2020 emphasizes the need for holistic and multidisciplinary education, aligning with the principles and objectives of the Gurukul system. This study aims to analyze the relevance, challenges, and potential implementation strategies of integrating the Gurukul pedagogical model into the modern education system as outlined in the NEP. Design/methodology/approach – Through a comprehensive literature review and analysis of policy documents, this research paper examines the core principles of the Bhartiya Gurukul system and its alignment with the goals and objectives of the NEP 2020. It explores the emphasis on holistic development, the integration of values education, the promotion of experiential learning, and the personalized student-teacher relationships as key elements of the Gurukul model. Findings – The paper discusses the potential challenges and barriers to implementing the Gurukul pedagogical model within the current education system. These challenges may include teacher training and capacity-building, curriculum design, infrastructural requirements, and the need for a supportive policy framework. However, it also highlights the potential benefits of incorporating aspects of the Gurukul system, such as fostering character development, promoting critical thinking, and nurturing creativity and innovation among students. Practical implications – The findings of this study have practical implications for educators, policymakers, and educational institutions seeking to implement the NEP 2020. It provides insights into how the Gurukul model can be effectively adapted and integrated into the modern education system, particularly in the context of NEP 2020. It highlights the need for a balanced approach that combines traditional and modern educational practices to create a well-rounded learning environment for students. Originality/value – This research paper contributes to the growing body of knowledge on the NEP 2020 and the exploration of alternative pedagogical models in the Indian education system. It offers valuable insights for policymakers, educators, and researchers interested in the potential of the Gurukul system to enhance the quality and effectiveness of education in India.",
            keywords: [
                "NEP 2020", 
                "Bhartiya Gurukul", 
                "pedagogical model", 
                "holistic education"]
        }
        
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
          <Proceeding3 data={data} />
        </div>
        <div className="w-full sm:w-1/5">
          {/* Right sidebar or additional content */}
        </div>
      </div>
      <Footer />
    </div>
  );
}