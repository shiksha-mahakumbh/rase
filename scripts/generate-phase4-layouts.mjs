import fs from "fs";
import path from "path";

const root = "src/app";

const pressLayouts = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
  (n) => `Press${n}`
);

const publicationRoutes = ["books", "proceeding1", "proceeding2", "proceeding3", "fulllengthpaper", "Topics", "donation", "feedback", "Press_Release", "shikshamahakumbh", "shikshakumbh"];

const committeeSlugs = [
  ["shikshamahakumbh2024", "Shiksha Mahakumbh 2024", "2024"],
  ["shikshamahakumbh2023", "Shiksha Mahakumbh 2023", "2023"],
  ["shikshakumbh2024", "Shiksha Kumbh 2024", "2024"],
  ["shikshakumbh2023", "Shiksha Kumbh 2023", "2023"],
];

const datadekhPaths = [
  "participantregistrationdatadekh",
  "volunteerdatadekh",
  "volunteerregistrationdatadekh",
  "ngoregistrationdatadekh",
  "abstractdatadekh",
  "fulllengthdatadekh",
  "fulllengthpaperdatadekh",
  "organiserdatadekh",
  "schooldata",
  "Talentdata",
  "Conclavedata",
  "Bestpracticedata",
  "accomodationdata",
  "DelegateForm",
  "heiprojectregistrationdata",
  "AllData",
  "noticeboarddata",
];

function writeLayout(dir, content) {
  const file = path.join(root, dir, "layout.tsx");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) return;
  fs.writeFileSync(file, content);
  console.log("created", file);
}

for (const n of pressLayouts) {
  writeLayout(
    n,
    `import { pressArticleMeta } from "@/lib/seo/publicPages";

export const metadata = pressArticleMeta(${String(n)});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`
  );
}

for (const key of publicationRoutes) {
  const metaKey = key === "Press_Release" ? "pressRelease" : key === "Topics" ? "topics" : key === "fulllengthpaper" ? "fulllengthpaper" : key;
  writeLayout(
    key,
    `import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.${metaKey};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`
  );
}

writeLayout(
  "committee",
  `export default function CommitteeGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`
);

for (const [slug, edition, year] of committeeSlugs) {
  writeLayout(
    `committee/${slug}`,
    `import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta("${slug}", "${edition}", "${year}");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committeepage" },
          { name: "${edition}", path: "/committee/${slug}" },
        ]}
      />
      {children}
    </>
  );
}
`
  );
}

for (const segment of datadekhPaths) {
  writeLayout(
    segment,
    `import { datadekhMeta } from "@/lib/seo/publicPages";

export const metadata = datadekhMeta("${segment}");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`
  );
}

writeLayout(
  "admin",
  `import { NO_INDEX_META } from "@/lib/seo/publicPages";

export const metadata = NO_INDEX_META.admin;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`
);

console.log("done");
