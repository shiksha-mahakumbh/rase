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
    name: "Necessity To Establish A Global Platform For Education",
    url: "https://www.businessworld.in/article/necessity-to-establish-a-global-platform-for-education-akin-to-the-olympics-and-option-in-the-form-of-shiksha-mahakumbh-abhiyan-540875",
    description: "Necessity To Establish A Global Platform For Education Akin To The Olympics And Option In The Form Of Shiksha Mahakumbh Abhiyan ",
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
