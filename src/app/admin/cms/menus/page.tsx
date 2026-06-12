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
} from "@/components/admin/cms/AdminUi";

type MenuItem = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  children?: MenuItem[];
};

type Menu = {
  id: string;
  name: string;
  slug: string;
  menuType: string;
  items: MenuItem[];
};

export default function MenusAdminPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState("");
  const [newItem, setNewItem] = useState({ label: "", url: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Menu[] }>("menus");
      const list = data.items ?? [];
      setMenus(list);
      setActiveMenuId((prev) => prev || list[0]?.id || "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load menus");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const seed = async () => {
    try {
      await adminCmsFetch("menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed", locale: "en" }),
      });
      toast.success("Default menus seeded");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Seed failed");
    }
  };

  const addItem = async () => {
    if (!activeMenuId || !newItem.label || !newItem.url) return;
    try {
      await adminCmsFetch(`menus/${activeMenuId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      toast.success("Menu item added");
      setNewItem({ label: "", url: "" });
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Add item failed");
    }
  };

  const removeItem = async (itemId: string) => {
    if (!activeMenuId) return;
    try {
      await adminCmsFetch(`menus/${activeMenuId}/items?itemId=${itemId}`, {
        method: "DELETE",
      });
      toast.success("Item removed");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Navigation Menus"
        description="Manage header and footer navigation shown on the public site."
        actions={<AdminButton variant="secondary" onClick={seed}>Seed defaults</AdminButton>}
      />

      {menus.length === 0 ? (
        <AdminEmpty message="No menus found. Seed default header/footer menus." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <AdminCard className="space-y-2">
            {menus.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMenuId(m.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeMenuId === m.id ? "bg-brand-navy text-white" : "hover:bg-slate-100"
                }`}
              >
                {m.name}
                <span className="block text-xs opacity-70">{m.menuType}</span>
              </button>
            ))}
          </AdminCard>

          <AdminCard className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-brand-navy">
              {activeMenu?.name ?? "Select a menu"}
            </h2>
            <ul className="divide-y rounded-lg border">
              {(activeMenu?.items ?? []).map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.url}</p>
                  </div>
                  <AdminButton size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                    Remove
                  </AdminButton>
                </li>
              ))}
            </ul>
            <div className="grid gap-3 md:grid-cols-3">
              <AdminInput label="Label" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} />
              <AdminInput label="URL" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} />
              <div className="flex items-end">
                <AdminButton onClick={addItem}>Add item</AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
