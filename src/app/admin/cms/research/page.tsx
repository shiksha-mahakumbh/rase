"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminButton, AdminSelect, AdminTextarea, AdminLoading, AdminEmpty } from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge } from "@/components/admin/ops/OpsUi";

type Submission = {
  id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  institution: string | null;
  status: string;
  score: number | null;
  remarks: string | null;
  recommendation: string | null;
  createdAt: string;
};

const STATUS_OPTS = [
  { value: "", label: "All" },
  { value: "Submitted", label: "Submitted" },
  { value: "Under_Review", label: "Under Review" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
  { value: "Revision_Requested", label: "Revision Requested" },
];

export default function ResearchSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { score: string; remarks: string; recommendation: string; status: string }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (status) params.set("status", status);
      const data = await adminCmsFetch<{ items: Submission[] }>(`research?${params}`);
      setItems(data.items ?? []);
      const d: typeof drafts = {};
      for (const s of data.items ?? []) {
        d[s.id] = { score: String(s.score ?? ""), remarks: s.remarks ?? "", recommendation: s.recommendation ?? "", status: s.status };
      }
      setDrafts(d);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { void load(); }, [load]);

  const save = async (id: string, sendLetter = false) => {
    const d = drafts[id];
    if (!d) return;
    try {
      await adminCmsFetch(`research/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: d.status,
          score: d.score ? Number(d.score) : undefined,
          remarks: d.remarks,
          recommendation: d.recommendation,
          sendAcceptanceLetter: sendLetter,
        }),
      });
      toast.success("Updated");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Research Submissions" description="Abstract review queue, scoring, and acceptance letters." />
      <AdminCard className="mb-4 max-w-xs">
        <AdminSelect label="Status filter" options={STATUS_OPTS} value={status} onChange={(e) => setStatus(e.target.value)} />
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No submissions." /> : (
        <div className="space-y-3">
          {items.map((s) => (
            <AdminCard key={s.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-brand-navy">{s.title}</h3>
                  <p className="text-sm">{s.authorName} · {s.authorEmail}</p>
                  <p className="text-xs text-slate-500">{s.institution ?? "—"}</p>
                  <OpsStatusBadge value={s.status.replace(/_/g, " ")} />
                </div>
                <AdminButton size="sm" variant="secondary" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>Review</AdminButton>
              </div>
              {expanded === s.id && drafts[s.id] && (
                <div className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-2">
                  <AdminSelect label="Status" options={STATUS_OPTS.filter((o) => o.value)} value={drafts[s.id].status} onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...drafts[s.id], status: e.target.value } })} />
                  <label className="text-sm">Score (1-10)<input className="mt-1 w-full rounded-lg border px-3 py-2" value={drafts[s.id].score} onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...drafts[s.id], score: e.target.value } })} /></label>
                  <AdminTextarea label="Remarks" rows={3} value={drafts[s.id].remarks} onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...drafts[s.id], remarks: e.target.value } })} />
                  <AdminTextarea label="Recommendation" rows={3} value={drafts[s.id].recommendation} onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...drafts[s.id], recommendation: e.target.value } })} />
                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    <AdminButton onClick={() => void save(s.id)}>Save Review</AdminButton>
                    {drafts[s.id].status === "Accepted" && (
                      <AdminButton variant="secondary" onClick={() => void save(s.id, true)}>Send Acceptance Letter</AdminButton>
                    )}
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
