"use client";

import { useEffect, useState } from "react";
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
  AdminEmpty,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type Bar = {
  id: string;
  title: string;
  message: string;
  barType: string;
  colorTheme: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  isActive: boolean;
  isDismissible: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

export default function AnnouncementBarsPage() {
  const [items, setItems] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    message: "",
    barType: "global",
    colorTheme: "navy",
    ctaLabel: "",
    ctaUrl: "",
    isDismissible: true,
    startsAt: "",
    endsAt: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Bar[] }>("announcement-bars");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load bars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    try {
      await adminCmsFetch("announcement-bars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ctaLabel: form.ctaLabel || undefined,
          ctaUrl: form.ctaUrl || undefined,
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
          endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        }),
      });
      toast.success("Announcement bar created");
      setForm({ title: "", message: "", barType: "global", colorTheme: "navy", ctaLabel: "", ctaUrl: "", isDismissible: true, startsAt: "", endsAt: "" });
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    }
  };

  const toggle = async (id: string, isActive: boolean) => {
    try {
      await adminCmsFetch(`announcement-bars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this bar?")) return;
    try {
      await adminCmsFetch(`announcement-bars/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Announcement Bars" description="Ticker, modal, and registration alerts across the site." />

      <AdminCard className="mb-6 space-y-4">
        <h2 className="font-semibold text-brand-navy">Create bar</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminSelect
            label="Type"
            value={form.barType}
            onChange={(e) => setForm({ ...form, barType: e.target.value })}
            options={[
              { value: "global", label: "Global (welcome modal)" },
              { value: "registration_alert", label: "Registration alert (modal + ticker)" },
              { value: "deadline_reminder", label: "Deadline reminder (ticker)" },
              { value: "emergency", label: "Emergency (modal priority)" },
            ]}
          />
        </div>
        <AdminTextarea label="Message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="CTA label" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
          <AdminInput label="CTA URL" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} />
          <AdminInput label="Starts at" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          <AdminInput label="Ends at" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        </div>
        <AdminButton onClick={create}>Create bar</AdminButton>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No announcement bars." />
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <AdminCard key={b.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-brand-navy">{b.title}</h3>
                  <StatusBadge status={b.isActive ? "active" : "inactive"} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{b.message}</p>
                <p className="text-xs text-slate-400">{b.barType} · {b.colorTheme}</p>
              </div>
              <div className="flex gap-2">
                <AdminButton size="sm" variant="secondary" onClick={() => toggle(b.id, b.isActive)}>
                  {b.isActive ? "Deactivate" : "Activate"}
                </AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => remove(b.id)}>Delete</AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
