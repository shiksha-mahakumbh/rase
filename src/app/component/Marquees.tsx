import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

interface Item {
  imageUrl: string;
  text: string;
  link: string;
}

const items: Item[] = [
  
  {
    imageUrl: "/new.gif",
    text: "द्वितीय शिक्षा महाकुंभ, 16 तथा 17 दिसंबर 2024 ,व्यक्ति के निर्माण में शिक्षा का महत्वपूर्ण योगदान : प्रो. राकेश सिन्हा",
    link: "https://www.rase.co.in/Press5",
  },
 
  
  {
  imageUrl: "/new.gif",
  text: "शिक्षा महाकुंभ 2.0 was successfully concluded at Kurukshetra University from December 16-17, 2024. To download photographs click here",
  link: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
  },


  


 

  {
    imageUrl: "/new.gif",
    text: "Baton Ceremony: A Grand Start to Shiksha Mahakumbh 2.0! Witness the Baton Ceremony's success, Click Here.",
    link: "https://www.rase.co.in/Press1",
  },
  {
    imageUrl: "/new.gif",
    text: "शिक्षा महाकुंभ-2024 (द्वितीय संस्करण),आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम, Click Here.",
    link: "https://www.rase.co.in/Press3",
  },
];

const Marquees: React.FC = () => {
  return (
    <div className="bg-[#f5f0e7] flex">
      <div className="bg-[#232323] p-2 text-base font-bold text-white">
        Annoucement
      </div>
      <Marquee pauseOnHover={true} pauseOnClick={true}>
        <div className="flex flex-wrap pt-2 ">
          {items.map((item, index) => (
            <div key={index} className="flex items-center mb-4 ms-4">
              <img
                src={item.imageUrl}
                alt="Item Image"
                className=" mt-1 me-1 object-cover"
              />
              <Link href={item.link}>
                <p className="mr-2 font-semibold text-base  text-primary ">
                  {item.text}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Marquees;
