"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LEAD_SERVICES, LEAD_SOURCES } from "@/types/lead";
import { leadSchema, type LeadFormValues } from "@/lib/validation/lead";

const fieldClass =
  "w-full rounded-[10px] border border-border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary aria-[invalid=true]:border-destructive";

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-[13px] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({
  onSubmit,
  onCancel,
}: {
  // Return an error message for the email field (e.g. duplicate) or null on success.
  onSubmit: (values: LeadFormValues) => string | null;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      business: "",
      email: "",
      phone: "",
      website: "",
      category: "",
      source: "Website",
      service: "SEO",
      message: "",
      consent: false,
    },
  });

  const submit = (values: LeadFormValues) => {
    const problem = onSubmit(values);
    if (problem) setError("email", { message: problem });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name *" htmlFor="name" error={errors.name?.message}>
          <input id="name" {...register("name")} aria-invalid={!!errors.name} className={fieldClass} />
        </Field>
        <Field label="Business name" htmlFor="business">
          <input id="business" {...register("business")} className={fieldClass} />
        </Field>
        <Field label="Email address *" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} className={fieldClass} />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
          <input id="phone" {...register("phone")} aria-invalid={!!errors.phone} className={fieldClass} />
        </Field>
        <Field label="Website" htmlFor="website" error={errors.website?.message}>
          <input id="website" placeholder="https://" {...register("website")} aria-invalid={!!errors.website} className={fieldClass} />
        </Field>
        <Field label="Business category" htmlFor="category">
          <input id="category" {...register("category")} className={fieldClass} />
        </Field>
        <Field label="Lead source" htmlFor="source">
          <select id="source" {...register("source")} className={fieldClass}>
            {LEAD_SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Interested service" htmlFor="service">
          <select id="service" {...register("service")} className={fieldClass}>
            {LEAD_SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Additional message" htmlFor="message" error={errors.message?.message}>
        <textarea id="message" rows={3} {...register("message")} aria-invalid={!!errors.message} className={fieldClass} />
      </Field>
      <div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" {...register("consent")} className="mt-0.5 size-4 accent-[var(--primary)]" />
          <span>This person has agreed to be contacted. *</span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {errors.consent.message}
          </p>
        )}
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel}
          className="rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-sm transition hover:brightness-110 disabled:opacity-60">
          Add lead
        </button>
      </div>
    </form>
  );
}