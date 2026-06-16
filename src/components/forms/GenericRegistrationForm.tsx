"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { RegistrationType } from "@/types/registration";
import { resolvePaymentStatus } from "@/lib/registration/config";
import {
  accommodationFeeForBedType,
  projectFeeForStudentType,
} from "@/lib/registration/fees";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";
import { useRegisterPaymentGate } from "@/hooks/useRegisterPaymentGate";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";
import { panRequiredForAmount } from "@/lib/registration/validation";
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
      accommodationBedType: "Single Bed",
    },
  });

  useRegistrationDraft(registrationType, watch, reset);

  const projectStudentType = watch("projectStudentType");
  const accommodationBedType = watch("accommodationBedType");
  const fullName = watch("fullName");
  const email = watch("email");
  const contactNumber = watch("contactNumber");

  const fee = useMemo(() => {
    if (registrationType === "Projects") {
      return projectFeeForStudentType(projectStudentType ?? "School Student");
    }
    if (registrationType === "Accommodation") {
      return accommodationFeeForBedType(accommodationBedType ?? "Single Bed");
    }
    return 0;
  }, [registrationType, projectStudentType, accommodationBedType]);

  useEffect(() => {
    flow?.setCurrentFee(requiresPayment ? fee : 0);
  }, [fee, flow, requiresPayment]);

  useEffect(() => {
    setValue("registrationFee", fee);
  }, [fee, setValue]);

  useEffect(() => {
    if (registrationType === "Accommodation") {
      setValue("title", `Accommodation — ${accommodationBedType ?? "Single Bed"}`);
      setValue("description", "Accommodation portal registration");
    }
  }, [registrationType, accommodationBedType, setValue]);

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
      "accommodationRequired",
    ];
    if (registrationType === "Projects") fields.push("projectStudentType");
    if (registrationType === "Accommodation") {
      fields.push("accommodationBedType");
    } else {
      fields.push("title", "description");
    }
    return trigger(fields);
  }, [trigger, registrationType]);

  useRegisterPaymentGate(requiresPayment ? validateDetails : async () => true);

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const orderNotes = useMemo(
    () => ({
      registrationType,
      email: email?.trim() || "unknown",
      category:
        registrationType === "Projects"
          ? projectStudentType ?? "School Student"
          : registrationType === "Accommodation"
            ? accommodationBedType ?? "Single Bed"
            : registrationType,
      amount: String(fee),
    }),
    [
      registrationType,
      email,
      projectStudentType,
      accommodationBedType,
      fee,
    ]
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
        category:
          registrationType === "Projects"
            ? data.projectStudentType
            : registrationType === "Accommodation"
              ? data.accommodationBedType
              : data.title,
        registrationFee: fee,
        title:
          registrationType === "Accommodation"
            ? `Accommodation — ${data.accommodationBedType}`
            : data.title,
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
          <FormField
            label="Student Type"
            name="projectStudentType"
            as="select"
            required
            register={reg}
            errors={errs}
            options={[
              { value: "School Student", label: "School Student — ₹200" },
              { value: "College Student", label: "College Student — ₹400" },
            ]}
          />
        )}

        {registrationType === "Accommodation" && (
          <>
            <FormField
              label="Bed Type"
              name="accommodationBedType"
              as="select"
              required
              register={reg}
              errors={errs}
              options={[
                { value: "Single Bed", label: "Single Bed — ₹3,000" },
                { value: "Double Bed", label: "Double Bed — ₹6,000" },
              ]}
            />
            <FormField
              label="Additional Notes"
              name="description"
              as="textarea"
              rows={4}
              register={reg}
              errors={errs}
              placeholder="Any special requirements"
            />
          </>
        )}

        {registrationType !== "Accommodation" && (
          <>
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
          </>
        )}

        {requiresPayment && fee > 0 && (
          <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-brand-navy">
              Registration Fee: ₹{fee.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-slate-600">
              Pay via Razorpay on the next step after confirming your details.
            </p>
          </div>
        )}
      </FormSection>

      {registrationType !== "Accommodation" && (
        <AccommodationSection register={reg} watch={watchShared} errors={errs} />
      )}

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

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
