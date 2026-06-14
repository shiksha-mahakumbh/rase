"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminButton, AdminInput, AdminSelect, AdminTextarea, AdminLoading, AdminEmpty } from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge } from "@/components/admin/ops/OpsUi";

type Campaign = {
  id: string;
  name: string;
  channel: string;
  status: string;
  deliveredCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
};

export default function CommunicationsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [audience, setAudience] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Campaign[] }>("communications?limit=30");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    try {
      const campaign = await adminCmsFetch<{ id: string }>("communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, channel, subject, bodyHtml, targetFilter: { audience } }),
      });
      await adminCmsFetch("communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", campaignId: campaign.id }),
      });
      toast.success("Campaign sent");
      setName(""); setSubject(""); setBodyHtml("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Campaign failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Communications" description="Email, SMS, and WhatsApp campaigns to targeted attendee groups." />
      <AdminCard className="mb-6">
        <h2 className="mb-3 font-bold text-brand-navy">New Campaign</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <AdminInput label="Campaign name" value={name} onChange={(e) => setName(e.target.value)} />
          <AdminSelect label="Channel" options={[{ value: "email", label: "Email" }, { value: "sms", label: "SMS" }, { value: "whatsapp", label: "WhatsApp" }]} value={channel} onChange={(e) => setChannel(e.target.value)} />
          <AdminSelect label="Target audience" options={[{ value: "all", label: "All attendees" }, { value: "delegates", label: "Delegates" }, { value: "volunteers", label: "Volunteers" }, { value: "speakers", label: "Speakers" }]} value={audience} onChange={(e) => setAudience(e.target.value)} />
          <AdminInput label="Subject (email)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <div className="md:col-span-2">
            <AdminTextarea label="Message body (HTML for email)" rows={5} value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} />
          </div>
          <AdminButton onClick={() => void create()} disabled={!name.trim()}>Create & Send</AdminButton>
        </div>
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No campaigns yet." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase"><tr><th className="px-3 py-3 text-left">Name</th><th className="px-3 py-3">Channel</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Delivered</th><th className="px-3 py-3">Failed</th></tr></thead>
            <tbody>{items.map((c) => (
              <tr key={c.id} className="border-b"><td className="px-3 py-2">{c.name}</td><td className="px-3 py-2">{c.channel}</td><td className="px-3 py-2"><OpsStatusBadge value={c.status} /></td><td className="px-3 py-2">{c.deliveredCount}</td><td className="px-3 py-2">{c.failedCount}</td></tr>
            ))}</tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
