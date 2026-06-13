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
  isPaidRegistrationType,
  resolvePaymentStatus,
} from "@/lib/registration/config";

interface SubmitOptions {
  registrationType: RegistrationType;
  data: Record<string, unknown>;
  files?: Record<string, File | File[] | null | undefined>;
  paymentStatus?: PaymentStatus;
}

async function getCaptchaToken(): Promise<string | null> {
  const { executeRecaptcha, isRecaptchaConfigured, waitForRecaptcha } =
    await import("@/lib/security/recaptcha-client");

  if (!isRecaptchaConfigured()) {
    return process.env.NODE_ENV !== "production" ? "dev-bypass" : null;
  }

  const ready = await waitForRecaptcha();
  if (!ready) return null;

  return executeRecaptcha("registration");
}

async function uploadRegistrationFile(
  file: File,
  registrationType: RegistrationType,
  field: string
): Promise<UploadedFileMeta> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("registrationType", registrationType);
  formData.append("field", field);

  const res = await fetch("/api/registration/upload", {
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
      const captchaToken = await getCaptchaToken();
      if (!captchaToken) {
        toast.error(
          "Security check is still loading. Please wait a moment and try again."
        );
        return;
      }

      const uploaded: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(files)) {
        if (!value) continue;

        if (Array.isArray(value)) {
          const results: UploadedFileMeta[] = [];
          for (const file of value) {
            results.push(
              await uploadRegistrationFile(file, registrationType, key)
            );
          }
          uploaded[key] = results;
        } else {
          uploaded[key] = await uploadRegistrationFile(
            value,
            registrationType,
            key
          );
        }
      }

      const fee = data.registrationFee as number | undefined;
      const resolvedPaymentStatus: PaymentStatus =
        paymentStatus ??
        resolvePaymentStatus(registrationType, {
          registrationFee: fee,
          hasPaymentProof: Boolean(
            data.utrNumber || data.transactionId || data.razorpayPaymentId
          ),
        });

      const payment = isPaidRegistrationType(registrationType)
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

      const res = await fetch("/api/registration/submit", {
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
      const successParams = new URLSearchParams({
        id: result.registrationId,
      });
      if (result.lookupToken) {
        successParams.set("token", result.lookupToken);
      }
      router.push(`/registration/success?${successParams.toString()}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
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
  return mapped;
}
