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
    text: "Shiksha Kumbh 2024 Successfully Completed on June 30, 2024 @ NIT Srinagar, To Watch the Event Click Here.",
    link: "https://www.youtube.com/watch?v=73I3Knmqun4&ab_channel=ShikshaMahakumbh",
  },
  {
    imageUrl: "/new.gif",
    text: "2nd Edition of Shiksha Mahakumbh is postponed due to unavoidable circumstances. All registrations and papers submitted will be valid in the rescheduled programme. Further the process of registrations and invitations will continue as earlier. Inconvenience caused due to postponement of the programme is deeply regretted. Stay tuned with us at our website and social media handles for more updates.",
    link: "https://www.youtube.com/watch?v=73I3Knmqun4&ab_channel=ShikshaMahakumbh",
  },

  {
    imageUrl: "/new.gif",
    text: "To view the photos of RASE conferences 2024 Day-1, Click Here.",
    link: "https://drive.google.com/drive/folders/1PpyJY91vF-ldoS9d2sdPWcBVvscXRq_0",
  },
  {
    imageUrl: "/new.gif",
    text: "To view the photos of RASE conferences 2024 Day-2, Click Here.",
    link: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
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
