"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import {
  FormField,
  FormRadioGroup,
  FormSection,
  SharedFormValues,
} from "@/components/forms/FormField";

const ACCOMMODATION_DATES = [
  "8–11 Oct 2026",
  "8–10 Oct 2026",
  "8–9 Oct 2026",
  "9–11 Oct 2026",
  "9–10 Oct 2026",
  "10–11 Oct 2026",
  "8 Oct Only",
  "9 Oct Only",
  "10 Oct Only",
  "11 Oct Only",
];

const ACCOMMODATION_TYPES = ["Single Room", "Double Sharing", "Dormitory"];

const PARTICIPANT_CATEGORIES = [
  "Author",
  "Faculty",
  "Teacher",
  "Student",
  "Research Scholar",
  "Industry",
  "Guest",
  "VVIP",
  "Organizer",
  "Volunteer",
  "Other",
];

interface SharedFormProps {
  register: UseFormRegister<SharedFormValues>;
  errors?: FieldErrors<SharedFormValues>;
}

export function CommonParticipantFields({
  register,
  errors,
}: SharedFormProps) {
  return (
    <FormSection title="Participant Details" className="registration-details">
      <FormField
        label="Full Name"
        name="fullName"
        required
        register={register}
        errors={errors}
      />
      <FormRadioGroup
        label="Gender"
        name="gender"
        options={["Male", "Female", "Other"]}
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="Designation / Role"
        name="designation"
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="Institution / Organization / Affiliation"
        name="institution"
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="Address"
        name="address"
        required
        as="textarea"
        rows={2}
        register={register}
        errors={errors}
      />
      <FormField
        label="Country"
        name="country"
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="Email ID"
        name="email"
        type="email"
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="Contact Number"
        name="contactNumber"
        type="tel"
        required
        register={register}
        errors={errors}
      />
      <FormField
        label="WhatsApp Number"
        name="whatsappNumber"
        type="tel"
        register={register}
        errors={errors}
      />
      <FormRadioGroup
        label="Are you from Vidya Bharti?"
        name="vidyaBharti"
        options={["Vidya Bharti", "Non Vidya Bharti"]}
        required
        register={register}
        errors={errors}
      />
    </FormSection>
  );
}

interface AccommodationSectionProps extends SharedFormProps {
  watch: UseFormWatch<SharedFormValues>;
}

export function AccommodationSection({
  register,
  watch,
  errors,
}: AccommodationSectionProps) {
  const required = watch("accommodationRequired");

  return (
    <>
      <FormRadioGroup
        label="Accommodation Required"
        name="accommodationRequired"
        options={["Yes", "No"]}
        required
        register={register}
        errors={errors}
      />

      {required === "Yes" && (
        <FormSection title="Accommodation Details">
          <FormField
            label="Accommodation Date"
            name="accommodationDate"
            as="select"
            required
            register={register}
            errors={errors}
            options={ACCOMMODATION_DATES.map((d) => ({ value: d, label: d }))}
          />
          <FormField
            label="Accommodation Type"
            name="accommodationType"
            as="select"
            required
            register={register}
            errors={errors}
            options={ACCOMMODATION_TYPES.map((d) => ({ value: d, label: d }))}
          />
          <FormField
            label="Participant Category"
            name="participantCategory"
            as="select"
            required
            register={register}
            errors={errors}
            options={PARTICIPANT_CATEGORIES.map((d) => ({
              value: d,
              label: d,
            }))}
          />
        </FormSection>
      )}
    </>
  );
}
