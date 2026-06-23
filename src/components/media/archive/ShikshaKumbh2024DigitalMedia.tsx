"use client";

import DigitalMediaArchiveGrid from "./DigitalMediaArchiveGrid";

const media = [
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

const media2 = [
  
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

export default function ShikshaKumbh2024DigitalMedia() {
  return (
    <DigitalMediaArchiveGrid
      sections={[
        { title: "RASE 2024 — Digital Media Day 1", items: media },
        { title: "RASE 2024 — Digital Media Day 2", items: media2 },
      ]}
    />
  );
}
