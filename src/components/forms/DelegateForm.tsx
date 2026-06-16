"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  delegateSchema,
  DelegateFormValues,
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
import { DELEGATE_FEES } from "@/types/registration";
import { useRegistrationSubmit } from "@/lib/useRegistrationSubmit";
import { resolvePaymentStatus } from "@/lib/registration/config";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";
import { useRegisterPaymentGate } from "@/hooks/useRegisterPaymentGate";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";
import { panRequiredForAmount } from "@/lib/registration/validation";
import toast from "react-hot-toast";

const defaultValues: Partial<DelegateFormValues> = {
  accommodationRequired: "No",
  gender: undefined,
  vidyaBharti: undefined,
};

export default function DelegateForm() {
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
  } = useForm<DelegateFormValues>({
    resolver: zodResolver(delegateSchema),
    defaultValues,
  });

  useRegistrationDraft("Delegate Registration", watch, reset);

  const category = watch("delegateCategory");
  const fullName = watch("fullName");
  const email = watch("email");
  const contactNumber = watch("contactNumber");
  const fee = useMemo(
    () => (category ? DELEGATE_FEES[category] ?? 0 : 0),
    [category]
  );

  useEffect(() => {
    flow?.setCurrentFee(fee);
  }, [fee, flow]);

  const validateDetails = useCallback(async () => {
    const fields: (keyof DelegateFormValues)[] = [
      "fullName",
      "email",
      "contactNumber",
      "designation",
      "institution",
      "address",
      "country",
      "gender",
      "vidyaBharti",
      "delegateCategory",
      "accommodationRequired",
    ];
    return trigger(fields);
  }, [trigger]);

  useRegisterPaymentGate(validateDetails);

  const onSubmit = async (data: DelegateFormValues) => {
    if (fee > 0) {
      const paidOnline = Boolean(data.razorpayPaymentId?.trim());
      if (!paidOnline && !receipt) {
        setReceiptError("Complete Razorpay payment or upload a payment receipt");
        toast.error("Please complete Razorpay payment before submitting.");
        return;
      }
    }
    setReceiptError(undefined);

    await submitRegistration({
      registrationType: "Delegate Registration",
      data: {
        ...data,
        delegateCategory: data.delegateCategory,
        registrationFee: fee,
        category: data.delegateCategory,
      },
      files: receipt ? { receipt } : undefined,
      paymentStatus: resolvePaymentStatus("Delegate Registration", {
        registrationFee: fee,
        hasPaymentProof: Boolean(
          data.utrNumber?.trim() || data.razorpayPaymentId?.trim()
        ),
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-registration-form>
      <CommonParticipantFields register={sharedRegister(register)} errors={sharedErrors(errors)} />

      <FormSection title="Delegate Registration" className="registration-details">
        <FormField
          label="Delegate Category"
          name="delegateCategory"
          as="select"
          required
          register={sharedRegister(register)}
          errors={sharedErrors(errors)}
          options={Object.keys(DELEGATE_FEES).map((k) => ({
            value: k,
            label: k,
          }))}
        />
        {fee > 0 ? (
          <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-brand-navy">
              Registration Fee: ₹{fee.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-slate-600">
              You will pay via Razorpay on the next step after confirming your details.
            </p>
          </div>
        ) : category ? (
          <div className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            No payment required for this category. Submit directly after filling details.
          </div>
        ) : null}
      </FormSection>

      <AccommodationSection register={sharedRegister(register)} watch={sharedWatch(watch)} errors={sharedErrors(errors)} />

      {fee > 0 && (
        <FormSection title="Payment" className="registration-payment">
          <PaymentBlock
            fee={fee}
            showPayButton
            customerName={fullName}
            customerEmail={email}
            customerPhone={contactNumber}
            orderNotes={{
              registrationType: "Delegate Registration",
              email: email?.trim() || "unknown",
              category: category ?? "General",
              amount: String(fee),
            }}
            onPaymentVerified={(p) => {
              setPaymentVerified(true);
              setValue("transactionId", p.razorpay_payment_id);
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
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
            placeholder="Auto-filled after Razorpay payment"
          />
          <FormField
            label="Transaction Number"
            name="transactionId"
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
          />
          <FormField
            label="Cheque Number (Optional)"
            name="chequeNumber"
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
          />
          <FormField
            label={`PAN Number${panRequiredForAmount(fee) ? "" : " (Optional)"}`}
            name="panNumber"
            required={panRequiredForAmount(fee)}
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
            placeholder="ABCDE1234F"
          />
          <FileUploadField
            label="Upload Receipt (optional if paid online via Razorpay)"
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
