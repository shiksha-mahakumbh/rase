"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminCard, AdminLoading } from "@/components/admin/cms/AdminUi";
import { formatRegistrationDate } from "@/lib/format-date";

type Revision = {
  id: string;
  version: number;
  createdAt: string;
  snapshot?: unknown;
};

export default function AdminRevisionsPanel({
  apiPath,
  title = "Revision history",
}: {
  apiPath: string;
  title?: string;
}) {
  const [items, setItems] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ revisions: Revision[] }>(apiPath);
      setItems(data.revisions ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AdminCard className="mt-6">
      <h2 className="mb-3 text-lg font-bold text-brand-navy">{title}</h2>
      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">No revisions saved yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border text-sm">
          {items.map((r) => (
            <li key={r.id} className="flex items-center justify-between px-4 py-2">
              <span className="font-mono text-xs">v{r.version}</span>
              <span className="text-slate-500">{formatRegistrationDate(r.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
