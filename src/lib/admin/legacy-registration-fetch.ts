export async function fetchGatewayRegistrations(
  type: string,
  limit = 500
): Promise<Record<string, unknown>[]> {
  const params = new URLSearchParams({
    type,
    limit: String(limit),
    offset: "0",
  });

  const res = await fetch(`/api/admin/gateway/registrations?${params}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      if (typeof errBody.error === "string") detail = errBody.error;
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to load registrations: ${detail}`);
  }

  const body = await res.json();
  return (body.items ?? []) as Record<string, unknown>[];
}

export function mergedRegistrationFields(
  item: Record<string, unknown>
): Record<string, unknown> {
  const metadata =
    item.metadata && typeof item.metadata === "object"
      ? (item.metadata as Record<string, unknown>)
      : {};
  return { ...metadata, ...item };
}
