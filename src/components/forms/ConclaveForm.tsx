"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  conclaveSchema,
  ConclaveFormValues,
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
import { useState } from "react";

const CONCLAVE_OPTIONS = [
  "Vice Chancellor & Director Conclave",
  "School Leaders Conclave",
  "Talent Conclave",
  "Industry Conclave",
  "Startup Conclave",
  "Policy Conclave",
  "Research Conclave",
];

export default function ConclaveForm() {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConclaveFormValues>({
    resolver: zodResolver(conclaveSchema),
    defaultValues: { accommodationRequired: "No" },
  });

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const onSubmit = async (data: ConclaveFormValues) => {
    if (!receipt) {
      setReceiptError("Payment receipt is required");
      return;
    }
    setReceiptError(undefined);

    await submitRegistration({
      registrationType: "Conclave",
      data: {
        ...data,
        category: data.conclaveSelection,
      },
      files: { receipt },
      paymentStatus: "Paid",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title="Conclave Registration">
        <FormField
          label="Conclave Selection"
          name="conclaveSelection"
          as="select"
          required
          register={reg}
          errors={errs}
          options={CONCLAVE_OPTIONS.map((o) => ({ value: o, label: o }))}
        />
        <FormField
          label="Participation Type"
          name="participationType"
          as="select"
          required
          register={reg}
          errors={errs}
          options={["Speaker", "Delegate", "Invitee", "Observer"].map((o) => ({
            value: o,
            label: o,
          }))}
        />
        <div className="md:col-span-2">
          <PaymentBlock />
        </div>
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      <FormSection title="Payment Details" className="registration-payment">
        <FormField
          label="UTR Number"
          name="utrNumber"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Transaction ID"
          name="transactionId"
          required
          register={reg}
          errors={errs}
        />
        <FileUploadField
          label="Upload Payment Receipt"
          name="receipt"
          accept=".jpg,.jpeg,.png,.pdf"
          required
          onChange={setReceipt}
          error={receiptError}
          hint="Accepted: jpg, jpeg, png, pdf"
        />
      </FormSection>

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
