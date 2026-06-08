"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  awardsSchema,
  AwardsFormValues,
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
import { formClasses } from "@/app/component/ui/formClasses";
import { useRegistrationSubmit } from "@/lib/useRegistrationSubmit";
import { resolvePaymentStatus } from "@/lib/registration/config";
import { useState } from "react";

const AWARD_CATEGORIES = [
  "Best Teacher",
  "Best Principal",
  "Best Institution",
  "Best Innovation",
  "Best Startup",
  "Best Researcher",
  "Talent Recognition",
];

export default function AwardsForm() {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [pdf, setPdf] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [letter, setLetter] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AwardsFormValues>({
    resolver: zodResolver(awardsSchema),
    defaultValues: { accommodationRequired: "No" },
  });

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const onSubmit = async (data: AwardsFormValues) => {
    await submitRegistration({
      registrationType: "Awards",
      data: {
        ...data,
        category: data.awardCategory,
      },
      files: {
        supportingPdf: pdf,
        supportingPhotos: photos.length ? photos : undefined,
        recommendationLetter: letter,
      },
      paymentStatus: resolvePaymentStatus("Awards"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title="Awards Registration">
        <FormField
          label="Award Category"
          name="awardCategory"
          as="select"
          required
          register={reg}
          errors={errs}
          options={AWARD_CATEGORIES.map((a) => ({ value: a, label: a }))}
        />
      </FormSection>

      <FormSection title="Nominee Details">
        <FormField
          label="Nominee Name"
          name="nomineeName"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Nominee Designation"
          name="nomineeDesignation"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Nominee Institution"
          name="nomineeInstitution"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Achievements"
          name="achievements"
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
        <FileUploadField
          label="Upload Recommendation Letter"
          name="recommendationLetter"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={setLetter}
        />
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
