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
    
        { name: 'Babushahi', url: 'https://www.babushahi.com/full-news.php?id=176260&headline=Haryana-Governor-Dattatraya-inaugurates-Shiksha-Kumbh-organised-at-NIT-Kurukshetra', description: 'Haryana Governor Dattatraya inaugurates Shiksha Kumbh at NIT Kurukshetra' },
        { name: 'Punjab Newsline', url: 'https://www.punjabnewsline.com/news/governor-promises-that-shiksha-kumbh-will-become-a-symbol-of-educational-innovation-cooperation-and-empowerment-70308', description: 'Governor promises Shiksha Kumbh will symbolize educational innovation and empowerment' },
        { name: 'Babushahi (Hindi)', url: 'https://www-babushahi-com.translate.goog/full-news.php?id=176260&_x_tr_sl=en&_x_tr_tl=hi&_x_tr_hl=hi&_x_tr_pto=tc', description: 'Haryana Governor Dattatraya inaugurates Shiksha Kumbh' },
        { name: 'India News Calling', url: 'https://www.indianewscalling.com/sunday-magazine/news/147043--.aspx', description: 'Shiksha Kumbh highlights educational collaboration and innovation' },
        { name: 'Amar Ujala', url: 'https://www.amarujala.com/amp/haryana/kurukshetra/new-education-policy-is-a-game-changer-for-creating-startups-governor-kurukshetra-news-c-45-1-kur1001-10590-2023-12-21', description: 'New Education Policy’s impact on startup creation highlighted by Governor' },
        { name: 'City Darpan', url: 'https://www.citydarpan.com/news/11935', description: 'Governor emphasizes the role of Shiksha Kumbh in educational innovation' },
        { name: 'The Print', url: 'https://hindi.theprint.in/india/haryana-governor-launches-shiksha-kumbh/642706/?amp', description: 'Haryana Governor launches Shiksha Kumbh initiative' },
        { name: 'The Week', url: 'https://www.theweek.in/wire-updates/national/2023/12/20/des62--hr-governor.amp.html', description: 'Governor Dattatraya inaugurates Shiksha Kumbh' },
        { name: 'Navraj Times', url: 'https://navrajtimes.com/education/shiksha-kumbh-promises-to-be-a-symbol-of-educational-innovation-collaboration-and-empowerment-bandaru/', description: 'Shiksha Kumbh promises educational innovation and collaboration' },
        { name: 'Bharat Sarathi', url: 'https://bharatsarathi.com/?p=182864', description: 'Details on Shiksha Kumbh’s inauguration by Haryana Governor' },
        { name: 'Indian News Calling', url: 'https://www.indianewscalling.com/sunday-magazine/news/147043--.aspx', description: 'Shiksha Kumbh emphasizes educational collaboration' },
        { name: 'Devdiscourse', url: 'https://www.devdiscourse.com/article/education/2752946-haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative?amp', description: 'Governor Dattatraya inaugurates Shiksha Kumbh initiative' },
        { name: 'PTI News', url: 'https://oldbhasha.ptinews.com/news/state/567977.html', description: 'Governor Dattatraya’s inauguration of Shiksha Kumbh' },
        { name: 'Dainik Tribune', url: 'https://www.dainiktribuneonline.com/news/haryana/shiksha-kumbh-symbolizes-educational-innovation-and-empowerment/', description: 'Shiksha Kumbh symbolizes educational innovation and empowerment' },
        { name: 'X.com', url: 'https://x.com/Dattatreya/status/1737454016777613596?s=20', description: 'Governor Dattatraya’s tweet on Shiksha Kumbh' },
        { name: 'Daily Pioneer', url: 'https://www.dailypioneer.com/2023/state-editions/haryana-governor-dattatreya-inaugurates--shiksha-kumbh--initiative.html', description: 'Haryana Governor inaugurates Shiksha Kumbh initiative' },
        { name: 'Ground News', url: 'https://ground.news/article/haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative-2034290', description: 'Haryana Governor inaugurates Shiksha Kumbh initiative' },
        { name: 'News Drum', url: 'https://www.newsdrum.in/national/haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative-2034290', description: 'Governor Dattatraya inaugurates Shiksha Kumbh initiative' },
        { name: 'Samagra Bharat', url: 'https://www.samagrabharat.com/2023/12/22/teachers-fraternity-should-become-success-stories-to-become-real-heroes-better-than-entertainers-in-the-film-industry-prof-m-m-goyal/', description: 'Teachers’ fraternity should become success stories: Prof M.M. Goyal' },
        { name: 'Newzdex', url: 'https://www.newzdex.com/?p=60665', description: 'Shiksha Kumbh event updates' },
        { name: 'Newzdex', url: 'https://www.newzdex.com/?p=60587', description: 'Details on Shiksha Kumbh event' },
        { name: 'Images', url: 'https://images.app.goo.gl/5Rf3yvkJM1GeGEY1A', description: 'Images related to Shiksha Kumbh' },
        { name: 'Images', url: 'https://images.app.goo.gl/j4GsqvUGhH3bwvo57', description: 'Images from Shiksha Kumbh event' },
        { name: 'Indian News Calling', url: 'https://www.indianewscalling.com/sunday-magazine/news/147043--.aspx', description: 'Shiksha Kumbh highlights educational collaboration' },
        { name: 'Mirror 365', url: 'https://mirror365.com/%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A4%95%E0%A5%81%E0%A4%82%E0%A4%AD-%E0%A4%B6%E0%A5%88%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%95-%E0%A4%A8%E0%A4%B5%E0%A4%BE%E0%A4%9A/', description: 'Shiksha Kumbh educational innovation' },
        { name: 'Media Setu', url: 'https://themediasetu.com/governor-bandaru-dattatreya-promises-that-shiksha-kumbh-will-become-a-symbol-of-educational-innovation-cooperation-and-empowerment/', description: 'Governor promises Shiksha Kumbh as a symbol of educational innovation' },
        { name: 'Google Search', url: 'https://www.google.com/search?q=%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE+%E0%A4%95%E0%A5%81%E0%A4%82%E0%A4%AD,+2023&sca_esv=593546230&rlz=1C1ONGR_enIN1054IN1054&tbm=isch&sxsrf=AM9HkKkr643ClAIIcfboc3gibuigqxWxfw:1703491292103&source=lnms&sa=X&ved=2ahUKEwjixd_Kj6qDAxW0T2wGHYNyDZ4Q_AUoA3oECAEQBQ&biw=1920&bih=945&dpr=1#imgrc=T_M8QoO9lbJkvM', description: 'Image search results for Shiksha Kumbh 2023' },
        { name: 'Samagra Bharat', url: 'https://www.samagrabharat.com/2023/12/21/knowledge-of-needonomics-essential-for-startup-entrepreneurs-aspiring-to-become-unicorns-prof-m-m-goel/', description: 'Knowledge of Needonomics essential for startup entrepreneurs' },
        { name: 'Images', url: 'https://images.app.goo.gl/pVpETnKmfD3TCPyQ9', description: 'Shiksha Kumbh event images' },
        { name: 'Bhaskar', url: 'https://www.bhaskar.com/local/haryana/kurukshetra/news/national-education-policy-2020-is-going-to-increase-skill-building-of-students-governor-dattatreya-132318789.html', description: 'Governor Dattatraya on how National Education Policy 2020 will enhance skill-building' },
        { name: 'Vidyabharati Samvad', url: 'https://vidyabharatisamvad.com/3234/meeting-of-shiksha-kumbh-of-kurukshetra-and-national-institute-of-technology-nit-kurukshetra/', description: 'Meeting details of Shiksha Kumbh at NIT Kurukshetra' },
    ];
    


  const Media: React.FC = () => {
    const [showAllDay1, setShowAllDay1] = useState(false);
   
  
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
    
  
    return (
      <div className="bg-[url('/pattern2.png')] bg-repeat justify-center p-8">
        <h1 className="text-2xl text-primary font-bold text-shadow-lg mb-12">
          RASE 2023 2<sup>nd</sup> Edition Digital Media
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
      </div>
    );
  };
  
  export default Media;