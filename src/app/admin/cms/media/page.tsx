"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { adminCmsFetch, adminCmsUpload } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";

type Folder = { id: string; name: string; slug: string; parentId: string | null };
type Asset = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  assetType: string;
  altText: string | null;
  tags: string[];
  folderId: string | null;
};

const BUCKET_FOLDERS = ["media", "downloads", "notices", "homepage"];

export default function MediaLibraryPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [folderId, setFolderId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 24;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState("");
  const [altText, setAltText] = useState("");
  const [newFolder, setNewFolder] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [folderRes, assetRes] = await Promise.all([
        adminCmsFetch<{ items: Folder[] }>("media-library/folders"),
        adminCmsFetch<{ items: Asset[]; total: number }>(
          `media-library?limit=${limit}&offset=${offset}${folderId ? `&folderId=${folderId}` : ""}${search ? `&q=${encodeURIComponent(search)}` : ""}`
        ),
      ]);
      setFolders(folderRes.items ?? []);
      setAssets(assetRes.items ?? []);
      setTotal(assetRes.total ?? assetRes.items?.length ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [folderId, search, offset]);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folderId) fd.append("folderId", folderId);
      if (tags) fd.append("tags", tags);
      if (altText) fd.append("altText", altText);
      await adminCmsUpload("media-library", fd);
      toast.success("Uploaded");
      if (fileRef.current) fileRef.current.value = "";
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async (name: string) => {
    if (!name.trim()) return;
    try {
      await adminCmsFetch("media-library/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }),
      });
      toast.success("Folder created");
      setNewFolder("");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Folder create failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this asset?")) return;
    try {
      await adminCmsFetch(`media-library/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and organize images, PDFs, and assets for CMS modules."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Folders</h2>
          <button
            type="button"
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${!folderId ? "bg-brand-navy text-white" : "hover:bg-slate-100"}`}
            onClick={() => { setFolderId(""); setOffset(0); }}
          >
            All assets
          </button>
          {BUCKET_FOLDERS.map((b) => {
            const match = folders.find((f) => f.slug === b);
            return (
              <button
                key={b}
                type="button"
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm capitalize ${folderId === match?.id ? "bg-brand-navy text-white" : "hover:bg-slate-100"}`}
                onClick={() => {
                  if (match) { setFolderId(match.id); setOffset(0); }
                  else void createFolder(b);
                }}
              >
                {b}
              </button>
            );
          })}
          {folders.filter((f) => !BUCKET_FOLDERS.includes(f.slug)).map((f) => (
            <button
              key={f.id}
              type="button"
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${folderId === f.id ? "bg-brand-navy text-white" : "hover:bg-slate-100"}`}
              onClick={() => { setFolderId(f.id); setOffset(0); }}
            >
              {f.name}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            <AdminInput value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="New folder" />
            <AdminButton size="sm" onClick={() => createFolder(newFolder)}>+</AdminButton>
          </div>
        </AdminCard>

        <div className="space-y-4 lg:col-span-3">
          <AdminCard className="space-y-3">
            <h2 className="font-semibold text-brand-navy">Upload</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInput label="Alt text" value={altText} onChange={(e) => setAltText(e.target.value)} />
              <AdminInput label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma-separated" />
            </div>
            <input
              ref={fileRef}
              type="file"
              className="w-full rounded-lg border border-dashed border-slate-300 p-4 text-sm"
              aria-label="Drag and drop or choose file"
              onChange={() => {}}
            />
            <AdminButton onClick={upload} disabled={uploading}>
              {uploading ? "Uploading…" : "Upload to library"}
            </AdminButton>
          </AdminCard>

          <AdminCard>
            <AdminInput
              label="Search assets"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
              placeholder="Filename, alt text, tags…"
            />
          </AdminCard>

          {loading ? (
            <AdminLoading />
          ) : assets.length === 0 ? (
            <AdminEmpty message="No assets yet. Upload images or PDFs above — they appear on the public site once linked from pages, gallery, or downloads." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {assets.map((a) => (
                  <AdminCard key={a.id} className="p-3">
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-slate-100">
                      {isImage(a.mimeType) ? (
                        <Image src={a.fileUrl} alt={a.altText ?? a.fileName} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-500">
                          {a.mimeType.includes("pdf") ? "PDF" : a.assetType}
                        </div>
                      )}
                    </div>
                    <p className="truncate text-xs font-medium">{a.fileName}</p>
                    <p className="truncate text-[10px] text-slate-500">{a.tags.join(", ")}</p>
                    <div className="mt-2 flex gap-1">
                      <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-navy underline">
                        Open
                      </a>
                      <button type="button" className="text-xs text-red-600" onClick={() => remove(a.id)}>
                        Delete
                      </button>
                    </div>
                  </AdminCard>
                ))}
              </div>
              <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
