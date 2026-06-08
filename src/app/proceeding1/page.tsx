"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import Proceeding1 from "../component/Proceeding1";
import { proceeding1Data } from "@/content/proceedings/proceeding1-data";

const PAGE_HERO = {
  eyebrow: "Publications",
  title: "Proceedings Volume I",
  subtitle: "Research outcomes from Shiksha Mahakumbh editions.",
  accent: "navy",
} as const;

export default function Proceeding1Page() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/proceedings">
      <Proceeding1 data={proceeding1Data} />
    </PublicPageShell>
  );
}
