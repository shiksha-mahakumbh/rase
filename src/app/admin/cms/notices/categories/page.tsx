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
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/cms/AdminUi";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

export default function NoticeCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Category[] }>("notices/categories");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    try {
      await adminCmsFetch("notices/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description || undefined,
        }),
      });
      toast.success("Category created");
      setForm({ name: "", slug: "", description: "" });
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Notice Categories"
        description="Organize notices with category badges on the public noticeboard."
      />
      <AdminCard className="mb-6 space-y-4">
        <h2 className="font-semibold text-brand-navy">Create category</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <AdminInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <AdminInput
            label="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <div className="flex items-end">
            <AdminButton onClick={create}>Add category</AdminButton>
          </div>
        </div>
        <AdminTextarea
          label="Description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No categories yet." />
      ) : (
        <AdminCard>
          <ul className="divide-y">
            {items.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-brand-navy">{c.name}</p>
                  <p className="text-xs text-slate-500">/{c.slug}</p>
                </div>
                <span className="text-xs text-slate-400">Order {c.sortOrder}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  );
}
