"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  genericSchema,
  GenericFormValues,
} from "@/lib/schemas/registrationSchemas";
import { CommonParticipantFields } from "@/components/forms/CommonParticipantFields";
import AccommodationNotice from "@/components/forms/AccommodationNotice";
import {
  FormField,
  FormSection,
  FileUploadField,
  PaymentBlock,
  sharedRegister,
  sharedErrors,
} from "@/components/forms/FormField";
import { formClasses } from "@/components/forms/formClasses";
import { useRegistrationSubmit } from "@/lib/useRegistrationSubmit";
import { RegistrationType } from "@/types/registration";
import { resolvePaymentStatus } from "@/lib/registration/config";
import { buildRazorpayOrderNotes } from "@/lib/razorpay/order-notes";
import {
  PROJECT_STUDENT_TYPE_LABELS,
  projectFeeForStudentType,
  type ProjectStudentType,
} from "@/lib/registration/fees";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";
import { useRegisterPaymentGate } from "@/hooks/useRegisterPaymentGate";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";
import { panRequiredForAmount } from "@/lib/registration/validation";
import toast from "react-hot-toast";
import RegistrationLegalNotice from "@/components/forms/RegistrationLegalNotice";

interface GenericRegistrationFormProps {
  registrationType: RegistrationType;
  sectionTitle: string;
  requiresPayment?: boolean;
}

const PROJECT_OPTIONS = (
  Object.entries(PROJECT_STUDENT_TYPE_LABELS) as [ProjectStudentType, { short: string; fee: number }][]
).map(([value, { short, fee }]) => ({
  value,
  label: `${short} — ₹${fee.toLocaleString("en-IN")}`,
}));

export default function GenericRegistrationForm({
  registrationType,
  sectionTitle,
  requiresPayment = false,
}: GenericRegistrationFormProps) {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const flow = useRegistrationFlow();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string>();
  const [paymentVerified, setPaymentVerified] = useState(false);

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
    defaultValues: {
      accommodationRequired: "No",
      projectStudentType: "School Student",
    },
  });

  useRegistrationDraft(registrationType, watch, reset);

  const projectStudentType = watch("projectStudentType");
  const fullName = watch("fullName");
  const email = watch("email");
  const contactNumber = watch("contactNumber");
  const institution = watch("institution");

  const fee = useMemo(() => {
    if (registrationType === "Projects") {
      return projectFeeForStudentType(projectStudentType ?? "School Student");
    }
    return 0;
  }, [registrationType, projectStudentType]);

  useEffect(() => {
    flow?.setCurrentFee(requiresPayment ? fee : 0);
  }, [fee, flow, requiresPayment]);

  useEffect(() => {
    setValue("registrationFee", fee);
  }, [fee, setValue]);

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
    ];
    if (registrationType === "Projects") fields.push("projectStudentType");
    return trigger(fields);
  }, [trigger, registrationType]);

  useRegisterPaymentGate(requiresPayment ? validateDetails : async () => true);

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);

  const orderNotes = useMemo(
    () =>
      buildRazorpayOrderNotes({
        registrationType,
        fullName: fullName?.trim(),
        email: email?.trim(),
        phone: contactNumber?.trim(),
        institution: institution?.trim(),
        category:
          registrationType === "Projects"
            ? projectStudentType ?? "School Student"
            : registrationType,
        amount: fee,
      }),
    [registrationType, fullName, email, contactNumber, institution, projectStudentType, fee]
  );

  const onSubmit = async (data: GenericFormValues) => {
    if (requiresPayment && fee > 0) {
      const paidOnline = Boolean(data.razorpayPaymentId?.trim());
      if (!paidOnline && !receipt && !data.utrNumber?.trim()) {
        setReceiptError("Complete Razorpay payment or upload payment receipt");
        toast.error("Payment proof is required before submitting.");
        return;
      }
    }
    setReceiptError(undefined);

    await submitRegistration({
      registrationType,
      data: {
        ...data,
        accommodationRequired: "No",
        category:
          registrationType === "Projects" ? data.projectStudentType : data.title,
        registrationFee: fee,
      },
      files: requiresPayment && receipt ? { receipt } : undefined,
      paymentStatus: resolvePaymentStatus(registrationType, {
        registrationFee: fee,
        hasPaymentProof: Boolean(
          data.utrNumber?.trim() || data.razorpayPaymentId?.trim() || receipt
        ),
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-registration-form>
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title={sectionTitle} className="registration-details">
        {registrationType === "Projects" && (
          <>
            <p className="md:col-span-2 text-sm text-slate-600">
              Select your project level. The registration fee is collected securely via Razorpay
              on the next step. Keep your payment confirmation for check-in.
            </p>
            <FormField
              label="Project Level"
              name="projectStudentType"
              as="select"
              required
              register={reg}
              errors={errs}
              options={PROJECT_OPTIONS}
            />
          </>
        )}

        <FormField
          label={registrationType === "Projects" ? "Project Title" : "Title / Subject"}
          name="title"
          required
          register={reg}
          errors={errs}
          placeholder="Short title of your project or display"
        />
        <FormField
          label="Description"
          name="description"
          as="textarea"
          rows={6}
          required
          register={reg}
          errors={errs}
          placeholder="Summarise your project, methodology, and what visitors will see at the exhibition."
        />

        {requiresPayment && fee > 0 && (
          <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-brand-navy">
              Registration Fee: ₹{fee.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-slate-600">
              Pay via Razorpay on the next step after confirming your details. Paid registrations
              are generally non-refundable once confirmed.
            </p>
          </div>
        )}
      </FormSection>

      <AccommodationNotice />

      {requiresPayment && fee > 0 && (
        <FormSection title="Payment" className="registration-payment">
          <PaymentBlock
            fee={fee}
            showPayButton
            customerName={fullName}
            customerEmail={email}
            customerPhone={contactNumber}
            orderNotes={orderNotes}
            onPaymentVerified={(p) => {
              setPaymentVerified(true);
              setValue("utrNumber", p.razorpay_payment_id);
              setValue("razorpayPaymentId", p.razorpay_payment_id);
              setValue("razorpayOrderId", p.razorpay_order_id);
              flow?.notifyPaymentVerified();
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
          <FormField
            label={`PAN Number${panRequiredForAmount(fee) ? "" : " (Optional)"}`}
            name="panNumber"
            required={panRequiredForAmount(fee)}
            register={reg}
            errors={errs}
            placeholder="ABCDE1234F"
          />
          <FileUploadField
            label="Upload Receipt (required if not paid online)"
            name="receipt"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={setReceipt}
            error={receiptError}
          />
        </FormSection>
      )}

      <RegistrationLegalNotice />

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
