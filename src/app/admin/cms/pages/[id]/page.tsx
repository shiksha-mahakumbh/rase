"use client";

import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", status: "draft" });

  useEffect(() => {
    void (async () => {
      try {
        const data = await adminCmsFetch<{ page: Record<string, unknown> }>(`pages/${id}`);
        const p = data.page;
        setForm({
          title: String(p.title ?? ""),
          slug: String(p.slug ?? ""),
          excerpt: String(p.excerpt ?? ""),
          content: String(p.content ?? ""),
          status: String(p.status ?? "draft"),
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load page");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (action?: "publish" | "archive") => {
    try {
      const body = action
        ? { action }
        : {
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt,
            content: form.content,
          };
      const res = await adminCmsFetch<{ page: { status: string } }>(`pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.page?.status) setForm((f) => ({ ...f, status: res.page.status }));
      toast.success(action ? `${action}ed` : "Saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Edit page"
        description={`Status: ${form.status}`}
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => save()}>Save</AdminButton>
            <AdminButton onClick={() => save("publish")}>Publish</AdminButton>
            <AdminButton variant="danger" onClick={() => save("archive")}>Archive</AdminButton>
          </>
        }
      />
      <AdminCard className="space-y-4">
        <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <AdminInput label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <AdminTextarea label="Excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <AdminTextarea label="Content" rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </AdminCard>
    </div>
  );
}
