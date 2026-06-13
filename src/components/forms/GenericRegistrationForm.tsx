"use client";

import { useCallback, useState } from "react";
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
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";
import { useRegisterPaymentGate } from "@/hooks/useRegisterPaymentGate";
import toast from "react-hot-toast";

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
  const [paymentVerified, setPaymentVerified] = useState(false);

  const fee =
    registrationType === "Projects" ? PROJECT_REGISTRATION_FEE : undefined;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<GenericFormValues>({
    resolver: zodResolver(genericSchema),
    defaultValues: { accommodationRequired: "No" },
  });

  useRegistrationDraft(registrationType, watch, reset);

  const fullName = watch("fullName");
  const email = watch("email");
  const contactNumber = watch("contactNumber");

  const validateDetails = useCallback(async () => {
    const fields: (keyof GenericFormValues)[] = [
      "fullName",
      "email",
      "contactNumber",
      "designation",
      "institution",
      "address",
      "country",
      "gender",
      "vidyaBharti",
      "title",
      "description",
      "accommodationRequired",
    ];
    return trigger(fields);
  }, [trigger]);

  useRegisterPaymentGate(requiresPayment ? validateDetails : async () => true);

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const onSubmit = async (data: GenericFormValues) => {
    if (requiresPayment && fee) {
      const paidOnline = Boolean(data.razorpayPaymentId?.trim());
      if (!paidOnline && !data.utrNumber?.trim()) {
        setReceiptError("Complete Razorpay payment or enter payment ID");
        toast.error("Please complete Razorpay payment before submitting.");
        return;
      }
    }
    setReceiptError(undefined);

    await submitRegistration({
      registrationType,
      data: {
        ...data,
        category: data.title,
        registrationFee: fee ?? 0,
      },
      files: requiresPayment && receipt ? { receipt } : undefined,
      paymentStatus: resolvePaymentStatus(registrationType, {
        registrationFee: fee,
        hasPaymentProof: Boolean(
          data.utrNumber?.trim() || data.razorpayPaymentId?.trim()
        ),
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-registration-form>
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
          <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-brand-navy">
              Registration Fee: ₹{fee.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-slate-600">
              You will pay via Razorpay on the next step after confirming your details.
            </p>
          </div>
        )}
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      {requiresPayment && fee && (
        <FormSection title="Payment" className="registration-payment">
          <PaymentBlock
            fee={fee}
            showPayButton
            customerName={fullName}
            customerEmail={email}
            customerPhone={contactNumber}
            onPaymentVerified={(p) => {
              setPaymentVerified(true);
              setValue("utrNumber", p.razorpay_payment_id);
              setValue("razorpayPaymentId", p.razorpay_payment_id);
              setValue("razorpayOrderId", p.razorpay_order_id);
            }}
          />
          {paymentVerified && (
            <p className="md:col-span-2 text-sm font-medium text-emerald-700">
              Payment verified. Submit your registration below.
            </p>
          )}
          <FormField
            label="UTR / Payment ID"
            name="utrNumber"
            register={reg}
            errors={errs}
            placeholder="Auto-filled after Razorpay payment"
          />
          <FileUploadField
            label="Upload Receipt (optional if paid online)"
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
