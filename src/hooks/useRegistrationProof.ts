"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REGISTRATION_PROOF_MIN_DWELL_MS } from "@/lib/security/registration-proof-constants";

type ProofBundle = {
  proofToken: string;
  uploadToken: string;
  issuedAt: number;
};

const REFRESH_MS = 15 * 60 * 1000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function fetchProofBundle(): Promise<ProofBundle> {
  const res = await fetch("/api/v2/registration-session", {
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

  /** Ensures a valid proof token and waits out the anti-bot dwell window. */
  const prepareForSubmit = useCallback(async (): Promise<ProofBundle> => {
    const next = await ensureFresh();
    const dwellRemaining =
      REGISTRATION_PROOF_MIN_DWELL_MS - (Date.now() - next.issuedAt);
    if (dwellRemaining > 0) {
      await sleep(dwellRemaining);
    }
    return next;
  }, [ensureFresh]);

  return { bundle, loading, ensureFresh, prepareForSubmit, refresh };
}
