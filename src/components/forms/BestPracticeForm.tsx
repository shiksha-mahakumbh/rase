"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bestPracticeSchema,
  BestPracticeFormValues,
} from "@/lib/schemas/registrationSchemas";
import {
  CommonParticipantFields,
  AccommodationSection,
} from "@/components/forms/CommonParticipantFields";
import {
  FormField,
  FormSection,
  FileUploadField,
  sharedRegister,
  sharedErrors,
  sharedWatch,
} from "@/components/forms/FormField";
import { formClasses } from "@/components/forms/formClasses";
import { useRegistrationSubmit } from "@/lib/useRegistrationSubmit";
import { resolvePaymentStatus } from "@/lib/registration/config";
import { useState } from "react";
import RegistrationLegalNotice from "@/components/forms/RegistrationLegalNotice";

const AREAS = [
  "Education",
  "Health",
  "Environment",
  "Social Welfare",
  "Skill Development",
  "Innovation",
  "Governance",
  "Other",
];

export default function BestPracticeForm() {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [pdf, setPdf] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BestPracticeFormValues>({
    resolver: zodResolver(bestPracticeSchema),
    defaultValues: { accommodationRequired: "No" },
  });

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const description = watch("briefDescription") ?? "";
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  const onSubmit = async (data: BestPracticeFormValues) => {
    await submitRegistration({
      registrationType: "Best Practices",
      data: {
        ...data,
        category: data.areaOfWork,
        wordCount,
      },
      files: {
        supportingPdf: pdf,
        supportingPhotos: photos.length ? photos : undefined,
      },
      paymentStatus: resolvePaymentStatus("Best Practices"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title="Best Practice Details">
        <FormField
          label="Title of Best Practice"
          name="title"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Organization / Individual Name"
          name="organizationName"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Area of Work"
          name="areaOfWork"
          as="select"
          required
          register={reg}
          errors={errs}
          options={AREAS.map((a) => ({ value: a, label: a }))}
        />
        <div className="md:col-span-2">
          <FormField
            label="Brief Description (min 500 words)"
            name="briefDescription"
            as="textarea"
            rows={8}
            required
            register={reg}
            errors={errs}
          />
          <p className="text-xs text-gray-500">Word count: {wordCount} / 500</p>
        </div>
        <FormField
          label="Outcomes / Achievements"
          name="outcomes"
          as="textarea"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Scope for Replication"
          name="scopeForReplication"
          as="textarea"
          required
          register={reg}
          errors={errs}
        />
        <FileUploadField
          label="Supporting Documents (PDF)"
          name="supportingPdf"
          accept=".pdf"
          onChange={setPdf}
        />
        <FileUploadField
          label="Upload Photos"
          name="supportingPhotos"
          accept=".jpg,.jpeg,.png"
          onChange={(file) => file && setPhotos((p) => [...p, file])}
        />
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      <RegistrationLegalNotice />

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
