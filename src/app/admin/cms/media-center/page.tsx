"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type MediaEntry = {
  id: string;
  title: string | null;
  slug: string | null;
  mediaCenterCategory: string | null;
  status: string;
  url: string;
  isFeatured: boolean;
  publishAt: string | null;
  updatedAt: string;
};

const MEDIA_CATEGORIES = [
  "news",
  "press_release",
  "media_mention",
  "photo_gallery",
  "video",
  "interview",
  "publication",
] as const;

export default function MediaCenterAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<MediaEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    mediaCenterCategory: "news" as (typeof MEDIA_CATEGORIES)[number],
    excerpt: "",
    url: "",
    tags: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (status) params.set("status", status);
      const data = await adminCmsFetch<{ items: MediaEntry[]; total: number }>(
        `media-center?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (m) =>
            (m.title ?? "").toLowerCase().includes(q) ||
            (m.slug ?? "").toLowerCase().includes(q) ||
            m.url.toLowerCase().includes(q)
        );
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load media entries");
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
          adminCmsFetch(`media-center/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          })
        )
      );
      toast.success(`${action}ed ${selected.size} entry(ies)`);
      setSelected(new Set());
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this media entry?")) return;
    try {
      await adminCmsFetch(`media-center/${id}`, { method: "DELETE" });
      toast.success("Entry deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const create = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL required");
      return;
    }
    setCreating(true);
    try {
      const created = await adminCmsFetch<{ entry: { id: string } }>("media-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          mediaCenterCategory: form.mediaCenterCategory,
          excerpt: form.excerpt || undefined,
          url: form.url,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      toast.success("Entry created");
      setShowCreate(false);
      setForm({ title: "", mediaCenterCategory: "news", excerpt: "", url: "", tags: "" });
      router.push(`/admin/cms/media-center/${created.entry.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Center"
        description="Manage press releases, news, videos, and media mentions."
        actions={
          <AdminButton onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Cancel" : "Create entry"}
          </AdminButton>
        }
      />

      {showCreate && (
        <AdminCard className="mb-4 space-y-4">
          <h3 className="font-semibold text-brand-navy">New media entry</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <AdminSelect
              label="Category"
              value={form.mediaCenterCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  mediaCenterCategory: e.target.value as (typeof MEDIA_CATEGORIES)[number],
                })
              }
              options={MEDIA_CATEGORIES.map((c) => ({
                value: c,
                label: c.replace(/_/g, " "),
              }))}
            />
          </div>
          <AdminInput
            label="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <AdminTextarea
            label="Excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <AdminInput
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <AdminButton onClick={() => void create()} disabled={creating}>
            Create & edit
          </AdminButton>
        </AdminCard>
      )}

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="Title, slug, or URL…"
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
        <AdminEmpty message="No media entries found. Create your first entry." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Media center entries</caption>
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(m.id);
                        else next.delete(m.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${m.title ?? m.id}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cms/media-center/${m.id}`}
                      className="font-medium text-brand-navy hover:underline"
                    >
                      {m.isFeatured ? "⭐ " : ""}
                      {m.title ?? "Untitled"}
                    </Link>
                    <p className="text-xs text-slate-500 truncate max-w-[240px]">{m.url}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">
                    {(m.mediaCenterCategory ?? "—").replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/cms/media-center/${m.id}`}>
                        <AdminButton size="sm" variant="ghost">
                          Edit
                        </AdminButton>
                      </Link>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(m.id)}>
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
