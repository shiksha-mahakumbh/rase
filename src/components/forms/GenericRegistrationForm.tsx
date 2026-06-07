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
import { RegistrationType } from "@/types/registration";
import { useState } from "react";
import { useRegistrationDraft } from "@/hooks/useRegistrationDraft";

interface GenericRegistrationFormProps {
  registrationType: RegistrationType;
  sectionTitle: string;
}

export default function GenericRegistrationForm({
  registrationType,
  sectionTitle,
}: GenericRegistrationFormProps) {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [receipt, setReceipt] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
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
    await submitRegistration({
      registrationType,
      data: {
        ...data,
        category: data.title,
      },
      files: { receipt },
      paymentStatus: data.utrNumber ? "Paid" : "Pending",
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
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      <FormSection title="Payment Details (if applicable)" className="registration-payment">
        <div className="md:col-span-2">
          <PaymentBlock />
        </div>
        <FormField
          label="UTR Number"
          name="utrNumber"
          register={reg}
          errors={errs}
        />
        <FileUploadField
          label="Upload Receipt"
          name="receipt"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={setReceipt}
        />
      </FormSection>

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
