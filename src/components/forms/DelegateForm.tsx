"use client";

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
import { useMemo, useState } from "react";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";

const defaultValues: Partial<DelegateFormValues> = {
  accommodationRequired: "No",
  gender: undefined,
  vidyaBharti: undefined,
};

export default function DelegateForm() {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DelegateFormValues>({
    resolver: zodResolver(delegateSchema),
    defaultValues,
  });

  useRegistrationDraft("Delegate Registration", watch, reset);

  const category = watch("delegateCategory");
  const fee = useMemo(
    () => (category ? DELEGATE_FEES[category] ?? 0 : 0),
    [category]
  );

  const onSubmit = async (data: DelegateFormValues) => {
    if (fee > 0 && !receipt) {
      setReceiptError("Payment receipt is required");
      return;
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
      files: { receipt },
      paymentStatus: fee > 0 && data.utrNumber ? "Paid" : "Pending",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="flex items-end md:col-span-2">
          <PaymentBlock fee={fee} showPayButton={fee > 0} />
        </div>
      </FormSection>

      <AccommodationSection register={sharedRegister(register)} watch={sharedWatch(watch)} errors={sharedErrors(errors)} />

      {fee > 0 && (
        <FormSection title="Payment Details" className="registration-payment">
          <FormField
            label="UTR Number"
            name="utrNumber"
            required
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
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
            label="PAN Number"
            name="panNumber"
            register={sharedRegister(register)}
            errors={sharedErrors(errors)}
          />
          <FileUploadField
            label="Upload Receipt"
            name="receipt"
            accept=".jpg,.jpeg,.png,.pdf"
            required
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
