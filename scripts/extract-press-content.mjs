/**
 * @deprecated LegacyArticle.tsx files removed — edit src/data/press-articles.json directly.
 * Originally extracted LegacyArticle.tsx → scripts/data/press-articles-content.mjs
 * Run: node scripts/extract-press-content.mjs (only if legacy TSX files are restored)
 */
import fs from "fs";
import path from "path";

const SLUGS = [
  "education-summit-coverage",
  "baton-ceremony-smk-4",
  "summit-highlights",
  "shiksha-mahakumbh-4-0",
  "residential-camp-success",
  "residential-camp-hindi",
  "mahakumbh-programme-update",
  "national-coverage",
  "education-movement",
];

const PRESS_NUMBERS = {
  "education-summit-coverage": 6,
  "baton-ceremony-smk-4": 1,
  "summit-highlights": 9,
  "shiksha-mahakumbh-4-0": 2,
  "residential-camp-success": 3,
  "residential-camp-hindi": 4,
  "mahakumbh-programme-update": 7,
  "national-coverage": 5,
  "education-movement": 8,
};

function extractField(src, name) {
  const re = new RegExp(`const ${name}\\s*=\\s*([\\s\\S]*?);\\n`, "m");
  const m = src.match(re);
  if (!m) return "";
  return m[1].replace(/^`|`$/g, "").replace(/^"|"$/g, "").trim();
}

function extractSections(src) {
  const start = src.indexOf("sections: [");
  if (start < 0) return [];
  let depth = 0;
  let i = start + "sections: ".length;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const block = src.slice(start, i);
  const sections = [];
  const sectionRe = /title:\s*(?:"([^"]*)"|`([^`]*)`|'([^']*)')/g;
  let match;
  const titles = [];
  while ((match = sectionRe.exec(block))) {
    titles.push(match[1] ?? match[2] ?? match[3] ?? "");
  }

  const parts = block.split(/\{\s*title:/).slice(1);
  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx];
    const titleMatch = part.match(/^\s*(?:"([^"]*)"|`([^`]*)`|'([^']*)')/);
    const title = titleMatch
      ? titleMatch[1] ?? titleMatch[2] ?? titleMatch[3] ?? ""
      : titles[idx] ?? "";

    const contentStart = part.indexOf("content: [");
    if (contentStart < 0) {
      sections.push({ title, body: "" });
      continue;
    }

    const strings = [];
    const strRe = /`([\s\S]*?)`|"([^"]*?)"/g;
    const contentBlock = part.slice(contentStart);
    let sm;
    while ((sm = strRe.exec(contentBlock))) {
      const text = (sm[1] ?? sm[2] ?? "").trim();
      if (text && !text.startsWith("highlight-") && !text.startsWith("contact-")) {
        strings.push(text);
      }
    }

    const boldRe = /<b[^>]*>([\s\S]*?)<\/b>/g;
    let bm;
    while ((bm = boldRe.exec(contentBlock))) {
      strings.push(`**${bm[1].trim()}**`);
    }

    const body = strings
      .map((s) => {
        if (s.startsWith("**") && s.endsWith("**")) {
          return `<p><strong>${s.slice(2, -2)}</strong></p>`;
        }
        return `<p>${s.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("\n");

    sections.push({ title, body });
  }

  return sections;
}

const CONTACT_STANDARD = `<ul>
<li><a href="tel:+917903431900">Call: +91 7903431900</a> · <a href="https://wa.me/917903431900" target="_blank" rel="noopener">WhatsApp</a></li>
<li><a href="tel:+918360990494">Call: +91 8360990494</a> · <a href="https://wa.me/918360990494" target="_blank" rel="noopener">WhatsApp</a></li>
<li><a href="tel:+919416362401">Call: +91 9416362401</a> · <a href="https://wa.me/919416362401" target="_blank" rel="noopener">WhatsApp</a></li>
</ul>`;

const CONTACT_HINDI = `<ul>
<li><a href="tel:+917903431900">Call: +91 94632 31250 - शमशेर सिंह जी</a> · <a href="https://wa.me/917903431900" target="_blank" rel="noopener">WhatsApp</a></li>
<li><a href="tel:+918360990494">Call: +91 83609 90494 - जितेश पांडेय जी</a> · <a href="https://wa.me/918360990494" target="_blank" rel="noopener">WhatsApp</a></li>
<li><a href="tel:+919416362401">Call: +91 94163 62401 - सुनील धींगड़ा जी</a> · <a href="https://wa.me/919416362401" target="_blank" rel="noopener">WhatsApp</a></li>
</ul>`;

const articles = [];

for (const slug of SLUGS) {
  const filePath = path.join(
    process.cwd(),
    `src/app/press/${slug}/LegacyArticle.tsx`
  );
  const src = fs.readFileSync(filePath, "utf8");
  const shareTextPlain = extractField(src, "shareTextPlain");
  const shareImage = extractField(src, "shareImage");
  const dataTitleMatch = src.match(/title:\s*"([^"]*)"|title:\s*`([^`]*)`/);
  const dataTitle = dataTitleMatch?.[1] ?? dataTitleMatch?.[2] ?? "";

  let sections = extractSections(src);
  const useHindiContacts = /94632|शमशेर|83609 90494/.test(src);
  sections = sections.map((s) => {
    if (/contact|संपर्क/i.test(s.title)) {
      return {
        ...s,
        body: useHindiContacts ? CONTACT_HINDI : CONTACT_STANDARD,
      };
    }
    if (/tel:\+|wa\.me|_blank/.test(s.body)) {
      return {
        ...s,
        body: useHindiContacts ? CONTACT_HINDI : CONTACT_STANDARD,
      };
    }
    return {
      ...s,
      body: s.body
        .replace(/<p>highlight-\d+<\/p>/g, "")
        .replace(/<p>attractions-\d+<\/p>/g, "")
        .replace(/<p>upcoming-\d+<\/p>/g, "")
        .replace(/\n{2,}/g, "\n"),
    };
  });

  const title =
    dataTitle ||
    sections.find((s) => s.title && s.title.length > 20)?.title ||
    slug.replace(/-/g, " ");

  articles.push({
    slug,
    pressNumber: PRESS_NUMBERS[slug],
    locale: /[\u0900-\u097F]/.test(title) ? "en" : "en",
    title,
    excerpt: shareTextPlain || title.slice(0, 160),
    heroImage: shareImage || `/2024M/press${PRESS_NUMBERS[slug]}.jpg`,
    shareText: shareTextPlain,
    sections,
  });
}

const outPath = path.join(process.cwd(), "scripts/data/press-articles-content.mjs");
const jsonPath = path.join(process.cwd(), "src/data/press-articles.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
fs.writeFileSync(
  outPath,
  `/** Auto-generated by scripts/extract-press-content.mjs */\nexport const PRESS_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`
);
fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2));
console.log(`Wrote ${articles.length} articles → ${outPath}`);
console.log(`Wrote ${articles.length} articles → ${jsonPath}`);
