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
    text: "कुरुक्षेत्र हरियाणा में आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024। आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन किया जाएगा",
    link: "https://www.rase.co.in/Press2",
  },
  {
    imageUrl: "/new.gif",
    text: "The date of शिक्षा महाकुंभ 2.0 is finalised and now it’s going to happen on December 16-17, 2024. Register to participate at shikshamahakumbh.com & rase.co.in",
    link: "https://www.youtube.com/watch?v=73I3Knmqun4&ab_channel=ShikshaMahakumbh",
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
