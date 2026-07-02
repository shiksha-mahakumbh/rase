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
import { useRegistrationProof } from "@/hooks/useRegistrationProof";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";

interface SubmitOptions {
  registrationType: RegistrationType;
  data: Record<string, unknown>;
  files?: Record<string, File | File[] | null | undefined>;
  paymentStatus?: PaymentStatus;
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
  const flow = useRegistrationFlow();
  const [loading, setLoading] = useState(false);
  const { ensureFresh } = useRegistrationProof(true);

  const submitRegistration = async ({
    registrationType,
    data,
    files = {},
    paymentStatus,
  }: SubmitOptions) => {
    setLoading(true);
    try {
      if (flow?.honeypotValue?.trim()) {
        toast.error("Submission blocked. Please try again or contact support.");
        return;
      }

      const fee = data.registrationFee as number | undefined;
      const uploadEntries = Object.entries(files).filter(([, v]) => v);
      const hasVerifiedRazorpay = Boolean(
        (fee ?? 0) > 0 && String(data.razorpayPaymentId ?? "").trim()
      );

      let registrationProof: string | undefined;
      let uploadToken: string | undefined;

      if (!hasVerifiedRazorpay) {
        const proofBundle = await ensureFresh();
        registrationProof = proofBundle.proofToken;
        uploadToken = proofBundle.uploadToken;
      } else if (uploadEntries.length > 0) {
        const proofBundle = await ensureFresh();
        uploadToken = proofBundle.uploadToken;
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
          registrationProof,
          registrationType,
          data: payload,
          paymentStatus: resolvedPaymentStatus,
          companyWebsite: flow?.honeypotValue ?? "",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message =
          typeof err.error === "string"
            ? err.error
            : "Registration failed. Please try again.";
        if (res.status === 403 && message.toLowerCase().includes("session")) {
          throw new Error(`${message} If this continues, wait a few seconds after opening the form.`);
        }
        throw new Error(message);
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
