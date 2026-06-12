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

type Speaker = {
  id: string;
  fullName: string;
  slug: string;
  category: string;
  status: string;
  institution: string | null;
  isFeatured: boolean;
  updatedAt: string;
};

export default function SpeakersAdminPage() {
  const [items, setItems] = useState<Speaker[]>([]);
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
      const data = await adminCmsFetch<{ items: Speaker[]; total: number }>(
        `speakers?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.slug.toLowerCase().includes(q) ||
            (s.institution ?? "").toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load speakers");
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
          adminCmsFetch(`speakers/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} speaker(s)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this speaker?")) return;
    try {
      await adminCmsFetch(`speakers/${id}`, { method: "DELETE" });
      toast.success("Speaker deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Speakers"
        description="Manage keynote, plenary, and guest speaker profiles."
        actions={
          <Link href="/admin/cms/speakers/new">
            <AdminButton>Create speaker</AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Name, slug, or institution…"
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
        <AdminEmpty message="No speakers found. Create your first speaker." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Speakers</caption>
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
              {items.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(s.id);
                        else next.delete(s.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${s.fullName}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/speakers/${s.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {s.isFeatured ? "⭐ " : ""}
                      {s.fullName}
                    </Link>
                    <p className="text-xs text-slate-500">{s.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 capitalize">{s.category.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/speakers/${s.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(s.id)}>
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
