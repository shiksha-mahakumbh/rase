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

type Partner = {
  id: string;
  name: string;
  slug: string | null;
  partnerCategory: string;
  status: string;
  website: string | null;
  isFeatured: boolean;
  updatedAt: string;
};

export default function PartnersAdminPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (status) params.set("status", status);
      const data = await adminCmsFetch<{ items: Partner[]; total: number }>(
        `partners?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.slug ?? "").toLowerCase().includes(q) ||
            p.partnerCategory.toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, [offset, status, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const bulkAction = async (action: "publish" | "archive") => {
    if (!selected.size) return;
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          adminCmsFetch(`partners/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} partner(s)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    try {
      await adminCmsFetch(`partners/${id}`, { method: "DELETE" });
      toast.success("Partner deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Partners"
        description="Manage sponsors, knowledge partners, and collaborators."
        actions={
          <Link href="/admin/cms/partners/new">
            <AdminButton>Create partner</AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AdminSelect
            label="Status"
            value={status}
            onChange={(e) => {
              setOffset(0);
              setStatus(e.target.value);
            }}
            options={[
              { value: "", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <div className="flex items-end gap-2 md:col-span-2">
            <AdminButton variant="secondary" onClick={() => bulkAction("publish")} disabled={!selected.size}>
              Publish selected
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => bulkAction("archive")} disabled={!selected.size}>
              Archive selected
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No partners found. Create your first partner." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Partners</caption>
            <thead className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? new Set(items.map((i) => i.id)) : new Set()
                      )
                    }
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(p.id);
                        else next.delete(p.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${p.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/partners/${p.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {p.isFeatured ? "⭐ " : ""}
                      {p.name}
                    </Link>
                    {p.website && (
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.website}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 capitalize">{p.partnerCategory}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/partners/${p.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(p.id)}>
                        Delete
                      </AdminButton>
                    </div>
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
