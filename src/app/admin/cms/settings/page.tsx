"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organizationName: "",
    tagline: "",
    logoUrl: "",
    contactEmail: "",
    supportEmail: "",
    phoneNumbers: "",
    copyrightText: "",
    socialYoutube: "",
    socialFacebook: "",
    socialLinkedin: "",
    socialInstagram: "",
    socialX: "",
    registrationOpen: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await adminCmsFetch<{ settings: Record<string, unknown> }>("settings?locale=en");
        const s = data.settings ?? {};
        const social = (s.socialLinks as Record<string, string>) ?? {};
        const phones = Array.isArray(s.phoneNumbers) ? (s.phoneNumbers as string[]).join("\n") : "";
        setForm({
          organizationName: String(s.organizationName ?? ""),
          tagline: String(s.tagline ?? ""),
          logoUrl: String(s.logoUrl ?? ""),
          contactEmail: String(s.contactEmail ?? ""),
          supportEmail: String(s.supportEmail ?? ""),
          phoneNumbers: phones,
          copyrightText: String(s.copyrightText ?? ""),
          socialYoutube: social.youtube ?? "",
          socialFacebook: social.facebook ?? "",
          socialLinkedin: social.linkedin ?? "",
          socialInstagram: social.instagram ?? "",
          socialX: social.x ?? "",
          registrationOpen: Boolean(s.registrationOpen ?? true),
          maintenanceMode: Boolean(s.maintenanceMode ?? false),
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminCmsFetch("settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          organizationName: form.organizationName,
          tagline: form.tagline,
          logoUrl: form.logoUrl,
          contactEmail: form.contactEmail,
          supportEmail: form.supportEmail,
          phoneNumbers: form.phoneNumbers.split("\n").map((p) => p.trim()).filter(Boolean),
          copyrightText: form.copyrightText,
          socialLinks: {
            youtube: form.socialYoutube,
            facebook: form.socialFacebook,
            linkedin: form.socialLinkedin,
            instagram: form.socialInstagram,
            x: form.socialX,
          },
          registrationOpen: form.registrationOpen,
          maintenanceMode: form.maintenanceMode,
        }),
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Organization details, contact info, social links, and feature toggles."
        actions={<AdminButton onClick={save} disabled={saving}>Save settings</AdminButton>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Organization</h2>
          <AdminInput label="Organization name" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
          <AdminInput label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <AdminInput label="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          <AdminTextarea label="Copyright text" rows={2} value={form.copyrightText} onChange={(e) => setForm({ ...form, copyrightText: e.target.value })} />
        </AdminCard>
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Contact</h2>
          <AdminInput label="Contact email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          <AdminInput label="Support email" type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
          <AdminTextarea label="Phone numbers (one per line)" rows={4} value={form.phoneNumbers} onChange={(e) => setForm({ ...form, phoneNumbers: e.target.value })} />
        </AdminCard>
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Social links</h2>
          <AdminInput label="YouTube" value={form.socialYoutube} onChange={(e) => setForm({ ...form, socialYoutube: e.target.value })} />
          <AdminInput label="Facebook" value={form.socialFacebook} onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })} />
          <AdminInput label="LinkedIn" value={form.socialLinkedin} onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })} />
          <AdminInput label="Instagram" value={form.socialInstagram} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} />
          <AdminInput label="X (Twitter)" value={form.socialX} onChange={(e) => setForm({ ...form, socialX: e.target.value })} />
        </AdminCard>
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-brand-navy">Toggles</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} />
            Registration open
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
            Maintenance mode
          </label>
        </AdminCard>
      </div>
    </div>
  );
}
