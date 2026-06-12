"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

const MEDIA_CATEGORIES = [
  "news",
  "press_release",
  "media_mention",
  "photo_gallery",
  "video",
  "interview",
  "publication",
] as const;

const MEDIA_TYPES = [
  "image",
  "video",
  "document",
  "press_release",
  "interview",
  "publication",
] as const;

export default function EditMediaCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    mediaCenterCategory: "news" as (typeof MEDIA_CATEGORIES)[number],
    mediaType: "document" as (typeof MEDIA_TYPES)[number],
    excerpt: "",
    description: "",
    url: "",
    tags: "",
    locale: "en",
    isFeatured: false,
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await adminCmsFetch<{ entry: Record<string, unknown> }>(
          `media-center/${id}`
        );
        const e = data.entry;
        setForm({
          title: String(e.title ?? ""),
          mediaCenterCategory: String(
            e.mediaCenterCategory ?? "news"
          ) as (typeof MEDIA_CATEGORIES)[number],
          mediaType: String(e.mediaType ?? "document") as (typeof MEDIA_TYPES)[number],
          excerpt: String(e.excerpt ?? ""),
          description: String(e.description ?? ""),
          url: String(e.url ?? ""),
          tags: Array.isArray(e.tags) ? (e.tags as string[]).join(", ") : "",
          locale: String(e.locale ?? "en"),
          isFeatured: Boolean(e.isFeatured),
          seoTitle: "",
          metaDescription: "",
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load entry");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (action?: "publish" | "archive") => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        mediaCenterCategory: form.mediaCenterCategory,
        mediaType: form.mediaType,
        excerpt: form.excerpt || undefined,
        description: form.description || undefined,
        url: form.url,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        locale: form.locale,
        isFeatured: form.isFeatured,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      await adminCmsFetch(`media-center/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (action) {
        await adminCmsFetch(`media-center/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        toast.success(action === "publish" ? "Published" : "Archived");
      } else {
        toast.success("Saved");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Edit media entry"
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => router.back()}>
              Back
            </AdminButton>
            <AdminButton onClick={() => save()} disabled={saving}>
              Save draft
            </AdminButton>
            <AdminButton onClick={() => save("publish")} disabled={saving}>
              Publish
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => save("archive")} disabled={saving}>
              Archive
            </AdminButton>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2 space-y-4">
          <AdminInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <AdminInput
            label="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <AdminTextarea
            label="Excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <AdminTextarea
            label="Description"
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </AdminCard>
        <div className="space-y-4">
          <AdminCard className="space-y-4">
            <AdminSelect
              label="Category"
              value={form.mediaCenterCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  mediaCenterCategory: e.target.value as (typeof MEDIA_CATEGORIES)[number],
                })
              }
              options={MEDIA_CATEGORIES.map((c) => ({
                value: c,
                label: c.replace(/_/g, " "),
              }))}
            />
            <AdminSelect
              label="Media type"
              value={form.mediaType}
              onChange={(e) =>
                setForm({
                  ...form,
                  mediaType: e.target.value as (typeof MEDIA_TYPES)[number],
                })
              }
              options={MEDIA_TYPES.map((t) => ({
                value: t,
                label: t.replace(/_/g, " "),
              }))}
            />
            <AdminSelect
              label="Locale"
              value={form.locale}
              onChange={(e) => setForm({ ...form, locale: e.target.value })}
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "Hindi" },
              ]}
            />
            <AdminInput
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured entry
            </label>
          </AdminCard>
          <AdminCard className="space-y-4">
            <h3 className="font-semibold text-brand-navy">SEO</h3>
            <AdminInput
              label="SEO title"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />
            <AdminTextarea
              label="Meta description"
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
