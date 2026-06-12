"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type Page = {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  status: string;
  locale: string;
  updatedAt: string;
};

export default function PagesAdminPage() {
  const [items, setItems] = useState<Page[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (status) params.set("status", status);
      const data = await adminCmsFetch<{ items: Page[]; total: number }>(`pages?${params}`);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }, [offset, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="CMS Pages"
        description="Generic pages with sections and revisions. Homepage is managed separately."
        actions={
          <Link href="/admin/cms/pages/new">
            <AdminButton>Create page</AdminButton>
          </Link>
        }
      />
      <AdminCard className="mb-4">
        <AdminSelect
          label="Status filter"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setOffset(0); }}
          options={[
            { value: "", label: "All" },
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No pages found." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">CMS pages list</caption>
            <thead className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">/{p.slug}</td>
                  <td className="px-4 py-3">{p.pageType}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/cms/pages/${p.id}`}>
                      <AdminButton size="sm" variant="ghost">Edit</AdminButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
          </div>
        </AdminCard>
      )}
    </div>
  );
}
