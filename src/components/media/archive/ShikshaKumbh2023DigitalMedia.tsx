"use client";

import DigitalMediaArchiveGrid from "./DigitalMediaArchiveGrid";

const media = [
  { name: "Babushahi", url: "https://www.babushahi.com/full-news.php?id=176260&headline=Haryana-Governor-Dattatraya-inaugurates-Shiksha-Kumbh-organised-at-NIT-Kurukshetra", description: "Haryana Governor Dattatraya inaugurates Shiksha Kumbh at NIT Kurukshetra" },
  { name: "Punjab Newsline", url: "https://www.punjabnewsline.com/news/governor-promises-that-shiksha-kumbh-will-become-a-symbol-of-educational-innovation-cooperation-and-empowerment-70308", description: "Governor promises Shiksha Kumbh will symbolize educational innovation and empowerment" },
  { name: "Babushahi (Hindi)", url: "https://www-babushahi-com.translate.goog/full-news.php?id=176260&_x_tr_sl=en&_x_tr_tl=hi&_x_tr_hl=hi&_x_tr_pto=tc", description: "Haryana Governor Dattatraya inaugurates Shiksha Kumbh" },
  { name: "India News Calling", url: "https://www.indianewscalling.com/sunday-magazine/news/147043--.aspx", description: "Shiksha Kumbh highlights educational collaboration and innovation" },
  { name: "Amar Ujala", url: "https://www.amarujala.com/amp/haryana/kurukshetra/new-education-policy-is-a-game-changer-for-creating-startups-governor-kurukshetra-news-c-45-1-kur1001-10590-2023-12-21", description: "New Education Policy's impact on startup creation highlighted by Governor" },
  { name: "City Darpan", url: "https://www.citydarpan.com/news/11935", description: "Governor emphasizes the role of Shiksha Kumbh in educational innovation" },
  { name: "The Print", url: "https://hindi.theprint.in/india/haryana-governor-launches-shiksha-kumbh/642706/?amp", description: "Haryana Governor launches Shiksha Kumbh initiative" },
  { name: "The Week", url: "https://www.theweek.in/wire-updates/national/2023/12/20/des62--hr-governor.amp.html", description: "Governor Dattatraya inaugurates Shiksha Kumbh" },
  { name: "Navraj Times", url: "https://navrajtimes.com/education/shiksha-kumbh-promises-to-be-a-symbol-of-educational-innovation-collaboration-and-empowerment-bandaru/", description: "Shiksha Kumbh promises educational innovation and collaboration" },
  { name: "Bharat Sarathi", url: "https://bharatsarathi.com/?p=182864", description: "Details on Shiksha Kumbh's inauguration by Haryana Governor" },
  { name: "Devdiscourse", url: "https://www.devdiscourse.com/article/education/2752946-haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative?amp", description: "Governor Dattatreya inaugurates Shiksha Kumbh initiative" },
  { name: "PTI News", url: "https://oldbhasha.ptinews.com/news/state/567977.html", description: "Governor Dattatreya's inauguration of Shiksha Kumbh" },
  { name: "Dainik Tribune", url: "https://www.dainiktribuneonline.com/news/haryana/shiksha-kumbh-symbolizes-educational-innovation-and-empowerment/", description: "Shiksha Kumbh symbolizes educational innovation and empowerment" },
  { name: "X.com", url: "https://x.com/Dattatreya/status/1737454016777613596?s=20", description: "Governor Dattatreya's tweet on Shiksha Kumbh" },
  { name: "Daily Pioneer", url: "https://www.dailypioneer.com/2023/state-editions/haryana-governor-dattatreya-inaugurates--shiksha-kumbh--initiative.html", description: "Haryana Governor inaugurates Shiksha Kumbh initiative" },
  { name: "Ground News", url: "https://ground.news/article/haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative-2034290", description: "Haryana Governor inaugurates Shiksha Kumbh initiative" },
  { name: "News Drum", url: "https://www.newsdrum.in/national/haryana-governor-dattatreya-inaugurates-shiksha-kumbh-initiative-2034290", description: "Governor Dattatreya inaugurates Shiksha Kumbh initiative" },
  { name: "Samagra Bharat", url: "https://www.samagrabharat.com/2023/12/22/teachers-fraternity-should-become-success-stories-to-become-real-heroes-better-than-entertainers-in-the-film-industry-prof-m-m-goyal/", description: "Teachers' fraternity should become success stories: Prof M.M. Goyal" },
  { name: "Newzdex", url: "https://www.newzdex.com/?p=60665", description: "Shiksha Kumbh event updates" },
  { name: "Newzdex", url: "https://www.newzdex.com/?p=60587", description: "Details on Shiksha Kumbh event" },
  { name: "Bhaskar", url: "https://www.bhaskar.com/local/haryana/kurukshetra/news/national-education-policy-2020-is-going-to-increase-skill-building-of-students-governor-dattatreya-132318789.html", description: "Governor Dattatraya on NEP 2020 skill-building" },
  { name: "Vidyabharati Samvad", url: "https://vidyabharatisamvad.com/3234/meeting-of-shiksha-kumbh-of-kurukshetra-and-national-institute-of-technology-nit-kurukshetra/", description: "Meeting details of Shiksha Kumbh at NIT Kurukshetra" },
];

export default function ShikshaKumbh2023DigitalMedia() {
  return (
    <DigitalMediaArchiveGrid
      sections={[{ title: "Shiksha Kumbh 2.0 — Digital Media", items: media }]}
    />
  );
}
