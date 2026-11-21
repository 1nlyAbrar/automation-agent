import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json({ error: "n8n Webhook URL not configured" }, { status: 500 });
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone || "Not provided", // Pass phone or fallback
        source: "Next.js Dashboard",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n returned status ${n8nResponse.status}`);
    }

    return NextResponse.json({ success: true, message: "Lead sent to n8n successfully" });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}