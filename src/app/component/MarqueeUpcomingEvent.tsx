import React from "react";
import Marquee from "react-fast-marquee";
import Link from 'next/link';

interface Item {
    imageUrl: string;
    text: string;
    link: string;
}

const items: Item[] = [
    { imageUrl: '/new.gif', text: 'Shiksha Kumbh 2023 Live Streaming', link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
    { imageUrl: '/new.gif', text: 'Visit Shiksha Kumbh 2024', link: 'https://sk24.rase.co.in/' },
    { imageUrl: '/new.gif', text: 'Dates of Shiksha Kumbh 2024', link: 'https://sk24.rase.co.in/impDate' },
   
];

const MarqueeUpcomingEvent: React.FC = () => {
    return (
        <div className=" w-full">
            <Marquee direction="up" pauseOnHover={true} pauseOnClick={true}>
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div key={index} className="object-cover p-2 w-full">
                            <img src={item.imageUrl} alt="Item Image" className="mt-1 me-1 object-cover" />
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
