"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "@/components/admin/cms/AdminUi";

const DOC_TYPES = [
  { value: "invitation_letter", label: "Invitation Letter" },
  { value: "acceptance_letter", label: "Acceptance Letter" },
  { value: "participation_letter", label: "Participation Letter" },
  { value: "volunteer_letter", label: "Volunteer Letter" },
  { value: "appreciation_letter", label: "Appreciation Letter" },
];

type Doc = {
  id: string;
  documentType: string;
  title: string;
  recipientName: string | null;
  createdAt: string;
  registration: { registrationId: string; fullName: string } | null;
};

export default function DocumentsPage() {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState("invitation_letter");
  const [registrationId, setRegistrationId] = useState("");
  const [bulkIds, setBulkIds] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminCmsFetch<Doc[]>("documents"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const generate = async () => {
    try {
      const result = await adminCmsFetch<{ document: { id: string } }>("documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: docType, registrationId }),
      });
      toast.success("Document generated");
      window.open(`/api/admin/gateway/documents/${result.document.id}/download`, "_blank");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const bulkGenerate = async () => {
    const registrationIds = bulkIds.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!registrationIds.length) { toast.error("Enter registration IDs"); return; }
    try {
      const result = await adminCmsFetch<{ success: number }>("documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk", documentType: docType, registrationIds }),
      });
      toast.success(`Generated ${result.success} documents`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Document Generation Center" description="Invitation, acceptance, participation, and appreciation letters." />
      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-2">
          <AdminSelect label="Document type" options={DOC_TYPES} value={docType} onChange={(e) => setDocType(e.target.value)} />
          <AdminInput label="Registration ID" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} />
          <AdminButton onClick={() => void generate()} disabled={!registrationId}>Generate PDF</AdminButton>
        </div>
        <div className="mt-4 border-t pt-4">
          <label className="text-sm font-medium">Bulk IDs (comma or newline separated)</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" rows={3} value={bulkIds} onChange={(e) => setBulkIds(e.target.value)} />
          <AdminButton className="mt-2" variant="secondary" onClick={() => void bulkGenerate()}>Bulk Generate</AdminButton>
        </div>
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No documents yet." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase">
              <tr><th className="px-3 py-3 text-left">Type</th><th className="px-3 py-3">Recipient</th><th className="px-3 py-3">Date</th><th className="px-3 py-3"></th></tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="px-3 py-2">{d.title}</td>
                  <td className="px-3 py-2">{d.recipientName ?? d.registration?.fullName ?? "—"}</td>
                  <td className="px-3 py-2">{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-3 py-2">
                    <a className="text-brand-navy underline" href={`/api/admin/gateway/documents/${d.id}/download`} target="_blank" rel="noreferrer">PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
