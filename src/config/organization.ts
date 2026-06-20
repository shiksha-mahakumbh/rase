import { SITE_URL } from "./site";

/** Official Department of Holistic Education contact & location — single source of truth */
export const DHE_ORGANIZATION = {
  name: "Department of Holistic Education",
  shortName: "DHE",
  abhiyan: "Shiksha Mahakumbh Abhiyan",
  address: {
    line1: "E7, Orchid Towers",
    line2: "Sector-125",
    line3: "SAS Nagar",
    state: "Punjab",
    pincode: "140301",
    country: "India",
    formatted:
      "E7, Orchid Towers, Sector-125, SAS Nagar, Punjab 140301",
    mapsQuery:
      "E7+Orchid+Towers+Sector-125+Sunny+Enclave+SAS+Nagar+Punjab+140301",
    /** Approximate coordinates — Orchid Towers, Sector 125, Kharar */
    lat: 30.74,
    lng: 76.64,
  },
  emails: [
    "info@shikshamahakumbh.com",
    "shikshamahakumbh23@gmail.com",
    "academics@shikshamahakumbh.com",
  ],
  phones: ["+91 79034 31900", "+91 94632 31250"],
  websites: [
    { label: "www.shikshamahakumbh.com", href: "https://www.shikshamahakumbh.com" },
    { label: "www.dhe.org.in", href: "https://www.dhe.org.in/" },
    { label: "www.rase.co.in", href: "https://www.rase.co.in" },
  ],
  intro:
    "The Department of Holistic Education (DHE) is a visionary initiative dedicated to transforming education through holistic, interdisciplinary, and socially impactful approaches.",
  mission:
    "To integrate innovation, ethics, skill development, research, and Indian Knowledge Systems into mainstream education — aligned with the vision of Viksit Bharat 2047.",
  abhiyanLeadership: {
    patron: "Dr. Thakur S.K. Raunija (Dr. Thakur SKR)",
    patronRole: "Senior Scientist, ISRO & Director, DHE",
    coordinator: "Maj. Dr. Shamshere Singh",
    secretary: "Dr. Jitender Garg",
    photoFramePath: "/abhiyaninphotoframe",
  },
} as const;

export const DHE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${DHE_ORGANIZATION.address.mapsQuery}&hl=en&z=16&output=embed`;

export const DHE_MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${DHE_ORGANIZATION.address.mapsQuery}`;
