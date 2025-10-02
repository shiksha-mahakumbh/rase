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
    text: "शिक्षा महाकुंभ अभियान – 5th Edition is going to be held at NIPER Mohali from 31st October to 2nd November 2025.",
    link: "https://www.rase.co.in",
  },
 
  
  {
  imageUrl: "/new.gif",
  text: "शिक्षा महाकुंभ 4.0 was successfully concluded at Kurukshetra University from December 16-17, 2024. To download photographs click here",
  link: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
  },


  


 

  {
    imageUrl: "/new.gif",
    text: "Join the revolution through education at NIPER Mohali, Click Here.",
    link: "https://www.rase.co.in/registration/Single_Registration",
  },
  {
    imageUrl: "/new.gif",
    text: "शिक्षा महाकुंभ अभियान के कार्यालय का NIPER SAS Nagar के परिसर मे उद्घाटन संपन्न।, Click Here.",
    link: "<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fshikshamahakumbh%2Fposts%2Fpfbid02ppA5ShzyHvASa2sEfbBihxkV8b9DGoqz7QhWHDqTLbFra9GmLxa7pxv5mEd6UQQYl&show_text=true&width=500" width="500" height="767" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>",
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
