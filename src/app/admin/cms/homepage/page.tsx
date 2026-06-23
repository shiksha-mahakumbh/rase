"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminTextarea,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

type Section = {
  sectionKey: string;
  title: string | null;
  content: Record<string, unknown>;
  isVisible: boolean;
};

const SECTION_HINTS: Record<string, string> = {
  hero: '{"headline":"","subheadline":"","description":"","badge":"","dates":"","venue":"","imageUrl":""}',
  stats: '{"tagline":"","features":[],"faqs":[],"logos":[]}',
  counters: '{"items":[{"label":"","value":"","suffix":""}]}',
  featured_events: '{"items":[{"title":"","date":"","venue":"","url":""}]}',
  featured_programs: '{"items":[{"title":"","description":"","url":"","badge":""}]}',
  testimonials: '{"items":[{"name":"","role":"","quote":""}]}',
  partners:
    '{"items":[{"name":"","logoUrl":"","website":"","type":"academic|media|sponsor"}]} — prefer /admin/cms/partners (published DB partners override this JSON)',
  announcements: '{"items":[{"title":"","body":"","detail":"","url":"","cta":""}]}',
  gallery: '{"items":[{"src":"","alt":"","legend":""}]}',
  cta: '{"editionLabel":"","headline":"","body":"","buttonLabel":"","buttonUrl":"","travel":[]}',
};

export default function HomepageAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionKeys, setSectionKeys] = useState<string[]>([]);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [activeKey, setActiveKey] = useState("hero");
  const [pageStatus, setPageStatus] = useState("draft");

  useEffect(() => {
    void (async () => {
      try {
        const data = await adminCmsFetch<{
          page: { status: string; sections: Section[] };
          sectionKeys: string[];
        }>("homepage?locale=en");
        setSectionKeys(data.sectionKeys ?? []);
        setPageStatus(data.page?.status ?? "draft");
        const map: Record<string, string> = {};
        for (const s of data.page?.sections ?? []) {
          map[s.sectionKey] = JSON.stringify(s.content ?? {}, null, 2);
        }
        for (const key of data.sectionKeys ?? []) {
          if (!map[key]) map[key] = SECTION_HINTS[key] ?? "{}";
        }
        setSections(map);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load homepage");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSection = async () => {
    setSaving(true);
    try {
      let content: Record<string, unknown>;
      try {
        content = JSON.parse(sections[activeKey] ?? "{}") as Record<string, unknown>;
      } catch {
        toast.error("Invalid JSON in section content");
        return;
      }
      await adminCmsFetch("homepage/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: activeKey, content, locale: "en" }),
      });
      toast.success(`Saved ${activeKey} section`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    try {
      await adminCmsFetch("homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", locale: "en" }),
      });
      setPageStatus("published");
      toast.success("Homepage published");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Homepage CMS"
        description={`Edit homepage sections. Status: ${pageStatus}.`}
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <AdminButton variant="secondary">Preview site</AdminButton>
            </a>
            <AdminButton onClick={saveSection} disabled={saving}>
              Save section
            </AdminButton>
            <AdminButton onClick={publish}>Publish homepage</AdminButton>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="space-y-1 p-3">
          {sectionKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                activeKey === key
                  ? "bg-brand-navy text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {key.replace(/_/g, " ")}
            </button>
          ))}
        </AdminCard>
        <AdminCard className="lg:col-span-3">
          <h2 className="mb-2 font-semibold capitalize text-brand-navy">
            {activeKey.replace(/_/g, " ")}
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Edit JSON content. Invalid JSON will be rejected on save.
          </p>
          <AdminTextarea
            rows={22}
            className="font-mono text-xs"
            value={sections[activeKey] ?? "{}"}
            onChange={(e) =>
              setSections({ ...sections, [activeKey]: e.target.value })
            }
          />
        </AdminCard>
      </div>
    </div>
  );
}
