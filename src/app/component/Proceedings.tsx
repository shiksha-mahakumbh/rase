"use client";
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import Image from 'next/image';
import proceeding1 from '/public/proceeding1.jpg';
import proceeding2 from '/public/proceeding2.jpg';
import proceeding3 from '/public/proceeding3.jpg';
const { Meta } = Card;

const Proceedings: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const cardData = [
    {
      title: "RASE 2023 1st Edition",
      description: "Click on the buttons below to preview, download, or read the proceedings.",
      image: proceeding2,
      previewLink: '/Proceeding2.pdf',
      downloadLink: '/Proceeding2.pdf',
      readLink: '/proceeding2' // Link to the TSX file or page
    },
    {
      title: "RASE 2023 2nd Edition",
      description: "Click on the buttons below to preview, download, or read the proceedings.",
      image: proceeding1,
      previewLink: '/Proceeding1.pdf',
      downloadLink: '/Proceeding1.pdf',
      readLink: '/proceeding1' // Link to the TSX file or page
    },
    {
      title: "RASE 2024 3rd Edition",
      description: "Click on the buttons below to preview, download, or read the proceedings.",
      image: proceeding3,
      previewLink: '/Proceeding3.pdf',
      downloadLink: '/Proceeding3.pdf',
      readLink: '/proceeding3' // Link to the TSX file or page
    },
    // Add more cards as needed
  ];

  const openPreview = (previewLink: string) => {
    window.open(previewLink, '_blank');
  };

  const downloadProceedings = (downloadLink: string) => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = downloadLink.substring(downloadLink.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openReadProceeding = (readLink: string) => {
    window.open(readLink, '_blank');
  };

  return (
    <>
      <h1 className='text-3xl font-bold text-primary text-center mb-6'>Proceedings</h1>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {cardData.map((data, index) => (
          <Card
            key={index}
            style={{ width: isMobile ? '100%' : 300, marginBottom: 20 }}
            bodyStyle={{ padding: 10 }}
            cover={
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // Aspect ratio 16:9
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <Image
                    alt="Proceeding Image"
                    src={data.image}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            }
            actions={[
              <Button
                key="preview"
                type="primary"
                onClick={() => openPreview(data.previewLink)}
                style={{ width: '100%', marginBottom: '4px', backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} // Uniform color
              >
                Preview
              </Button>,
              <Button
                key="download"
                type="primary"
                onClick={() => downloadProceedings(data.downloadLink)}
                style={{ width: '100%', marginBottom: '4px', backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} // Uniform color
              >
                Download
              </Button>,
              <Button
                key="read"
                type="primary"
                onClick={() => openReadProceeding(data.readLink)}
                style={{ width: '100%', backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} // Uniform color
              >
                Read 
              </Button>,
            ]}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateY(0deg)';
            }}
          >
            <Meta
              title={data.title}
              description={data.description}
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default Proceedings;