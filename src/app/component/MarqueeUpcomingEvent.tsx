import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import OptimizedImage from "@/components/media/OptimizedImage";

interface Item {
    imageUrl: string;
    text: string;
    link: string;
}

const items: Item[] = [
    { imageUrl: '/new.gif', text: 'शिक्षा महाकुंभ 6.0 — Register Now', link: '/registration' },
    { imageUrl: '/new.gif', text: 'Abhiyan Edition Timeline', link: '/abhiyan' },
    { imageUrl: '/new.gif', text: 'Past Editions Archive', link: '/past-events' },
];

const MarqueeUpcomingEvent: React.FC = () => {
    return (
        <div className=" w-full">
            <Marquee direction="up" pauseOnHover={true} pauseOnClick={true}>
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div key={index} className="object-cover p-2 w-full">
                            <OptimizedImage
                              src={item.imageUrl}
                              alt=""
                              width={48}
                              height={48}
                              className="me-1 mt-1 object-cover"
                              enableBlur={false}
                            />
                            <Link href={item.link}>
                                <p className="text-orange-600">{item.text}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};

export default MarqueeUpcomingEvent;
