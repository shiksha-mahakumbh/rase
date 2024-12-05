"use client"; // Ensure this component is rendered on the client side

import React, { useState } from "react";
import { Card, Button, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons"; // Import Ant Design icons
import { motion } from "framer-motion"; // Import Framer Motion
import "antd/dist/reset.css"; // Import Ant Design styles

const { Meta } = Card;

// Define a type for media items
interface MediaItem {
  name: string;
  url: string;
  description: string;
}
interface MediaItem1 {
  name: string;
  url: string;
  description: string;
}

const media: MediaItem[] = [
  {
    name: "कुरुक्षेत्र में 16-17 आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024",
    url: "https://www.facebook.com/share/v/2t8ZUL8ADqb6vFM7/",
    description: "खबरनामा हरियाणा/विद्या भारती अखिल भारतीय शिक्षा संस्थान एवं कुरुक्षेत्र विश्वविद्यालय कुरुक्षेत्र के संयुक्त तत्वावधान में आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन किया जाएगा।",
  },
  {
    name: "Shiksha Mahakumbh Abhiyan",
    url: "https://www.businessworld.in/article/shiksha-mahakumbh-abhiyan-a-torch-bearer-platform-for-educational-dialogue-and-ecosystem-to-implement-nep-2020-539335",
    description: " A Torch Bearer Platform For Educational Dialogue And Ecosystem To Implement NEP 2020 ",
  },
  {
    name: "Necessity To Establish A Global Platform For Education",
    url: "https://www.businessworld.in/article/necessity-to-establish-a-global-platform-for-education-akin-to-the-olympics-and-option-in-the-form-of-shiksha-mahakumbh-abhiyan-540875",
    description: "Necessity To Establish A Global Platform For Education Akin To The Olympics And Option In The Form Of Shiksha Mahakumbh Abhiyan ",
  },
  {
    name: "यदि बनना चाहते है शिक्षा के महाकुंभ का हिस्सा ",
    url: "https://www.facebook.com/Bharatnewsptk/videos/%E0%A4%AF%E0%A4%A6%E0%A4%BF-%E0%A4%AC%E0%A4%A8%E0%A4%A8%E0%A4%BE-%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A5%87-%E0%A4%B9%E0%A5%88-%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A4%95%E0%A5%87-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%95%E0%A5%81%E0%A4%82%E0%A4%AD-%E0%A4%95%E0%A4%BE-%E0%A4%B9%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%B8%E0%A4%BE-%E0%A4%A4%E0%A5%8B-%E0%A4%9C%E0%A4%B2%E0%A5%8D%E0%A4%A6-%E0%A4%95%E0%A4%B0%E0%A5%87-wwwshikshamahakumbhcom/986021730019759/?mibextid=qi2Omg&rdid=6NNaywVz5BSFHtSF",
    description: "यदि बनना चाहते है शिक्षा के महाकुंभ का हिस्सा तो जल्द करे www.shikshamahakumbh.com & www.rase.co.in पर पंजीकरण ",
  }
];

const ShikshaMahaKumbh2023DigitalMedia: React.FC = () => {
  const [showAllDay1, setShowAllDay1] = useState(false);

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const menu = (url: string) => (
    <Menu>
      <Menu.Item key="1">
        <a href={url} target="_blank" rel="noopener noreferrer">
          Visit Site
        </a>
      </Menu.Item>
    </Menu>
  );

  // Show only 8 items initially
  const displayedMedia = showAllDay1 ? media : media.slice(0, 8);

  return (
    <div className="bg-[url('/pattern3.png')] bg-repeat justify-center p-8">
      <h1 className="text-2xl text-primary font-bold text-shadow-lg mb-12">
        Shiksha MahaKumbh 2024 2<sup>st</sup> Edition Digital Media
      </h1>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-8">
        {displayedMedia.map((item: MediaItem, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <Card
              className="relative transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              hoverable
              cover={
                <div className="relative h-40 bg-black rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-white text-2xl font-bold p-4">
                        {item.name}
                      </h2>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="flex justify-between items-center mt-4">
                <p className="text-black">{item.description}</p>
                <Button
                  type="primary"
                  className="font-semibold text-white bg-primary hover:bg-white hover:border-primary text-lg p-4 flex justify-center text-center items-center"
                  onClick={() => handleClick(item.url)}
                >
                  Visit
                </Button>
                <Dropdown overlay={menu(item.url)} trigger={["click"]}>
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="text-black font-bold"
                  />
                </Dropdown>
              </div>
            </Card>
          </motion.div>
        ))}

        
      </div>
    </div>
  );
};

export default ShikshaMahaKumbh2023DigitalMedia;
