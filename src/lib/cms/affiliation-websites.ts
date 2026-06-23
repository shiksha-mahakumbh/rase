import { normalizeAffiliationKey } from "@/lib/cms/partner-showcase";

/** Exact normalized name → official website */
const WEBSITE_BY_KEY: Record<string, string> = {
  "business world": "https://businessworld.in/",
  "dainik savera": "https://epaper.dainiksaveratimes.in/",
  "uttam hindu": "https://www.uttamhindu.com/",
  "the pioneer": "https://www.dailypioneer.com/",
  "द पायनियर": "https://www.dailypioneer.com/",
  "द उत्तम हिंदू": "https://www.uttamhindu.com/",
  drdo: "https://www.drdo.gov.in/",
  "डीआरडीओ": "https://www.drdo.gov.in/",
  nhpc: "https://www.nhpcindia.com/",
  "एनएचपीसी": "https://www.nhpcindia.com/",
  nfil: "https://www.nfil.in/",
  "एनएफआईएल": "https://www.nfil.in/",
  isro: "https://www.isro.gov.in/",
  csir: "https://www.csir.res.in/",
  ugc: "https://www.ugc.gov.in/",
  icar: "https://www.icar.org.in/",
  "nalanda university": "https://nalandauniv.edu.in/",
  "department of holistic education": "https://www.dhe.org.in/",
  "shiksha mahakumbh abhiyan": "https://www.shikshamahakumbh.com/",
};

