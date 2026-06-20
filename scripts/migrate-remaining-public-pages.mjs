import fs from "fs";
import path from "path";

const migrations = [
  {
    file: "src/app/past_event/sm25/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM25 from "../../component/sm25/SM25";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2025",
  subtitle: "Highlights and archives from the 2025 edition.",
  accent: "navy",
} as const;

export default function Sm25PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM25 />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/sm24/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM24 from "../../component/sm24/SM24";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2024",
  subtitle: "Highlights and archives from the 2024 edition.",
  accent: "navy",
} as const;

export default function Sm24PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM24 />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/sm23/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM23 from "../../component/sm23/SM23";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2023",
  subtitle: "Highlights and archives from the 2023 edition.",
  accent: "navy",
} as const;

export default function Sm23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM23 />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/sk24/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/sk24/SK24";
import Organizer from "../../component/sk24/organizer";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Kumbh 2024",
  subtitle: "Highlights and archives from the 2024 Kumbh edition.",
  accent: "saffron",
} as const;

export default function Sk24PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <EventPage />
      <Organizer />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/sk23/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/sk23/SK23";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Kumbh 2023",
  subtitle: "Highlights and archives from the 2023 Kumbh edition.",
  accent: "saffron",
} as const;

export default function Sk23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <EventPage />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/Spoken_English_Workshop/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Spoken_English_Workshop/Spoken_English_Workshop";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Spoken English Workshop",
  subtitle: "Professional development workshop archive.",
  accent: "emerald",
} as const;

export default function SpokenEnglishWorkshopPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/Teacher_Development_Program/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Teacher_Development_Program/Teacher_Development_Program";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Teacher Development Program",
  subtitle: "Faculty development programme archive.",
  accent: "emerald",
} as const;

export default function TeacherDevelopmentProgramPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop/page.tsx",
    content: `"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Innovation_and_Entrepreneurship_Dhe_Workshop/Innovation_and_Entrepreneurship_Dhe_Workshop";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Innovation & Entrepreneurship Workshop",
  subtitle: "DHE workshop on innovation and entrepreneurial skills.",
  accent: "emerald",
} as const;

export default function InnovationWorkshopPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/registration/Accomodation/page.tsx",
    content: `"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import AccomodationForm from "@/components/forms/AccommodationLegacyForm";
import { PAGE_HEROES } from "@/lib/page-heroes";

/** Legacy registration path — preserved for bookmarks */
export default function RegistrationAccommodationPage() {
  return (
    <PublicPageShell
      hero={PAGE_HEROES.accommodation}
      containerClassName="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16"
    >
      <AccomodationForm />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/ResidentialCamp/page.tsx",
    content: `import PublicPageShell from "@/components/layouts/PublicPageShell";
import ResidentialCamp from "../component/Residential_Camp";

const PAGE_HERO = {
  eyebrow: "Programmes",
  title: "Residential Camp",
  subtitle: "Residential training programmes at Shiksha Mahakumbh.",
  accent: "emerald",
} as const;

export default function ResidentialCampPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <ResidentialCamp />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/BatonCeremony/page.tsx",
    content: `import PublicPageShell from "@/components/layouts/PublicPageShell";
import BatonCeremony from "../component/Baton";

const PAGE_HERO = {
  eyebrow: "Events",
  title: "Baton Ceremony",
  subtitle: "Ceremonial launch of Shiksha Mahakumbh editions.",
  accent: "saffron",
} as const;

export default function BatonCeremonyPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <BatonCeremony />
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/schoolprojectdisplaysubmission/page.tsx",
    content: `import PublicPageShell from "@/components/layouts/PublicPageShell";
import SchoolProjectForm from "../component/Registration/SchoolProjectForm";
import Marquees from "../component/Marquees";

const PAGE_HERO = {
  eyebrow: "Registration",
  title: "School Project Display",
  subtitle: "Submit school project displays for Shiksha Mahakumbh exhibition.",
  accent: "emerald",
} as const;

export default function SchoolProjectDisplayPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} skipContainer showCta={false}>
      <Marquees />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <SchoolProjectForm />
      </div>
    </PublicPageShell>
  );
}
`,
  },
  {
    file: "src/app/heiprojectdisplaysubmission/page.tsx",
    content: `import PublicPageShell from "@/components/layouts/PublicPageShell";
import HeiProjectForm from "../component/Registration/HeiProjectForm";
import Marquees from "../component/Marquees";

const PAGE_HERO = {
  eyebrow: "Registration",
  title: "HEI Project Display",
  subtitle: "Submit higher-education institution project displays.",
  accent: "emerald",
} as const;

export default function HeiProjectDisplayPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} skipContainer showCta={false}>
      <Marquees />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <HeiProjectForm />
      </div>
    </PublicPageShell>
  );
}
`,
  },
];

for (const { file, content } of migrations) {
  fs.writeFileSync(file, content);
  console.log("Wrote", file);
}

// proceeding1 shell replacement
for (const vol of ["proceeding1", "proceeding2", "proceeding3"]) {
  const file = `src/app/${vol}/page.tsx`;
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("CompanyInfo")) continue;

  const volNum = vol.replace("proceeding", "");
  const newHeader = `"use client";
import React from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
`;

  src = src.replace(/^"use client";\s*\nimport React from ['"]react['"];\s*\nimport CompanyInfo[\s\S]*?import NavBar[^\n]+\n/, newHeader);

  const compMatch = src.match(/import (Proceeding\d+) from/);
  const comp = compMatch?.[1] ?? "Proceeding1";

  src = src.replace(
    /export default function \w+\(\) \{\s*return \(\s*<div className="bg-white">[\s\S]*?<CompanyInfo[\s\S]*?<Footer\s*\/>\s*<\/div>\s*\);\s*\}/,
    `const PAGE_HERO = {
  eyebrow: "Publications",
  title: "Proceedings Volume ${volNum}",
  subtitle: "Research outcomes from Shiksha Mahakumbh editions.",
  accent: "navy",
} as const;

export default function ProceedingVolumePage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/proceedings">
      <${comp} ${src.includes("data={") ? "data={data}" : ""} />
    </PublicPageShell>
  );
}`
  );

  // proceeding1 has data import - fix the component line
  if (vol === "proceeding1") {
    src = src.replace(
      /export default function ProceedingVolumePage\(\) \{[\s\S]*?\}/,
      `export default function Proceeding1Page() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/proceedings">
      <Proceeding1 data={proceeding1Data} />
    </PublicPageShell>
  );
}`
    );
    if (!src.includes("proceeding1Data")) {
      src = src.replace(
        newHeader,
        `${newHeader}import Proceeding1 from "../component/Proceeding1";\nimport { proceeding1Data } from "@/content/proceedings/proceeding1-data";\n\n`
      );
    }
  }

  fs.writeFileSync(file, src);
  console.log("Patched", file);
}
