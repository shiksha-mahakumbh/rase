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

type Notice = {
  id: string;
  title: string;
  slug: string;
  status: string;
  isPinned: boolean;
  publishAt: string | null;
  expireAt: string | null;
  category: { name: string } | null;
  updatedAt: string;
};

export default function NoticesAdminPage() {
  const [items, setItems] = useState<Notice[]>([]);
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
      const data = await adminCmsFetch<{
        items: Notice[];
        total: number;
      }>(`notices?${params}`);
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.slug.toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load notices");
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
          adminCmsFetch(`notices/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} notice(s)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await adminCmsFetch(`notices/${id}`, { method: "DELETE" });
      toast.success("Notice deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Notice Board"
        description="Create, schedule, publish, and archive campus notices."
        actions={
          <Link href="/admin/cms/notices/new">
            <AdminButton>Create notice</AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Title or slug…"
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
        <AdminEmpty message="No notices found. Create your first notice." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Notice board entries</caption>
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
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(n.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(n.id);
                        else next.delete(n.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${n.title}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/notices/${n.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {n.isPinned ? "📌 " : ""}
                      {n.title}
                    </Link>
                    <p className="text-xs text-slate-500">{n.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={n.status} />
                  </td>
                  <td className="px-4 py-3">{n.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {n.publishAt && <div>From {new Date(n.publishAt).toLocaleDateString()}</div>}
                    {n.expireAt && <div>Until {new Date(n.expireAt).toLocaleDateString()}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/notices/${n.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <a href={`/noticeboard#${n.slug}`} target="_blank" rel="noopener noreferrer">
                        <AdminButton size="sm" variant="ghost">
                          Preview
                        </AdminButton>
                      </a>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(n.id)}>
                        Delete
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <AdminPagination
              offset={offset}
              limit={limit}
              total={total}
              onPage={setOffset}
            />
          </div>
        </AdminCard>
      )}
    </div>
  );
}
