"use client";

import React, { useState } from "react";
import { Card, Button, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import { SMK_50_DIGITAL_MEDIA } from "@/data/media/shiksha-mahakumbh-5.0-digital-media";

const { Meta } = Card;

const ShikshaMahaKumbh2025DigitalMedia: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

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

  const displayedMedia = showAll ? SMK_50_DIGITAL_MEDIA : SMK_50_DIGITAL_MEDIA.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="mb-4 text-center text-3xl font-bold text-brand-navy md:text-4xl">
        Shiksha Mahakumbh 5.0 — Digital Media
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-center text-slate-600">
        Online news, government portals, YouTube, Facebook, and Instagram coverage from NIPER Mohali
        — including official reporting from the{" "}
        <a
          href="https://ladakh.gov.in/shiksha-mahakumbh-abhiyan-2025/"
          className="font-semibold text-brand-blue hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Union Territory of Ladakh
        </a>
        .
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedMedia.map((item, index) => (
          <motion.div
            key={item.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              hoverable
              className="h-full shadow-md"
              actions={[
                <Button key="visit" type="link" onClick={() => handleClick(item.url)}>
                  Visit
                </Button>,
                <Dropdown key="more" overlay={menu(item.url)} trigger={["click"]}>
                  <MoreOutlined />
                </Dropdown>,
              ]}
            >
              <Meta title={item.name} description={item.description} />
            </Card>
          </motion.div>
        ))}
      </div>

      {SMK_50_DIGITAL_MEDIA.length > 8 ? (
        <div className="mt-8 text-center">
          <Button type="primary" size="large" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show Less" : `Show All (${SMK_50_DIGITAL_MEDIA.length})`}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ShikshaMahaKumbh2025DigitalMedia;
