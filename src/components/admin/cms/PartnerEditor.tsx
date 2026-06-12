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

const PARTNER_CATEGORIES = [
  "academic",
  "knowledge",
  "industry",
  "media",
  "csr",
  "government",
  "ngo",
  "international",
  "technology",
  "research",
  "other",
] as const;

export default function PartnerEditor({ partnerId }: { partnerId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!partnerId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
    description: "",
    partnerCategory: "other" as (typeof PARTNER_CATEGORIES)[number],
    locale: "en",
    isFeatured: false,
    sortOrder: "0",
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      if (!partnerId) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminCmsFetch<{ partner: Record<string, unknown> }>(
          `partners/${partnerId}`
        );
        const p = data.partner;
        setForm({
          name: String(p.name ?? ""),
          logoUrl: String(p.logoUrl ?? ""),
          website: String(p.website ?? ""),
          description: String(p.description ?? ""),
          partnerCategory: String(p.partnerCategory ?? "other") as (typeof PARTNER_CATEGORIES)[number],
          locale: String(p.locale ?? "en"),
          isFeatured: Boolean(p.isFeatured),
          sortOrder: String(p.sortOrder ?? 0),
          seoTitle: "",
          metaDescription: "",
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load partner");
      } finally {
        setLoading(false);
      }
    })();
  }, [partnerId]);

  const save = async (action?: "publish" | "archive") => {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        logoUrl: form.logoUrl || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
        partnerCategory: form.partnerCategory,
        locale: form.locale,
        isFeatured: form.isFeatured,
        sortOrder: Number(form.sortOrder) || 0,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      let id = partnerId;
      if (partnerId) {
        await adminCmsFetch(`partners/${partnerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const created = await adminCmsFetch<{ partner: { id: string } }>("partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        id = created.partner.id;
      }

      if (action && id) {
        await adminCmsFetch(`partners/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        toast.success(action === "publish" ? "Published" : "Archived");
      } else {
        toast.success("Saved");
      }

      router.push(`/admin/cms/partners/${id}`);
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
        title={partnerId ? "Edit partner" : "Create partner"}
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
            {partnerId && (
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
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <AdminInput
            label="Logo URL"
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          />
          <AdminInput
            label="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
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
              value={form.partnerCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  partnerCategory: e.target.value as (typeof PARTNER_CATEGORIES)[number],
                })
              }
              options={PARTNER_CATEGORIES.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured partner
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
