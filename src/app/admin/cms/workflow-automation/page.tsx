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
  AdminTextarea,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

type Rule = {
  id: string;
  name: string;
  trigger: string;
  channel: string;
  isEnabled: boolean;
  templateSubject: string | null;
  templateBody: string | null;
};

const TRIGGERS = [
  { value: "registration_complete", label: "Registration Complete" },
  { value: "payment_complete", label: "Payment Complete" },
  { value: "accommodation_assigned", label: "Accommodation Assigned" },
  { value: "paper_accepted", label: "Paper Accepted" },
  { value: "certificate_available", label: "Certificate Available" },
];

export default function WorkflowAutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Rule | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRules(await adminCmsFetch<Rule[]>("workflow-rules"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    try {
      await adminCmsFetch("workflow-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      toast.success("Rule saved");
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const toggle = async (rule: Rule) => {
    try {
      await adminCmsFetch("workflow-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id: rule.id, isEnabled: !rule.isEnabled }),
      });
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Toggle failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Workflow Automation"
        description="Configure auto email and WhatsApp rules for lifecycle events."
      />
      {loading ? (
        <AdminLoading />
      ) : (
        <div className="space-y-3">
          {rules.map((r) => (
            <AdminCard key={r.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-brand-navy">{r.name}</h3>
                  <p className="text-sm text-slate-600">
                    Trigger: {r.trigger.replace(/_/g, " ")} · Channel: {r.channel}
                  </p>
                  <p className="text-xs text-slate-500">{r.isEnabled ? "Enabled" : "Disabled"}</p>
                </div>
                <div className="flex gap-2">
                  <AdminButton size="sm" variant="secondary" onClick={() => setEditing(r)}>
                    Edit
                  </AdminButton>
                  <AdminButton size="sm" onClick={() => void toggle(r)}>
                    {r.isEnabled ? "Disable" : "Enable"}
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
      {editing && (
        <AdminCard className="mt-6">
          <h2 className="mb-3 font-bold">Edit Rule</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminInput label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <AdminSelect
              label="Trigger"
              options={TRIGGERS}
              value={editing.trigger}
              onChange={(e) => setEditing({ ...editing, trigger: e.target.value })}
            />
            <AdminSelect
              label="Channel"
              options={[
                { value: "email", label: "Email" },
                { value: "whatsapp", label: "WhatsApp" },
                { value: "both", label: "Both" },
              ]}
              value={editing.channel}
              onChange={(e) => setEditing({ ...editing, channel: e.target.value })}
            />
            <AdminInput
              label="Subject"
              value={editing.templateSubject ?? ""}
              onChange={(e) => setEditing({ ...editing, templateSubject: e.target.value })}
            />
            <div className="md:col-span-2">
              <AdminTextarea
                label="Body (use {{fullName}}, {{registrationId}}, etc.)"
                rows={5}
                value={editing.templateBody ?? ""}
                onChange={(e) => setEditing({ ...editing, templateBody: e.target.value })}
              />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <AdminButton onClick={() => void save()}>Save</AdminButton>
              <AdminButton variant="secondary" onClick={() => setEditing(null)}>Cancel</AdminButton>
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
