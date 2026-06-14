"use client";

import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { formClasses } from "@/app/component/ui/formClasses";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";

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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
        />
      ) : as === "select" ? (
        <select
          id={name}
          className={className}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
        >
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          inputMode={type === "tel" ? "numeric" : undefined}
          maxLength={type === "tel" ? 10 : undefined}
          onInput={
            type === "tel"
              ? (e) => {
                  const el = e.currentTarget;
                  el.value = el.value.replace(/\D/g, "").slice(0, 10);
                }
              : undefined
          }
          {...register(name)}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${formClasses.section} ${className}`.trim()}>
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
  onPaymentVerified,
  customerName,
  customerEmail,
  customerPhone,
  orderNotes,
}: {
  fee?: number;
  showPayButton?: boolean;
  onPaymentVerified?: (payment: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
  }) => void;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderNotes?: Record<string, string>;
}) {
  const amount = typeof fee === "number" && fee > 0 ? fee : undefined;

  return (
    <div className={`registration-razorpay ${formClasses.notice} md:col-span-2`}>
      {typeof fee === "number" && (
        <p className="mb-2 font-semibold">
          Registration Fee: ₹{fee.toLocaleString("en-IN")}
        </p>
      )}
      {showPayButton && amount && (
        <>
          <p className="mb-2 text-sm">
            Pay securely via Razorpay, then enter your payment ID below (auto-filled
            after successful payment).
          </p>
          <RazorpayCheckout
            amountInRupees={amount}
            description="Shiksha Mahakumbh Registration Fee"
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
            orderNotes={orderNotes}
            onSuccess={(result) => {
              onPaymentVerified?.({
                razorpay_payment_id: result.razorpay_payment_id,
                razorpay_order_id: result.razorpay_order_id,
              });
            }}
          />
        </>
      )}
      {showPayButton && !amount && (
        <p className="text-sm text-slate-600">
          No registration fee for this category. Proceed to submit.
        </p>
      )}
    </div>
  );
}
