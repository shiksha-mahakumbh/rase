"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/cms/AdminUi";

const PAGE_TYPES = [
  { value: "static", label: "Static page" },
  { value: "article", label: "Press article" },
  { value: "policy", label: "Legal / policy" },
  { value: "department", label: "Department" },
  { value: "about", label: "About" },
  { value: "custom", label: "Custom" },
];

function NewPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("pageType") ?? "static";

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    pageType: defaultType,
    locale: "en",
    excerpt: "",
    content: "",
  });

  const create = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await adminCmsFetch<{ page: { id: string } }>("pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          pageType: form.pageType,
          locale: form.locale,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
          status: "draft",
        }),
      });
      toast.success("Page created");
      router.push(`/admin/cms/pages/${res.page.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Create page"
        description="New CMS page — you can add sections and publish after creation."
      />
      <AdminCard className="max-w-2xl space-y-4">
        <AdminInput
          label="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <AdminInput
          label="Slug (optional — auto-generated from title)"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Page type"
            value={form.pageType}
            onChange={(e) => setForm((f) => ({ ...f, pageType: e.target.value }))}
            options={PAGE_TYPES}
          />
          <AdminSelect
            label="Locale"
            value={form.locale}
            onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
            options={[
              { value: "en", label: "English" },
              { value: "hi", label: "Hindi" },
            ]}
          />
        </div>
        <AdminTextarea
          label="Excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
        <AdminTextarea
          label="Content"
          rows={8}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
        <AdminButton onClick={create} disabled={saving}>
          {saving ? "Creating…" : "Create page"}
        </AdminButton>
      </AdminCard>
    </div>
  );
}

export default function NewPageAdminPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading…</div>}>
      <NewPageForm />
    </Suspense>
  );
}
