import type { RegistrationRow } from "@/lib/exportRegistrations";

export type { RegistrationRow };

export const REGISTRATIONS_PAGE_SIZE = 50;

export interface RegistrationsPageResult {
  rows: RegistrationRow[];
  hasMore: boolean;
  total: number;
}

function mapItemToRow(item: Record<string, unknown>): RegistrationRow {
  return {
    id: String(item.id ?? item.registrationId ?? ""),
    registrationId: String(item.registrationId ?? ""),
    registrationType: String(item.registrationType ?? ""),
    fullName: String(item.fullName ?? ""),
    email: String(item.email ?? ""),
    contactNumber: String(item.contactNumber ?? ""),
    institution: String(item.institution ?? ""),
    paymentStatus: item.paymentStatus as RegistrationRow["paymentStatus"],
    registrationStatus: item.registrationStatus as RegistrationRow["registrationStatus"],
    accommodationStatus: item.accommodationStatus as RegistrationRow["accommodationStatus"],
    accommodationRequired: item.accommodationRequired as RegistrationRow["accommodationRequired"],
    createdAt: item.createdAt as RegistrationRow["createdAt"],
    updatedAt: item.updatedAt as RegistrationRow["updatedAt"],
    metadata: item.metadata,
    ...item,
  } as RegistrationRow;
}

export async function fetchRegistrationsPage(
  offset = 0,
  type?: string
): Promise<RegistrationsPageResult> {
  const params = new URLSearchParams({
    limit: String(REGISTRATIONS_PAGE_SIZE),
    offset: String(offset),
  });
  if (type) params.set("type", type);

  const res = await fetch(`/api/admin/gateway/registrations?${params}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load registrations");
  }

  const body = await res.json();
  const items = (body.items ?? []) as Record<string, unknown>[];
  const total = Number(body.total ?? items.length);
  const rows = items.map(mapItemToRow);

  return {
    rows,
    hasMore: offset + rows.length < total,
    total,
  };
}

export async function fetchAllRegistrations(type?: string): Promise<RegistrationRow[]> {
  const first = await fetchRegistrationsPage(0, type);
  if (!first.hasMore) return first.rows;

  const all = [...first.rows];
  let offset = REGISTRATIONS_PAGE_SIZE;
  while (offset < first.total) {
    const page = await fetchRegistrationsPage(offset, type);
    all.push(...page.rows);
    offset += REGISTRATIONS_PAGE_SIZE;
    if (!page.hasMore) break;
  }
  return all;
}

export async function fetchRegistrationByPublicId(
  registrationId: string
): Promise<Record<string, unknown> | null> {
  const res = await fetch(
    `/api/admin/gateway/registrations/${encodeURIComponent(registrationId)}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load registration");
  const body = await res.json();
  return (body.registration ?? body) as Record<string, unknown>;
}
