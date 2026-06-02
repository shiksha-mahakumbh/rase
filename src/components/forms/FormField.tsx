"use client";

import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { formClasses } from "@/app/component/ui/formClasses";

export type SharedFormValues = Record<string, unknown>;

export function sharedRegister<T extends FieldValues>(
  register: UseFormRegister<T>
): UseFormRegister<SharedFormValues> {
  return register as UseFormRegister<SharedFormValues>;
}

export function sharedErrors<T extends FieldValues>(
  errors?: FieldErrors<T>
): FieldErrors<SharedFormValues> | undefined {
  return errors as FieldErrors<SharedFormValues> | undefined;
}

export function sharedWatch<T extends FieldValues>(
  watch: UseFormWatch<T>
): UseFormWatch<SharedFormValues> {
  return watch as UseFormWatch<SharedFormValues>;
}

interface FieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<SharedFormValues>;
  errors?: FieldErrors<SharedFormValues>;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  rows?: number;
}

export function FormField({
  label,
  name,
  required,
  type = "text",
  placeholder,
  register,
  errors,
  as = "input",
  options,
  rows = 4,
}: FieldProps) {
  const error = errors?.[name]?.message as string | undefined;
  const className =
    as === "textarea"
      ? formClasses.textarea
      : as === "select"
        ? formClasses.select
        : formClasses.input;

  return (
    <div className={formClasses.fieldGroup}>
      <label htmlFor={name} className={formClasses.label}>
        {label}{" "}
        {required && <span className={formClasses.required}>*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={className}
          {...register(name)}
        />
      ) : as === "select" ? (
        <select id={name} className={className} {...register(name)}>
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={className}
          {...register(name)}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={formClasses.section}>
      <h2 className={formClasses.sectionTitle}>{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function FormRadioGroup({
  label,
  name,
  options,
  required,
  register,
  errors,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  register: UseFormRegister<SharedFormValues>;
  errors?: FieldErrors<SharedFormValues>;
}) {
  const error = errors?.[name]?.message as string | undefined;

  return (
    <div className={`${formClasses.fieldGroup} md:col-span-2`}>
      <p className={formClasses.label}>
        {label}{" "}
        {required && <span className={formClasses.required}>*</span>}
      </p>
      <div className="mt-2 flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              value={opt}
              className="h-4 w-4 text-primary"
              {...register(name)}
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FileUploadField({
  label,
  name,
  accept,
  required,
  onChange,
  error,
  hint,
}: {
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <div className={formClasses.fieldGroup}>
      <label htmlFor={name} className={formClasses.label}>
        {label}{" "}
        {required && <span className={formClasses.required}>*</span>}
      </label>
      <input
        id={name}
        type="file"
        accept={accept}
        className={formClasses.input}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function PaymentBlock({
  fee,
  showPayButton = true,
}: {
  fee?: number;
  showPayButton?: boolean;
}) {
  return (
    <div className={`${formClasses.notice} md:col-span-2`}>
      {typeof fee === "number" && (
        <p className="mb-2 font-semibold">
          Registration Fee: ₹{fee.toLocaleString("en-IN")}
        </p>
      )}
      {showPayButton && (
        <>
          <p className="mb-2 text-sm">
            1. Complete the form → 2. Pay registration fee → 3. Return and enter
            payment details
          </p>
          <a
            href="https://rzp.io/rzp/MMLfl4L2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Pay Registration Fee
          </a>
        </>
      )}
    </div>
  );
}
