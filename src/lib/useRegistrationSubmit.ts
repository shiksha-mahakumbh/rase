"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearAllRegistrationDrafts } from "@/lib/registration/draftStorage";
import {
  ANALYTICS_EVENTS,
  getTrafficSource,
  trackEvent,
} from "@/lib/analytics/events";
import { attributionForSubmission } from "@/lib/analytics/attribution";
import {
  PaymentStatus,
  RegistrationType,
  UploadedFileMeta,
} from "@/types/registration";
import {
  isPaidCapableType,
  resolvePaymentStatus,
} from "@/lib/registration/config";

interface SubmitOptions {
  registrationType: RegistrationType;
  data: Record<string, unknown>;
  files?: Record<string, File | File[] | null | undefined>;
  paymentStatus?: PaymentStatus;
}

async function getCaptchaToken(action: string): Promise<string | null> {
  const { executeRecaptcha, isRecaptchaConfigured, waitForRecaptcha } =
    await import("@/lib/security/recaptcha-client");

  if (!isRecaptchaConfigured()) {
    return process.env.NODE_ENV !== "production" ? "dev-bypass" : null;
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const ready = await waitForRecaptcha(attempt === 0 ? 20_000 : 12_000);
    if (!ready) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    const token = await executeRecaptcha(action);
    if (token) return token;
    await new Promise((r) => setTimeout(r, 600));
  }

  return null;
}

async function getUploadToken(captchaToken: string): Promise<string> {
  const res = await fetch("/api/v2/registration/verify-captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: captchaToken, action: "registration" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Security check failed"
    );
  }
  const body = await res.json();
  if (!body.uploadToken) {
    throw new Error("Security check failed");
  }
  return body.uploadToken as string;
}

async function uploadRegistrationFile(
  file: File,
  registrationType: RegistrationType,
  field: string,
  uploadToken: string
): Promise<UploadedFileMeta> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("registrationType", registrationType);
  formData.append("field", field);
  formData.append("uploadToken", uploadToken);

  const res = await fetch("/api/v2/registration/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "File upload failed"
    );
  }

  const body = await res.json();
  return body.file as UploadedFileMeta;
}

export function useRegistrationSubmit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitRegistration = async ({
    registrationType,
    data,
    files = {},
    paymentStatus,
  }: SubmitOptions) => {
    setLoading(true);
    try {
      const fee = data.registrationFee as number | undefined;
      const uploadEntries = Object.entries(files).filter(([, v]) => v);
      const captchaToken = await getCaptchaToken("registration");
      const hasVerifiedRazorpay = Boolean(
        (fee ?? 0) > 0 && String(data.razorpayPaymentId ?? "").trim()
      );
      if (!captchaToken && !hasVerifiedRazorpay) {
        toast.error(
          "Security check could not load. Disable ad blockers, refresh the page, and try again."
        );
        return;
      }

      let uploadToken: string | undefined;
      if (uploadEntries.length > 0) {
        if (!captchaToken) {
          toast.error("Security check required before uploading files.");
          return;
        }
        uploadToken = await getUploadToken(captchaToken);
      }

      const uploaded: Record<string, unknown> = {};

      if (uploadEntries.length > 0 && uploadToken) {
        await Promise.all(
          uploadEntries.map(async ([key, value]) => {
            if (!value) return;
            if (Array.isArray(value)) {
              const results: UploadedFileMeta[] = [];
              for (const file of value) {
                results.push(
                  await uploadRegistrationFile(file, registrationType, key, uploadToken!)
                );
              }
              uploaded[key] = results;
            } else {
              uploaded[key] = await uploadRegistrationFile(
                value,
                registrationType,
                key,
                uploadToken!
              );
            }
          })
        );
      }

      const resolvedPaymentStatus: PaymentStatus =
        paymentStatus ??
        resolvePaymentStatus(registrationType, {
          registrationFee: fee,
          hasPaymentProof: Boolean(
            data.utrNumber || data.transactionId || data.razorpayPaymentId
          ),
        });

      const payment =
        isPaidCapableType(registrationType) && (fee ?? 0) > 0
          ? buildPaymentPayload(data, uploaded, resolvedPaymentStatus)
          : undefined;

      const payload = {
        ...data,
        ...mapUploadedFiles(uploaded),
        ...(payment ? { payment } : {}),
        trafficSource: getTrafficSource(),
        ...attributionForSubmission(),
      };

      if (data.accommodationRequired === "Yes") {
        trackEvent(ANALYTICS_EVENTS.accommodationRequested, {
          registrationType,
        });
      }

      console.info("REGISTRATION_START", {
        registrationType,
        userEmail: data.email,
        fee,
        paymentId: data.razorpayPaymentId ?? null,
      });

      const res = await fetch("/api/v2/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captchaToken,
          registrationType,
          data: payload,
          paymentStatus: resolvedPaymentStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          typeof err.error === "string"
            ? err.error
            : "Registration failed. Please try again."
        );
      }

      const result = await res.json();

      if (result.duplicate) {
        toast.success("Registration already completed for this payment.");
      }

      trackEvent(ANALYTICS_EVENTS.registrationCompleted, {
        registrationType,
        source: getTrafficSource(),
      });

      clearAllRegistrationDrafts();
      toast.success("Registration submitted successfully!");
      if (typeof window !== "undefined" && typeof data.email === "string") {
        sessionStorage.setItem("smk_registration_email", data.email.trim());
      }
      const successParams = new URLSearchParams({
        id: result.registrationId,
      });
      if (result.lookupToken) {
        successParams.set("token", result.lookupToken);
      }
      router.push(`/registration/success?${successParams.toString()}`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(
        `${message} Need help? Contact us at /contact-us or email academics@shikshamahakumbh.com.`
      );
    } finally {
      setLoading(false);
    }
  };

  return { submitRegistration, loading };
}

function buildPaymentPayload(
  data: Record<string, unknown>,
  uploaded: Record<string, unknown>,
  paymentStatus: PaymentStatus
) {
  const receipt = uploaded.receipt as UploadedFileMeta | undefined;
  return {
    utrNumber: data.utrNumber,
    transactionId: data.transactionId,
    chequeNumber: data.chequeNumber,
    panNumber: data.panNumber,
    registrationFee: data.registrationFee,
    razorpayPaymentId: data.razorpayPaymentId,
    razorpayOrderId: data.razorpayOrderId,
    status: paymentStatus,
    amount: data.registrationFee,
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
  if (uploaded.studentIdCard) mapped.studentIdCard = uploaded.studentIdCard;
  return mapped;
}
