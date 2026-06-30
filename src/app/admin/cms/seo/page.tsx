"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { robotsToFlags } from "@/lib/seo/robots-meta";
import SeoPreview from "@/components/admin/cms/SeoPreview";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLocaleSelect,
  useCmsCanMutate,
} from "@/components/admin/cms/AdminUi";

export default function SeoManagerPage() {
  const canMutate = useCmsCanMutate();
  const [locale, setLocale] = useState("en");
  const [entityType, setEntityType] = useState("page");
  const [entityId, setEntityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    seoTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    twitterCard: "summary_large_image",
    schemaJsonLd: "",
  });

  const load = async () => {
    if (!entityId.trim()) return;
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ seo: Record<string, unknown> | null }>(
        `seo/${entityType}/${entityId}?locale=${locale}`
      );
      const s = data.seo ?? {};
      const flags = robotsToFlags(typeof s.robots === "string" ? s.robots : undefined);
      setForm({
        seoTitle: String(s.seoTitle ?? ""),
        metaDescription: String(s.metaDescription ?? ""),
        metaKeywords: Array.isArray(s.metaKeywords) ? (s.metaKeywords as string[]).join(", ") : "",
        canonicalUrl: String(s.canonicalUrl ?? ""),
        robotsIndex: s.robotsIndex !== undefined ? Boolean(s.robotsIndex) : flags.index,
        robotsFollow: s.robotsFollow !== undefined ? Boolean(s.robotsFollow) : flags.follow,
        ogTitle: String(s.ogTitle ?? ""),
        ogDescription: String(s.ogDescription ?? ""),
        ogImageUrl: String(s.ogImageUrl ?? ""),
        twitterCard: String(s.twitterCard ?? "summary_large_image"),
        schemaJsonLd: s.schemaJsonLd ? JSON.stringify(s.schemaJsonLd, null, 2) : "",
      });
      toast.success("SEO loaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!entityId.trim() || !canMutate) return;
    try {
      let schemaJsonLd: unknown;
      if (form.schemaJsonLd.trim()) {
        schemaJsonLd = JSON.parse(form.schemaJsonLd);
      }
      await adminCmsFetch(`seo/${entityType}/${entityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          seoTitle: form.seoTitle,
          metaDescription: form.metaDescription,
          metaKeywords: form.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          canonicalUrl: form.canonicalUrl,
          robotsIndex: form.robotsIndex,
          robotsFollow: form.robotsFollow,
          ogTitle: form.ogTitle,
          ogDescription: form.ogDescription,
          ogImageUrl: form.ogImageUrl,
          twitterCard: form.twitterCard,
          schemaJsonLd,
        }),
      });
      toast.success("SEO saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="SEO Manager"
        description="Edit metadata, OpenGraph, Twitter Cards, and JSON-LD for any CMS entity."
        actions={
          canMutate ? <AdminButton onClick={save}>Save SEO</AdminButton> : undefined
        }
      />

      <AdminCard className="mb-6">
        <div className="grid gap-3 md:grid-cols-5">
          <AdminLocaleSelect value={locale} onChange={setLocale} />
          <AdminSelect
            label="Entity type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={[
              { value: "page", label: "Page" },
              { value: "notice", label: "Notice" },
              { value: "download", label: "Download" },
            ]}
          />
          <AdminInput
            label="Entity ID"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="UUID from CMS module"
          />
          <div className="flex items-end md:col-span-2">
            <AdminButton variant="secondary" onClick={load} disabled={loading}>
              {loading ? "Loading…" : "Load SEO"}
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="mb-6">
        <SeoPreview
          title={form.ogTitle || form.seoTitle}
          description={form.ogDescription || form.metaDescription}
          url={form.canonicalUrl}
          imageUrl={form.ogImageUrl}
        />
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Basic metadata</h2>
          <AdminInput label="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} disabled={!canMutate} />
          <AdminTextarea label="Meta description" rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} disabled={!canMutate} />
          <AdminInput label="Keywords (comma-separated)" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} disabled={!canMutate} />
          <AdminInput label="Canonical URL" value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} disabled={!canMutate} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.robotsIndex} disabled={!canMutate} onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })} />
            Allow indexing
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.robotsFollow} disabled={!canMutate} onChange={(e) => setForm({ ...form, robotsFollow: e.target.checked })} />
            Allow following links
          </label>
        </AdminCard>
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Social & schema</h2>
          <AdminInput label="OG title" value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} disabled={!canMutate} />
          <AdminTextarea label="OG description" rows={2} value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} disabled={!canMutate} />
          <AdminInput label="OG image URL" value={form.ogImageUrl} onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })} disabled={!canMutate} />
          <AdminSelect
            label="Twitter card"
            value={form.twitterCard}
            onChange={(e) => setForm({ ...form, twitterCard: e.target.value })}
            disabled={!canMutate}
            options={[
              { value: "summary_large_image", label: "Summary large image" },
              { value: "summary", label: "Summary" },
            ]}
          />
          <AdminTextarea
            label="JSON-LD schema"
            rows={8}
            className="font-mono text-xs"
            value={form.schemaJsonLd}
            onChange={(e) => setForm({ ...form, schemaJsonLd: e.target.value })}
            disabled={!canMutate}
          />
        </AdminCard>
      </div>
    </div>
  );
}
