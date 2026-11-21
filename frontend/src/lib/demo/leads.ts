// DEMO DATA ONLY. Replaced by backend API responses in a later stage.
import type { Lead, LeadService, LeadSource, LeadStatus } from "@/types/lead";

type Row = [string, string, string, string, LeadSource, LeadService, LeadStatus, number, string];

const ROWS: Row[] = [
  ["Amelia Hart", "Hart & Co Design", "amelia@hartco.io", "+44 20 7946 0101", "Website", "SEO", "Qualified", 82, "2026-11-03"],
  ["Rafi Ahmed", "Bondhu Foods", "rafi@bondhufoods.com", "+880 1711 000111", "Referral", "Branding", "New", 64, "2026-11-03"],
  ["Lena Fischer", "Fischer Dental", "lena@fischerdental.de", "+49 30 901820", "LinkedIn", "Social Media", "Contacted", 71, "2026-11-02"],
  ["Marcus Cole", "Cole Logistics", "marcus@colelog.com", "+1 415 555 0132", "Google Ads", "Automation", "Interested", 88, "2026-11-01"],
  ["Priya Nair", "Nair Textiles", "priya@nairtex.in", "+91 98100 22334", "Website", "Email Marketing", "Converted", 93, "2026-10-29"],
  ["Tomas Rivera", "Rivera Studio", "tomas@riverastudio.mx", "+52 55 5555 0188", "Webinar", "Branding", "New", 48, "2026-10-28"],
  ["Sara Khan", "Khan Realty", "sara@khanrealty.pk", "+92 300 5550144", "Referral", "SEO", "Qualified", 77, "2026-10-26"],
  ["Oliver Grant", "Grant Fitness", "oliver@grantfit.co.uk", "+44 161 496 0123", "Facebook", "Social Media", "Rejected", 22, "2026-10-24"],
  ["Nadia Rahman", "Rahman Pharma", "nadia@rahmanpharma.com", "+880 1811 000222", "Website", "Automation", "Interested", 85, "2026-10-21"],
  ["Hiro Tanaka", "Tanaka Robotics", "hiro@tanakarobotics.jp", "+81 3 5555 0166", "LinkedIn", "Automation", "Converted", 95, "2026-10-18"],
];

export const DEMO_LEADS: Lead[] = ROWS.map((r, i) => ({
  id: `demo-${i + 1}`,
  name: r[0],
  business: r[1],
  email: r[2],
  phone: r[3],
  website: "",
  category: "",
  source: r[4],
  service: r[5],
  message: "",
  status: r[6],
  score: r[7],
  createdAt: r[8],
}));