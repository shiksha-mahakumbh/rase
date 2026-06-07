"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { saveRegistration } from "@/lib/saveRegistration";
import { clearAllRegistrationDrafts } from "@/lib/registration/draftStorage";
import {
  ANALYTICS_EVENTS,
  getTrafficSource,
  trackEvent,
} from "@/lib/analytics/events";
import { attributionForFirestore } from "@/lib/analytics/attribution";

async function verifyCaptchaBeforeSubmit(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return process.env.NODE_ENV !== "production";
  }

  const grecaptcha = (
    window as unknown as {
      grecaptcha?: {
        ready: (cb: () => void) => void;
        execute: (key: string, opts: { action: string }) => Promise<string>;
      };
    }
  ).grecaptcha;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!grecaptcha || !siteKey) return false;

  const token = await new Promise<string | null>((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action: "registration" }).then(resolve).catch(() => resolve(null));
    });
  });

  if (!token) return false;

  const res = await fetch("/api/registration/verify-captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, action: "registration" }),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.ok);
}
import { uploadFile } from "@/lib/uploadFile";
import {
  PaymentStatus,
  RegistrationType,
  UploadedFileMeta,
} from "@/types/registration";

interface SubmitOptions {
  registrationType: RegistrationType;
  data: Record<string, unknown>;
  files?: Record<string, File | File[] | null | undefined>;
  paymentStatus?: PaymentStatus;
}

export function useRegistrationSubmit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitRegistration = async ({
    registrationType,
    data,
    files = {},
    paymentStatus = "Pending",
  }: SubmitOptions) => {
    setLoading(true);
    try {
      const captchaOk = await verifyCaptchaBeforeSubmit();
      if (!captchaOk) {
        toast.error("Security verification failed. Please refresh and try again.");
        return;
      }

      const uploaded: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(files)) {
        if (!value) continue;

        if (Array.isArray(value)) {
          const results: UploadedFileMeta[] = [];
          for (const file of value) {
            const result = await uploadFile(
              file,
              `registrations/${registrationType}/${key}`
            );
            results.push(result);
          }
          uploaded[key] = results;
        } else {
          const result = await uploadFile(
            value,
            `registrations/${registrationType}/${key}`
          );
          uploaded[key] = result;
        }
      }

      const payment = buildPaymentPayload(data, uploaded);
      const fee = data.registrationFee as number | undefined;
      const resolvedPaymentStatus: PaymentStatus =
        fee === 0 ? "Paid" : paymentStatus;

      const payload = {
        ...data,
        ...mapUploadedFiles(uploaded),
        payment,
        trafficSource: getTrafficSource(),
        ...attributionForFirestore(),
      };

      if (data.accommodationRequired === "Yes") {
        trackEvent(ANALYTICS_EVENTS.accommodationRequested, {
          registrationType,
        });
      }

      const result = await saveRegistration({
        registrationType,
        data: payload,
        paymentStatus: resolvedPaymentStatus,
      });

      try {
        await fetch("/api/registration/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: result.registrationId,
            registrationType,
            fullName: data.fullName,
            email: data.email,
            masterDocId: result.masterDocId,
          }),
        });
      } catch {
        // Email failure should not block registration
      }

      trackEvent(ANALYTICS_EVENTS.registrationCompleted, {
        registrationType,
        source: getTrafficSource(),
      });

      clearAllRegistrationDrafts();
      toast.success("Registration submitted successfully!");
      router.push(
        `/registration/success?id=${encodeURIComponent(result.registrationId)}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { submitRegistration, loading };
}

function buildPaymentPayload(
  data: Record<string, unknown>,
  uploaded: Record<string, unknown>
) {
  const receipt = uploaded.receipt as UploadedFileMeta | undefined;
  return {
    utrNumber: data.utrNumber,
    transactionId: data.transactionId,
    chequeNumber: data.chequeNumber,
    panNumber: data.panNumber,
    registrationFee: data.registrationFee,
    receipt,
  };
}

function mapUploadedFiles(uploaded: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {};
  if (uploaded.receipt) mapped.paymentReceipt = uploaded.receipt;
  if (uploaded.supportingPdf) mapped.supportingPdf = uploaded.supportingPdf;
  if (uploaded.supportingPhotos)
    mapped.supportingPhotos = uploaded.supportingPhotos;
  if (uploaded.recommendationLetter)
    mapped.recommendationLetter = uploaded.recommendationLetter;
  if (uploaded.studentList) mapped.studentList = uploaded.studentList;
  return mapped;
}
