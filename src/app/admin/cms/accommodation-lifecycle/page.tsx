"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminButton, AdminInput, AdminSelect, AdminLoading, AdminEmpty, AdminPagination } from "@/components/admin/cms/AdminUi";

type Row = {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  status: string;
  building: string | null;
  roomNumber: string | null;
  bedNumber: string | null;
  bedType: string | null;
};

type Room = { id: string; building: string; roomNumber: string; bedNumber: string | null; capacity: number; occupied: number };

export default function AccommodationLifecyclePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [allocating, setAllocating] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, roomList] = await Promise.all([
        adminCmsFetch<{ items: Row[]; total: number }>(`accommodation-lifecycle?limit=${limit}&offset=${offset}`),
        adminCmsFetch<Room[]>("accommodation-rooms"),
      ]);
      setItems(list.items ?? []);
      setTotal(list.total ?? 0);
      setRooms(roomList ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => { void load(); }, [load]);

  const allocate = async (requestId: string) => {
    if (!roomId) { toast.error("Select a room"); return; }
    try {
      await adminCmsFetch("accommodation-lifecycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "allocate", requestId, roomId }),
      });
      toast.success("Room allocated & email sent");
      setAllocating(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Allocation failed");
    }
  };

  const approve = async (requestId: string) => {
    try {
      await adminCmsFetch("accommodation-lifecycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-status", requestId, status: "Confirmed" }),
      });
      toast.success("Approved");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Accommodation" description="Room allocation workflow — approve, assign room, notify guest." />
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No accommodation requests." /> : (
        <div className="space-y-3">
          {items.map((row) => (
            <AdminCard key={row.id} className="!p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold">{row.registrationId}</p>
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-sm text-slate-600">{row.email} · {row.bedType ?? "—"}</p>
                  <p className="text-sm">Status: <strong>{row.status}</strong></p>
                  {row.building && <p className="text-sm">Room: {row.building} / {row.roomNumber} {row.bedNumber ? `#${row.bedNumber}` : ""}</p>}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  {row.status !== "Allocated" && (
                    <>
                      <AdminButton size="sm" variant="secondary" onClick={() => void approve(row.id)}>Approve</AdminButton>
                      <AdminButton size="sm" onClick={() => setAllocating(row.id)}>Assign Room</AdminButton>
                    </>
                  )}
                </div>
              </div>
              {allocating === row.id && (
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  <AdminSelect label="Room" options={[{ value: "", label: "Select room" }, ...rooms.map((r) => ({ value: r.id, label: `${r.building} ${r.roomNumber} (${r.occupied}/${r.capacity})` }))]} value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                  <AdminButton onClick={() => void allocate(row.id)}>Confirm Allocation</AdminButton>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
      <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
    </div>
  );
}
