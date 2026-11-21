import { z } from "zod";
import { LEAD_SERVICES, LEAD_SOURCES } from "@/types/lead";

const isUrlOrEmpty = (v: string) => {
  if (v === "") return true;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter the lead's full name."),
  business: z.string().trim(),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+?[0-9 ()-]{7,20}$/.test(v), "Enter a valid phone number."),
  website: z
    .string()
    .trim()
    .refine(isUrlOrEmpty, "Enter a full URL, for example https://example.com"),
  category: z.string().trim(),
  source: z.enum(LEAD_SOURCES),
  service: z.enum(LEAD_SERVICES),
  message: z.string().trim().max(500, "Keep the message under 500 characters."),
  consent: z.boolean().refine((v) => v === true, "Consent is required before contacting this lead."),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();