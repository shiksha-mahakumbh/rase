import {
  FormField,
  FileUploadField,
  FormSection,
  sharedRegister,
  sharedErrors,
} from "@/components/forms/FormField";
import { DELEGATE_STUDENT_TYPE_KEYS } from "@/lib/registration/delegate-categories";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { DelegateFormValues } from "@/lib/schemas/registrationSchemas";

type Props = {
  register: UseFormRegister<DelegateFormValues>;
  errors: FieldErrors<DelegateFormValues>;
  onStudentIdCardChange: (file: File | null) => void;
  studentIdCardError?: string;
};

export function DelegateStudentFields({
  register,
  errors,
  onStudentIdCardChange,
  studentIdCardError,
}: Props) {
  return (
    <FormSection title="Student Verification" className="registration-student-proof">
      <p className="md:col-span-2 text-sm text-slate-600">
        Free student registration requires proof of enrolment. Upload a valid school or college ID
        card and provide your roll number and course details.
      </p>
      <FormField
        label="Student Type"
        name="studentType"
        as="select"
        required
        register={sharedRegister(register)}
        errors={sharedErrors(errors)}
        options={DELEGATE_STUDENT_TYPE_KEYS.map((value) => ({
          value,
          label: value,
        }))}
      />
      <FormField
        label="Roll / Enrollment ID"
        name="studentIdNumber"
        required
        register={sharedRegister(register)}
        errors={sharedErrors(errors)}
        placeholder="e.g. 2024CS101"
      />
      <FormField
        label="Course / Class / Year"
        name="courseOrClass"
        required
        register={sharedRegister(register)}
        errors={sharedErrors(errors)}
        placeholder="e.g. Class 12, B.Tech 2nd Year"
      />
      <div className="md:col-span-2">
        <FileUploadField
        label="Student ID Card (required)"
        name="studentIdCard"
        accept=".jpg,.jpeg,.png,.pdf"
        required
        onChange={onStudentIdCardChange}
        error={studentIdCardError ?? (errors.studentIdCard?.message as string | undefined)}
      />
      </div>
    </FormSection>
  );
}
