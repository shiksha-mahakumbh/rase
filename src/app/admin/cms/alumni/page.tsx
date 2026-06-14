"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";

type Alumni = {
  id: string;
  fullName: string;
  email: string;
  institution: string | null;
  state: string | null;
  eventEdition: string;
  interests: string[];
  convertedAt: string;
  registration: { registrationId: string };
};

export default function AlumniPage() {
  const [items, setItems] = useState<Alumni[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (search) params.set("search", search);
      const data = await adminCmsFetch<{ items: Alumni[]; total: number }>(`alumni?${params}`);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [offset, search]);

  useEffect(() => { void load(); }, [load]);

  const convert = async () => {
    try {
      const result = await adminCmsFetch<{ count: number }>("alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", eventEdition: "SMK2026" }),
      });
      toast.success(`Converted ${result.count} attendees to alumni`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Conversion failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Alumni Database"
        description="Post-event alumni records with participation history."
        actions={<AdminButton onClick={() => void convert()}>Convert Checked-In Attendees</AdminButton>}
      />
      <AdminCard className="mb-4 max-w-sm">
        <AdminInput label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setOffset(0); }} placeholder="Name, email, institution" />
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No alumni records yet." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase">
              <tr>
                <th className="px-3 py-3 text-left">Name</th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Institution</th>
                <th className="px-3 py-3">State</th>
                <th className="px-3 py-3">Edition</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-3 py-2">{a.fullName}<br /><span className="text-xs text-slate-500">{a.email}</span></td>
                  <td className="px-3 py-2 font-mono text-xs">{a.registration.registrationId}</td>
                  <td className="px-3 py-2">{a.institution ?? "—"}</td>
                  <td className="px-3 py-2">{a.state ?? "—"}</td>
                  <td className="px-3 py-2">{a.eventEdition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
      <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
    </div>
  );
}
