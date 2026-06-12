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

const EVENT_CATEGORIES = [
  "summit",
  "conclave",
  "workshop",
  "olympiad",
  "exhibition",
  "ceremony",
  "other",
] as const;

export default function EventEditor({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!eventId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other" as (typeof EVENT_CATEGORIES)[number],
    venue: "",
    location: "",
    startDate: "",
    endDate: "",
    bannerUrl: "",
    registrationLink: "",
    edition: "",
    locale: "en",
    isFeatured: false,
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminCmsFetch<{ event: Record<string, unknown> }>(
          `events/${eventId}`
        );
        const e = data.event;
        const start = e.startDate ?? e.eventDate;
        setForm({
          title: String(e.title ?? ""),
          description: String(e.description ?? ""),
          category: String(e.category ?? "other") as (typeof EVENT_CATEGORIES)[number],
          venue: String(e.venue ?? ""),
          location: String(e.location ?? ""),
          startDate: start
            ? new Date(String(start)).toISOString().slice(0, 16)
            : "",
          endDate: e.endDate
            ? new Date(String(e.endDate)).toISOString().slice(0, 16)
            : "",
          bannerUrl: String(e.bannerUrl ?? ""),
          registrationLink: String(e.registrationLink ?? ""),
          edition: String(e.edition ?? ""),
          locale: String(e.locale ?? "en"),
          isFeatured: Boolean(e.isFeatured),
          seoTitle: "",
          metaDescription: "",
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const save = async (action?: "publish" | "archive") => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        venue: form.venue || undefined,
        location: form.location || undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        bannerUrl: form.bannerUrl || undefined,
        registrationLink: form.registrationLink || undefined,
        edition: form.edition || undefined,
        locale: form.locale,
        isFeatured: form.isFeatured,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      let id = eventId;
      if (eventId) {
        await adminCmsFetch(`events/${eventId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const created = await adminCmsFetch<{ event: { id: string } }>("events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        id = created.event.id;
      }

      if (action && id) {
        await adminCmsFetch(`events/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        toast.success(action === "publish" ? "Published" : "Archived");
      } else {
        toast.success("Saved");
      }

      router.push(`/admin/cms/events/${id}`);
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
        title={eventId ? "Edit event" : "Create event"}
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
            {eventId && (
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
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <AdminTextarea
            label="Description"
            rows={8}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <AdminInput
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Start date"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <AdminInput
              label="End date"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <AdminInput
            label="Banner URL"
            value={form.bannerUrl}
            onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
          />
          <AdminInput
            label="Registration link"
            value={form.registrationLink}
            onChange={(e) => setForm({ ...form, registrationLink: e.target.value })}
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
                  category: e.target.value as (typeof EVENT_CATEGORIES)[number],
                })
              }
              options={EVENT_CATEGORIES.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured event
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
