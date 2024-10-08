'use client'; // Ensure this component is rendered on the client side

import React, { useState } from 'react';
import { Card, Button, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons'; // Import Ant Design icons
import { motion } from 'framer-motion'; // Import Framer Motion
import 'antd/dist/reset.css'; // Import Ant Design styles

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
  { name: 'KNS Kashmir', url: 'https://www.knskashmir.com/lgmanoj-sinha-addresses-national-conference-on--role-of-academic-driven-startups-indeveloping-economy-of-jandk-(rase-2024)--187410', description: 'LG Manoj Sinha addresses National Conference on Role of Academic-driven Startups in Developing Economy of J&K (RASE-2024)' },
  { name: 'Kashmir Reader', url: 'https://kashmirreader.com/2024/06/30/addresses-national-rase-2024-focuson-problem-first-not-product-first-lg-to-startups-entrepreneurs/', description: 'Focus on Problem First, Not Product First, LG to Startups, Entrepreneurs' },
  { name: 'Daily Excelsior', url: 'https://www.dailyexcelsior.com/jk-has-got-over-rs-1-10-lakh-cr-industrial-proposalslg/', description: 'J&K has got over Rs 1.10 lakh Cr industrial proposals: LG' },
  { name: 'One India', url: 'https://www.oneindia.com/amphtml/india/l-g-manoj-sinhaspearheads-j-ks-startup-revolution-bridges-academia-and-industry-at-rase-2024-3865757.html', description: 'LG Manoj Sinha Spearheads J&K\'s Startup Revolution, Bridges Academia and Industry at RASE 2024' },
  { name: 'Kashmir Reader', url: 'https://kashmirreader.com/2024/06/30/startupspowerful-instrument-to-bridge-gap-between-universities-industries-says-lg-at-nit-srinagar/', description: 'Startups: A Powerful Instrument to Bridge the Gap Between Universities and Industries, says LG at NIT Srinagar' },
  { name: 'One India Hindi', url: 'https://hindi.oneindia.com/news/jammu-and-kashmir/j-k-lg-sinhainaugurates-academic-driven-startups-raise-2024-national-conference-1041401.html', description: 'J&K LG Sinha Inaugurates Academic-driven Startups RASE 2024 National Conference' },
  { name: 'Grinning Face', url: 'https://www.grinningface.ca/vir458/tjfaic142741k1dcd18.php', description: 'Academic-driven Startups' },
  { name: 'The Week', url: 'https://www.theweek.in/wireupdates/business/2024/06/29/nrg10-jk-startups-sinha.amp.html', description: 'J&K Startups Sinha' },
  { name: 'Rediff Money', url: 'https://money.rediff.com/amp/news/market/j-amp-k-startup-opportunities-ltgovernor-sinha-x27-s-vision/12007920240629', description: 'J&K Startup Opportunities: Lt Governor Sinha\'s Vision' },
  { name: 'The Kashmir Images', url: 'https://thekashmirimages.com/2024/06/30/academic-driven-startups-to-transformjks-economy-lg-sinha/', description: 'Academic-driven Startups to Transform J&K\'s Economy: LG Sinha' },
  { name: 'Scoop News', url: 'http://www.scoopnews.in/det.aspx?q=131346', description: 'LG Manoj Sinha at NIT Srinagar on Saturday' },
  { name: 'Daily Excelsior', url: 'https://www.dailyexcelsior.com/lgmanoj-sinha-at-nit-srinagar-on-saturday/', description: 'LG Manoj Sinha at NIT Srinagar' },
  { name: 'Good Returns', url: 'https://www.goodreturns.in/news/startups-opportunities-in-jammu-kashmir-011-1354681.html', description: 'Startup Opportunities in Jammu & Kashmir' },
  { name: 'Rising Kashmir', url: 'https://risingkashmir.com/academic-driven-startups-vital-to-jks-economic-growth-lg/', description: 'Academic-driven Startups Vital to J&K\'s Economic Growth: LG' },
  { name: 'Bold News Online', url: 'https://boldnewsonline.com/amp/startups-are-powerful-instrument-to-bridgeuniversities-industries-gap-meeting-two-important-objectives-employment-generation-profitgeneration-lg/', description: 'Startups: A Powerful Instrument to Bridge Universities and Industries Gap, Meeting Two Important Objectives - Employment Generation and Profit Generation: LG' },
  { name: 'The Kashmir Horizon', url: 'https://thekashmirhorizon.com/2024/06/30/lg-addresses-national-seminar-on-roleof-academic-driven-startups-in-developing-economy-of-jk-rase-2024/', description: 'LG Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE2024)' },
  { name: 'Kashmir Dot Com', url: 'https://kashmirdotcom.in/2024/06/29/lt-governor-addresses-national-seminar-onrole-of-academic-driven-startups-in-developing-economy-of-jk-rase-2024/', description: 'Lt Governor Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE2024)' },
  { name: 'Morning Kashmir', url: 'https://www.morningkashmir.com/ltgovernor-addresses-national-seminar-on-role-of-academic-driven-startups-in-developingeconomy-of-jk-rase-2024/', description: 'Lt Governor Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE-2024)' },
  { name: 'Kashmir Vision', url: 'https://kashmirvision.in/2024/06/30/startups-are-powerful-instrument-to-bridgeuniversities-industries-gap-lt-guv/', description: 'Startups: A Powerful Instrument to Bridge Universities and Industries Gap: Lt Guv' },
  { name: 'Street Times', url: 'https://www.streettimes.in/lg-addresses-national-seminar-on-role-of-academic-driven-startups-in-developing-economy-of-jk-rase-2024/', description: 'LG Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE-2024)' },
  { name: 'The North Lines', url: 'https://thenorthlines.com/lg-sinha-champions-academic-startups-propels-jkeconomy-forward/', description: 'LG Sinha Champions Academic Startups, Propels J&K Economy Forward' },
  { name: 'Daily Good Morning Kashmir', url: 'https://www.dailygoodmorningkashmir.com/startups-powerfulinstrument-to-bridge-universities-industries-gap-lg/#google_vignette', description: 'Startups: Powerful Instrument to Bridge Universities and Industries Gap: LG' },
  { name: 'Press Trust of Kashmir', url: 'https://presstrustofkashmir.com/2024/06/29/lt-governor-addresses-nationalseminar-on-role-of-academic-driven-startups-in-developing-economy-of-jk-rase-2024/', description: 'Lt Governor Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE2024)' },
  { name: 'RNA Kashmir Online', url: 'https://www.rnakashmironline.com/displaynews.aspx?id=45769', description: 'National Conference on Role of Academic-driven Startups in Developing Economy of J&K (RASE2024)' },
  { name: 'Kashmir News Observer', url: 'https://www.kashmirnewsobserver.com/top-stories/lg-addresses-national-seminaron-role-of-academic-driven-startups-in-developing-economy-of-jandk-(rase-2024)-kno-186624', description: 'LG Addresses National Seminar on Role of Academic-driven Startups in Developing Economy of J&K (RASE2024)' },
  { name: 'UNI India', url: 'http://www.uniindia.com/focus-on-problem-first-and-not-product-firstlg/north/news/3230282.html', description: 'Focus on Problem First and Not Product First: LG' },
  { name: 'MENAFN', url: 'https://menafn.com/1108388760/Immense-Possibilities-For-Startups-Across-Sectors-InJ-K-LG', description: 'Immense Possibilities for Startups Across Sectors in J&K: LG' },
];


