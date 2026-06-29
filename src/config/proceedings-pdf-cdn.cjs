/** Shared proceedings PDF CDN config (CJS for next.config + upload scripts). */
const PROCEEDINGS_CDN_RELEASE = "proceedings-cdn-v1";
const PROCEEDINGS_CDN_REPO = "shiksha-mahakumbh/rase";

const PROCEEDINGS_CDN_FILES = {
  vol1: "Proceeding1.pdf",
  vol2: "Proceeding2.pdf",
  vol3: "Proceeding3.pdf",
};

function proceedingsCdnUrl(filename) {
  return `https://github.com/${PROCEEDINGS_CDN_REPO}/releases/download/${PROCEEDINGS_CDN_RELEASE}/${filename}`;
}

const PROCEEDINGS_PDF_CDN = {
  vol1: proceedingsCdnUrl(PROCEEDINGS_CDN_FILES.vol1),
  vol2: proceedingsCdnUrl(PROCEEDINGS_CDN_FILES.vol2),
  vol3: proceedingsCdnUrl(PROCEEDINGS_CDN_FILES.vol3),
};

const PROCEEDINGS_LEGACY_PDF_REDIRECTS = [
  { source: "/Proceeding1.pdf", destination: PROCEEDINGS_PDF_CDN.vol1, permanent: true },
  { source: "/Proceeding2.pdf", destination: PROCEEDINGS_PDF_CDN.vol2, permanent: true },
  { source: "/Proceeding3.pdf", destination: PROCEEDINGS_PDF_CDN.vol3, permanent: true },
];

module.exports = {
  PROCEEDINGS_CDN_RELEASE,
  PROCEEDINGS_CDN_REPO,
  PROCEEDINGS_CDN_FILES,
  PROCEEDINGS_PDF_CDN,
  PROCEEDINGS_LEGACY_PDF_REDIRECTS,
  proceedingsCdnUrl,
};
