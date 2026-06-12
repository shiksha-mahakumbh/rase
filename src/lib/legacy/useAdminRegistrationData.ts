"use client";

import { useEffect, useState } from "react";
import {
  fetchAllRegistrations,
  type RegistrationRow,
} from "@/lib/admin/registrations-client";

export function rowToLegacyRecord(row: RegistrationRow): Record<string, unknown> {
  const meta =
    row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata)
      ? (row.metadata as Record<string, unknown>)
      : {};
  return { ...meta, ...row };
}

export function useAdminRegistrationData(type?: string) {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchAllRegistrations(type);
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [type]);

  return { rows, loading, error };
}
