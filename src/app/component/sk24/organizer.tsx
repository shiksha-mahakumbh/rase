
"use client"
import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';

const Organiger: React.FC = () => {

  interface Item {
    imageUrl: string;
    text: string;
    link: string;
  }

  const marquees: Item[] = [

  { imageUrl: '/2024K/l1.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l2.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l3.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l4.webp', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l5.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l6.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/2024K/l7.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/l8.jpg', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l9.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l10.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' }, 
  { imageUrl: '/2024K/l11.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l12.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l13.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l14.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l15.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l16.jpg', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l17.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l18.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l19.webp', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l20.png', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l21.jpg', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l22.jpg', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  { imageUrl: '/2024K/l23.jpg', text: "Shiksha Mahakumbh - IIT Ropar, 4-6  October, 2024", link: 'https://www.youtube.com/watch?v=FFfdSd8_XOw' },
  
  ];

  return (
    <div  className='flex flex-col w-full'>
     <h1 className='flex font-semibold p-2 text-primary text-center text-xl justify-center '>Co-organizer</h1>

      <Marquee  pauseOnHover={true}  pauseOnClick={true}>
        {marquees.map((marqueeContent,index) => (
          <Image
          className='w-16 h-16 m-6 '
          key={index}
          src={marqueeContent.imageUrl}
          alt ="logo"
          height={500}
          width={500}
          />
        ))}
      </Marquee>
    </div>
  );
};

export default Organiger;