const media2: MediaItem1[] = [
  
    { name: 'The Statesman', url: 'http://dhunt.in/VmpJo', description: 'StartUp Movement has Picked Up in India in a Big Way: Dr. Jitendra Singh' },
    { name: 'Rising Kashmir', url: 'https://risingkashmir.com/change-of-mindset-key-to-startups-in-jk-dr-jitendrasingh/', description: 'Change of Mindset Key to Startups in J&K: Dr. Jitendra Singh' },
    { name: 'Greater Kashmir', url: 'https://www.google.com/amp/s/m.greaterkashmir.com/article/change-of-mindset-exploration-of-regional-resources-are-key-to-startups-in-jk-jitendra-singh/310248/amp', description: 'Change of Mindset, Exploration of Regional Resources are Key to Startups in J&K: Jitendra Singh' },
    { name: 'Bhaskar Live', url: 'https://bhaskarlive.in/exploration-of-regional-resources-key-to-build-startup-ecosystem-in-jk-dr-jitendra-singh/', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'Daily Excelsior', url: 'https://www.dailyexcelsior.com/jks-regional-startup-resources-still-not-fully-explored-dr-jitendra/', description: 'J&K\'s Regional Startup Resources Still Not Fully Explored: Dr. Jitendra' },
    { name: 'Brighter Kashmir', url: 'http://brighterkashmir.com/youngsters-should-invest-in-startups-jitendra', description: 'Youngsters Should Invest in Startups: Jitendra' },
    { name: 'State Times', url: 'https://www.google.com/amp/s/statetimes.in/amp/mindset-change-exploration-of-regional-resources-key-to-jk-startups-dr-jitendra/', description: 'Mindset Change, Exploration of Regional Resources Key to J&K Startups: Dr. Jitendra' },
    { name: 'UNI India', url: 'http://www.uniindia.com/news/north/change-of-mindset-regional-resources-key-to-startups-in-j-k-minister/3230898.html', description: 'Change of Mindset, Regional Resources Key to Startups in J&K: Minister' },
    { name: 'Street Times', url: 'https://www.streettimes.in/change-of-mindset-exploration-of-regional-resources-are-the-key-to-startups-in-jk-dr-jitendra-singh/', description: 'Change of Mindset, Exploration of Regional Resources are the Key to Startups in J&K: Dr. Jitendra Singh' },
    { name: 'The Kashmir Horizon', url: 'https://thekashmirhorizon.com/2024/07/01/change-of-mindset-regional-resources-key-to-startups-in-jk-minister/', description: 'Change of Mindset, Regional Resources Key to Startups in J&K: Minister' },
    { name: 'The Print', url: 'https://www.google.com/amp/s/theprint.in/india/change-of-mindset-key-for-success-of-start-ups-in-jk-union-minister-jitendra-singh/2154416/%3famp', description: 'Change of Mindset Key for Success of Start-Ups in J&K: Union Minister Jitendra Singh' },
    { name: 'Pune News', url: 'https://pune.news/technology/exploration-of-regional-resources-key-to-build-startup-ecosystem-in-jk-dr-jitendra-singh-196049/', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'Economic Times', url: 'https://government.economictimes.indiatimes.com/news/economy/exploration-of-regional-resources-key-to-build-startup-ecosystem-in-jk-dr-jitendra-singh/111391511', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'MENAFN', url: 'https://menafn.com/1108390551/Exploration-Of-Regional-Resources-Key-To-Build-Startup-Ecosystem-In-JK-Dr-Jitendra-Singh', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'HI India', url: 'https://hiindia.com/exploration-of-regional-resources-key-to-build-startup-ecosystem-in-jk-dr-jitendra-singh/', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'Jammu Links News', url: 'https://www.jammulinksnews.com/mb/newsdet.aspx?q=354375', description: 'Exploration of Regional Resources Key to Build Startup Ecosystem in J&K: Dr. Jitendra Singh' },
    { name: 'The Print', url: 'https://www.google.com/amp/s/theprint.in/india/change-of-mindset-key-for-success-of-start-ups-in-jk-union-minister-jitendra-singh/2154416/%3famp', description: 'Change of Mindset Key for Success of Start-Ups in J&K: Union Minister Jitendra Singh' },
    { name: 'Greater Kashmir', url: 'https://m.greaterkashmir.com/article/dr-jitendra-singh-attends-national-conference-on-skill-startup-entrepreneurship-in-education-at-nit-srinagar/310043/amp', description: 'Dr. Jitendra Singh Attends National Conference on Skill, Startup, Entrepreneurship in Education at NIT Srinagar' },
  ];
  

  const ShikshaKumbh2024DigitalMedia: React.FC = () => {
    const [showAllDay1, setShowAllDay1] = useState(false);
    const [showAllDay2, setShowAllDay2] = useState(false);
  
    const handleClick = (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };
  
    const menu = (url: string) => (
      <Menu>
        <Menu.Item key="1">
          <a href={url} target="_blank" rel="noopener noreferrer">Visit Site</a>
        </Menu.Item>
      </Menu>
    );
  
    // Show only 8 items initially
    const displayedMedia = showAllDay1 ? media : media.slice(0, 8);
    const displayedMedia2 = showAllDay2 ? media2 : media2.slice(0, 8);
  
    return (
      <div className="bg-[url('/pattern1.png')] bg-repeat justify-center p-8">
        <h1 className="text-2xl text-primary font-bold text-shadow-lg mb-12">
          RASE 2024 3<sup>rd</sup> Edition Digital Media Day - 1
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
                        <h2 className="text-white text-2xl font-bold p-4">{item.name}</h2>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="flex justify-between items-center mt-4">
                  <p className='text-black'>{item.description}</p>
                  <Button
                    type="primary"
                    className="font-semibold text-white bg-primary hover:bg-white hover:border-primary text-lg p-4 flex justify-center text-center items-center"
                    onClick={() => handleClick(item.url)}
                  >
                    Visit
                  </Button>
                  <Dropdown overlay={menu(item.url)} trigger={['click']}>
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
  
          {!showAllDay1 && (
            <Button
              type="default"
              onClick={() => setShowAllDay1(true)}
              className="mt-8 text-white bg-primary border-primary"
            >
              Show More
            </Button>
          )}
        </div>
  
        <h1 className="text-2xl text-primary font-bold text-shadow-lg mb-12">
          RASE 2024 3<sup>rd</sup> Edition Digital Media Day - 2
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-8">
          {displayedMedia2.map((item: MediaItem, index: number) => (
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
                        <h2 className="text-white text-2xl font-bold p-4">{item.name}</h2>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="flex justify-between items-center mt-4">
                  <p className='text-black'>{item.description}</p>
                  <Button
                    type="primary"
                    className="font-semibold text-white bg-primary hover:bg-white hover:border-primary text-lg p-4 flex justify-center text-center items-center"
                    onClick={() => handleClick(item.url)}
                  >
                    Visit
                  </Button>
                  <Dropdown overlay={menu(item.url)} trigger={['click']}>
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
  
          {!showAllDay2 && (
            <Button
              type="default"
              onClick={() => setShowAllDay2(true)}
              className="mt-8 text-white bg-primary border-primary"
            >
              Show More
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  export default ShikshaKumbh2024DigitalMedia;
