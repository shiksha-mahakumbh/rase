"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminSelect,
  AdminTextarea,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

export default function ContactInboxPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: string; adminReply: string }>>({});
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (status) params.set("status", status);
      const data = await adminCmsFetch<{ items: ContactMessage[]; total: number }>(
        `contact?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      const next: Record<string, { status: string; adminReply: string }> = {};
      for (const row of data.items ?? []) {
        next[row.id] = { status: row.status, adminReply: row.adminReply ?? "" };
      }
      setDrafts(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [offset, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    try {
      await adminCmsFetch(`contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draft.status, adminReply: draft.adminReply }),
      });
      toast.success("Message updated");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Contact Inbox"
        description="Review contact form submissions, update status, and record admin replies."
      />

      <AdminCard className="mb-4">
        <AdminSelect
          label="Status filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setOffset(0);
          }}
          options={STATUS_OPTIONS}
        />
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No contact messages found." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((row) => {
              const draft = drafts[row.id] ?? { status: row.status, adminReply: "" };
              const isOpen = expanded === row.id;
              return (
                <AdminCard key={row.id}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : row.id)}
                  >
                    <div>
                      <p className="font-semibold text-brand-navy">{row.fullName}</p>
                      <p className="text-sm text-slate-600">{row.email}</p>
                      {row.subject && (
                        <p className="mt-1 text-sm text-slate-700">{row.subject}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={row.status} />
                      <span className="text-xs text-slate-500">
                        {new Date(row.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      <p className="whitespace-pre-wrap text-sm text-slate-700">{row.message}</p>
                      {row.phone && (
                        <p className="text-sm text-slate-600">Phone: {row.phone}</p>
                      )}
                      <AdminSelect
                        label="Status"
                        value={draft.status}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: { ...draft, status: e.target.value },
                          }))
                        }
                        options={STATUS_OPTIONS.filter((o) => o.value !== "")}
                      />
                      <AdminTextarea
                        label="Admin reply"
                        rows={4}
                        value={draft.adminReply}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: { ...draft, adminReply: e.target.value },
                          }))
                        }
                      />
                      <AdminButton onClick={() => save(row.id)}>Save</AdminButton>
                    </div>
                  )}
                </AdminCard>
              );
            })}
          </div>
          <AdminPagination
            offset={offset}
            limit={limit}
            total={total}
            onPage={setOffset}
          />
        </>
      )}
    </div>
  );
}
