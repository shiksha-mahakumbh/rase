import React from 'react';
import Link from 'next/link';
import './news.css'


const ScrollableListWithLinks: React.FC<{ items: { text: string; path: string }[] }> = ({ items }) => {
  return (
    <div className="newlstcnt  overflow-y-scroll">
      <ul className="divide-y divide-red-700">
        {items.map((item, index) => (
          <li key={index} className="py-2">
            <Link href={item.path}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Lstnews = () => {
  const items = [
    { text: "Visit Shiksha Mahakumbh 2024", path: "/" },
    { text: "Dates of Shiksha Mahakumbh 2024", path: "/" },
    { text: "Launching of Shiksha Kumbh 2024 Campaign", path: "/" }
  ];
  return (
    <div className='newcntt'>
     <h2 className="headd">Latest News...</h2><br></br>
      <ScrollableListWithLinks items={items} />
  </div>
  )
}

export default Lstnews
