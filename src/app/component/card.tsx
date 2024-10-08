import React from "react";
import { Card, Tag } from "antd";

const cardData = [
  {
    src: "/2023K/k2.JPG",
    alt: "Shiksha Kumbh 2023",
    title: "RASE 2023 1st Edition",
    description: `We introduce "Shiksha Kumbh," a groundbreaking concept designed to complement Shiksha Mahakumbh and ensure that the light of education reaches every institution. The first edition of Shiksha Kumbh was held at NIT Kurukshetra in December 2023.`,
    tags: ["#shiksha", "#kumbh", "#bharat"],
  },
  {
    src: "/2023M/k1.png",
    alt: "Shiksha MahaKumbh 2023",
    title: "RASE 2023 2nd Edition",
    description: `This journey has seen the successful launch of the "Shiksha Mahakumbh" initiative, which made its historic debut in June 2023, with the inaugural session held at NIT Jalandhar, marking a momentous stride in our quest to reimagine education.`,
    tags: ["#dhe", "#mahakumbh", "#drthakur"],
  },
  {
    src: "/2024K/k2.jpeg",
    alt: "Shiksha Kumbh 2024",
    title: "RASE 2024 3rd Edition",
    description: `The conference will highlight the economic impact of academic-driven startups, fostering collaboration, skill development, and rural innovation. It aims to cultivate entrepreneurship culture and utilize educational infrastructure for startup growth.`,
    tags: ["#kumbh", "#shiksha", "#dhe"],
  },
];

export const CustomCard: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {cardData.map((item, index) => (
        <Card
          key={index}
          hoverable
          cover={
            <img
              alt={item.alt}
              src={item.src}
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
          style={{ maxWidth: "271px", width: "100%", marginBottom: "1rem" }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "#502a2a",
                marginBottom: "0.5rem",
              }}
            >
              {item.title}
            </h2>
            <p style={{ color: "#555" }}>{item.description}</p>
          </div>
          <div style={{ paddingTop: "1rem" }}>
            {item.tags.map((tag, tagIndex) => (
              <Tag
                key={tagIndex}
                style={{
                  marginBottom: "0.5rem",
                  color: "white",
                  backgroundColor: "#502a2a",
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
