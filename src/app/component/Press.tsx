"use client";
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import Image from 'next/image';
import proceeding1 from '/public/2024M/press2.jpg';
import proceeding2 from '/public/2024M/press1.jpg';
import proceeding3 from '/public/2024M/res/res9.jpg';
import proceeding4 from '/public/2024M/press4.jpg';


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
      title: `"हवन रश्म" के साथ शिक्षा महाकुंभ 2.0 का शुरू हुया काउंटडाउन"`,
      description: `शिक्षा महाकुंभ 2.0 की तैयारियों के अंतर्गत सुबह 7:30 बजे UIET, कुरुक्षेत्र विश्वविद्यालय में "हवन रश्म" का आयोजन किया गया।`,
      image: proceeding4,
      // previewLink: '/Press1.pdf',
      // downloadLink: '/Press1.pdf',
      readLink: '/Press4' // Link to the TSX file or page
    },
    {
      title: "शिक्षा महाकुंभ-2024 (द्वितीय संस्करण)",
      description: "आवासीय अभ्यास वर्ग – सफलता की ओर एक और कदम",
      image: proceeding3,
      // previewLink: '/Press1.pdf',
      // downloadLink: '/Press1.pdf',
      readLink: '/Press3' // Link to the TSX file or page
    },
    {
      title: "कुरुक्षेत्र हरियाणा में आयोजित होगा द्वितीय शिक्षा महाकुंभ 2024।",
      description: "आगामी 16 तथा 17 दिसंबर 2024 को कुरुक्षेत्र विश्वविद्यालय में द्वितीय शिक्षा महाकुंभ का आयोजन किया जाएगा ",
      image: proceeding1,
      // previewLink: '/Press1.pdf',
      // downloadLink: '/Press1.pdf',
      readLink: '/Press2' // Link to the TSX file or page
    },
    {
      title: "Baton Ceremony",
      description: "A Grand Start to Shiksha Mahakumbh 2.0: Baton CeremonySuccessfully Concluded  Kurukshetra, November 20, 2024",
      image: proceeding2,
      // previewLink: '/Press1.pdf',
      // downloadLink: '/Press1.pdf',
      readLink: '/Press1' // Link to the TSX file or page
    },
    // {
    //   title: "RASE 2023 2nd Edition",
    //   description: "Click on the buttons below to preview, download, or read the proceedings.",
    //   image: proceeding1,
    //   previewLink: '/Proceeding1.pdf',
    //   downloadLink: '/Proceeding1.pdf',
    //   readLink: '/proceeding1' // Link to the TSX file or page
    // },
    // {
    //   title: "RASE 2024 3rd Edition",
    //   description: "Click on the buttons below to preview, download, or read the proceedings.",
    //   image: proceeding3,
    //   previewLink: '/Proceeding3.pdf',
    //   downloadLink: '/Proceeding3.pdf',
    //   readLink: '/proceeding3' // Link to the TSX file or page
    // },
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
      <h1 className='text-3xl font-bold text-primary text-center mb-6'>Press Note
</h1>
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
              // <Button
              //   key="preview"
              //   type="primary"
              //   onClick={() => openPreview(data.previewLink)}
              //   style={{ width: '100%', marginBottom: '4px', backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} // Uniform color
              // >
              //   Preview
              // </Button>,
              // <Button
              //   key="download"
              //   type="primary"
              //   onClick={() => downloadProceedings(data.downloadLink)}
              //   style={{ width: '100%', marginBottom: '4px', backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} // Uniform color
              // >
              //   Download
              // </Button>,
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