"use client";
import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';

const MediaPartners: React.FC = () => {
  interface Item {
    imageUrl: string;
    link: string;
  }

  const mediaPartners: Item[] = [
    { imageUrl: '/2024K/BW.jpg', link: 'https://businessworld.in/' },
    { imageUrl: '/2024K/dainik.jpg', link: 'https://epaper.dainiksaveratimes.in/' },
    { imageUrl: '/2024K/utam.png', link: 'https://www.uttamhindu.com/' }
    // { imageUrl: '/media/partner2.png', link: 'https://example.com' },
    // { imageUrl: '/media/partner3.png', link: 'https://example.com' },
    // { imageUrl: '/media/partner4.png', link: 'https://example.com' },
    // { imageUrl: '/media/partner5.png', link: 'https://example.com' },
    // // Add more media partners as needed
  ];

  return (
    <div className='flex flex-col w-full'>
      <h1 className='flex font-semibold p-2 text-primary text-center text-xl justify-center'>
        Media Partners
      </h1>

      <Marquee pauseOnHover={true} pauseOnClick={true}>
        {mediaPartners.map((partner, index) => (
          <a key={index} href={partner.link} target="_blank" rel="noopener noreferrer">
            <Image
              className='w-24 h-24 m-6'
              src={partner.imageUrl}
              alt={`Media Partner ${index + 1}`}
              height={500}
              width={500}
            />
          </a>
        ))}
      </Marquee>
    </div>
  );
};

export default MediaPartners;
