import React from 'react';
import Link from 'next/link';
import './news.css'


const ScrollableListWithLinks: React.FC<{ items: { text: string; path: string }[] }> = ({ items }) => {
  return (
    <div className="newlstcnt overflow-y-scroll">
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




const Upevent = () => {
  const items = [
    { text: "Register for शिक्षा महाकुंभ 6.0", path: "/registration" },
    { text: "Abhiyan Edition Timeline", path: "/abhiyan" },
    { text: "Past Editions Archive", path: "/past-events" }
  ];
  return (
    <div className='newcntt'>
     <h2 className="headd">Upcoming Events...</h2><br></br>
      <ScrollableListWithLinks items={items} />
  </div>
  )
}

export default Upevent
