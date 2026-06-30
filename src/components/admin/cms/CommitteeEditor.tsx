"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  CmsReadOnlyBanner,
  useCmsCanMutate,
} from "@/components/admin/cms/AdminUi";
import AdminRevisionsPanel from "@/components/admin/cms/AdminRevisionsPanel";

const COMMITTEE_CATEGORIES = [
  "National_Advisory_Board",
  "Advisory_Board",
  "National_Organizing_Committee",
  "Steering_Committee",
  "Event_Committee",
  "Patrons",
  "Chief_Patrons",
  "Organizing_Committee",
  "Academic_Committee",
  "Technical_Committee",
  "Research_Committee",
  "Volunteer_Committee",
  "Media_Committee",
  "Hospitality_Committee",
  "Other",
] as const;

type Member = {
  id: string;
  fullName: string;
  designation: string | null;
  institution: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function CommitteeEditor({ committeeId }: { committeeId?: string }) {
  const router = useRouter();
  const canMutate = useCmsCanMutate();
  const [loading, setLoading] = useState(!!committeeId);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState({ fullName: "", designation: "", institution: "" });
  const [form, setForm] = useState({
    name: "",
    category: "Organizing_Committee" as (typeof COMMITTEE_CATEGORIES)[number],
    description: "",
    edition: "",
    locale: "en",
    sortOrder: "0",
    seoTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    void (async () => {
      if (!committeeId) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminCmsFetch<{ committee: Record<string, unknown> }>(
          `committees/${committeeId}`
        );
        const c = data.committee;
        setForm({
          name: String(c.name ?? ""),
          category: String(c.category ?? "Organizing_Committee") as (typeof COMMITTEE_CATEGORIES)[number],
          description: String(c.description ?? ""),
          edition: String(c.edition ?? ""),
          locale: String(c.locale ?? "en"),
          sortOrder: String(c.sortOrder ?? 0),
          seoTitle: "",
          metaDescription: "",
        });
        setMembers((c.members as Member[]) ?? []);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load committee");
      } finally {
        setLoading(false);
      }
    })();
  }, [committeeId]);

  const save = async (action?: "publish" | "archive") => {
    if (!canMutate) return;
    setSaving(true);
    try {
      const body = {
        name: form.name,
        category: form.category,
        description: form.description || undefined,
        edition: form.edition || undefined,
        locale: form.locale,
        sortOrder: Number(form.sortOrder) || 0,
        seo: {
          seoTitle: form.seoTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        },
      };

      let id = committeeId;
      if (committeeId) {
        await adminCmsFetch(`committees/${committeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const created = await adminCmsFetch<{ committee: { id: string } }>("committees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        id = created.committee.id;
      }

      if (action && id) {
        await adminCmsFetch(`committees/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        toast.success(action === "publish" ? "Published" : "Archived");
      } else {
        toast.success("Saved");
      }

      router.push(`/admin/cms/committees/${id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addMember = async () => {
    if (!canMutate || !committeeId || !newMember.fullName.trim()) return;
    try {
      await adminCmsFetch(`committees/${committeeId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      toast.success("Member added");
      setNewMember({ fullName: "", designation: "", institution: "" });
      const data = await adminCmsFetch<{ committee: { members: Member[] } }>(
        `committees/${committeeId}`
      );
      setMembers(data.committee.members ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add member");
    }
  };

  const removeMember = async (memberId: string) => {
    if (!canMutate) return;
    if (!confirm("Remove this member?")) return;
    try {
      await adminCmsFetch(`committees/members/${memberId}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove member");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <CmsReadOnlyBanner />
      <AdminPageHeader
        title={committeeId ? "Edit committee" : "Create committee"}
        actions={
          canMutate ? (
            <>
              <AdminButton variant="secondary" onClick={() => router.back()}>
                Back
              </AdminButton>
              <AdminButton onClick={() => save()} disabled={saving}>
                Save draft
              </AdminButton>
              <AdminButton onClick={() => save("publish")} disabled={saving}>
                Publish
              </AdminButton>
              {committeeId && (
                <AdminButton variant="secondary" onClick={() => save("archive")} disabled={saving}>
                  Archive
                </AdminButton>
              )}
            </>
          ) : (
            <AdminButton variant="secondary" onClick={() => router.back()}>
              Back
            </AdminButton>
          )
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2 space-y-4">
          <AdminInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <AdminSelect
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as (typeof COMMITTEE_CATEGORIES)[number],
              })
            }
            options={COMMITTEE_CATEGORIES.map((c) => ({
              value: c,
              label: c.replace(/_/g, " "),
            }))}
          />
          <AdminTextarea
            label="Description"
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {committeeId && (
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-brand-navy">Members</h3>
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{m.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {[m.designation, m.institution].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <AdminButton size="sm" variant="danger" onClick={() => removeMember(m.id)}>
                    Remove
                  </AdminButton>
                </div>
              ))}
              <div className="grid gap-2 md:grid-cols-3">
                <AdminInput
                  label="Full name"
                  value={newMember.fullName}
                  onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                />
                <AdminInput
                  label="Designation"
                  value={newMember.designation}
                  onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                />
                <AdminInput
                  label="Institution"
                  value={newMember.institution}
                  onChange={(e) => setNewMember({ ...newMember, institution: e.target.value })}
                />
              </div>
              <AdminButton onClick={() => void addMember()}>Add member</AdminButton>
            </div>
          )}
        </AdminCard>
        <div className="space-y-4">
          <AdminCard className="space-y-4">
            <AdminInput
              label="Edition"
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
            />
            <AdminSelect
              label="Locale"
              value={form.locale}
              onChange={(e) => setForm({ ...form, locale: e.target.value })}
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "Hindi" },
              ]}
            />
            <AdminInput
              label="Sort order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </AdminCard>
          <AdminCard className="space-y-4">
            <h3 className="font-semibold text-brand-navy">SEO</h3>
            <AdminInput
              label="SEO title"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />
            <AdminTextarea
              label="Meta description"
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </AdminCard>
        </div>
      </div>
      {committeeId ? (
        <AdminRevisionsPanel
          apiPath={`committees/${committeeId}/revisions`}
          title="Committee revisions"
        />
      ) : null}
    </div>
  );
}
