import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

function validateContactData(data: unknown): ContactFormData | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const name = typeof d.name === "string" ? d.name.trim() : "";
  const email = typeof d.email === "string" ? d.email.trim().toLowerCase() : "";
  const company = typeof d.company === "string" ? d.company.trim() : "";
  const message = typeof d.message === "string" ? d.message.trim() : "";

  if (!name || name.length > 100) return null;
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!company || company.length > 100) return null;
  if (message.length < 10 || message.length > 2000) return null;

  return { name, email, company, message };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const contactData = validateContactData(body);
  if (!contactData) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    const userAgent = request.headers.get("user-agent") || "unknown";
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact_form_submission",
        data: contactData,
        metadata: { userAgent, timestamp: new Date().toISOString() },
      }),
    }).catch((err) => console.error("Webhook error:", err));
  } else {
    console.log("Contact form submission:", contactData);
  }

  return NextResponse.json({ success: true, message: "Contact form submitted successfully" });
}