/** Substring / pattern match — first match wins */
const WEBSITE_PATTERNS: { pattern: RegExp; url: string }[] = [
  { pattern: /holistic education|dhe\b|डीएचई/i, url: "https://www.dhe.org.in/" },
  { pattern: /shiksha mahakumbh|शिक्षा महाकुंभ/i, url: "https://www.shikshamahakumbh.com/" },
  { pattern: /vidya bharat|विद्या भारती/i, url: "https://www.vidyabharati.org/" },
  { pattern: /bharatiya shikshan|भारतीय शिक्षण/i, url: "https://www.bharatiyashikshanmandalfbd.org/" },
  { pattern: /swadeshi jagran|स्वदेशी जागरण/i, url: "https://www.swadeshijagran.org/" },
  { pattern: /iit\s*ropar|आईआईटी\s*रोपड़/i, url: "https://www.iitrpr.ac.in/" },
  { pattern: /iit\s*kanpur|आईआईटी\s*कानपुर/i, url: "https://www.iitk.ac.in/" },
  { pattern: /iit\s*jammu|आईआईटी\s*जम्मू/i, url: "https://www.iitjammu.ac.in/" },
  { pattern: /iim\s*amritsar|आईआईएम\s*अमृतसर|आइआइएम\s*अमृतसर/i, url: "https://iimamritsar.ac.in/" },
  { pattern: /iim\s*trichy|आईआईएम\s*तिरुचि|आइआइएम\s*तिरुचि/i, url: "https://www.iimtrichy.ac.in/" },
  { pattern: /iim\s*jammu|आइआइएम\s*जम्मू/i, url: "https://iimjammu.ac.in/" },
  { pattern: /iim\s*sirmour|आइआइएम\s*सिरमौर/i, url: "https://iimsirmour.ac.in/" },
  { pattern: /nit\s*hamirpur|एनआईटी\s*हमीरपुर/i, url: "https://nith.ac.in/" },
  { pattern: /nit\s*kurukshetra|एनआईटी\s*कुरुक्षेत्र/i, url: "https://nitkkr.ac.in/" },
  { pattern: /nit\s*jalandhar|एनआईटी\s*जालंधर|एनआईटी\s*जलंधर/i, url: "https://nitj.ac.in/" },
  { pattern: /nit\s*sri?nagar|एनआईटी\s*श्रीनगर/i, url: "https://nitsri.ac.in/" },
  { pattern: /nit\s*uttarakhand|एनआईटी\s*उत्तराखंड/i, url: "https://nituk.ac.in/" },
  { pattern: /nit\s*jamshedpur|एनआईटी\s*जमशेदपुर/i, url: "https://www.nitjsr.ac.in/" },
  { pattern: /mnnit|एमएनएनआईटी/i, url: "https://www.mnnit.ac.in/" },
  { pattern: /kurukshetra university|कुरुक्षेत्र विश्वविद्यालय/i, url: "https://kuk.ac.in/" },
  { pattern: /punjab university|पंजाब विश्वविद्यालय/i, url: "https://puchd.ac.in/" },
  { pattern: /panjab university|panjab university/i, url: "https://puchd.ac.in/" },
  { pattern: /central university.*punjab|केंद्रीय विश्वविद्यालय पंजाब/i, url: "https://www.cup.edu.in/" },
  { pattern: /central university.*haryana|हरियाणा केंद्रीय/i, url: "https://cuh.ac.in/" },
  { pattern: /central university.*himachal|हिमाचल प्रदेश केंद्रीय/i, url: "https://cuhimachal.ac.in/" },
  { pattern: /jammu central university|जम्मू केंद्रीय/i, url: "https://www.cujammu.ac.in/" },
  { pattern: /maharshi dayanand|महर्षि दयानंद/i, url: "https://www.mdu.ac.in/" },
  { pattern: /chaudhary.*bansi.*lal|चौधरी.*बंसी/i, url: "https://www.cbLU.ac.in/" },
  { pattern: /chaudhary charan singh.*haryana|चौधरी चरण सिंह हरियाणा/i, url: "https://www.hau.ac.in/" },
  { pattern: /gurugram university|गुरुग्राम विश्वविद्यालय/i, url: "https://www.gurugramuniversity.ac.in/" },
  { pattern: /indira gandhi university|इन्दिरा गांधी विश्वविद्यालय/i, url: "https://igu.ac.in/" },
  { pattern: /jamia millia|जामिया मिलिया/i, url: "https://www.jmi.ac.in/" },
  { pattern: /slbs.*sanskrit|एसएलबीएस.*संस्कृत/i, url: "https://www.slbsrsv.ac.in/" },
  { pattern: /lal bahadur shastri.*sanskrit|लाल बहादुर शास्त्री.*संस्कृत/i, url: "https://www.slbss.ac.in/" },
  { pattern: /nip[ae]r\s*mohali|नाइपर\s*मोहाली/i, url: "https://www.niper.gov.in/" },
  { pattern: /iiser\s*mohali|आईआईएसईआर\s*मोहाली/i, url: "https://www.iisermohali.ac.in/" },
  { pattern: /institute of science education.*mohali|आईएसईआर\s*मोहाली/i, url: "https://www.iisermohali.ac.in/" },
  { pattern: /csir.*csio|सीएसआईओ/i, url: "https://www.csio.res.in/" },
  { pattern: /csir.*niscpr|एनआईएससीपीआर/i, url: "https://www.niscpr.res.in/" },
  { pattern: /drdo|डीआरडीओ/i, url: "https://www.drdo.gov.in/" },
  { pattern: /nhpc|एनएचपीसी/i, url: "https://www.nhpcindia.com/" },
  { pattern: /nfil|एनएफआईएल/i, url: "https://www.nfil.in/" },
  { pattern: /business world/i, url: "https://businessworld.in/" },
  { pattern: /dainik savera/i, url: "https://epaper.dainiksaveratimes.in/" },
  { pattern: /uttam hindu|उत्तम हिंदू/i, url: "https://www.uttamhindu.com/" },
  { pattern: /pioneer|पायनियर/i, url: "https://www.dailypioneer.com/" },
  { pattern: /english connection|इंग्लिश कनेक्शन/i, url: "https://www.englishconnection.online/" },
  { pattern: /youngov|यंगो/i, url: "https://youngovator.com/" },
  { pattern: /patent.*design.*trademark/i, url: "https://ipindia.gov.in/" },
  { pattern: /haryana yoga|हरियाणा योग/i, url: "https://ayush.gov.in/" },
  { pattern: /patanjali.*research|पतंजलि अनुसंधान/i, url: "https://www.patanjaliayurved.org/" },
  { pattern: /iskcon|इस्कॉन/i, url: "https://www.iskcon.org/" },
  { pattern: /iit\s*mandi/i, url: "https://www.iitmandi.ac.in/" },
  { pattern: /iit\s*delhi/i, url: "https://home.iitd.ac.in/" },
  { pattern: /ncert/i, url: "https://ncert.nic.in/" },
  { pattern: /pgimer/i, url: "https://pgimer.edu.in/" },
  { pattern: /plaksha/i, url: "https://plaksha.org/" },
  { pattern: /sliet|एसएलआईईडी/i, url: "https://www.sliet.ac.in/" },
  { pattern: /nittr|nittt/i, url: "https://www.nitttrchd.ac.in/" },
  { pattern: /UIET|uiet/i, url: "https://uietkuk.ac.in/" },
  { pattern: /savantx/i, url: "https://savantx.com/" },
  { pattern: /requil|रिक्विल/i, url: "https://www.requil.com/" },
];

export function resolveAffiliationWebsite(name: string): string | undefined {
  const key = normalizeAffiliationKey(name);
  if (WEBSITE_BY_KEY[key]) return WEBSITE_BY_KEY[key];

  for (const [mapKey, url] of Object.entries(WEBSITE_BY_KEY)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return url;
  }

  for (const { pattern, url } of WEBSITE_PATTERNS) {
    if (pattern.test(name)) return url;
  }

  return undefined;
}
