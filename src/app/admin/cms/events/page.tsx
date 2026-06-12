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

type Event = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  venue: string | null;
  startDate: string | null;
  isFeatured: boolean;
  updatedAt: string;
};

export default function EventsAdminPage() {
  const [items, setItems] = useState<Event[]>([]);
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
      const data = await adminCmsFetch<{ items: Event[]; total: number }>(
        `events?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.slug.toLowerCase().includes(q) ||
            (e.venue ?? "").toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load events");
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
          adminCmsFetch(`events/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} event(s)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await adminCmsFetch(`events/${id}`, { method: "DELETE" });
      toast.success("Event deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Events"
        description="Manage summits, workshops, ceremonies, and exhibitions."
        actions={
          <Link href="/admin/cms/events/new">
            <AdminButton>Create event</AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Title, slug, or venue…"
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
              { value: "unpublished", label: "Unpublished" },
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
        <AdminEmpty message="No events found. Create your first event." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Events</caption>
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
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      onChange={(ev) => {
                        const next = new Set(selected);
                        if (ev.target.checked) next.add(e.id);
                        else next.delete(e.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${e.title}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/events/${e.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {e.isFeatured ? "⭐ " : ""}
                      {e.title}
                    </Link>
                    <p className="text-xs text-slate-500">{e.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {e.startDate
                      ? new Date(e.startDate).toLocaleDateString()
                      : "—"}
                    {e.venue && <div>{e.venue}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/events/${e.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(e.id)}>
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
