import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = "https://bkznyxmdknjhbijyefjq.supabase.co";
    const supabaseKey = process.env.SUPABASE_ANON_KEY; // We will add this to env next

    if (!supabaseKey) {
      return NextResponse.json({ error: "Supabase key not configured" }, { status: 500 });
    }

    // Fetch leads, ordered by newest first
    const res = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc`, {
      method: "GET",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      // Prevent caching so we always get fresh data
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase error: ${errorText}`);
    }

    const leads = await res.json();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}