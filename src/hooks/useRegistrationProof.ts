"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ProofBundle = {
  proofToken: string;
  uploadToken: string;
  issuedAt: number;
};

const REFRESH_MS = 15 * 60 * 1000;

async function fetchProofBundle(): Promise<ProofBundle> {
  const res = await fetch("/api/v2/registration/proof", {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("Could not start registration session. Please refresh and try again.");
  }
  const body = (await res.json()) as ProofBundle;
  if (!body.proofToken || !body.uploadToken) {
    throw new Error("Could not start registration session. Please refresh and try again.");
  }
  return {
    proofToken: body.proofToken,
    uploadToken: body.uploadToken,
    issuedAt: body.issuedAt ?? Date.now(),
  };
}

/** Loads a first-party proof token when the user opens the registration form (no reCAPTCHA). */
export function useRegistrationProof(enabled: boolean) {
  const [bundle, setBundle] = useState<ProofBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const inflight = useRef<Promise<ProofBundle> | null>(null);

  const refresh = useCallback(async (): Promise<ProofBundle> => {
    if (inflight.current) return inflight.current;
    setLoading(true);
    inflight.current = fetchProofBundle()
      .then((next) => {
        setBundle(next);
        return next;
      })
      .finally(() => {
        inflight.current = null;
        setLoading(false);
      });
    return inflight.current;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void refresh();
  }, [enabled, refresh]);

  const ensureFresh = useCallback(async (): Promise<ProofBundle> => {
    if (bundle && Date.now() - bundle.issuedAt < REFRESH_MS) {
      return bundle;
    }
    return refresh();
  }, [bundle, refresh]);

  return { bundle, loading, ensureFresh, refresh };
}
