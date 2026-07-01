"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";

type NewsletterSubscriber = {
  id: string;
  email: string;
  fullName: string | null;
  source: string | null;
  status: string;
  createdAt: string;
};

export default function NewsletterAdminPage() {
  const [items, setItems] = useState<NewsletterSubscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await adminCmsFetch<{ items: NewsletterSubscriber[]; total: number }>(
        `newsletter?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="Active marketing newsletter subscriptions from the website."
      />

      <AdminCard>
        {loading ? (
          <AdminLoading />
        ) : items.length === 0 ? (
          <AdminEmpty message="No active subscribers yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  <th className="px-3 py-2 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-mono text-xs">{row.email}</td>
                    <td className="px-3 py-2">{row.fullName ?? "—"}</td>
                    <td className="px-3 py-2">{row.source ?? "website"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && total > limit ? (
          <AdminPagination
            offset={offset}
            limit={limit}
            total={total}
            onPage={setOffset}
          />
        ) : null}
      </AdminCard>
    </div>
  );
}
