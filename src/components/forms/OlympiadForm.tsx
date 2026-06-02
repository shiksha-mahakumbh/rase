"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  olympiadSchema,
  OlympiadFormValues,
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
import { OLYMPIAD_FEE_PER_STUDENT } from "@/types/registration";
import {
  parseStudentListFile,
  validateStudentListFile,
  ParsedStudent,
} from "@/lib/parseStudentList";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OlympiadForm() {
  const { submitRegistration, loading } = useRegistrationSubmit();
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [receipt, setReceipt] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OlympiadFormValues>({
    resolver: zodResolver(olympiadSchema),
    defaultValues: {
      accommodationRequired: "No",
      studentCount: 0,
      registrationFee: 0,
    },
  });

  const reg = sharedRegister(register);
  const errs = sharedErrors(errors);
  const watchShared = sharedWatch(watch);

  const studentCount = watch("studentCount");
  const registrationFee = watch("registrationFee");

  const handleStudentFile = async (file: File | null) => {
    setStudentFile(file);
    setParsedStudents([]);
    setValue("studentCount", 0);
    setValue("registrationFee", 0);

    if (!file) return;

    const validationError = validateStudentListFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const { students, count } = await parseStudentListFile(file);
      setParsedStudents(students);
      setValue("studentCount", count);
      setValue("registrationFee", count * OLYMPIAD_FEE_PER_STUDENT);
      toast.success(`Parsed ${count} students`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to parse student list"
      );
    }
  };

  const onSubmit = async (data: OlympiadFormValues) => {
    if (!studentFile || !parsedStudents.length) {
      toast.error("Please upload a valid student list");
      return;
    }

    await submitRegistration({
      registrationType: "Olympiad",
      data: {
        ...data,
        category: data.olympiadType,
        parsedStudents,
      },
      files: { studentList: studentFile, receipt },
      paymentStatus:
        data.registrationFee > 0 && data.utrNumber ? "Paid" : "Pending",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CommonParticipantFields register={reg} errors={errs} />

      <FormSection title="Olympiad Registration">
        <FormField
          label="Olympiad Type"
          name="olympiadType"
          as="select"
          required
          register={reg}
          errors={errs}
          options={[
            "English Olympiad",
            "Mathematics Olympiad",
            "Tech Olympiad",
          ].map((o) => ({ value: o, label: o }))}
        />
      </FormSection>

      <FormSection title="School Information">
        <FormField
          label="School Name"
          name="schoolName"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="School Address"
          name="schoolAddress"
          as="textarea"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Principal Name"
          name="principalName"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Principal Email"
          name="principalEmail"
          type="email"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Coordinator Name"
          name="coordinatorName"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Coordinator Contact Number"
          name="coordinatorContact"
          type="tel"
          required
          register={reg}
          errors={errs}
        />
        <FormField
          label="Coordinator Email"
          name="coordinatorEmail"
          type="email"
          required
          register={reg}
          errors={errs}
        />
        <FileUploadField
          label="Upload Student List"
          name="studentList"
          accept=".xls,.xlsx,.csv"
          required
          onChange={handleStudentFile}
          hint="Max 10 MB. Columns: Student Name, Parent Name, Class, Section, Roll No, School"
        />
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 md:col-span-2">
          <p className="font-semibold text-primary">
            Number of Students: {studentCount}
          </p>
          <p className="text-sm text-gray-700">
            Registration Fee: ₹{registrationFee.toLocaleString("en-IN")}
          </p>
        </div>
      </FormSection>

      <AccommodationSection register={reg} watch={watchShared} errors={errs} />

      {registrationFee > 0 && (
        <FormSection title="Payment Details">
          <div className="md:col-span-2">
            <PaymentBlock fee={registrationFee} />
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
      )}

      <button type="submit" disabled={loading} className={formClasses.submitBtn}>
        {loading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
