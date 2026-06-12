"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type Album = {
  id: string;
  title: string;
  slug: string;
  albumType: string;
  locale: string;
  status: string;
  _count?: { items: number };
};

const EMPTY = {
  title: "",
  slug: "",
  description: "",
  albumType: "gallery",
  locale: "en",
  status: "draft",
};

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [itemsJson, setItemsJson] = useState("[]");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Album[] }>("media-albums?limit=50");
      setAlbums(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load albums");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
    setItemsJson("[]");
  };

  const edit = async (id: string) => {
    try {
      const data = await adminCmsFetch<{ album: { id: string; title: string; slug: string; description: string | null; albumType: string; locale: string; status: string; items: unknown[] } }>(
        `media-albums/${id}`
      );
      const album = data.album;
      setEditingId(id);
      setForm({
        title: album.title,
        slug: album.slug,
        description: album.description ?? "",
        albumType: album.albumType,
        locale: album.locale,
        status: album.status,
      });
      setItemsJson(JSON.stringify(album.items ?? [], null, 2));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load album");
    }
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    let items: Array<Record<string, unknown>>;
    try {
      items = JSON.parse(itemsJson) as Array<Record<string, unknown>>;
    } catch {
      toast.error("Invalid items JSON");
      return;
    }

    try {
      const body = { ...form, items };
      if (editingId) {
        await adminCmsFetch(`media-albums/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Album updated");
      } else {
        await adminCmsFetch("media-albums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Album created");
      }
      reset();
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this album?")) return;
    try {
      await adminCmsFetch(`media-albums/${id}`, { method: "DELETE" });
      toast.success("Album deleted");
      if (editingId === id) reset();
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Gallery Manager"
        description="Manage photo albums for the public gallery and homepage slides."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">
            {editingId ? "Edit album" : "New album"}
          </h2>
          <div className="space-y-3">
            <AdminInput
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <AdminInput
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <AdminTextarea
              label="Description"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminSelect
                label="Type"
                value={form.albumType}
                onChange={(e) => setForm((f) => ({ ...f, albumType: e.target.value }))}
                options={[
                  { value: "gallery", label: "Gallery" },
                  { value: "homepage", label: "Homepage" },
                  { value: "edition", label: "Edition" },
                  { value: "press", label: "Press" },
                ]}
              />
              <AdminSelect
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </div>
            <AdminTextarea
              label="Items JSON"
              rows={8}
              className="font-mono text-xs"
              value={itemsJson}
              onChange={(e) => setItemsJson(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Example: [{"{"}&quot;imageUrl&quot;:&quot;/2024M/Press7.jpg&quot;,&quot;altText&quot;:&quot;Inauguration&quot;,&quot;caption&quot;:&quot;SMK 4.0&quot;{"}"}]
            </p>
            <div className="flex gap-2">
              <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
              {editingId && (
                <AdminButton variant="secondary" onClick={reset}>
                  Cancel
                </AdminButton>
              )}
            </div>
          </div>
        </AdminCard>

        <div className="space-y-3">
          {albums.length === 0 ? (
            <AdminEmpty message="No albums yet." />
          ) : (
            albums.map((album) => (
              <AdminCard key={album.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-navy">{album.title}</p>
                    <p className="text-sm text-slate-500">
                      {album.slug} · {album.albumType} · {album.locale} ·{" "}
                      {album._count?.items ?? 0} items
                    </p>
                    <StatusBadge status={album.status} />
                  </div>
                  <div className="flex gap-2">
                    <AdminButton size="sm" variant="secondary" onClick={() => edit(album.id)}>
                      Edit
                    </AdminButton>
                    <AdminButton size="sm" variant="danger" onClick={() => remove(album.id)}>
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </AdminCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
