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

type Committee = {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  edition: string | null;
  locale: string;
  updatedAt: string;
  _count?: { members: number };
};

export default function CommitteesAdminPage() {
  const [items, setItems] = useState<Committee[]>([]);
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
      const data = await adminCmsFetch<{ items: Committee[]; total: number }>(
        `committees?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load committees");
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
          adminCmsFetch(`committees/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} committee(s)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this committee?")) return;
    try {
      await adminCmsFetch(`committees/${id}`, { method: "DELETE" });
      toast.success("Committee deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Committees"
        description="Manage organizing, advisory, and technical committees."
        actions={
          <Link href="/admin/cms/committees/new">
            <AdminButton>Create committee</AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Name, slug, or category…"
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
              { value: "scheduled", label: "Scheduled" },
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
        <AdminEmpty message="No committees found. Create your first committee." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Committees</caption>
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
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(c.id);
                        else next.delete(c.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${c.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/committees/${c.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="text-xs text-slate-500">{c.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-xs">{c.category.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">{c._count?.members ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/committees/${c.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(c.id)}>
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
