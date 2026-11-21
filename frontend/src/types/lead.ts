export const LEAD_STATUSES = [
  "New",
  "Qualified",
  "Contacted",
  "Interested",
  "Converted",
  "Rejected",
] as const;

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Google Ads",
  "Facebook",
  "Webinar",
  "Manual",
] as const;

export const LEAD_SERVICES = [
  "SEO",
  "Branding",
  "Social Media",
  "Email Marketing",
  "Automation",
  "Other",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadService = (typeof LEAD_SERVICES)[number];

export type Lead = {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  source: LeadSource;
  service: LeadService;
  message: string;
  score: number;
  status: LeadStatus;
  createdAt: string;
};