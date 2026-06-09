"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  genericSchema,
  GenericFormValues,
} from "@/lib/schemas/registrationSchemas";
import {
  CommonParticipantFields,
  AccommodationSection,
} from "@/components/forms/CommonParticipantFields";
import {
  FormField,
  FormSection,
  FileUploadField,
  PaymentBlock,
  sharedRegister,
  sharedErrors,
  sharedWatch,
} from "@/components/forms/FormField";
import { formClasses } from "@/app/component/ui/formClasses";
import { useRegistrationSubmit } from "@/lib/useRegistrationSubmit";
import {
  PROJECT_REGISTRATION_FEE,
  RegistrationType,
} from "@/types/registration";
import { resolvePaymentStatus } from "@/lib/registration/config";
import { useState } from "react";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";

interface GenericRegistrationFormProps {
  registrationType: RegistrationType;
  sectionTitle: string;
  requiresPayment?: boolean;
}

export default function GenericRegistrationForm({
  registrationType,
  sectionTitle,
  requiresPayment = false,
}: GenericRegistrationFormProps) {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string>();

  const fee =
    registrationType === "Projects" ? PROJECT_REGISTRATION_FEE : undefined;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GenericFormValues>({
    resolver: zodResolver(genericSchema),
    defaultValues: { accommodationRequired: "No" },
  });

  useRegistrationDraft(registrationType, watch, reset);

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const onSubmit = async (data: GenericFormValues) => {
    if (requiresPayment && fee && !data.utrNumber?.trim()) {
      setReceiptError("Payment confirmation (UTR / payment ID) is required");
      return;
    }
    setReceiptError(undefined);

    await submitRegistration({
      registrationType,
      data: {
        ...data,
        category: data.title,
        registrationFee: fee ?? 0,
      },
      files: requiresPayment ? { receipt } : undefined,
      paymentStatus: resolvePaymentStatus(registrationType, {
        registrationFee: fee,
        hasPaymentProof: Boolean(data.utrNumber?.trim()),
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title={sectionTitle} className="registration-details">
        <FormField
          label="Title / Subject"
          name="title"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Description"
          name="description"
          as="textarea"
          rows={6}
          required
          register={reg}
          errors={errs}
        />
        {requiresPayment && fee && (
          <div className="md:col-span-2">
            <PaymentBlock
              fee={fee}
              showPayButton
              onPaymentVerified={(p) => {
                setValue("utrNumber", p.razorpay_payment_id);
                setValue("razorpayPaymentId", p.razorpay_payment_id);
                setValue("razorpayOrderId", p.razorpay_order_id);
              }}
            />
          </div>
        )}
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      {requiresPayment && (
        <FormSection title="Payment Details" className="registration-payment">
          <FormField
            label="UTR / Payment ID"
            name="utrNumber"
            required
            register={reg}
            errors={errs}
          />
          <FileUploadField
            label="Upload Receipt"
            name="receipt"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={setReceipt}
            error={receiptError}
          />
        </FormSection>
      )}

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
