"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import ProceedingVolumeShowcase from "@/components/proceedings/ProceedingVolumeShowcase";
import ProceedingVolumeJsonLd from "@/components/proceedings/ProceedingVolumeJsonLd";
import { proceeding1Data } from "@/content/proceedings/proceeding1-data";
import { getProceedingVolumeByPath } from "@/data/proceedings-hub";

const volume = getProceedingVolumeByPath("/proceeding1")!;

export default function Proceeding1Page() {
  return (
    <PublicPageShell
      showHero={false}
      relatedPath="/proceedings"
      skipContainer
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Proceedings", path: "/proceedings" },
        { name: `Volume ${volume.volume}`, path: volume.readHref },
      ]}
    >
      <ProceedingVolumeJsonLd volume={volume} />
      <ProceedingVolumeShowcase volume={volume} data={proceeding1Data} />
    </PublicPageShell>
  );
}
