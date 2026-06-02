"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { saveRegistration } from "@/lib/saveRegistration";
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
      };

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
