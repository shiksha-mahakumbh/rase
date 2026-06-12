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

type Category = { id: string; name: string };

export default function NoticeEditor({ noticeId }: { noticeId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!noticeId);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    isPinned: false,
    publishAt: "",
    expireAt: "",
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      try {
        const cats = await adminCmsFetch<{ items: Category[] }>("notices/categories");
        setCategories(cats.items ?? []);
        if (noticeId) {
          const data = await adminCmsFetch<{ notice: Record<string, unknown> }>(
            `notices/${noticeId}`
          );
          const n = data.notice;
          setForm({
            title: String(n.title ?? ""),
            description: String(n.description ?? ""),
            categoryId: String(n.categoryId ?? ""),
            isPinned: Boolean(n.isPinned),
            publishAt: n.publishAt
              ? new Date(String(n.publishAt)).toISOString().slice(0, 16)
              : "",
            expireAt: n.expireAt
              ? new Date(String(n.expireAt)).toISOString().slice(0, 16)
              : "",
            seoTitle: String((n.seo as { seoTitle?: string })?.seoTitle ?? ""),
            metaDescription: String(
              (n.seo as { metaDescription?: string })?.metaDescription ?? ""
            ),
          });
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load notice");
      } finally {
        setLoading(false);
      }
    })();
  }, [noticeId]);

  const save = async (publish = false) => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId || undefined,
        isPinned: form.isPinned,
        publishAt: form.publishAt ? new Date(form.publishAt).toISOString() : undefined,
        expireAt: form.expireAt ? new Date(form.expireAt).toISOString() : undefined,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      let id = noticeId;
      if (noticeId) {
        await adminCmsFetch(`notices/${noticeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const created = await adminCmsFetch<{ notice: { id: string } }>("notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        id = created.notice.id;
      }

      if (publish && id) {
        await adminCmsFetch(`notices/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "publish" }),
        });
      }

      toast.success(publish ? "Published" : "Saved");
      router.push(`/admin/cms/notices/${id}`);
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
        title={noticeId ? "Edit notice" : "Create notice"}
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => router.back()}>
              Back
            </AdminButton>
            <AdminButton onClick={() => save(false)} disabled={saving}>
              Save draft
            </AdminButton>
            <AdminButton onClick={() => save(true)} disabled={saving}>
              Publish
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
          <AdminTextarea
            label="Description"
            rows={10}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </AdminCard>
        <div className="space-y-4">
          <AdminCard className="space-y-4">
            <AdminSelect
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={[
                { value: "", label: "Uncategorized" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
              />
              Pin to top
            </label>
            <AdminInput
              label="Publish at"
              type="datetime-local"
              value={form.publishAt}
              onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
            />
            <AdminInput
              label="Expire at"
              type="datetime-local"
              value={form.expireAt}
              onChange={(e) => setForm({ ...form, expireAt: e.target.value })}
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
