"use client";

import { useEffect, useState } from "react";
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

const SPEAKER_CATEGORIES = ["keynote", "plenary", "track_chair", "panelist", "guest", "other"] as const;

export default function SpeakerEditor({ speakerId }: { speakerId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!speakerId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    title: "",
    designation: "",
    institution: "",
    country: "",
    bio: "",
    photoUrl: "",
    category: "other" as (typeof SPEAKER_CATEGORIES)[number],
    edition: "",
    locale: "en",
    topics: "",
    tags: "",
    isFeatured: false,
    sortOrder: "0",
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      if (!speakerId) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminCmsFetch<{ speaker: Record<string, unknown> }>(
          `speakers/${speakerId}`
        );
        const s = data.speaker;
        setForm({
          fullName: String(s.fullName ?? ""),
          title: String(s.title ?? ""),
          designation: String(s.designation ?? ""),
          institution: String(s.institution ?? ""),
          country: String(s.country ?? ""),
          bio: String(s.bio ?? ""),
          photoUrl: String(s.photoUrl ?? ""),
          category: String(s.category ?? "other") as (typeof SPEAKER_CATEGORIES)[number],
          edition: String(s.edition ?? ""),
          locale: String(s.locale ?? "en"),
          topics: Array.isArray(s.topics) ? (s.topics as string[]).join(", ") : "",
          tags: Array.isArray(s.tags) ? (s.tags as string[]).join(", ") : "",
          isFeatured: Boolean(s.isFeatured),
          sortOrder: String(s.sortOrder ?? 0),
          seoTitle: "",
          metaDescription: "",
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load speaker");
      } finally {
        setLoading(false);
      }
    })();
  }, [speakerId]);

  const save = async (action?: "publish" | "archive") => {
    setSaving(true);
    try {
      const body = {
        fullName: form.fullName,
        title: form.title || undefined,
        designation: form.designation || undefined,
        institution: form.institution || undefined,
        country: form.country || undefined,
        bio: form.bio || undefined,
        photoUrl: form.photoUrl || undefined,
        category: form.category,
        edition: form.edition || undefined,
        locale: form.locale,
        topics: form.topics ? form.topics.split(",").map((t) => t.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        isFeatured: form.isFeatured,
        sortOrder: Number(form.sortOrder) || 0,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      let id = speakerId;
      if (speakerId) {
        await adminCmsFetch(`speakers/${speakerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const created = await adminCmsFetch<{ speaker: { id: string } }>("speakers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        id = created.speaker.id;
      }

      if (action && id) {
        await adminCmsFetch(`speakers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        toast.success(action === "publish" ? "Published" : "Archived");
      } else {
        toast.success("Saved");
      }

      router.push(`/admin/cms/speakers/${id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title={speakerId ? "Edit speaker" : "Create speaker"}
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
            {speakerId && (
              <AdminButton variant="secondary" onClick={() => save("archive")} disabled={saving}>
                Archive
              </AdminButton>
            )}
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2 space-y-4">
          <AdminInput
            label="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <AdminInput
              label="Designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Institution"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
            />
            <AdminInput
              label="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <AdminTextarea
            label="Bio"
            rows={8}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <AdminInput
            label="Photo URL"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          />
        </AdminCard>
        <div className="space-y-4">
          <AdminCard className="space-y-4">
            <AdminSelect
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as (typeof SPEAKER_CATEGORIES)[number],
                })
              }
              options={SPEAKER_CATEGORIES.map((c) => ({
                value: c,
                label: c.replace(/_/g, " "),
              }))}
            />
            <AdminInput
              label="Edition"
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
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
              label="Topics (comma-separated)"
              value={form.topics}
              onChange={(e) => setForm({ ...form, topics: e.target.value })}
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
              Featured speaker
            </label>
            <AdminInput
              label="Sort order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
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
