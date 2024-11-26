"use client";
import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';

const Conference_Support: React.FC = () => {
  interface Item {
    imageUrl: string;
    link: string;
  }

  const Conference_Support: Item[] = [
    { imageUrl: '/2024M/our partners/1.png', link: '' },
    // { imageUrl: '/2024M/our partners/2.png', link: '' },
    { imageUrl: '/2024M/our partners/3.png', link: '' },
    { imageUrl: '/2024M/our partners/4.png', link: '' },
    { imageUrl: '/2024M/our partners/5.png', link: '' },
    { imageUrl: '/2024M/our partners/6.png', link: '' },
    { imageUrl: '/2024M/our partners/7.png', link: '' },
    { imageUrl: '/2024M/our partners/8.jpg', link: '' },
    { imageUrl: '/2024M/our partners/9.png', link: '' },
    { imageUrl: '/2024M/our partners/10.png', link: '' },
    { imageUrl: '/2024M/our partners/11.png', link: '' },
    { imageUrl: '/2024M/our partners/12.jpg', link: '' },
    { imageUrl: '/2024M/our partners/13.png', link: '' },
    { imageUrl: '/2024M/our partners/14.png', link: '' },
    { imageUrl: '/2024M/our partners/15.jpg', link: '' },
    { imageUrl: '/2024M/our partners/16.png', link: '' },
    { imageUrl: '/2024M/our partners/17.jpg', link: '' },
    { imageUrl: '/2024M/our partners/18.png', link: '' },
    { imageUrl: '/2024M/our partners/19.png', link: '' },
    { imageUrl: '/2024M/our partners/20.png', link: '' },
    { imageUrl: '/2024M/our partners/21.png', link: '' },
    { imageUrl: '/2024M/our partners/22.png', link: '' },
    { imageUrl: '/2024M/our partners/23.png', link: '' },
    // Add more media partners as needed
  ];

  return (
    <div className='flex flex-col w-full'>
      <h1 className='flex font-semibold p-2 text-primary text-center text-xl justify-center'>
         Academic Partners
      </h1>

      <Marquee pauseOnHover={true} pauseOnClick={true}>
        {Conference_Support.map((partner, index) => (
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

export default Conference_Support;
