"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch, adminCmsUpload } from "@/lib/admin-cms-api";
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
  AdminSafeExternalLink,
} from "@/components/admin/cms/AdminUi";

type Download = {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  downloadType: string;
  downloadCount: number;
  status: string;
  fileUrl: string;
};

export default function DownloadsAdminPage() {
  const [items, setItems] = useState<Download[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    downloadType: "brochure",
    tags: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await adminCmsFetch<{ items: Download[]; total: number }>(
        `downloads?${params}`
      );
      let rows = data.items ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter((d) => d.title.toLowerCase().includes(q));
      }
      setItems(rows);
      setTotal(data.total ?? rows.length);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load downloads");
    } finally {
      setLoading(false);
    }
  }, [offset, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !form.title.trim()) {
      toast.error("Title and file required");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("downloadType", form.downloadType);
      fd.append("tags", form.tags);
      await adminCmsUpload("downloads", fd);
      toast.success("Download uploaded");
      setForm({ title: "", description: "", category: "", downloadType: "brochure", tags: "" });
      if (fileRef.current) fileRef.current.value = "";
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this download?")) return;
    try {
      await adminCmsFetch(`downloads/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Downloads Center"
        description="Upload brochures, reports, guidelines, and circulars."
        actions={
          <a href="/downloads" target="_blank" rel="noopener noreferrer">
            <AdminButton variant="secondary">Preview public page</AdminButton>
          </a>
        }
      />

      <AdminCard className="mb-6 space-y-4">
        <h2 className="font-semibold text-brand-navy">Upload file</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminSelect
            label="Type"
            value={form.downloadType}
            onChange={(e) => setForm({ ...form, downloadType: e.target.value })}
            options={[
              { value: "brochure", label: "Brochure" },
              { value: "report", label: "Report" },
              { value: "guidelines", label: "Guidelines" },
              { value: "circular", label: "Circular" },
              { value: "poster", label: "Poster" },
              { value: "presentation", label: "Presentation" },
              { value: "other", label: "Other" },
            ]}
          />
          <AdminInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <AdminInput label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>
        <AdminTextarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input ref={fileRef} type="file" className="text-sm" aria-label="Upload file" />
        <AdminButton onClick={upload} disabled={uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </AdminButton>
      </AdminCard>

      <AdminCard className="mb-4">
        <AdminInput label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by title…" />
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No downloads yet. Upload a file above to publish brochures and documents on /downloads." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Downloads library</caption>
            <thead className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Downloads</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.title}</p>
                    <p className="text-xs text-slate-500">{d.category ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">{d.downloadType}</td>
                  <td className="px-4 py-3">{d.downloadCount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <AdminSafeExternalLink href={d.fileUrl}>
                        <AdminButton size="sm" variant="ghost">Open</AdminButton>
                      </AdminSafeExternalLink>
                      <AdminButton size="sm" variant="danger" onClick={() => remove(d.id)}>
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
