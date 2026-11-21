import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the Groq client using the OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    // The System Prompt (Tells the AI who it is and how to speak)
    const systemPrompt = `
      You are an AI business assistant for an Automation Agent platform. 
      
      LANGUAGE RULES (VERY IMPORTANT):
      - You must understand English, Bangla (Bengali script), and Banglish (Bengali written in English letters, e.g., "kemon acho", "amar koyta lead ache?").
      - You MUST reply in the exact same language and tone the user uses. 
      - If the user asks in Bangla, reply in Bangla.
      - If the user asks in Banglish, reply in Banglish.
      - If the user asks in English, reply in English.

      HERE IS WHAT THE PLATFORM DOES (Use this to answer "what commands do you have" or "how do I use this"):
      1. Email Automation: Users can create campaigns, write templates, and set up multi-step sequences.
      2. Follow-ups: Users can schedule calls, emails, and meetings with leads. The dashboard has a calendar.
      3. AI Reports: That's you! You analyze the data.
      4. Metrics: The current demo data shows a 20% conversion rate, average lead score of 73, and Website as the top source.

      RULES:
      - You ONLY answer questions related to business, marketing, sales, automation, and the features listed above.
      - If a user asks a question outside of business (like "how to bake a cake" or "who won the world cup"), you must politely decline and say you only assist with business inquiries.
      - Keep answers concise, professional, and helpful.
    `;

    // Call Groq API
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiText = response.choices[0].message.content;

    return NextResponse.json({ text: aiText });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}